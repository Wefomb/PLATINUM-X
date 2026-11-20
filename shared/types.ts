export type ProductCategory = 'essentials' | 'graphic-edition';

export type ProductSize = 'S' | 'M' | 'L' | 'XL';

export interface ProductVariant {
  id: string;
  productId: string;
  size: ProductSize;
  colorName: string;
  colorHex: string;
  sku: string;
  stockQuantity: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortTitle: string;
  subtitle: string;
  eyebrow: string;
  editionLabel: string;
  category: ProductCategory;
  description: string;
  priceCents: number | null;
  currency: string;
  pricingNote: string;
  images: string[];
  bannerImage?: string;
  bannerTitle?: string;
  bannerEyebrow?: string;
  colorName: string;
  colorHex: string;
  specs: ProductSpec[];
  status: 'active' | 'archived';
  sortOrder: number;
  variants: ProductVariant[];
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  editionLabel: string;
  size: ProductSize;
  colorName: string;
  image: string;
  quantity: number;
  priceCents: number | null;
  currency: string;
  availableStock: number;
}

export interface CartState {
  cartId: string;
  items: CartItem[];
  itemCount: number;
  subtotalCents: number | null;
  currency: string;
  pricingMode: 'enquiry' | 'priced';
}

export interface CheckoutPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  notes?: string;
}

export interface OrderItemSnapshot {
  productId: string;
  variantId: string;
  name: string;
  size: string;
  colorName: string;
  quantity: number;
  priceCents: number | null;
  image: string;
}

export interface OrderRecord {
  id: string;
  reference: string;
  status: string;
  paymentMode: 'development' | 'studio_enquiry' | 'stripe';
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  items: OrderItemSnapshot[];
  subtotalCents: number | null;
  currency: string;
  createdAt: string;
}

export interface JournalArticle {
  slug: string;
  number: string;
  eyebrow: string;
  title: string;
  excerpt: string;
  body: string[];
  image: string;
  ctaLabel: string;
  ctaTo: string;
}
