import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { db, listProducts, getProductBySlug, generateId } from '../db.ts';
import { JOURNAL_ARTICLES } from '../fixtures.ts';
import type { CartState, CartItem, OrderRecord } from '../../shared/types.ts';

const router = Router();

function getOrCreateCartId(req: Request, res: Response): string {
  const headerCartId = req.header('x-px-cart-id');
  const cookieCartId = req.cookies?.px_cart_id;
  const candidate =
    typeof headerCartId === 'string' && /^cart_[a-f0-9]{16}$/.test(headerCartId)
      ? headerCartId
      : typeof cookieCartId === 'string' && /^cart_[a-f0-9]{16}$/.test(cookieCartId)
        ? cookieCartId
        : null;

  if (candidate) {
    const existing = db.prepare('SELECT id FROM carts WHERE id = ?').get(candidate) as { id: string } | undefined;
    if (existing) {
      return existing.id;
    }
  }

  const newCartId = generateId('cart');
  db.prepare('INSERT INTO carts (id) VALUES (?)').run(newCartId);
  res.cookie('px_cart_id', newCartId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  return newCartId;
}

function buildCartState(cartId: string): CartState {
  const rows = db
    .prepare(
      `
      SELECT
        ci.id,
        ci.product_id,
        ci.variant_id,
        ci.quantity,
        p.slug,
        p.name,
        p.edition_label,
        p.images_json,
        p.price_cents,
        p.currency,
        pv.size,
        pv.color_name,
        pv.stock_quantity
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      JOIN product_variants pv ON pv.id = ci.variant_id
      WHERE ci.cart_id = ?
      ORDER BY ci.created_at ASC
    `
    )
    .all(cartId) as any[];

  const items: CartItem[] = rows.map((r) => {
    const images = JSON.parse(r.images_json) as string[];
    return {
      id: r.id,
      productId: r.product_id,
      variantId: r.variant_id,
      slug: r.slug,
      name: r.name,
      editionLabel: r.edition_label,
      size: r.size,
      colorName: r.color_name,
      image: images[0] ?? '',
      quantity: r.quantity,
      priceCents: r.price_cents,
      currency: r.currency,
      availableStock: r.stock_quantity,
    };
  });

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const allPriced = items.length > 0 && items.every((i) => typeof i.priceCents === 'number');
  const subtotalCents = allPriced
    ? items.reduce((sum, i) => sum + (i.priceCents ?? 0) * i.quantity, 0)
    : null;

  return {
    cartId,
    items,
    itemCount,
    subtotalCents,
    currency: 'USD',
    pricingMode: process.env.CATALOG_MODE === 'priced' && allPriced ? 'priced' : 'enquiry',
  };
}

// Health check
router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'platinum-x', timestamp: new Date().toISOString() });
});

// Products catalog
router.get('/products', (req, res) => {
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined;
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  const products = listProducts(category, sort, q);
  res.json({ products });
});

router.get('/products/:slug', (req, res) => {
  const product = getProductBySlug(req.params.slug);
  if (!product) {
    res.status(404).json({ error: 'Product not found.' });
    return;
  }
  const related = listProducts().filter((p) => p.slug !== product.slug);
  res.json({ product, related });
});

// Journal articles
router.get('/journal', (_req, res) => {
  res.json({ articles: JOURNAL_ARTICLES });
});

router.get('/journal/:slug', (req, res) => {
  const article = JOURNAL_ARTICLES.find((a) => a.slug === req.params.slug);
  if (!article) {
    res.status(404).json({ error: 'Article not found.' });
    return;
  }
  res.json({ article });
});

// Cart endpoints
router.get('/cart', (req, res) => {
  const cartId = getOrCreateCartId(req, res);
  res.json(buildCartState(cartId));
});

const addCartSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(10).default(1),
});

router.post('/cart/items', (req, res) => {
  const parsed = addCartSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid selection.', details: parsed.error.flatten() });
    return;
  }
  const { productId, variantId, quantity } = parsed.data;
  const cartId = getOrCreateCartId(req, res);

  const variant = db
    .prepare('SELECT id, product_id, stock_quantity FROM product_variants WHERE id = ? AND product_id = ?')
    .get(variantId, productId) as { id: string; product_id: string; stock_quantity: number } | undefined;

  if (!variant) {
    res.status(404).json({ error: 'Selected size variant was not found.' });
    return;
  }
  if (variant.stock_quantity < 1) {
    res.status(409).json({ error: 'This size is currently unavailable.' });
    return;
  }

  const existingItem = db
    .prepare('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND variant_id = ?')
    .get(cartId, variantId) as { id: string; quantity: number } | undefined;

  const nextQty = (existingItem?.quantity ?? 0) + quantity;
  if (nextQty > variant.stock_quantity) {
    res.status(409).json({
      error: `Only ${variant.stock_quantity} available in this size.`,
    });
    return;
  }

  if (existingItem) {
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(nextQty, existingItem.id);
  } else {
    db.prepare('INSERT INTO cart_items (id, cart_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?, ?)').run(
      generateId('ci'),
      cartId,
      productId,
      variantId,
      quantity
    );
  }

  db.prepare(`UPDATE carts SET updated_at = datetime('now') WHERE id = ?`).run(cartId);
  res.json(buildCartState(cartId));
});

const updateCartSchema = z.object({
  quantity: z.number().int().min(0).max(20),
});

router.patch('/cart/items/:itemId', (req, res) => {
  const parsed = updateCartSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid quantity.' });
    return;
  }
  const cartId = getOrCreateCartId(req, res);
  const item = db
    .prepare(
      `SELECT ci.id, pv.stock_quantity
       FROM cart_items ci
       JOIN product_variants pv ON pv.id = ci.variant_id
       WHERE ci.id = ? AND ci.cart_id = ?`
    )
    .get(req.params.itemId, cartId) as { id: string; stock_quantity: number } | undefined;

  if (!item) {
    res.status(404).json({ error: 'Cart item not found.' });
    return;
  }

  if (parsed.data.quantity === 0) {
    db.prepare('DELETE FROM cart_items WHERE id = ?').run(item.id);
  } else if (parsed.data.quantity > item.stock_quantity) {
    res.status(409).json({ error: `Only ${item.stock_quantity} available in this size.` });
    return;
  } else {
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(parsed.data.quantity, item.id);
  }

  db.prepare(`UPDATE carts SET updated_at = datetime('now') WHERE id = ?`).run(cartId);
  res.json(buildCartState(cartId));
});

router.delete('/cart/items/:itemId', (req, res) => {
  const cartId = getOrCreateCartId(req, res);
  db.prepare('DELETE FROM cart_items WHERE id = ? AND cart_id = ?').run(req.params.itemId, cartId);
  db.prepare(`UPDATE carts SET updated_at = datetime('now') WHERE id = ?`).run(cartId);
  res.json(buildCartState(cartId));
});

// Checkout & Order Creation
const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, 'Please enter your full name.').max(120),
  customerEmail: z.string().trim().email('Please enter a valid email address.').max(180),
  customerPhone: z.string().trim().min(6, 'Please enter a contact phone number.').max(40),
  shippingAddressLine1: z.string().trim().min(4, 'Please enter a delivery street address.').max(200),
  shippingAddressLine2: z.string().trim().max(200).optional(),
  shippingCity: z.string().trim().min(2, 'Please enter a city.').max(100),
  shippingPostalCode: z.string().trim().min(2, 'Please enter a postal code.').max(30),
  shippingCountry: z.string().trim().min(2, 'Please enter a country.').max(80),
  notes: z.string().trim().max(500).optional(),
});

router.post('/checkout', (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Please verify your delivery information.', details: parsed.error.flatten() });
    return;
  }

  const cartId = getOrCreateCartId(req, res);
  const cart = buildCartState(cartId);

  if (cart.items.length === 0) {
    res.status(400).json({ error: 'Your bag is empty.' });
    return;
  }

  const data = parsed.data;
  const orderId = generateId('ord');
  const reference = `PX-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const isStripeConfigured =
    process.env.PAYMENT_PROVIDER === 'stripe' && Boolean(process.env.PAYMENT_SECRET_KEY) && cart.pricingMode === 'priced';

  const paymentMode = isStripeConfigured
    ? 'stripe'
    : cart.pricingMode === 'enquiry'
      ? 'studio_enquiry'
      : 'development';

  const paymentStatus = isStripeConfigured
    ? 'awaiting_payment'
    : cart.pricingMode === 'enquiry'
      ? 'awaiting_studio_confirmation'
      : 'development_mode';

  const orderStatus = cart.pricingMode === 'enquiry' ? 'enquiry_received' : 'pending';

  try {
    const tx = db.transaction(() => {
      for (const item of cart.items) {
        const variant = db
          .prepare('SELECT stock_quantity FROM product_variants WHERE id = ?')
          .get(item.variantId) as { stock_quantity: number } | undefined;

        if (!variant || variant.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name} (${item.size}).`);
        }

        db.prepare('UPDATE product_variants SET stock_quantity = stock_quantity - ? WHERE id = ?').run(
          item.quantity,
          item.variantId
        );
      }

      const itemsSnapshot = cart.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        size: item.size,
        colorName: item.colorName,
        quantity: item.quantity,
        priceCents: item.priceCents,
        image: item.image,
      }));

      db.prepare(
        `INSERT INTO orders (
          id, reference, status, payment_mode, payment_status,
          customer_name, customer_email, customer_phone,
          shipping_address_json, notes, items_json, subtotal_cents, currency
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        orderId,
        reference,
        orderStatus,
        paymentMode,
        paymentStatus,
        data.customerName,
        data.customerEmail,
        data.customerPhone,
        JSON.stringify({
          line1: data.shippingAddressLine1,
          line2: data.shippingAddressLine2 || undefined,
          city: data.shippingCity,
          postalCode: data.shippingPostalCode,
          country: data.shippingCountry,
        }),
        data.notes || null,
        JSON.stringify(itemsSnapshot),
        cart.subtotalCents,
        cart.currency
      );

      db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cartId);
    });

    tx();
  } catch (err: any) {
    res.status(409).json({ error: err?.message || 'Unable to reserve inventory for this order.' });
    return;
  }

  const orderRow = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
  const order: OrderRecord = {
    id: orderRow.id,
    reference: orderRow.reference,
    status: orderRow.status,
    paymentMode: orderRow.payment_mode,
    paymentStatus: orderRow.payment_status,
    customerName: orderRow.customer_name,
    customerEmail: orderRow.customer_email,
    customerPhone: orderRow.customer_phone,
    shippingAddress: JSON.parse(orderRow.shipping_address_json),
    notes: orderRow.notes ?? undefined,
    items: JSON.parse(orderRow.items_json),
    subtotalCents: orderRow.subtotal_cents,
    currency: orderRow.currency,
    createdAt: orderRow.created_at,
  };

  res.status(201).json({ order });
});

router.get('/orders/:reference', (req, res) => {
  const row = db.prepare('SELECT * FROM orders WHERE reference = ?').get(req.params.reference) as any;
  if (!row) {
    res.status(404).json({ error: 'Order reference not found.' });
    return;
  }
  const order: OrderRecord = {
    id: row.id,
    reference: row.reference,
    status: row.status,
    paymentMode: row.payment_mode,
    paymentStatus: row.payment_status,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    shippingAddress: JSON.parse(row.shipping_address_json),
    notes: row.notes ?? undefined,
    items: JSON.parse(row.items_json),
    subtotalCents: row.subtotal_cents,
    currency: row.currency,
    createdAt: row.created_at,
  };
  res.json({ order });
});

// Stripe / Payment Webhook verification scaffold
router.post('/webhooks/payment', (req, res) => {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  const sig = req.header('stripe-signature') || req.header('x-payment-signature');
  if (!secret || !sig) {
    res.status(400).json({ error: 'Webhook signature verification is not configured.' });
    return;
  }
  // Verify HMAC signature against raw body when configured
  const expected = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    res.status(401).json({ error: 'Invalid webhook signature.' });
    return;
  }
  res.json({ received: true });
});

// Newsletter subscription
const newsletterSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.').max(180),
});

router.post('/newsletter', (req, res) => {
  const parsed = newsletterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Please enter a valid email address.' });
    return;
  }
  const email = parsed.data.email.toLowerCase();
  const existing = db.prepare('SELECT id FROM newsletter_subscribers WHERE email = ?').get(email);
  if (existing) {
    res.json({ subscribed: true, alreadySubscribed: true, message: 'You are already on the private list.' });
    return;
  }
  db.prepare('INSERT INTO newsletter_subscribers (id, email) VALUES (?, ?)').run(generateId('sub'), email);
  res.status(201).json({
    subscribed: true,
    alreadySubscribed: false,
    message: 'Welcome to the private list. Good things, in good time.',
  });
});

// Studio Contact / Measurement Enquiry form
const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  email: z.string().trim().email('Please enter a valid email address.').max(180),
  subject: z.string().trim().min(2, 'Please select or enter a subject.').max(150),
  message: z.string().trim().min(10, 'Please include a brief message for the studio.').max(2000),
});

router.post('/contact', (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Please complete all fields accurately.', details: parsed.error.flatten() });
    return;
  }
  const reference = `INQ-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  db.prepare(
    'INSERT INTO contact_inquiries (id, reference, name, email, subject, message) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(
    generateId('inq'),
    reference,
    parsed.data.name,
    parsed.data.email,
    parsed.data.subject,
    parsed.data.message
  );

  res.status(201).json({
    received: true,
    reference,
    message: 'Your enquiry has been received by the studio.',
  });
});

export default router;
