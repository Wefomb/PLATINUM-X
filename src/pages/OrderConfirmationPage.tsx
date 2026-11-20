import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { OrderRecord } from '../../shared/types.ts';
import { fetchOrderByReference } from '../services/api.ts';
import { SafeImage } from '../components/common/SafeImage.tsx';
import { FoxEmblem } from '../components/brand/BrandMarks.tsx';

function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export function OrderConfirmationPage() {
  const { reference = '' } = useParams<{ reference: string }>();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchOrderByReference(reference)
      .then((res) => {
        if (active) setOrder(res);
      })
      .catch((err: any) => {
        if (active) setError(err?.message || 'Order reference not found.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reference]);

  if (loading) {
    return (
      <section className="bg-[#F5F3EE] px-6 sm:px-10 lg:px-12 py-20">
        <div className="max-w-3xl mx-auto animate-pulse space-y-4">
          <div className="h-4 w-40 bg-[#DCDAD5]" />
          <div className="h-12 w-72 bg-[#DCDAD5]" />
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="bg-[#F5F3EE] px-6 sm:px-10 lg:px-12 py-24">
        <div className="max-w-xl mx-auto">
          <h1 className="font-serif text-4xl font-light mb-4">Order not found.</h1>
          <p className="text-sm text-[#6A6967] mb-8">{error}</p>
          <Link to="/collection" className="px-link-underline text-xs text-[#101010]">
            <span>Return to collection</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 pt-14 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FoxEmblem className="w-6 h-6" strokeWidth={1.5} />
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967]">
            REFERENCE / {order.reference}
          </p>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#101010] mb-4">
          {order.paymentMode === 'studio_enquiry'
            ? 'Studio request recorded.'
            : 'Order recorded.'}
        </h1>

        <p className="text-xs sm:text-sm text-[#6A6967] leading-relaxed mb-10 max-w-xl">
          Thank you, {order.customerName}. Your selection is logged under reference{' '}
          <strong className="text-[#101010] font-medium px-num">{order.reference}</strong>.{' '}
          {order.paymentMode === 'studio_enquiry'
            ? 'The studio will confirm sizing, pricing and delivery directly at '
            : 'Confirmation details apply to '}
          {order.customerEmail}.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-y border-[#DCDAD5] py-6 mb-8 text-xs">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
              DELIVERY ADDRESS
            </p>
            <p>{order.customerName}</p>
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
              STATUS
            </p>
            <p className="capitalize">{order.status.replace(/_/g, ' ')}</p>
            <p className="text-[#6A6967] mt-1 capitalize">
              Payment: {order.paymentStatus.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        <ul className="divide-y divide-[#DCDAD5] border-b border-[#DCDAD5] mb-10">
          {order.items.map((item, idx) => (
            <li key={item.variantId + idx} className="py-4 flex items-center gap-4">
              <div className="w-14 h-16 bg-[#E5E3DC] border border-[#DCDAD5] overflow-hidden shrink-0">
                <SafeImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#101010]">{item.name}</p>
                <p className="text-[11px] text-[#6A6967] mt-0.5">
                  {item.colorName} · Size {item.size} · Qty {item.quantity}
                </p>
              </div>
              <span className="text-xs text-[#6A6967] px-num">
                {item.priceCents !== null
                  ? formatMoney(item.priceCents * item.quantity, order.currency)
                  : 'Confirmed on enquiry'}
              </span>
            </li>
          ))}
        </ul>

        <Link
          to="/collection"
          className="inline-flex items-center gap-4 bg-[#101010] text-[#F5F3EE] px-6 py-3.5 text-xs"
        >
          <span>Return to collection</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
