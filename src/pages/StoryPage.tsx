import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SafeImage } from '../components/common/SafeImage.tsx';
import { EditorialReveal } from '../animations/EditorialReveal.tsx';
import { ParallaxMedia } from '../animations/ParallaxMedia.tsx';

const BELIEFS = [
  {
    num: '01',
    title: 'Presence over volume.',
    body: 'Confidence is not measured by how loudly you dress. It is felt in how you carry yourself.',
  },
  {
    num: '02',
    title: 'A deliberate palette.',
    body: 'Black and white give the silhouette, the texture and the person room to speak.',
  },
  {
    num: '03',
    title: 'Streetwear, considered.',
    body: 'Everyday ease meets a refined point of view. Familiar pieces, with a distinct identity.',
  },
];

const DETAIL_PILLARS = [
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

export function StoryPage() {
  return (
    <div className="w-full">
      {/* Dark Brand Hero */}
      <section className="bg-[#101010] text-[#F5F3EE] px-6 sm:px-10 lg:px-12 pt-14 pb-20 lg:pb-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B9994] mb-3">
            OUR STORY / PLATINUM X
          </p>
          <EditorialReveal
            as="h1"
            immediate
            lines={['Less noise.', 'More presence.']}
            className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-light leading-[1.04] text-[#F5F3EE] mb-5"
          />
          <p className="text-xs sm:text-sm leading-relaxed text-[#A3A19C] max-w-2xl mb-14">
            Platinum X exists at the intersection of streetwear and quiet luxury. We create minimalist
            clothing for a new generation that wants to look elegant, confident and expensive without
            being loud.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="aspect-square bg-[#050505] border border-white/10 overflow-hidden">
                <SafeImage
                  src="/assets/platinum/fox-emblem-dark.webp"
                  alt="PLATINUM X Fox Emblem"
                  darkSurface
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="lg:col-span-7 lg:pl-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B9994] mb-3">
                THE MARK / QUIET POWER
              </p>
              <EditorialReveal
                as="h2"
                lines={['Instinct.', 'With intention.']}
                className="font-serif text-4xl sm:text-[42px] font-light leading-[1.08] text-[#F5F3EE] mb-4"
              />
              <p className="text-xs sm:text-sm text-[#A3A19C] leading-relaxed max-w-sm">
                Intelligence. Precision. Adaptability. Independence. Mystery. Quiet power.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Believe */}
      <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 py-20 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
            WHAT WE BELIEVE
          </p>
          <EditorialReveal
            as="h2"
            lines={['More intention. Less excess.']}
            className="font-serif text-4xl sm:text-[44px] font-light text-[#101010] mb-10"
          />

          <div className="divide-y divide-[#DCDAD5] border-t border-b border-[#DCDAD5]">
            {BELIEFS.map((item) => (
              <div
                key={item.num}
                className="py-7 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline"
              >
                <div className="md:col-span-5 flex items-baseline gap-4">
                  <span className="text-[10px] tracking-[0.16em] text-[#6A6967] px-num">
                    {item.num}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#101010]">
                    {item.title}
                  </h3>
                </div>
                <p className="md:col-span-7 text-xs sm:text-sm text-[#6A6967] leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closer, By Design */}
      <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 pb-20 lg:pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <ParallaxMedia offset={24} className="aspect-[568/661] bg-[#101010]">
              <SafeImage
                src="/assets/platinum/details-closeup.webp"
                alt="PLATINUM X garment finish and woven label"
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
              {DETAIL_PILLARS.map((row) => (
                <div key={row.label} className="py-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-1.5">
                    {row.label}
                  </p>
                  <p className="text-xs sm:text-sm text-[#101010]">{row.text}</p>
                </div>
              ))}
            </div>

            <Link to="/journal" className="px-link-underline text-xs text-[#101010]">
              <span>Inside the world of PLATINUM X</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dark CTA Band */}
      <section className="bg-[#101010] text-[#F5F3EE] px-6 sm:px-10 lg:px-12 py-20 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B9994] mb-3">
            FOR THE ONES WHO KNOW
          </p>
          <EditorialReveal
            as="h2"
            lines={['Find your PLATINUM X.']}
            className="font-serif text-4xl sm:text-5xl font-light text-[#F5F3EE] mb-8"
          />
          <Link
            to="/collection"
            className="inline-flex items-center justify-between gap-8 bg-[#F5F3EE] text-[#101010] px-6 py-3.5 text-xs tracking-[0.04em] hover:bg-[#E7E4DB] transition-colors"
          >
            <span>Explore the collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
