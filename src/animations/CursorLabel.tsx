import React, { useEffect, useRef, useState } from 'react';
import { ensureGsapRegistered, gsap } from './gsapSetup.ts';
import { useMotionPrefs } from './useMotionPrefs.ts';

/**
 * Monochrome contextual cursor label that appears only over elements
 * carrying [data-cursor-label] on fine-pointer desktop devices.
 */
export function CursorLabel() {
  const { reducedMotion, isFinePointer, isDesktop } = useMotionPrefs();
  const badgeRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>('');

  useEffect(() => {
    if (reducedMotion || !isFinePointer || !isDesktop) return;
    const badge = badgeRef.current;
    if (!badge) return;

    ensureGsapRegistered();

    const xTo = gsap.quickTo(badge, 'x', { duration: 0.25, ease: 'power3.out' });
    const yTo = gsap.quickTo(badge, 'y', { duration: 0.25, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX + 14);
      yTo(e.clientY + 14);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor-label]');
      const nextLabel = target?.getAttribute('data-cursor-label') || '';
      setLabel(nextLabel);
      gsap.to(badge, {
        opacity: nextLabel ? 1 : 0,
        scale: nextLabel ? 1 : 0.9,
        duration: 0.18,
        overwrite: 'auto',
      });
    };

    const onLeave = () => {
      setLabel('');
      gsap.to(badge, { opacity: 0, duration: 0.15 });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [reducedMotion, isFinePointer, isDesktop]);

  if (reducedMotion || !isFinePointer || !isDesktop) return null;

  return (
    <div
      ref={badgeRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 opacity-0 bg-[#101010] text-[#F5F3EE] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] border border-[#F5F3EE]/20 shadow-sm whitespace-nowrap"
    >
      {label}
    </div>
  );
}
