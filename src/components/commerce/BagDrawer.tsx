import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, ArrowRight, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { SafeImage } from '../common/SafeImage.tsx';

function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export function BagDrawer() {
  const {
    cart,
    isBagOpen,
    setIsBagOpen,
    updateQuantity,
    removeItem,
    cartError,
    clearCartError,
    isUpdatingCart,
  } = useStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isBagOpen) {
        setIsBagOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isBagOpen, setIsBagOpen]);

  if (!isBagOpen) return null;

  const items = cart?.items ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <div
        className="fixed inset-0 bg-[#101010]/45 transition-opacity"
        onClick={() => setIsBagOpen(false)}
        aria-hidden="true"
      />

      <aside className="relative z-10 w-full max-w-md bg-[#F5F3EE] text-[#101010] border-l border-[#DCDAD5] h-full flex flex-col">
        <div className="px-6 py-5 border-b border-[#DCDAD5] flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967]">
              STUDIO SELECTION
            </p>
            <h2 className="font-serif text-2xl font-light mt-0.5">
              Your bag ({cart?.itemCount ?? 0})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsBagOpen(false)}
            aria-label="Close bag"
            className="p-2 text-[#101010] hover:opacity-60 transition-opacity cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {cartError && (
          <div className="mx-6 mt-4 p-3 bg-[#E7E4DB] border border-[#101010]/20 text-xs text-[#101010] flex items-center justify-between gap-3">
            <span>{cartError}</span>
            <button
              type="button"
              onClick={clearCartError}
              className="text-[10px] uppercase tracking-[0.15em] underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-start justify-center py-12">
              <p className="font-serif text-2xl font-light text-[#101010] mb-2">
                Your bag is empty.
              </p>
              <p className="text-xs text-[#6A6967] leading-relaxed mb-6 max-w-xs">
                Explore Collection 001 to select your preferred silhouette and size.
              </p>
              <Link
                to="/collection"
                onClick={() => setIsBagOpen(false)}
                className="inline-flex items-center gap-3 bg-[#101010] text-[#F5F3EE] px-5 py-3 text-xs tracking-[0.06em] hover:bg-[#171716] transition-colors"
              >
                <span>Explore the collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[#DCDAD5]">
              {items.map((item) => (
                <li key={item.id} className="py-5 first:pt-0 flex gap-4">
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={() => setIsBagOpen(false)}
                    className="w-20 h-24 shrink-0 bg-[#E5E3DC] border border-[#DCDAD5] overflow-hidden"
                  >
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={() => setIsBagOpen(false)}
                          className="text-sm font-medium text-[#101010] hover:underline truncate"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={isUpdatingCart}
                          aria-label={`Remove ${item.name}`}
                          className="text-[#6A6967] hover:text-[#101010] p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#6A6967] mt-1">
                        {item.colorName} / Size {item.size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-[#DCDAD5] bg-[#F5F3EE]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isUpdatingCart}
                          aria-label="Decrease quantity"
                          className="px-2.5 py-1.5 text-[#101010] hover:bg-[#E7E4DB] transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs px-num">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isUpdatingCart || item.quantity >= item.availableStock}
                          aria-label="Increase quantity"
                          className="px-2.5 py-1.5 text-[#101010] hover:bg-[#E7E4DB] transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs text-[#6A6967] px-num">
                        {item.priceCents !== null
                          ? formatMoney(item.priceCents * item.quantity, item.currency)
                          : 'On enquiry'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#DCDAD5] bg-[#E7E4DB]/60 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-[0.16em] text-[#6A6967]">
                {cart?.pricingMode === 'priced' ? 'Estimated subtotal' : 'Studio pricing'}
              </span>
              <span className="font-medium text-[#101010] px-num">
                {cart?.pricingMode === 'priced' && cart.subtotalCents !== null
                  ? formatMoney(cart.subtotalCents, cart.currency)
                  : 'Confirmed on enquiry'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={() => setIsBagOpen(false)}
                className="flex items-center justify-center border border-[#101010] text-[#101010] py-3 px-4 text-xs tracking-[0.04em] hover:bg-[#101010] hover:text-[#F5F3EE] transition-colors"
              >
                View bag
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsBagOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#101010] text-[#F5F3EE] py-3 px-4 text-xs tracking-[0.04em] hover:bg-[#171716] transition-colors"
              >
                <span>{cart?.pricingMode === 'priced' ? 'Checkout' : 'Submit request'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
