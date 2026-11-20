import React, { useEffect, useRef } from 'react';
import { useMotionPrefs } from './useMotionPrefs.ts';

interface VariableWeightHeadlineProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2';
}

/**
 * Selectively modulates variable font-weight axis ('wght' 300..580) on Cormorant Garamond
 * when the fine pointer approaches individual words on desktop.
 */
export function VariableWeightHeadline({
  text,
  className = '',
  as: Tag = 'h1',
}: VariableWeightHeadlineProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const { reducedMotion, isFinePointer, isDesktop } = useMotionPrefs();

  useEffect(() => {
    if (reducedMotion || !isFinePointer || !isDesktop) return;
    const el = containerRef.current;
    if (!el) return;

    const words = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-vw-word]'));
    if (words.length === 0) return;

    let rafId = 0;

    const handleMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        for (const word of words) {
          const rect = word.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
          const influence = Math.max(0, 1 - dist / 260);
          const weight = Math.round(350 + influence * 230);
          word.style.fontVariationSettings = `"wght" ${weight}`;
        }
      });
    };

    const handleLeave = () => {
      for (const word of words) {
        word.style.fontVariationSettings = `"wght" 400`;
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [reducedMotion, isFinePointer, isDesktop]);

  const segments = text.split('\n');

  return (
    <Tag ref={containerRef} className={className}>
      {segments.map((line, lineIdx) => (
        <span key={lineIdx} className="block">
          {line.split(' ').map((word, wordIdx, arr) => (
            <React.Fragment key={wordIdx}>
              <span
                data-vw-word
                style={{ fontVariationSettings: '"wght" 400', transition: 'font-variation-settings 220ms ease-out' }}
                className="inline-block"
              >
                {word}
              </span>
              {wordIdx < arr.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}
