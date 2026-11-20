import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowRight, Menu, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { FoxEmblem, PlatinumWordmark } from '../brand/BrandMarks.tsx';
import { InteractiveShirt360 } from './InteractiveShirt360.tsx';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/collection', label: 'Shop', end: false },
  { to: '/story', label: 'About', end: true },
  { to: '/journal', label: 'Journal', end: false },
];

export function PlatinumHero() {
  const { cart, setIsBagOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const itemCount = cart?.itemCount ?? 0;

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleOpenBag = () => {
    setMobileMenuOpen(false);
    setIsBagOpen(true);
  };

  return (
    <section
      aria-label="PLATINUM X Hero"
      className="relative h-screen h-dvh min-h-[600px] w-full overflow-hidden bg-black text-white flex flex-col"
    >
      {/* 1. Background & Interactive 360-Degree Rotating T-Shirt Layer */}
      <div className="absolute inset-0 z-10 bg-black">
        <div className="absolute inset-x-0 top-14 h-[42dvh] sm:h-[48dvh] lg:inset-y-0 lg:top-0 lg:left-[44%] lg:right-0 lg:h-full flex items-center justify-center px-4 sm:px-8 lg:px-10 py-3 lg:py-14">
          <div className="relative w-full h-full max-h-[40dvh] sm:max-h-[46dvh] lg:max-h-[82dvh]">
            <InteractiveShirt360 />
          </div>
        </div>

        {/* Pure black atmospheric blending for seamless edge transitions */}
        <div className="pointer-events-none hidden lg:block absolute inset-y-0 left-0 w-[46%] bg-gradient-to-r from-black from-70% via-black/60 to-transparent" />
        <div className="pointer-events-none lg:hidden absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black from-65% via-black/75 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent" />
      </div>

      {/* 2. Transparent Top Navigation Bar */}
      <header className="relative z-30 w-full px-6 sm:px-10 lg:px-14 py-6 flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <Link
          to="/"
          aria-label="PLATINUM X Home"
          className="inline-flex items-center gap-2.5 text-white hover:opacity-85 transition-opacity"
        >
          <FoxEmblem className="w-5 h-5 shrink-0" strokeWidth={1.6} />
          <PlatinumWordmark className="text-sm tracking-[0.24em] text-white" />
        </Link>

        {/* Center: Desktop Links */}
        <nav
          aria-label="Primary hero navigation"
          className="hidden lg:flex items-center gap-10"
        >
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `text-xs uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? 'text-white font-medium'
                    : 'text-white/70 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Desktop Cart & Shop Now CTA */}
        <div className="hidden lg:flex items-center gap-6">
          <button
            type="button"
            onClick={handleOpenBag}
            aria-label={`Open shopping bag (${itemCount} items)`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/85 hover:text-white transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="px-num">({itemCount})</span>
          </button>

          <Link
            to="/collection"
            className="text-xs uppercase tracking-[0.16em] text-white border border-white/35 px-4 py-2 rounded-[2px] hover:bg-white hover:text-black transition-colors"
          >
            Shop Now
          </Link>
        </div>

        {/* Mobile Quick Cart + Menu Toggle */}
        <div className="flex lg:hidden items-center gap-4">
          <button
            type="button"
            onClick={handleOpenBag}
            aria-label={`Open shopping bag (${itemCount} items)`}
            className="inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-white px-num cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>({itemCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="p-1.5 text-white hover:opacity-80 transition-opacity cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 3. Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="lg:hidden fixed inset-0 z-50 bg-black text-white flex flex-col justify-between px-6 py-6 overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-6 border-b border-white/15">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-2.5 text-white"
            >
              <FoxEmblem className="w-5 h-5 shrink-0" strokeWidth={1.6} />
              <PlatinumWordmark className="text-sm tracking-[0.24em] text-white" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav aria-label="Mobile sections" className="my-auto py-10 flex flex-col gap-6">
            {NAV_LINKS.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-4xl font-light tracking-[-0.01em] text-white hover:text-white/75 transition-colors flex items-baseline gap-4"
              >
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/45 px-num">
                  0{index + 1}
                </span>
                <span>{item.label}</span>
              </NavLink>
            ))}

            <button
              type="button"
              onClick={handleOpenBag}
              className="text-left font-serif text-4xl font-light tracking-[-0.01em] text-white hover:text-white/75 transition-colors flex items-baseline gap-4 cursor-pointer"
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/45 px-num">
                05
              </span>
              <span>Cart ({itemCount})</span>
            </button>
          </nav>

          <div className="pt-6 border-t border-white/15 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/55">
            <span>Less noise. More presence.</span>
            <span>Collection 001</span>
          </div>
        </div>
      )}

      {/* 4. Hero Foreground Editorial Content (Left Area) */}
      <div className="pointer-events-none relative z-20 flex-1 w-full px-6 sm:px-10 lg:px-14 pb-10 sm:pb-12 lg:pb-16 flex flex-col justify-end lg:justify-between">
        <div className="pointer-events-auto w-full lg:w-[46%] xl:w-[44%] flex flex-col justify-end lg:justify-between lg:h-full">
          {/* Upper-Middle Editorial Headline */}
          <div className="lg:my-auto lg:pt-4">
            <p className="px-hero-stagger px-hero-delay-1 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-white/75 mb-4 sm:mb-5">
              PLATINUM X &mdash; PREMIUM STREETWEAR
            </p>

            <h1 className="px-hero-stagger px-hero-delay-2 font-serif text-[3rem] sm:text-[4.25rem] lg:text-[5rem] xl:text-[6rem] font-light leading-[0.98] tracking-[-0.015em] text-white mb-6 lg:mb-0">
              <span className="block">Presence.</span>
              <span className="block">Without noise.</span>
            </h1>
          </div>

          {/* Lower-Left Supporting Copy & Primary CTA */}
          <div className="lg:pt-6">
            <p className="px-hero-stagger px-hero-delay-3 text-xs sm:text-sm leading-relaxed text-white/75 max-w-md mb-6 sm:mb-7">
              Minimalist streetwear for those who understand that true presence doesn&apos;t need to be loud.
            </p>

            <div className="px-hero-stagger px-hero-delay-4">
              <Link
                to="/collection"
                className="inline-flex items-center justify-between gap-5 bg-white text-black px-7 py-3.5 sm:py-4 text-[11px] font-medium uppercase tracking-[0.16em] rounded-[2px] hover:bg-[#E7E4DB] transition-colors"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
