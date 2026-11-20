import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { EditorialReveal } from '../animations/EditorialReveal.tsx';

const SECTIONS = [
  {
    eyebrow: '01 / ORDERING & AVAILABILITY',
    title: 'Studio confirmation.',
    body: 'Collection 001 is released in considered studio quantities. Submit your preferred piece and size through your bag or contact the studio directly to confirm garment measurements, pricing and delivery.',
  },
  {
    eyebrow: '02 / SHIPPING',
    title: 'Tracked dispatch.',
    body: 'Delivery arrangements and timelines are confirmed with you prior to dispatch. All pieces ship in protective monochrome garment packaging.',
  },
  {
    eyebrow: '03 / GARMENT CARE',
    title: 'Preserving the finish.',
    body: 'Please follow the care label supplied with your garment. Wash cold inside out with similar monochrome tones and keep printed liquid-metal surfaces protected when washing and ironing.',
  },
  {
    eyebrow: '04 / RETURNS & EXCHANGES',
    title: 'Size exchanges.',
    body: 'Unworn pieces with original tags intact may be exchanged subject to studio size availability. Reach out to the studio with your order reference before returning an item.',
  },
];

export function PoliciesPage() {
  return (
    <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 pt-14 pb-24">
      <div className="max-w-4xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
          STUDIO GUIDELINES
        </p>
        <EditorialReveal
          as="h1"
          immediate
          lines={['Shipping, care', '& returns.']}
          className="font-serif text-4xl sm:text-5xl font-light leading-[1.06] text-[#101010] mb-12"
        />

        <div className="divide-y divide-[#DCDAD5] border-t border-b border-[#DCDAD5]">
          {SECTIONS.map((sec) => (
            <div key={sec.eyebrow} className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
                  {sec.eyebrow}
                </p>
                <h2 className="font-serif text-2xl font-light text-[#101010]">{sec.title}</h2>
              </div>
              <p className="md:col-span-7 text-xs sm:text-sm text-[#6A6967] leading-relaxed">
                {sec.body}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-10">
          <Link to="/contact" className="px-link-underline text-xs text-[#101010]">
            <span>Contact the studio</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
