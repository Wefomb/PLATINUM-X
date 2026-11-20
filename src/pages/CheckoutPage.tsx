import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { submitCheckout } from '../services/api.ts';
import { SafeImage } from '../components/common/SafeImage.tsx';
import { EditorialReveal } from '../animations/EditorialReveal.tsx';

function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export function CheckoutPage() {
  const { cart, refreshCart } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddressLine1: '',
    shippingAddressLine2: '',
    shippingCity: '',
    shippingPostalCode: '',
    shippingCountry: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = cart?.items ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const order = await submitCheckout(form);
      await refreshCart();
      navigate(`/order/${encodeURIComponent(order.reference)}`);
    } catch (err: any) {
      setError(err?.message || 'Unable to submit your request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 py-24">
        <div className="max-w-xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">CHECKOUT</p>
          <h1 className="font-serif text-4xl font-light mb-4">Your bag is empty.</h1>
          <p className="text-sm text-[#6A6967] mb-8">
            Select a piece from Collection 001 before submitting a studio order or enquiry.
          </p>
          <Link
            to="/collection"
            className="inline-flex items-center gap-3 bg-[#101010] text-[#F5F3EE] px-6 py-3.5 text-xs"
          >
            <span>Explore the collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    );
  }

  const isEnquiryMode = cart?.pricingMode !== 'priced';

  return (
    <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 pt-14 pb-24">
      <div className="max-w-6xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
          {isEnquiryMode ? 'STUDIO ORDER ENQUIRY / COLLECTION 001' : 'CHECKOUT / COLLECTION 001'}
        </p>
        <EditorialReveal
          as="h1"
          immediate
          lines={[isEnquiryMode ? 'Confirm your selection.' : 'Delivery details.']}
          className="font-serif text-4xl sm:text-5xl font-light text-[#101010] mb-4"
        />
        <p className="text-xs sm:text-sm text-[#6A6967] max-w-xl mb-10 leading-relaxed">
          {isEnquiryMode
            ? 'Studio order mode: no payment card is collected here. Submitting reserves your selected sizes and sends your order reference for studio confirmation of pricing and delivery.'
            : 'Development checkout mode: submit your delivery details to generate a persisted order reference.'}
        </p>

        {error && (
          <div role="alert" className="mb-8 p-4 bg-[#E7E4DB] border border-[#101010]/30 text-xs text-[#101010]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="px-name" className="block text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
                  Full name
                </label>
                <input
                  id="px-name"
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full border border-[#DCDAD5] bg-transparent px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#101010]"
                />
              </div>

              <div>
                <label htmlFor="px-email" className="block text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
                  Email address
                </label>
                <input
                  id="px-email"
                  type="email"
                  required
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  className="w-full border border-[#DCDAD5] bg-transparent px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#101010]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="px-phone" className="block text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
                Phone number
              </label>
              <input
                id="px-phone"
                type="tel"
                required
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                className="w-full border border-[#DCDAD5] bg-transparent px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#101010]"
              />
            </div>

            <div>
              <label htmlFor="px-addr1" className="block text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
                Delivery street address
              </label>
              <input
                id="px-addr1"
                type="text"
                required
                value={form.shippingAddressLine1}
                onChange={(e) => setForm({ ...form, shippingAddressLine1: e.target.value })}
                className="w-full border border-[#DCDAD5] bg-transparent px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#101010]"
              />
            </div>

            <div>
              <label htmlFor="px-addr2" className="block text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
                Apartment, suite, etc. (optional)
              </label>
              <input
                id="px-addr2"
                type="text"
                value={form.shippingAddressLine2}
                onChange={(e) => setForm({ ...form, shippingAddressLine2: e.target.value })}
                className="w-full border border-[#DCDAD5] bg-transparent px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#101010]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="px-city" className="block text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
                  City
                </label>
                <input
                  id="px-city"
                  type="text"
                  required
                  value={form.shippingCity}
                  onChange={(e) => setForm({ ...form, shippingCity: e.target.value })}
                  className="w-full border border-[#DCDAD5] bg-transparent px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#101010]"
                />
              </div>

              <div>
                <label htmlFor="px-postal" className="block text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
                  Postal code
                </label>
                <input
                  id="px-postal"
                  type="text"
                  required
                  value={form.shippingPostalCode}
                  onChange={(e) => setForm({ ...form, shippingPostalCode: e.target.value })}
                  className="w-full border border-[#DCDAD5] bg-transparent px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#101010]"
                />
              </div>

              <div>
                <label htmlFor="px-country" className="block text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
                  Country
                </label>
                <input
                  id="px-country"
                  type="text"
                  required
                  value={form.shippingCountry}
                  onChange={(e) => setForm({ ...form, shippingCountry: e.target.value })}
                  className="w-full border border-[#DCDAD5] bg-transparent px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#101010]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="px-notes" className="block text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
                Sizing or studio notes (optional)
              </label>
              <textarea
                id="px-notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Preferred fit notes or delivery instructions..."
                className="w-full border border-[#DCDAD5] bg-transparent px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#101010]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto min-w-[260px] inline-flex items-center justify-between gap-6 bg-[#101010] text-[#F5F3EE] px-6 py-4 text-xs tracking-[0.04em] hover:bg-[#171716] transition-colors cursor-pointer disabled:opacity-45"
            >
              <span>
                {submitting
                  ? 'Confirming selection...'
                  : isEnquiryMode
                    ? 'Submit studio order request'
                    : 'Complete development order'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Summary Panel */}
          <aside className="lg:col-span-5 bg-[#E7E4DB] border border-[#DCDAD5] p-6 space-y-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967]">
              SELECTED PIECES ({cart?.itemCount ?? 0})
            </p>
            <ul className="divide-y divide-[#DCDAD5]">
              {items.map((item) => (
                <li key={item.id} className="py-4 flex items-center gap-4">
                  <div className="w-16 h-20 bg-[#E5E3DC] border border-[#DCDAD5] shrink-0 overflow-hidden">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#101010] truncate">{item.name}</p>
                    <p className="text-[11px] text-[#6A6967] mt-0.5">
                      {item.colorName} · Size {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs text-[#6A6967] px-num shrink-0">
                    {item.priceCents !== null
                      ? formatMoney(item.priceCents * item.quantity, item.currency)
                      : 'On enquiry'}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-[#DCDAD5] flex items-center justify-between text-xs">
              <span className="text-[#6A6967]">
                {isEnquiryMode ? 'Pricing & delivery' : 'Total'}
              </span>
              <span className="font-medium text-[#101010] px-num">
                {!isEnquiryMode && cart?.subtotalCents !== null && cart?.subtotalCents !== undefined
                  ? formatMoney(cart.subtotalCents, cart.currency)
                  : 'Confirmed on enquiry'}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
