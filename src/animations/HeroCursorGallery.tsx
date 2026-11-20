import React, { useEffect, useRef, useState } from 'react';
import { ensureGsapRegistered, gsap } from './gsapSetup.ts';
import { useMotionPrefs } from './useMotionPrefs.ts';

const HERO_TRAIL_IMAGES = [
  '/assets/platinum/lookbook-01-poster.webp',
  '/assets/platinum/details-closeup.webp',
  '/assets/platinum/lookbook-02.webp',
  '/assets/platinum/journal-hero.webp',
];

interface HeroCursorGalleryProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Restrained Kolibrie-adapted floating editorial image that subtly tracks
 * the desktop cursor inside the hero without obstructing primary text or CTA.
 */
export function HeroCursorGallery({ containerRef }: HeroCursorGalleryProps) {
  const { reducedMotion, isFinePointer, isDesktop } = useMotionPrefs();
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || !isFinePointer || !isDesktop) return;
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;

    ensureGsapRegistered();

    const xTo = gsap.quickTo(card, 'x', { duration: 0.65, ease: 'power3.out' });
    const yTo = gsap.quickTo(card, 'y', { duration: 0.65, ease: 'power3.out' });
    const rotTo = gsap.quickTo(card, 'rotation', { duration: 0.55, ease: 'power3.out' });

    let lastX = 0;
    let lastY = 0;
    let accumDist = 0;
    let isInside = false;

    const onEnter = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      isInside = true;
      gsap.set(card, { x: lastX - 80, y: lastY - 104 });
      gsap.to(card, { opacity: 0.22, scale: 1, duration: 0.35, ease: 'power2.out' });
    };

    const onMove = (e: MouseEvent) => {
      if (!isInside) return;
      const target = e.target as HTMLElement | null;
      const overInteractive = Boolean(target?.closest('a, button, input'));

      const rect = container.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      const dx = relX - lastX;
      const dy = relY - lastY;
      accumDist += Math.hypot(dx, dy);

      if (accumDist > 210) {
        accumDist = 0;
        setActiveIndex((prev) => (prev + 1) % HERO_TRAIL_IMAGES.length);
      }

      lastX = relX;
      lastY = relY;

      xTo(relX - 80);
      yTo(relY - 104);
      rotTo(Math.max(-5, Math.min(5, dx * 0.14)));

      gsap.to(card, {
        opacity: overInteractive ? 0 : 0.24,
        scale: overInteractive ? 0.94 : 1,
        duration: 0.25,
        overwrite: 'auto',
      });
    };

    const onLeave = () => {
      isInside = false;
      gsap.to(card, { opacity: 0, scale: 0.94, duration: 0.3, ease: 'power2.out' });
    };

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [containerRef, reducedMotion, isFinePointer, isDesktop]);

  if (reducedMotion || !isFinePointer || !isDesktop) {
    return null;
  }

  return (
    <div
      ref={cardRef}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 z-0 w-40 h-52 opacity-0 overflow-hidden border border-[#101010]/10 shadow-sm"
    >
      <img
        src={HERO_TRAIL_IMAGES[activeIndex]}
        alt=""
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover grayscale"
      />
    </div>
  );
}
