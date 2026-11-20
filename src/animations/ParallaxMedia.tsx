import React, { useEffect, useRef } from 'react';
import { ensureGsapRegistered, gsap, ScrollTrigger } from './gsapSetup.ts';
import { useMotionPrefs } from './useMotionPrefs.ts';

interface ParallaxMediaProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export function ParallaxMedia({ children, offset = 28, className = '' }: ParallaxMediaProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion, isDesktop } = useMotionPrefs();

  useEffect(() => {
    if (reducedMotion || !wrapRef.current || !innerRef.current) return;

    ensureGsapRegistered();
    const travel = isDesktop ? offset : Math.round(offset * 0.35);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { y: -travel },
        {
          y: travel,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, wrapRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion, isDesktop, offset]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="w-full h-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
