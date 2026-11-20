// server.ts
import "dotenv/config";
import express from "express";
import path2 from "path";
import fs2 from "fs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

// server/db.ts
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// server/fixtures.ts
var COLLECTION_001_FIXTURES = [
  {
    id: "prod_brand_bible",
    slug: "brand-bible-tee",
    name: "Brand Bible Tee",
    shortTitle: "Brand Bible Tee.",
    subtitle: "Less noise. More presence.",
    eyebrow: "PLATINUM X / GRAPHIC EDITION",
    editionLabel: "ONYX / THE GRAPHIC EDITION",
    category: "graphic-edition",
    description: "A monochrome graphic on an easy black silhouette. Liquid-metal artwork, a spaced wordmark and subtle sleeve signatures bring the first expression together.",
    priceCents: null,
    currency: "USD",
    pricingNote: "Pricing and delivery confirmed on enquiry.",
    images: [
      "/assets/platinum/pdp-main.webp",
      "/assets/platinum/lookbook-01-poster.webp",
      "/assets/platinum/details-closeup.webp"
    ],
    bannerEyebrow: "OFF THE HANGER",
    bannerTitle: "Your everyday. Elevated.",
    bannerImage: "/assets/platinum/brand-bible-back.webp",
    colorName: "Black",
    colorHex: "#101010",
    specs: [
      {
        label: "THE DESIGN",
        value: "Liquid-metal graphic \u2022 PLATINUM X wordmark \u2022 sleeve signatures"
      },
      {
        label: "THE FIT",
        value: "Relaxed silhouette. Request garment measurements for your preferred fit."
      },
      {
        label: "CARE",
        value: "Please follow the garment care label. Protect printed surfaces."
      }
    ],
    status: "active",
    sortOrder: 1
  },
  {
    id: "prod_signature_onyx",
    slug: "signature-tee-onyx",
    name: "Signature Tee / Onyx",
    shortTitle: "Signature Tee.",
    subtitle: "01 \u2014 Onyx / Relaxed silhouette",
    eyebrow: "PLATINUM X / THE ESSENTIAL",
    editionLabel: "ONYX / THE ESSENTIAL",
    category: "essentials",
    description: "An everyday foundation in heavyweight combed cotton. Dropped shoulders, structured collar and a quiet chest wordmark designed to let proportion take the lead.",
    priceCents: null,
    currency: "USD",
    pricingNote: "Pricing and delivery confirmed on enquiry.",
    images: [
      "/assets/platinum/signature-onyx.webp",
      "/assets/platinum/hero-model.webp",
      "/assets/platinum/details-closeup.webp"
    ],
    bannerEyebrow: "THE PERMANENT EDIT",
    bannerTitle: "Presence. Without noise.",
    bannerImage: "/assets/platinum/lookbook-02.webp",
    colorName: "Onyx",
    colorHex: "#101010",
    specs: [
      {
        label: "THE DESIGN",
        value: "Tonal chest signature \u2022 clean back \u2022 woven PLATINUM X neck label"
      },
      {
        label: "THE FIT",
        value: "Relaxed silhouette. Request garment measurements for your preferred fit."
      },
      {
        label: "CARE",
        value: "Please follow the garment care label. Wash cold inside out."
      }
    ],
    status: "active",
    sortOrder: 2
  },
  {
    id: "prod_signature_chalk",
    slug: "signature-tee-chalk",
    name: "Signature Tee / Chalk",
    shortTitle: "Signature Tee.",
    subtitle: "02 \u2014 Chalk / Relaxed silhouette",
    eyebrow: "PLATINUM X / THE ESSENTIAL",
    editionLabel: "CHALK / THE ESSENTIAL",
    category: "essentials",
    description: "The light counterpart to the Onyx essential. Cut in an architectural boxy drape with a crisp monochrome chest mark and unbleached chalk finish.",
    priceCents: null,
    currency: "USD",
    pricingNote: "Pricing and delivery confirmed on enquiry.",
    images: [
      "/assets/platinum/signature-chalk.webp",
      "/assets/platinum/details-closeup.webp"
    ],
    bannerEyebrow: "THE PERMANENT EDIT",
    bannerTitle: "Two tones. One identity.",
    bannerImage: "/assets/platinum/journal-hero.webp",
    colorName: "Chalk",
    colorHex: "#F3F2EE",
    specs: [
      {
        label: "THE DESIGN",
        value: "Minimal chest wordmark \u2022 dense ribbed collar \u2022 signature woven label"
      },
      {
        label: "THE FIT",
        value: "Relaxed silhouette. Request garment measurements for your preferred fit."
      },
      {
        label: "CARE",
        value: "Please follow the garment care label. Wash with similar light tones."
      }
    ],
    status: "active",
    sortOrder: 3
  }
];
var INITIAL_VARIANT_STOCK = {
  prod_brand_bible: { S: 8, M: 12, L: 10, XL: 6 },
  prod_signature_onyx: { S: 10, M: 14, L: 14, XL: 8 },
  prod_signature_chalk: { S: 10, M: 12, L: 12, XL: 8 }
};
var JOURNAL_ARTICLES = [
  {
    slug: "presence-is-a-quiet-thing",
    number: "01",
    eyebrow: "01 / POINT OF VIEW",
    title: "Presence is a quiet thing.",
    excerpt: "We do not believe presence comes from being louder. It comes from confidence, intention, and how you carry yourself.",
    body: [
      "We do not believe presence comes from being louder. It comes from confidence, intention, and how you carry yourself.",
      "A monochrome wardrobe is not an absence of expression. It is a choice to let proportion, texture and movement take the lead. The clothes frame the person. They never need to compete.",
      "Collection 001 establishes the visual discipline of PLATINUM X: heavy cotton bases, disciplined monochrome contrast, and marks placed only where they earn their space."
    ],
    image: "/assets/platinum/journal-hero.webp",
    ctaLabel: "Discover our philosophy",
    ctaTo: "/story"
  },
  {
    slug: "a-closer-look",
    number: "02",
    eyebrow: "02 / THE FINISH",
    title: "A closer look.",
    excerpt: "A label, a mark, the texture of black. The small things give a piece its character.",
    body: [
      "A label, a mark, the texture of black. The small things give a piece its character.",
      "From the woven interior neck tag bearing the PLATINUM X signature to the brushed metallic emblem and liquid-metal ink density, every element is calibrated for permanence rather than novelty.",
      "Inside the garment, construction meets restraint\u2014ensuring the piece feels considered from the first touch."
    ],
    image: "/assets/platinum/journal-details.webp",
    ctaLabel: "Explore the collection",
    ctaTo: "/collection"
  },
  {
    slug: "distinction-by-design",
    number: "03",
    eyebrow: "03 / THE ARTWORK",
    title: "Distinction, by design.",
    excerpt: "A study in contrast. Liquid forms and sharp instinct, expressed through a monochrome lens.",
    body: [
      "A study in contrast. Liquid forms and sharp instinct, expressed through a monochrome lens.",
      "The artistic fox illustration embodies the dual nature of PLATINUM X: razor-sharp precision emerging out of fluid monochrome ink.",
      "Paired against our minimal geometric fox emblem, these two expressions form the complete symbolic vocabulary of the house."
    ],
    image: "/assets/platinum/distinction-fox.webp",
    ctaLabel: "View Brand Bible Tee",
    ctaTo: "/product/brand-bible-tee"
  }
];

// server/db.ts
var dbPath = path.resolve(process.cwd(), process.env.SQLITE_PATH || "./data/platinum-x.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
var db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      short_title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      eyebrow TEXT NOT NULL,
      edition_label TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      price_cents INTEGER,
      currency TEXT NOT NULL DEFAULT 'USD',
      pricing_note TEXT NOT NULL,
      images_json TEXT NOT NULL,
      banner_image TEXT,
      banner_title TEXT,
      banner_eyebrow TEXT,
      color_name TEXT NOT NULL,
      color_hex TEXT NOT NULL,
      specs_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      size TEXT NOT NULL,
      color_name TEXT NOT NULL,
      color_hex TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      stock_quantity INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS carts (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      cart_id TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL REFERENCES products(id),
      variant_id TEXT NOT NULL REFERENCES product_variants(id),
      quantity INTEGER NOT NULL CHECK(quantity > 0),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(cart_id, variant_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      reference TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL,
      payment_mode TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address_json TEXT NOT NULL,
      notes TEXT,
      items_json TEXT NOT NULL,
      subtotal_cents INTEGER,
      currency TEXT NOT NULL DEFAULT 'USD',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      source TEXT NOT NULL DEFAULT 'footer',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id TEXT PRIMARY KEY,
      reference TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  seedProductsIfEmpty();
}
function seedProductsIfEmpty() {
  const countRow = db.prepare("SELECT COUNT(*) as count FROM products").get();
  if (countRow.count > 0) {
    return;
  }
  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, slug, name, short_title, subtitle, eyebrow, edition_label,
      category, description, price_cents, currency, pricing_note,
      images_json, banner_image, banner_title, banner_eyebrow,
      color_name, color_hex, specs_json, status, sort_order
    ) VALUES (
      @id, @slug, @name, @shortTitle, @subtitle, @eyebrow, @editionLabel,
      @category, @description, @priceCents, @currency, @pricingNote,
      @imagesJson, @bannerImage, @bannerTitle, @bannerEyebrow,
      @colorName, @colorHex, @specsJson, @status, @sortOrder
    )
  `);
  const insertVariant = db.prepare(`
    INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, stock_quantity)
    VALUES (@id, @productId, @size, @colorName, @colorHex, @sku, @stockQuantity)
  `);
  const tx = db.transaction(() => {
    for (const prod of COLLECTION_001_FIXTURES) {
      insertProduct.run({
        id: prod.id,
        slug: prod.slug,
        name: prod.name,
        shortTitle: prod.shortTitle,
        subtitle: prod.subtitle,
        eyebrow: prod.eyebrow,
        editionLabel: prod.editionLabel,
        category: prod.category,
        description: prod.description,
        priceCents: prod.priceCents,
        currency: prod.currency,
        pricingNote: prod.pricingNote,
        imagesJson: JSON.stringify(prod.images),
        bannerImage: prod.bannerImage ?? null,
        bannerTitle: prod.bannerTitle ?? null,
        bannerEyebrow: prod.bannerEyebrow ?? null,
        colorName: prod.colorName,
        colorHex: prod.colorHex,
        specsJson: JSON.stringify(prod.specs),
        status: prod.status,
        sortOrder: prod.sortOrder
      });
      const sizes = ["S", "M", "L", "XL"];
      const stockMap = INITIAL_VARIANT_STOCK[prod.id];
      for (const size of sizes) {
        insertVariant.run({
          id: `var_${prod.id}_${size.toLowerCase()}`,
          productId: prod.id,
          size,
          colorName: prod.colorName,
          colorHex: prod.colorHex,
          sku: `PX001-${prod.slug.toUpperCase().replace(/-/g, "")}-${size}`,
          stockQuantity: stockMap[size]
        });
      }
    }
  });
  tx();
}
function mapProductRow(row, variants) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortTitle: row.short_title,
    subtitle: row.subtitle,
    eyebrow: row.eyebrow,
    editionLabel: row.edition_label,
    category: row.category,
    description: row.description,
    priceCents: row.price_cents,
    currency: row.currency,
    pricingNote: row.pricing_note,
    images: JSON.parse(row.images_json),
    bannerImage: row.banner_image ?? void 0,
    bannerTitle: row.banner_title ?? void 0,
    bannerEyebrow: row.banner_eyebrow ?? void 0,
    colorName: row.color_name,
    colorHex: row.color_hex,
    specs: JSON.parse(row.specs_json),
    status: row.status,
    sortOrder: row.sort_order,
    variants
  };
}
function mapVariantRow(row) {
  return {
    id: row.id,
    productId: row.product_id,
    size: row.size,
    colorName: row.color_name,
    colorHex: row.color_hex,
    sku: row.sku,
    stockQuantity: row.stock_quantity
  };
}
function listProducts(category, sort, query) {
  const rows = db.prepare(`SELECT * FROM products WHERE status = 'active' ORDER BY sort_order ASC`).all();
  const variantRows = db.prepare(`SELECT * FROM product_variants`).all();
  const variantMap = /* @__PURE__ */ new Map();
  for (const v of variantRows) {
    const list = variantMap.get(v.product_id) ?? [];
    list.push(mapVariantRow(v));
    variantMap.set(v.product_id, list);
  }
  let products = rows.map((r) => mapProductRow(r, variantMap.get(r.id) ?? []));
  if (category && category !== "all") {
    products = products.filter((p) => p.category === category);
  }
  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.editionLabel.toLowerCase().includes(q) || p.colorName.toLowerCase().includes(q)
    );
  }
  if (sort === "name-asc") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "name-desc") {
    products.sort((a, b) => b.name.localeCompare(a.name));
  }
  return products;
}
function getProductBySlug(slug) {
  const row = db.prepare(`SELECT * FROM products WHERE slug = ? AND status = 'active'`).get(slug);
  if (!row) return null;
  const variantRows = db.prepare(`SELECT * FROM product_variants WHERE product_id = ?`).all(row.id);
  return mapProductRow(row, variantRows.map(mapVariantRow));
}
function generateId(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

// server/routes/api.ts
import { Router } from "express";
import { z } from "zod";
import crypto2 from "crypto";
var router = Router();
function getOrCreateCartId(req, res) {
  const headerCartId = req.header("x-px-cart-id");
  const cookieCartId = req.cookies?.px_cart_id;
  const candidate = typeof headerCartId === "string" && /^cart_[a-f0-9]{16}$/.test(headerCartId) ? headerCartId : typeof cookieCartId === "string" && /^cart_[a-f0-9]{16}$/.test(cookieCartId) ? cookieCartId : null;
  if (candidate) {
    const existing = db.prepare("SELECT id FROM carts WHERE id = ?").get(candidate);
    if (existing) {
      return existing.id;
    }
  }
  const newCartId = generateId("cart");
  db.prepare("INSERT INTO carts (id) VALUES (?)").run(newCartId);
  res.cookie("px_cart_id", newCartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1e3
  });
  return newCartId;
}
function buildCartState(cartId) {
  const rows = db.prepare(
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
  ).all(cartId);
  const items = rows.map((r) => {
    const images = JSON.parse(r.images_json);
    return {
      id: r.id,
      productId: r.product_id,
      variantId: r.variant_id,
      slug: r.slug,
      name: r.name,
      editionLabel: r.edition_label,
      size: r.size,
      colorName: r.color_name,
      image: images[0] ?? "",
      quantity: r.quantity,
      priceCents: r.price_cents,
      currency: r.currency,
      availableStock: r.stock_quantity
    };
  });
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const allPriced = items.length > 0 && items.every((i) => typeof i.priceCents === "number");
  const subtotalCents = allPriced ? items.reduce((sum, i) => sum + (i.priceCents ?? 0) * i.quantity, 0) : null;
  return {
    cartId,
    items,
    itemCount,
    subtotalCents,
    currency: "USD",
    pricingMode: process.env.CATALOG_MODE === "priced" && allPriced ? "priced" : "enquiry"
  };
}
router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "platinum-x", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
router.get("/products", (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : void 0;
  const sort = typeof req.query.sort === "string" ? req.query.sort : void 0;
  const q = typeof req.query.q === "string" ? req.query.q : void 0;
  const products = listProducts(category, sort, q);
  res.json({ products });
});
router.get("/products/:slug", (req, res) => {
  const product = getProductBySlug(req.params.slug);
  if (!product) {
    res.status(404).json({ error: "Product not found." });
    return;
  }
  const related = listProducts().filter((p) => p.slug !== product.slug);
  res.json({ product, related });
});
router.get("/journal", (_req, res) => {
  res.json({ articles: JOURNAL_ARTICLES });
});
router.get("/journal/:slug", (req, res) => {
  const article = JOURNAL_ARTICLES.find((a) => a.slug === req.params.slug);
  if (!article) {
    res.status(404).json({ error: "Article not found." });
    return;
  }
  res.json({ article });
});
router.get("/cart", (req, res) => {
  const cartId = getOrCreateCartId(req, res);
  res.json(buildCartState(cartId));
});
var addCartSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(10).default(1)
});
router.post("/cart/items", (req, res) => {
  const parsed = addCartSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid selection.", details: parsed.error.flatten() });
    return;
  }
  const { productId, variantId, quantity } = parsed.data;
  const cartId = getOrCreateCartId(req, res);
  const variant = db.prepare("SELECT id, product_id, stock_quantity FROM product_variants WHERE id = ? AND product_id = ?").get(variantId, productId);
  if (!variant) {
    res.status(404).json({ error: "Selected size variant was not found." });
    return;
  }
  if (variant.stock_quantity < 1) {
    res.status(409).json({ error: "This size is currently unavailable." });
    return;
  }
  const existingItem = db.prepare("SELECT id, quantity FROM cart_items WHERE cart_id = ? AND variant_id = ?").get(cartId, variantId);
  const nextQty = (existingItem?.quantity ?? 0) + quantity;
  if (nextQty > variant.stock_quantity) {
    res.status(409).json({
      error: `Only ${variant.stock_quantity} available in this size.`
    });
    return;
  }
  if (existingItem) {
    db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ?").run(nextQty, existingItem.id);
  } else {
    db.prepare("INSERT INTO cart_items (id, cart_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?, ?)").run(
      generateId("ci"),
      cartId,
      productId,
      variantId,
      quantity
    );
  }
  db.prepare(`UPDATE carts SET updated_at = datetime('now') WHERE id = ?`).run(cartId);
  res.json(buildCartState(cartId));
});
var updateCartSchema = z.object({
  quantity: z.number().int().min(0).max(20)
});
router.patch("/cart/items/:itemId", (req, res) => {
  const parsed = updateCartSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid quantity." });
    return;
  }
  const cartId = getOrCreateCartId(req, res);
  const item = db.prepare(
    `SELECT ci.id, pv.stock_quantity
       FROM cart_items ci
       JOIN product_variants pv ON pv.id = ci.variant_id
       WHERE ci.id = ? AND ci.cart_id = ?`
  ).get(req.params.itemId, cartId);
  if (!item) {
    res.status(404).json({ error: "Cart item not found." });
    return;
  }
  if (parsed.data.quantity === 0) {
    db.prepare("DELETE FROM cart_items WHERE id = ?").run(item.id);
  } else if (parsed.data.quantity > item.stock_quantity) {
    res.status(409).json({ error: `Only ${item.stock_quantity} available in this size.` });
    return;
  } else {
    db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ?").run(parsed.data.quantity, item.id);
  }
  db.prepare(`UPDATE carts SET updated_at = datetime('now') WHERE id = ?`).run(cartId);
  res.json(buildCartState(cartId));
});
router.delete("/cart/items/:itemId", (req, res) => {
  const cartId = getOrCreateCartId(req, res);
  db.prepare("DELETE FROM cart_items WHERE id = ? AND cart_id = ?").run(req.params.itemId, cartId);
  db.prepare(`UPDATE carts SET updated_at = datetime('now') WHERE id = ?`).run(cartId);
  res.json(buildCartState(cartId));
});
var checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name.").max(120),
  customerEmail: z.string().trim().email("Please enter a valid email address.").max(180),
  customerPhone: z.string().trim().min(6, "Please enter a contact phone number.").max(40),
  shippingAddressLine1: z.string().trim().min(4, "Please enter a delivery street address.").max(200),
  shippingAddressLine2: z.string().trim().max(200).optional(),
  shippingCity: z.string().trim().min(2, "Please enter a city.").max(100),
  shippingPostalCode: z.string().trim().min(2, "Please enter a postal code.").max(30),
  shippingCountry: z.string().trim().min(2, "Please enter a country.").max(80),
  notes: z.string().trim().max(500).optional()
});
router.post("/checkout", (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please verify your delivery information.", details: parsed.error.flatten() });
    return;
  }
  const cartId = getOrCreateCartId(req, res);
  const cart = buildCartState(cartId);
  if (cart.items.length === 0) {
    res.status(400).json({ error: "Your bag is empty." });
    return;
  }
  const data = parsed.data;
  const orderId = generateId("ord");
  const reference = `PX-${(/* @__PURE__ */ new Date()).getFullYear()}-${crypto2.randomBytes(3).toString("hex").toUpperCase()}`;
  const isStripeConfigured = process.env.PAYMENT_PROVIDER === "stripe" && Boolean(process.env.PAYMENT_SECRET_KEY) && cart.pricingMode === "priced";
  const paymentMode = isStripeConfigured ? "stripe" : cart.pricingMode === "enquiry" ? "studio_enquiry" : "development";
  const paymentStatus = isStripeConfigured ? "awaiting_payment" : cart.pricingMode === "enquiry" ? "awaiting_studio_confirmation" : "development_mode";
  const orderStatus = cart.pricingMode === "enquiry" ? "enquiry_received" : "pending";
  try {
    const tx = db.transaction(() => {
      for (const item of cart.items) {
        const variant = db.prepare("SELECT stock_quantity FROM product_variants WHERE id = ?").get(item.variantId);
        if (!variant || variant.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name} (${item.size}).`);
        }
        db.prepare("UPDATE product_variants SET stock_quantity = stock_quantity - ? WHERE id = ?").run(
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
        image: item.image
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
          line2: data.shippingAddressLine2 || void 0,
          city: data.shippingCity,
          postalCode: data.shippingPostalCode,
          country: data.shippingCountry
        }),
        data.notes || null,
        JSON.stringify(itemsSnapshot),
        cart.subtotalCents,
        cart.currency
      );
      db.prepare("DELETE FROM cart_items WHERE cart_id = ?").run(cartId);
    });
    tx();
  } catch (err) {
    res.status(409).json({ error: err?.message || "Unable to reserve inventory for this order." });
    return;
  }
  const orderRow = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
  const order = {
    id: orderRow.id,
    reference: orderRow.reference,
    status: orderRow.status,
    paymentMode: orderRow.payment_mode,
    paymentStatus: orderRow.payment_status,
    customerName: orderRow.customer_name,
    customerEmail: orderRow.customer_email,
    customerPhone: orderRow.customer_phone,
    shippingAddress: JSON.parse(orderRow.shipping_address_json),
    notes: orderRow.notes ?? void 0,
    items: JSON.parse(orderRow.items_json),
    subtotalCents: orderRow.subtotal_cents,
    currency: orderRow.currency,
    createdAt: orderRow.created_at
  };
  res.status(201).json({ order });
});
router.get("/orders/:reference", (req, res) => {
  const row = db.prepare("SELECT * FROM orders WHERE reference = ?").get(req.params.reference);
  if (!row) {
    res.status(404).json({ error: "Order reference not found." });
    return;
  }
  const order = {
    id: row.id,
    reference: row.reference,
    status: row.status,
    paymentMode: row.payment_mode,
    paymentStatus: row.payment_status,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    shippingAddress: JSON.parse(row.shipping_address_json),
    notes: row.notes ?? void 0,
    items: JSON.parse(row.items_json),
    subtotalCents: row.subtotal_cents,
    currency: row.currency,
    createdAt: row.created_at
  };
  res.json({ order });
});
router.post("/webhooks/payment", (req, res) => {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  const sig = req.header("stripe-signature") || req.header("x-payment-signature");
  if (!secret || !sig) {
    res.status(400).json({ error: "Webhook signature verification is not configured." });
    return;
  }
  const expected = crypto2.createHmac("sha256", secret).update(JSON.stringify(req.body)).digest("hex");
  if (!crypto2.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    res.status(401).json({ error: "Invalid webhook signature." });
    return;
  }
  res.json({ received: true });
});
var newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(180)
});
router.post("/newsletter", (req, res) => {
  const parsed = newsletterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }
  const email = parsed.data.email.toLowerCase();
  const existing = db.prepare("SELECT id FROM newsletter_subscribers WHERE email = ?").get(email);
  if (existing) {
    res.json({ subscribed: true, alreadySubscribed: true, message: "You are already on the private list." });
    return;
  }
  db.prepare("INSERT INTO newsletter_subscribers (id, email) VALUES (?, ?)").run(generateId("sub"), email);
  res.status(201).json({
    subscribed: true,
    alreadySubscribed: false,
    message: "Welcome to the private list. Good things, in good time."
  });
});
var contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(180),
  subject: z.string().trim().min(2, "Please select or enter a subject.").max(150),
  message: z.string().trim().min(10, "Please include a brief message for the studio.").max(2e3)
});
router.post("/contact", (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please complete all fields accurately.", details: parsed.error.flatten() });
    return;
  }
  const reference = `INQ-${crypto2.randomBytes(3).toString("hex").toUpperCase()}`;
  db.prepare(
    "INSERT INTO contact_inquiries (id, reference, name, email, subject, message) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(
    generateId("inq"),
    reference,
    parsed.data.name,
    parsed.data.email,
    parsed.data.subject,
    parsed.data.message
  );
  res.status(201).json({
    received: true,
    reference,
    message: "Your enquiry has been received by the studio."
  });
});
var api_default = router;

// server.ts
async function startServer() {
  initDatabase();
  const app = express();
  const isProd = process.env.NODE_ENV === "production";
  const port = Number(process.env.PORT || process.env.SERVER_PORT || 3e3);
  app.set("trust proxy", 1);
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "256kb" }));
  const apiLimiter = rateLimit({
    windowMs: 60 * 1e3,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please try again shortly." }
  });
  const writeLimiter = rateLimit({
    windowMs: 10 * 60 * 1e3,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Submission rate limit reached. Please wait a moment." }
  });
  app.use("/api", apiLimiter);
  app.use("/api/checkout", writeLimiter);
  app.use("/api/newsletter", writeLimiter);
  app.use("/api/contact", writeLimiter);
  app.use("/api", api_default);
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path2.resolve(process.cwd(), "dist");
    const publicDir = path2.resolve(process.cwd(), "public");
    if (fs2.existsSync(distDir)) {
      app.use(express.static(distDir, { maxAge: "7d", index: false }));
    }
    if (fs2.existsSync(publicDir)) {
      app.use(express.static(publicDir, { maxAge: "7d", index: false }));
    }
    app.get("*", (_req, res) => {
      res.sendFile(path2.join(distDir, "index.html"));
    });
  }
  app.use((err, _req, res, _next) => {
    console.error("Server error:", err);
    res.status(err?.status || 500).json({
      error: isProd ? "An unexpected error occurred." : err?.message || "Internal server error"
    });
  });
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`PLATINUM X server listening on http://0.0.0.0:${port} (${isProd ? "production" : "development"})`);
  });
  const shutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 8e3).unref();
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}
startServer().catch((err) => {
  console.error("Failed to start PLATINUM X server:", err);
  process.exit(1);
});
