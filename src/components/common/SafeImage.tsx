import React, { useState } from 'react';
import { FoxEmblem } from '../brand/BrandMarks.tsx';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
  darkSurface?: boolean;
}

export function SafeImage({
  src,
  alt,
  fallbackLabel,
  darkSurface = false,
  className = '',
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-3 p-6 text-center ${
          darkSurface ? 'bg-[#171716] text-[#F5F3EE]' : 'bg-[#E5E3DC] text-[#101010]'
        } ${className}`}
      >
        <FoxEmblem className="w-8 h-8 opacity-40" />
        <span className="text-[11px] uppercase tracking-[0.18em] opacity-60">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
