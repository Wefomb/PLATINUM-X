import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../../shared/types.ts';
import { ensureGsapRegistered, gsap, ScrollTrigger } from './gsapSetup.ts';
import { useMotionPrefs } from './useMotionPrefs.ts';
import { SafeImage } from '../components/common/SafeImage.tsx';

interface ProductStackShowcaseProps {
  products: Product[];
}

/**
 * Scroll-controlled 3D editorial card stack inspired by Kolibrie Studio,
 * rendered strictly in PLATINUM X monochrome ivory/obsidian tones.
 * On mobile/tablet or reduced-motion, degrades into an accessible vertical/horizontal deck.
 */
export function ProductStackShowcase({ products }: ProductStackShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const { reducedMotion, isDesktop, isFinePointer } = useMotionPrefs();

  const stackItems = products.slice(0, 3);

  useEffect(() => {
    if (reducedMotion || !isDesktop || stackItems.length < 2 || !sectionRef.current) return;

    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const total = stackItems.length;
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      cards.forEach((card, i) => {
        gsap.set(card, {
          zIndex: total - i,
          y: i * 28,
          z: -i * 95,
          scale: 1 - i * 0.045,
          opacity: i === 0 ? 1 : 0.88 - i * 0.14,
          transformOrigin: 'center center',
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top+=32',
          end: `+=${(total - 1) * 520}`,
          pin: true,
          scrub: 0.75,
          onUpdate: (self) => {
            const idx = Math.min(total - 1, Math.round(self.progress * (total - 1)));
            setActiveIdx(idx);
          },
        },
      });

      for (let i = 0; i < total - 1; i++) {
        const currentCard = cards[i];
        const remaining = cards.slice(i + 1);

        tl.to(
          currentCard,
          {
            yPercent: -115,
            rotationX: 7,
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut',
          },
          i
        );

        remaining.forEach((rem, offset) => {
          tl.to(
            rem,
            {
              y: offset * 28,
              z: -offset * 95,
              scale: 1 - offset * 0.045,
              opacity: offset === 0 ? 1 : 0.88 - offset * 0.14,
              duration: 1,
              ease: 'power2.inOut',
            },
            i
          );
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion, isDesktop, stackItems.length]);

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !isFinePointer || !isDesktop) return;
    const card = cardsRef.current[activeIdx];
    if (!card) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotationY: nx * 8,
      rotationX: -ny * 5,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handlePointerLeave = () => {
    const card = cardsRef.current[activeIdx];
    if (!card) return;
    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  if (stackItems.length === 0) return null;

  // Mobile / Tablet / Reduced motion clean vertical grid
  if (!isDesktop || reducedMotion) {
    return (
      <section className="bg-[#E7E4DB] border-y border-[#DCDAD5] px-6 sm:px-10 lg:px-16 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
                COLLECTION 001 / ARCHIVE STACK
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#101010]">
                Three expressions.
              </h2>
            </div>
            <Link
              to="/collection"
              className="px-link-underline text-xs uppercase tracking-[0.14em] text-[#101010] whitespace-nowrap"
            >
              View full collection <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stackItems.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.slug}`}
                className="group block bg-[#F5F3EE] border border-[#DCDAD5] overflow-hidden"
              >
                <div className="aspect-[4/4.2] overflow-hidden bg-[#101010]">
                  <SafeImage
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#6A6967]">
                      {item.editionLabel}
                    </p>
                    <p className="text-sm text-[#101010] mt-1">{item.name}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#101010] shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="bg-[#E7E4DB] border-y border-[#DCDAD5] px-8 lg:px-14 py-16 min-h-[78vh] flex items-center overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-12 gap-10 items-center">
        <div className="col-span-5 flex flex-col justify-between h-full py-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6A6967] mb-3">
              COLLECTION 001 / THE EDIT
            </p>
            <h2 className="font-serif text-4xl xl:text-5xl font-light leading-[1.06] text-[#101010] mb-5">
              Three pieces.
              <br />
              Considered weight.
            </h2>
            <p className="text-sm leading-relaxed text-[#6A6967] max-w-sm">
              Scroll to move through the opening capsule—from the liquid-metal Brand Bible
              expression to the two-tone Signature essentials.
            </p>
          </div>

          <div className="mt-10 border-t border-[#DCDAD5] pt-6 space-y-3">
            {stackItems.map((item, idx) => (
              <Link
                key={item.id}
                to={`/product/${item.slug}`}
                className={`flex items-center justify-between py-2 text-xs transition-colors ${
                  idx === activeIdx
                    ? 'text-[#101010] font-medium'
                    : 'text-[#6A6967] hover:text-[#101010]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="px-num text-[11px]">0{idx + 1}</span>
                  <span>{item.name}</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.15em]">
                  {idx === activeIdx ? 'Active' : 'Inspect'}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div
          className="col-span-7 relative h-[490px] flex items-center justify-center"
          style={{ perspective: '1400px' }}
          onMouseMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
        >
          <div className="relative w-full max-w-[460px] h-[440px]" style={{ transformStyle: 'preserve-3d' }}>
            {stackItems.map((item, idx) => {
              const isDark = item.slug === 'brand-bible-tee';
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    cardsRef.current[idx] = el;
                  }}
                  data-cursor-label="VIEW PIECE"
                  className={`absolute inset-0 border overflow-hidden shadow-[0_24px_60px_rgba(16,16,16,0.12)] ${
                    isDark
                      ? 'bg-[#101010] text-[#F5F3EE] border-[#2A2A28]'
                      : 'bg-[#F5F3EE] text-[#101010] border-[#DCDAD5]'
                  }`}
                >
                  <Link to={`/product/${item.slug}`} className="flex flex-col h-full group">
                    <div
                      className={`flex-1 overflow-hidden ${
                        isDark ? 'bg-[#101010]' : 'bg-[#E5E3DC]'
                      }`}
                    >
                      <SafeImage
                        src={item.images[0]}
                        alt={item.name}
                        darkSurface={isDark}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between border-t border-current/10">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] opacity-60">
                          {item.editionLabel}
                        </p>
                        <p className="font-serif text-xl mt-0.5">{item.name}</p>
                      </div>
                      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em]">
                        View piece
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
