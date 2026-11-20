import { useEffect } from 'react';
import Lenis from 'lenis';
import { ensureGsapRegistered, gsap, ScrollTrigger } from './gsapSetup.ts';
import { useMotionPrefs } from './useMotionPrefs.ts';

export function useLenisScroll(): void {
  const { reducedMotion, isDesktop } = useMotionPrefs();

  useEffect(() => {
    if (reducedMotion || !isDesktop) {
      return;
    }

    ensureGsapRegistered();

    const lenis = new Lenis({
      lerp: 0.165,
      wheelMultiplier: 1.25,
      smoothWheel: true,
    });

    const onLenisScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on('scroll', onLenisScroll);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.off('scroll', onLenisScroll);
      lenis.destroy();
    };
  }, [reducedMotion, isDesktop]);
}
