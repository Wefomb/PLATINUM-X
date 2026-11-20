import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import type { JournalArticle } from '../../shared/types.ts';
import { fetchJournalArticles } from '../services/api.ts';
import { SafeImage } from '../components/common/SafeImage.tsx';
import { EditorialReveal } from '../animations/EditorialReveal.tsx';
import { ParallaxMedia } from '../animations/ParallaxMedia.tsx';

const ARCHIVE_TILES = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  src: `/assets/platinum/archive/tile-${String(i + 1).padStart(2, '0')}.webp`,
  alt: `PLATINUM X Visual Archive study ${String(i + 1).padStart(2, '0')}`,
}));

export function JournalPage() {
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    fetchJournalArticles()
      .then(setArticles)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') setLightboxIdx((i) => (i === null ? null : (i + 1) % ARCHIVE_TILES.length));
      if (e.key === 'ArrowLeft')
        setLightboxIdx((i) => (i === null ? null : (i - 1 + ARCHIVE_TILES.length) % ARCHIVE_TILES.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx]);

  const leadArticle = articles[0];
  const secondaryArticles = articles.slice(1, 3);

  return (
    <div className="w-full">
      {/* Header + 01 Point of View */}
      <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 pt-14 pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
            THE JOURNAL
          </p>
          <EditorialReveal
            as="h1"
            immediate
            lines={['Notes on presence.']}
            className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-light text-[#101010] mb-3"
          />
          <p className="text-xs sm:text-sm text-[#6A6967] mb-12">
            Inside the clothes, the symbols and the point of view.
          </p>

          {/* 01 / POINT OF VIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <Link
                to={leadArticle ? `/journal/${leadArticle.slug}` : '/story'}
                data-cursor-label="DISCOVER"
                className="block overflow-hidden bg-[#101010]"
              >
                <ParallaxMedia offset={18} className="aspect-[640/760]">
                  <SafeImage
                    src="/assets/platinum/journal-hero.webp"
                    alt="Less noise, more presence editorial campaign"
                    darkSurface
                    className="w-full h-full object-cover scale-105"
                  />
                </ParallaxMedia>
              </Link>
            </div>

            <div className="lg:col-span-6 lg:pl-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
                01 / POINT OF VIEW
              </p>
              <EditorialReveal
                as="h2"
                lines={['Presence is', 'a quiet thing.']}
                className="font-serif text-4xl sm:text-[42px] font-light leading-[1.08] text-[#101010] mb-5"
              />
              <p className="text-xs sm:text-sm leading-relaxed text-[#6A6967] max-w-md mb-4">
                We do not believe presence comes from being louder. It comes from confidence,
                intention, and how you carry yourself.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-[#6A6967] max-w-md mb-7">
                A monochrome wardrobe is not an absence of expression. It is a choice to let
                proportion, texture and movement take the lead. The clothes frame the person.
                They never need to compete.
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <Link to="/story" className="px-link-underline text-xs text-[#101010]">
                  <span>Discover our philosophy</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
                {leadArticle && (
                  <Link
                    to={`/journal/${leadArticle.slug}`}
                    className="text-xs text-[#6A6967] hover:text-[#101010] transition-colors"
                  >
                    Read full note
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FROM THE STUDIO — The stories in the details */}
      <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 pb-20 lg:pb-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
            FROM THE STUDIO
          </p>
          <EditorialReveal
            as="h2"
            lines={['The stories in the details.']}
            className="font-serif text-4xl sm:text-[42px] font-light text-[#101010] mb-10"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              to="/journal/a-closer-look"
              data-cursor-label="DISCOVER"
              className="group block"
            >
              <div className="aspect-[640/625] bg-[#101010] overflow-hidden">
                <SafeImage
                  src="/assets/platinum/journal-details.webp"
                  alt="Close-up of PLATINUM X label and metallic fox pin"
                  darkSurface
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mt-4">
                02 / THE FINISH
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#101010] mt-1.5">
                A closer look.
              </h3>
              <p className="text-xs text-[#6A6967] mt-1.5">
                A label, a mark, the texture of black. The small things give a piece its character.
              </p>
            </Link>

            <Link
              to="/journal/distinction-by-design"
              data-cursor-label="DISCOVER"
              className="group block"
            >
              <div className="aspect-[640/625] bg-[#FFFFFF] border border-[#DCDAD5] overflow-hidden">
                <SafeImage
                  src="/assets/platinum/distinction-fox.webp"
                  alt="Artistic ink fox illustration — Distinction by design"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mt-4">
                03 / THE ARTWORK
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#101010] mt-1.5">
                Distinction, by design.
              </h3>
              <p className="text-xs text-[#6A6967] mt-1.5">
                A study in contrast. Liquid forms and sharp instinct, expressed through a monochrome lens.
              </p>
            </Link>
          </div>

          {secondaryArticles.length === 0 && null}
        </div>
      </section>

      {/* VISUAL ARCHIVE / COLLECTION 001 */}
      <section className="bg-[#101010] text-[#F5F3EE] px-6 sm:px-10 lg:px-12 py-20 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B9994] mb-3">
            VISUAL ARCHIVE / COLLECTION 001
          </p>
          <EditorialReveal
            as="h2"
            lines={['The world of PLATINUM X.']}
            className="font-serif text-4xl sm:text-5xl font-light text-[#F5F3EE] mb-10"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#262624] max-w-4xl border border-[#262624]">
            {ARCHIVE_TILES.map((tile, idx) => (
              <button
                key={tile.id}
                type="button"
                onClick={() => setLightboxIdx(idx)}
                data-cursor-label="INSPECT"
                aria-label={`Open ${tile.alt}`}
                className="group relative aspect-[188/270] overflow-hidden bg-[#101010] cursor-pointer text-left"
              >
                <SafeImage
                  src={tile.src}
                  alt={tile.alt}
                  darkSurface
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </button>
            ))}
          </div>

          <p className="text-xs text-[#9B9994] mt-6">
            A visual language of instinct, restraint and quiet power.
          </p>
        </div>
      </section>

      {/* Archive Lightbox */}
      {lightboxIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visual Archive study viewer"
          className="fixed inset-0 z-50 bg-[#101010]/92 flex items-center justify-center p-6"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            aria-label="Close archive viewer"
            className="absolute top-6 right-6 p-2 text-[#F5F3EE] hover:opacity-70 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="max-w-md w-full bg-[#101010] border border-white/15 p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <SafeImage
              src={ARCHIVE_TILES[lightboxIdx].src}
              alt={ARCHIVE_TILES[lightboxIdx].alt}
              darkSurface
              className="w-full h-auto object-contain"
            />
            <div className="pt-3 px-1 flex items-center justify-between text-[11px] text-[#9B9994] px-num">
              <span>PLATE {String(lightboxIdx + 1).padStart(2, '0')} / 16</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIdx((lightboxIdx - 1 + ARCHIVE_TILES.length) % ARCHIVE_TILES.length)
                  }
                  className="hover:text-[#F5F3EE] cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIdx((lightboxIdx + 1) % ARCHIVE_TILES.length)}
                  className="hover:text-[#F5F3EE] cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
