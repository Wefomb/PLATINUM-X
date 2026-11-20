import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { COLLECTION_001_FIXTURES, INITIAL_VARIANT_STOCK } from './fixtures.ts';
import type { Product, ProductVariant, ProductSize } from '../shared/types.ts';

const dbPath = path.resolve(process.cwd(), process.env.SQLITE_PATH || './data/platinum-x.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase(): void {
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

function seedProductsIfEmpty(): void {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
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
        sortOrder: prod.sortOrder,
      });

      const sizes: ProductSize[] = ['S', 'M', 'L', 'XL'];
      const stockMap = INITIAL_VARIANT_STOCK[prod.id];
      for (const size of sizes) {
        insertVariant.run({
          id: `var_${prod.id}_${size.toLowerCase()}`,
          productId: prod.id,
          size,
          colorName: prod.colorName,
          colorHex: prod.colorHex,
          sku: `PX001-${prod.slug.toUpperCase().replace(/-/g, '')}-${size}`,
          stockQuantity: stockMap[size],
        });
      }
    }
  });

  tx();
}

function mapProductRow(row: any, variants: ProductVariant[]): Product {
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
    bannerImage: row.banner_image ?? undefined,
    bannerTitle: row.banner_title ?? undefined,
    bannerEyebrow: row.banner_eyebrow ?? undefined,
    colorName: row.color_name,
    colorHex: row.color_hex,
    specs: JSON.parse(row.specs_json),
    status: row.status,
    sortOrder: row.sort_order,
    variants,
  };
}

function mapVariantRow(row: any): ProductVariant {
  return {
    id: row.id,
    productId: row.product_id,
    size: row.size,
    colorName: row.color_name,
    colorHex: row.color_hex,
    sku: row.sku,
    stockQuantity: row.stock_quantity,
  };
}

export function listProducts(category?: string, sort?: string, query?: string): Product[] {
  const rows = db.prepare(`SELECT * FROM products WHERE status = 'active' ORDER BY sort_order ASC`).all() as any[];
  const variantRows = db.prepare(`SELECT * FROM product_variants`).all() as any[];

  const variantMap = new Map<string, ProductVariant[]>();
  for (const v of variantRows) {
    const list = variantMap.get(v.product_id) ?? [];
    list.push(mapVariantRow(v));
    variantMap.set(v.product_id, list);
  }

  let products = rows.map((r) => mapProductRow(r, variantMap.get(r.id) ?? []));

  if (category && category !== 'all') {
    products = products.filter((p) => p.category === category);
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.editionLabel.toLowerCase().includes(q) ||
        p.colorName.toLowerCase().includes(q)
    );
  }

  if (sort === 'name-asc') {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'name-desc') {
    products.sort((a, b) => b.name.localeCompare(a.name));
  }

  return products;
}

export function getProductBySlug(slug: string): Product | null {
  const row = db.prepare(`SELECT * FROM products WHERE slug = ? AND status = 'active'`).get(slug) as any;
  if (!row) return null;
  const variantRows = db.prepare(`SELECT * FROM product_variants WHERE product_id = ?`).all(row.id) as any[];
  return mapProductRow(row, variantRows.map(mapVariantRow));
}

export function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
}
