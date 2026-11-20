import { useEffect, useState } from 'react';

export interface MotionPreferences {
  reducedMotion: boolean;
  isFinePointer: boolean;
  isDesktop: boolean;
}

export function useMotionPrefs(): MotionPreferences {
  const [prefs, setPrefs] = useState<MotionPreferences>(() => {
    if (typeof window === 'undefined') {
      return { reducedMotion: false, isFinePointer: true, isDesktop: true };
    }
    return {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      isFinePointer: window.matchMedia('(pointer: fine)').matches,
      isDesktop: window.innerWidth >= 992,
    };
  });

  useEffect(() => {
    const rmQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fpQuery = window.matchMedia('(pointer: fine)');

    const update = () => {
      setPrefs({
        reducedMotion: rmQuery.matches,
        isFinePointer: fpQuery.matches,
        isDesktop: window.innerWidth >= 992,
      });
    };

    rmQuery.addEventListener('change', update);
    fpQuery.addEventListener('change', update);
    window.addEventListener('resize', update);

    return () => {
      rmQuery.removeEventListener('change', update);
      fpQuery.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return prefs;
}
