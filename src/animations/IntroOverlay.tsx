import React, { useEffect, useRef, useState } from 'react';
import { ensureGsapRegistered, gsap } from './gsapSetup.ts';
import { FoxEmblem, PlatinumWordmark } from '../components/brand/BrandMarks.tsx';
import { useMotionPrefs } from './useMotionPrefs.ts';

const INTRO_SESSION_KEY = 'px_intro_seen';

export function IntroOverlay({ onComplete }: { onComplete?: () => void }) {
  const { reducedMotion } = useMotionPrefs();
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      return sessionStorage.getItem(INTRO_SESSION_KEY) !== '1';
    } catch {
      return false;
    }
  });

  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);

  const finishIntro = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      // ignore
    }
    setVisible(false);
    onComplete?.();
  };

  useEffect(() => {
    if (!visible) {
      onComplete?.();
      return;
    }

    if (reducedMotion) {
      finishIntro();
      return;
    }

    ensureGsapRegistered();

    // Safety fallback timer so intro can never block access
    const safetyTimer = window.setTimeout(() => {
      finishIntro();
    }, 2900);

    const ctx = gsap.context(() => {
      const paths = overlayRef.current?.querySelectorAll<SVGPathElement>('[data-fox-path]');
      if (paths && paths.length > 0) {
        paths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(safetyTimer);
          finishIntro();
        },
      });

      if (paths && paths.length > 0) {
        tl.to(paths, {
          strokeDashoffset: 0,
          duration: 0.95,
          stagger: 0.08,
          ease: 'power3.inOut',
        });
      }

      tl.fromTo(
        wordmarkRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out' },
        '-=0.35'
      )
        .to(
          [logoRef.current, wordmarkRef.current],
          { opacity: 0, y: -8, duration: 0.35, ease: 'power2.in' },
          '+=0.25'
        )
        .to(
          overlayRef.current,
          { yPercent: -100, duration: 0.65, ease: 'expo.inOut' },
          '-=0.1'
        );
    }, overlayRef);

    return () => {
      window.clearTimeout(safetyTimer);
      ctx.revert();
    };
  }, [visible, reducedMotion]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-label="Loading PLATINUM X"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#101010] text-[#F5F3EE]"
    >
      <div ref={logoRef} className="mb-5 text-[#F5F3EE]">
        <FoxEmblem className="w-14 h-14" strokeWidth={1.35} />
      </div>
      <div ref={wordmarkRef} className="opacity-0 flex flex-col items-center gap-2">
        <PlatinumWordmark className="text-lg sm:text-xl tracking-[0.28em]" />
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#9B9994]">
          Less noise. More presence.
        </span>
      </div>
      <button
        type="button"
        onClick={finishIntro}
        className="mt-10 text-[11px] uppercase tracking-[0.18em] text-[#9B9994] hover:text-[#F5F3EE] transition-colors px-3 py-1.5"
      >
        Skip
      </button>
    </div>
  );
}
