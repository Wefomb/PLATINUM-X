import React from 'react';

interface FoxEmblemProps {
  className?: string;
  strokeWidth?: number;
  variant?: 'outline' | 'solid';
}

/**
 * Minimal PLATINUM X geometric fox emblem (distinct from the artistic ink fox artwork).
 * Used in navigation, hero badge, philosophy band, and loading intro stroke reveal.
 */
export function FoxEmblem({
  className = 'w-7 h-7',
  strokeWidth = 1.6,
  variant = 'outline',
}: FoxEmblemProps) {
  if (variant === 'solid') {
    return (
      <svg
        viewBox="0 0 64 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M9 5L24.5 18.5L32 14.5L39.5 18.5L55 5L51 28L58 33L47 41L32 52L17 41L6 33L13 28L9 5Z"
          fill="currentColor"
        />
        <path d="M21 25L27 29L22 33L21 25Z" fill="#101010" />
        <path d="M43 25L37 29L42 33L43 25Z" fill="#101010" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 64 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        data-fox-path
        d="M11 6L24 18.5L32 15L40 18.5L53 6L49.5 27L57 32.5L46 40.5L32 51L18 40.5L7 32.5L14.5 27L11 6Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="miter"
      />
      <path
        data-fox-path
        d="M11 6L19.5 22.5L26 28.5L20 33.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="miter"
      />
      <path
        data-fox-path
        d="M53 6L44.5 22.5L38 28.5L44 33.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="miter"
      />
      <path
        data-fox-path
        d="M27.5 41.5L32 45L36.5 41.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function PlatinumWordmark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-serif uppercase tracking-[0.22em] font-normal select-none whitespace-nowrap ${className}`}
    >
      PLATINUM X
    </span>
  );
}
