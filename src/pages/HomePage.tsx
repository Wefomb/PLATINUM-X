import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { FoxEmblem } from '../components/brand/BrandMarks.tsx';
import { SafeImage } from '../components/common/SafeImage.tsx';
import { EditorialReveal } from '../animations/EditorialReveal.tsx';
import { ProductStackShowcase } from '../animations/ProductStackShowcase.tsx';
import { ParallaxMedia } from '../animations/ParallaxMedia.tsx';
import { PlatinumHero } from '../components/hero/PlatinumHero.tsx';

const DETAILS_PILLARS = [
  {
    label: '01 / THE CANVAS',
    text: 'A soft cotton base. A silhouette with room to move.',
  },
  {
    label: '02 / THE EXPRESSION',
    text: 'Monochrome graphics, deliberate placement, considered contrast.',
  },
  {
    label: '03 / THE FINISH',
    text: 'From the neckline to the signature, every detail belongs.',
  },
];

const FAQS = [
  {
    q: 'How do I choose my size?',
    a: 'Start with your preferred silhouette. Contact the studio for garment measurements before placing your order.',
  },
  {
    q: 'How do I order?',
    a: 'Choose your piece and enquire with the studio to confirm sizing, availability and delivery.',
  },
  {
    q: 'How should I care for my tee?',
    a: 'Follow the care label supplied with your garment. Keep printed surfaces protected when washing and ironing.',
  },
];

export function HomePage() {
  const { products } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <PlatinumHero />

      {/* 2. FEATURED COLLECTION — TWO TONES. ONE IDENTITY. */}
      <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 py-20 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
            THE PERMANENT EDIT
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <EditorialReveal
              as="h2"
              lines={['Two tones. One identity.']}
              className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-light text-[#101010]"
            />
            <Link
              to="/collection"
              className="px-link-underline text-xs text-[#101010] whitespace-nowrap self-start sm:self-auto"
            >
              <span>Explore the collection</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              to="/product/signature-tee-onyx"
              data-cursor-label="VIEW PIECE"
              className="group block"
            >
              <div className="aspect-[64/55] bg-[#E5E3DC] overflow-hidden">
                <SafeImage
                  src="/assets/platinum/signature-onyx.webp"
                  alt="The Signature Tee in Onyx"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="pt-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-sans text-sm text-[#101010]">The Signature Tee</h3>
                  <p className="text-[11px] text-[#6A6967] mt-0.5">
                    01 — Onyx / Relaxed silhouette
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#101010] transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              to="/product/signature-tee-chalk"
              data-cursor-label="VIEW PIECE"
              className="group block"
            >
              <div className="aspect-[64/55] bg-[#E5E3DC] overflow-hidden">
                <SafeImage
                  src="/assets/platinum/signature-chalk.webp"
                  alt="The Signature Tee in Chalk"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="pt-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-sans text-sm text-[#101010]">The Signature Tee</h3>
                  <p className="text-[11px] text-[#6A6967] mt-0.5">
                    02 — Chalk / Relaxed silhouette
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#101010] transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. STATEMENT SECTION — A STATEMENT. NOT A SHOUT. */}
      <section className="bg-[#101010] text-[#F5F3EE] px-6 sm:px-10 lg:px-12 py-20 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B9994] mb-8">
            EDITION 001 / THE GRAPHIC EXPRESSION
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <Link
                to="/product/brand-bible-tee"
                data-cursor-label="VIEW PIECE"
                className="block overflow-hidden bg-[#0A0A0A] group"
              >
                <SafeImage
                  src="/assets/platinum/brand-bible-front.webp"
                  alt="Brand Bible Tee featuring liquid-metal graphic"
                  darkSurface
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              </Link>
            </div>

            <div className="lg:col-span-6 lg:pl-6">
              <EditorialReveal
                as="h2"
                lines={['A statement.', 'Not a shout.']}
                className="font-serif text-4xl sm:text-5xl font-light leading-[1.06] text-[#F5F3EE] mb-6"
              />
              <p className="text-xs sm:text-sm leading-relaxed text-[#A3A19C] max-w-md mb-5">
                The Brand Bible tee brings a liquid-metal graphic to a grounded black canvas.
                An expressive piece, held together by a single palette.
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#7D7B77] mb-8">
                ONYX / MONOCHROME GRAPHIC
              </p>
              <Link
                to="/product/brand-bible-tee"
                className="inline-flex items-center justify-between gap-6 bg-[#F5F3EE] text-[#101010] px-6 py-3.5 text-xs tracking-[0.04em] hover:bg-[#E7E4DB] transition-colors"
              >
                <span>Explore the Brand Bible tee</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SCROLL-CONTROLLED 3D PRODUCT STACK */}
      {products.length > 0 && <ProductStackShowcase products={products} />}

      {/* 5. BRAND DETAIL SECTION — THE DETAILS MAKE THE DIFFERENCE */}
      <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 py-20 lg:py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <ParallaxMedia offset={24} className="aspect-[568/661] bg-[#101010]">
              <SafeImage
                src="/assets/platinum/details-closeup.webp"
                alt="Close-up of PLATINUM X woven neck label and brushed metal fox emblem"
                darkSurface
                loading="lazy"
                className="w-full h-full object-cover scale-105"
              />
            </ParallaxMedia>
          </div>

          <div className="lg:col-span-7 lg:pl-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
              CLOSER, BY DESIGN
            </p>
            <EditorialReveal
              as="h2"
              lines={['The details', 'make the difference.']}
              className="font-serif text-4xl sm:text-[42px] font-light leading-[1.08] text-[#101010] mb-8"
            />

            <div className="divide-y divide-[#DCDAD5] border-t border-b border-[#DCDAD5] mb-8">
              {DETAILS_PILLARS.map((row) => (
                <div key={row.label} className="py-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-1.5">
                    {row.label}
                  </p>
                  <p className="text-xs sm:text-sm text-[#101010]">{row.text}</p>
                </div>
              ))}
            </div>

            <Link
              to="/story"
              className="px-link-underline text-xs text-[#101010]"
            >
              <span>Inside the world of PLATINUM X</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL CAMPAIGN SECTION — MADE FOR YOUR PRESENCE */}
      <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 pb-20 lg:pb-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
            IN CONTEXT / LOOKBOOK 001
          </p>
          <EditorialReveal
            as="h2"
            lines={['Made for your presence.']}
            className="font-serif text-4xl sm:text-[42px] font-light text-[#101010] mb-10"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <Link
                to="/product/brand-bible-tee"
                data-cursor-label="EXPLORE"
                className="block overflow-hidden bg-[#101010] aspect-[342/410]"
              >
                <SafeImage
                  src="/assets/platinum/lookbook-01-poster.webp"
                  alt="Streetwear meets luxury editorial poster"
                  darkSurface
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </Link>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mt-4">
                01 / STREETWEAR MEETS LUXURY
              </p>
              <Link
                to="/journal"
                className="px-link-underline text-xs text-[#101010] mt-3"
              >
                <span>Explore the journal</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>

            <div>
              <Link
                to="/journal"
                data-cursor-label="DISCOVER"
                className="block overflow-hidden bg-[#101010] aspect-[342/410]"
              >
                <SafeImage
                  src="/assets/platinum/lookbook-02.webp"
                  alt="Less noise, more presence editorial campaign"
                  darkSurface
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </Link>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mt-4">
                02 / CONFIDENCE, WITHOUT VOLUME
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BEFORE YOU CHOOSE — CONSIDERATIONS */}
      <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 pb-20 lg:pb-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
            A FEW CONSIDERATIONS
          </p>
          <EditorialReveal
            as="h2"
            lines={['Before you choose.']}
            className="font-serif text-4xl sm:text-[42px] font-light text-[#101010] mb-8"
          />

          <div className="divide-y divide-[#DCDAD5] border-t border-b border-[#DCDAD5]">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                  >
                    <span className="text-sm font-medium text-[#101010] group-hover:opacity-75 transition-opacity">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#6A6967] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#101010]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-xs sm:text-sm text-[#6A6967] mt-2.5 max-w-2xl leading-relaxed">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. PHILOSOPHY BAND */}
      <section className="bg-[#171716] text-[#F5F3EE] px-6 sm:px-10 lg:px-12 py-24 lg:py-28 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <FoxEmblem className="w-9 h-9 text-[#F5F3EE] mb-6" strokeWidth={1.35} />
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#9B9994] mb-4">
            THE PLATINUM X PHILOSOPHY
          </p>
          <EditorialReveal
            as="h2"
            lines={['Luxury is knowing', 'what to leave out.']}
            className="font-serif text-4xl sm:text-5xl font-light leading-[1.08] text-[#F5F3EE] mb-5"
          />
          <p className="text-xs sm:text-sm text-[#9B9994] leading-relaxed max-w-sm">
            A monochrome wardrobe. A deliberate point of view.
            <br />
            We make room for the person wearing it.
          </p>
        </div>
      </section>
    </div>
  );
}
