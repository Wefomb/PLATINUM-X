import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { SafeImage } from '../components/common/SafeImage.tsx';
import { EditorialReveal } from '../animations/EditorialReveal.tsx';

function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export function CartPage() {
  const { cart, updateQuantity, removeItem, isUpdatingCart, cartError, clearCartError } = useStore();
  const items = cart?.items ?? [];

  return (
    <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 pt-14 pb-24 min-h-[65vh]">
      <div className="max-w-5xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
          STUDIO SELECTION
        </p>
        <EditorialReveal
          as="h1"
          immediate
          lines={[`Your bag (${cart?.itemCount ?? 0}).`]}
          className="font-serif text-4xl sm:text-5xl font-light text-[#101010] mb-10"
        />

        {cartError && (
          <div className="mb-6 p-4 bg-[#E7E4DB] border border-[#101010]/20 text-xs flex items-center justify-between">
            <span>{cartError}</span>
            <button type="button" onClick={clearCartError} className="underline text-[10px] uppercase">
              Dismiss
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="border-t border-[#DCDAD5] pt-12">
            <p className="text-sm text-[#6A6967] mb-6">
              Your bag is currently empty. Select a piece from Collection 001 to begin.
            </p>
            <Link
              to="/collection"
              className="inline-flex items-center gap-4 bg-[#101010] text-[#F5F3EE] px-6 py-3.5 text-xs"
            >
              <span>Discover the collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 divide-y divide-[#DCDAD5] border-t border-b border-[#DCDAD5]">
              {items.map((item) => (
                <div key={item.id} className="py-6 flex gap-5">
                  <Link
                    to={`/product/${item.slug}`}
                    className="w-24 h-28 shrink-0 bg-[#E5E3DC] border border-[#DCDAD5] overflow-hidden"
                  >
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-[#6A6967]">
                          {item.editionLabel}
                        </p>
                        <Link
                          to={`/product/${item.slug}`}
                          className="font-serif text-2xl font-light text-[#101010] hover:underline"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-[#6A6967] mt-1">
                          {item.colorName} · Size {item.size}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={isUpdatingCart}
                        aria-label={`Remove ${item.name}`}
                        className="text-[#6A6967] hover:text-[#101010] p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="inline-flex items-center border border-[#DCDAD5]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isUpdatingCart}
                          aria-label="Decrease quantity"
                          className="px-3 py-1.5 hover:bg-[#E7E4DB] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3.5 text-xs px-num">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isUpdatingCart || item.quantity >= item.availableStock}
                          aria-label="Increase quantity"
                          className="px-3 py-1.5 hover:bg-[#E7E4DB] cursor-pointer disabled:opacity-35"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs text-[#6A6967] px-num">
                        {item.priceCents !== null
                          ? formatMoney(item.priceCents * item.quantity, item.currency)
                          : 'Confirmed on enquiry'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 bg-[#E7E4DB] border border-[#DCDAD5] p-6 space-y-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967]">
                ORDER SUMMARY
              </p>
              <div className="flex items-center justify-between text-xs border-b border-[#DCDAD5] pb-4">
                <span className="text-[#6A6967]">Pieces</span>
                <span className="px-num">{cart?.itemCount ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6A6967]">
                  {cart?.pricingMode === 'priced' ? 'Subtotal' : 'Pricing & delivery'}
                </span>
                <span className="font-medium px-num">
                  {cart?.pricingMode === 'priced' && cart.subtotalCents !== null
                    ? formatMoney(cart.subtotalCents, cart.currency)
                    : 'Confirmed on enquiry'}
                </span>
              </div>
              <Link
                to="/checkout"
                className="w-full flex items-center justify-between bg-[#101010] text-[#F5F3EE] px-5 py-3.5 text-xs hover:bg-[#171716] transition-colors"
              >
                <span>
                  {cart?.pricingMode === 'priced' ? 'Proceed to checkout' : 'Continue to studio request'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
