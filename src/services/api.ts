import type { CartState, CheckoutPayload, JournalArticle, OrderRecord, Product } from '../../shared/types.ts';

const CART_STORAGE_KEY = 'px_cart_id';

function getStoredCartId(): string | null {
  try {
    return localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    return null;
  }
}

function setStoredCartId(cartId: string): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, cartId);
  } catch {
    // ignore storage restriction
  }
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }
  const cartId = getStoredCartId();
  if (cartId) {
    headers.set('x-px-cart-id', cartId);
  }

  const res = await fetch(url, {
    ...init,
    headers,
    credentials: 'same-origin',
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  if (data && typeof data.cartId === 'string') {
    setStoredCartId(data.cartId);
  }
  return data as T;
}

export async function fetchProducts(params?: {
  category?: string;
  sort?: string;
  q?: string;
}): Promise<Product[]> {
  const search = new URLSearchParams();
  if (params?.category && params.category !== 'all') search.set('category', params.category);
  if (params?.sort) search.set('sort', params.sort);
  if (params?.q) search.set('q', params.q);
  const qs = search.toString();
  const data = await apiFetch<{ products: Product[] }>(`/api/products${qs ? `?${qs}` : ''}`);
  return data.products;
}

export async function fetchProductBySlug(slug: string): Promise<{ product: Product; related: Product[] }> {
  return apiFetch<{ product: Product; related: Product[] }>(`/api/products/${encodeURIComponent(slug)}`);
}

export async function fetchJournalArticles(): Promise<JournalArticle[]> {
  const data = await apiFetch<{ articles: JournalArticle[] }>('/api/journal');
  return data.articles;
}

export async function fetchJournalArticle(slug: string): Promise<JournalArticle> {
  const data = await apiFetch<{ article: JournalArticle }>(`/api/journal/${encodeURIComponent(slug)}`);
  return data.article;
}

export async function fetchCart(): Promise<CartState> {
  return apiFetch<CartState>('/api/cart');
}

export async function addCartItem(productId: string, variantId: string, quantity = 1): Promise<CartState> {
  return apiFetch<CartState>('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, variantId, quantity }),
  });
}

export async function updateCartItem(itemId: string, quantity: number): Promise<CartState> {
  return apiFetch<CartState>(`/api/cart/items/${encodeURIComponent(itemId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(itemId: string): Promise<CartState> {
  return apiFetch<CartState>(`/api/cart/items/${encodeURIComponent(itemId)}`, {
    method: 'DELETE',
  });
}

export async function submitCheckout(payload: CheckoutPayload): Promise<OrderRecord> {
  const data = await apiFetch<{ order: OrderRecord }>('/api/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.order;
}

export async function fetchOrderByReference(reference: string): Promise<OrderRecord> {
  const data = await apiFetch<{ order: OrderRecord }>(`/api/orders/${encodeURIComponent(reference)}`);
  return data.order;
}

export async function subscribeNewsletter(email: string): Promise<{
  subscribed: boolean;
  alreadySubscribed: boolean;
  message: string;
}> {
  return apiFetch('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function submitContactInquiry(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ received: boolean; reference: string; message: string }> {
  return apiFetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
