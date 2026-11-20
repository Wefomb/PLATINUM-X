import React, { useEffect, useRef } from 'react';
import { ensureGsapRegistered, gsap, ScrollTrigger } from './gsapSetup.ts';
import { useMotionPrefs } from './useMotionPrefs.ts';

interface EditorialRevealProps {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3' | 'div';
  className?: string;
  delay?: number;
  immediate?: boolean;
}

export function EditorialReveal({
  lines,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  immediate = false,
}: EditorialRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPrefs();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const spans = containerRef.current?.querySelectorAll<HTMLElement>('[data-reveal-line]');
      if (!spans || spans.length === 0) return;

      const animVars: gsap.TweenVars = {
        yPercent: 0,
        opacity: 1,
        duration: 0.95,
        stagger: 0.09,
        delay,
        ease: 'expo.out',
      };

      if (!immediate) {
        animVars.scrollTrigger = {
          trigger: containerRef.current,
          start: 'top 88%',
          once: true,
        };
      }

      gsap.fromTo(
        spans,
        { yPercent: 112, opacity: 0.01 },
        animVars
      );
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion, delay, immediate]);

  return (
    <Tag ref={containerRef as any} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="px-reveal-mask">
          <span data-reveal-line className="inline-block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
