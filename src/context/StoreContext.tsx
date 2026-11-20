import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { CartState, Product } from '../../shared/types.ts';
import {
  fetchCart,
  fetchProducts,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from '../services/api.ts';

interface StoreContextValue {
  cart: CartState | null;
  products: Product[];
  isBagOpen: boolean;
  setIsBagOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  cartError: string | null;
  clearCartError: () => void;
  isUpdatingCart: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, variantId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const next = await fetchCart();
      setCart(next);
    } catch {
      // keep existing state on transient read failure
    }
  }, []);

  useEffect(() => {
    refreshCart();
    fetchProducts()
      .then(setProducts)
      .catch(() => {});
  }, [refreshCart]);

  const clearCartError = useCallback(() => setCartError(null), []);

  const addToCart = useCallback(async (productId: string, variantId: string, quantity = 1) => {
    setIsUpdatingCart(true);
    setCartError(null);
    try {
      const next = await addCartItem(productId, variantId, quantity);
      setCart(next);
      setIsBagOpen(true);
      return true;
    } catch (err: any) {
      setCartError(err?.message || 'Unable to add item to bag.');
      return false;
    } finally {
      setIsUpdatingCart(false);
    }
  }, []);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    setIsUpdatingCart(true);
    setCartError(null);
    try {
      const next = await updateCartItem(itemId, quantity);
      setCart(next);
    } catch (err: any) {
      setCartError(err?.message || 'Unable to update quantity.');
    } finally {
      setIsUpdatingCart(false);
    }
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    setIsUpdatingCart(true);
    setCartError(null);
    try {
      const next = await removeCartItem(itemId);
      setCart(next);
    } catch (err: any) {
      setCartError(err?.message || 'Unable to remove item.');
    } finally {
      setIsUpdatingCart(false);
    }
  }, []);

  return (
    <StoreContext.Provider
      value={{
        cart,
        products,
        isBagOpen,
        setIsBagOpen,
        isSearchOpen,
        setIsSearchOpen,
        cartError,
        clearCartError,
        isUpdatingCart,
        refreshCart,
        addToCart,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
