import React, { useEffect, useRef, useState } from 'react';
import { useMotionPrefs } from '../../animations/useMotionPrefs.ts';

const TOTAL_FRAMES = 96;
const SHEET_COUNT = 6;
const FRAMES_PER_SHEET = 16;
const COLS = 4;
const CELL_WIDTH = 520;
const CELL_HEIGHT = 544;
const AUTO_ROTATE_FPS = 7.2; // Smooth ~13.3s per full loop
const RESUME_DELAY_MS = 2000;
const SEAM_BLEND_FRAMES = 5;

function wrapPhase(value: number): number {
  const m = value % TOTAL_FRAMES;
  return m < 0 ? m + TOTAL_FRAMES : m;
}

export function InteractiveShirt360() {
  const { reducedMotion } = useMotionPrefs();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  // Loaded media assets kept outside React state for 60/120fps canvas loop
  const posterRef = useRef<HTMLImageElement | null>(null);
  const sheetsRef = useRef<(HTMLImageElement | null)[]>(Array(SHEET_COUNT).fill(null));
  const sheetReadyRef = useRef<boolean[]>(Array(SHEET_COUNT).fill(false));

  // Rotation physics state
  const phaseRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const pointerTypeRef = useRef<string>('mouse');
  const lastClientXRef = useRef(0);
  const startClientXRef = useRef(0);
  const startClientYRef = useRef(0);
  const touchAxisLockRef = useRef<'none' | 'horizontal' | 'vertical'>('none');
  const lastMoveTimeRef = useRef(0);
  const resumeAutoAtRef = useRef(0);
  const lastRenderedKeyRef = useRef('');

  // Preload poster + progressive 6 WebP sprite sheets
  useEffect(() => {
    let active = true;

    const poster = new Image();
    poster.decoding = 'async';
    poster.src = '/frames/poster.webp';
    poster.onload = () => {
      if (!active) return;
      posterRef.current = poster;
      lastRenderedKeyRef.current = '';
    };

    for (let s = 0; s < SHEET_COUNT; s++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = `/frames/sheet_${s}.webp`;
      const markReady = () => {
        if (!active) return;
        sheetsRef.current[s] = img;
        sheetReadyRef.current[s] = true;
        lastRenderedKeyRef.current = '';
      };
      img.onload = () => {
        if (typeof img.decode === 'function') {
          img.decode().then(markReady).catch(markReady);
        } else {
          markReady();
        }
      };
    }

    return () => {
      active = false;
    };
  }, []);

  // Sync canvas dimensions cleanly with container size and DPR
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        lastRenderedKeyRef.current = '';
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Main requestAnimationFrame rotation & canvas draw loop
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const drawSingleFrame = (
      ctx: CanvasRenderingContext2D,
      frameIdx: number,
      dx: number,
      dy: number,
      dw: number,
      dh: number,
      alpha: number
    ): boolean => {
      const idx = ((Math.floor(frameIdx) % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
      const sheetIdx = Math.floor(idx / FRAMES_PER_SHEET);
      const sheet = sheetsRef.current[sheetIdx];

      if (sheet && sheetReadyRef.current[sheetIdx]) {
        const localIdx = idx % FRAMES_PER_SHEET;
        const col = localIdx % COLS;
        const row = Math.floor(localIdx / COLS);
        ctx.globalAlpha = alpha;
        ctx.drawImage(
          sheet,
          col * CELL_WIDTH,
          row * CELL_HEIGHT,
          CELL_WIDTH,
          CELL_HEIGHT,
          dx,
          dy,
          dw,
          dh
        );
        return true;
      }

      if (posterRef.current) {
        ctx.globalAlpha = alpha;
        ctx.drawImage(posterRef.current, dx, dy, dw, dh);
        return true;
      }

      return false;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const allLoaded = sheetReadyRef.current.every(Boolean);

      if (!isDraggingRef.current) {
        // Apply rotational inertia velocity
        if (Math.abs(velocityRef.current) > 0.02) {
          phaseRef.current = wrapPhase(phaseRef.current + velocityRef.current * dt);
          velocityRef.current *= Math.exp(-5.5 * dt);
        } else {
          velocityRef.current = 0;
        }

        // Smooth continuous Y-axis auto-rotation (disabled under reduced-motion)
        if (!reducedMotion && allLoaded && now >= resumeAutoAtRef.current) {
          const blendIn = Math.min(1, (now - resumeAutoAtRef.current) / 600);
          phaseRef.current = wrapPhase(phaseRef.current + AUTO_ROTATE_FPS * blendIn * dt);
        }
      }

      // Quantize render key at 0.25-frame precision to avoid unnecessary redraws when stationary
      const quantized = Math.round(phaseRef.current * 4) / 4;
      const canvas = canvasRef.current;
      if (canvas) {
        const key = `${quantized}:${canvas.width}x${canvas.height}:${allLoaded ? '1' : '0'}`;
        if (key !== lastRenderedKeyRef.current) {
          const ctx = canvas.getContext('2d', { alpha: false });
          if (ctx) {
            const cw = canvas.width;
            const ch = canvas.height;
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, cw, ch);

            // Fit garment cleanly with object-contain proportions (520:544)
            const aspect = CELL_WIDTH / CELL_HEIGHT;
            let dw = cw;
            let dh = cw / aspect;
            if (dh > ch) {
              dh = ch;
              dw = ch * aspect;
            }
            const dx = (cw - dw) * 0.5;
            const dy = (ch - dh) * 0.5;

            const phase = allLoaded ? phaseRef.current : 0;
            const f0 = Math.floor(phase) % TOTAL_FRAMES;
            const f1 = (f0 + 1) % TOTAL_FRAMES;
            const frac = phase - Math.floor(phase);

            const seamStart = TOTAL_FRAMES - SEAM_BLEND_FRAMES;
            if (phase >= seamStart && allLoaded) {
              // Cross-dissolve final wrap gap cleanly into frame 0
              const seamT = (phase - seamStart) / SEAM_BLEND_FRAMES;
              drawSingleFrame(ctx, f0, dx, dy, dw, dh, 1);
              drawSingleFrame(ctx, 0, dx, dy, dw, dh, seamT);
            } else {
              drawSingleFrame(ctx, f0, dx, dy, dw, dh, 1);
              if (frac > 0.05 && f1 !== 0) {
                drawSingleFrame(ctx, f1, dx, dy, dw, dh, frac);
              }
            }

            ctx.globalAlpha = 1;
            lastRenderedKeyRef.current = key;
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const pixelsToFrames = (deltaPx: number): number => {
    const width = containerRef.current?.clientWidth || 520;
    const pixelsPerTurn = Math.max(280, Math.min(560, width * 0.85));
    return (deltaPx / pixelsPerTurn) * TOTAL_FRAMES;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    pointerTypeRef.current = e.pointerType;
    pointerIdRef.current = e.pointerId;
    startClientXRef.current = e.clientX;
    startClientYRef.current = e.clientY;
    lastClientXRef.current = e.clientX;
    lastMoveTimeRef.current = performance.now();

    if (e.pointerType === 'mouse') {
      isDraggingRef.current = true;
      setIsDragging(true);
      velocityRef.current = 0;
      touchAxisLockRef.current = 'horizontal';
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore if capture is unsupported
      }
    } else {
      // Touch: wait for axis intent so vertical scrolling stays untouched
      touchAxisLockRef.current = 'none';
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const now = performance.now();
    const dt = Math.max(0.004, (now - lastMoveTimeRef.current) / 1000);
    const dx = e.clientX - lastClientXRef.current;

    if (e.pointerType !== 'mouse') {
      if (pointerIdRef.current !== e.pointerId) return;

      if (touchAxisLockRef.current === 'none') {
        const totalDx = Math.abs(e.clientX - startClientXRef.current);
        const totalDy = Math.abs(e.clientY - startClientYRef.current);
        if (totalDx < 6 && totalDy < 6) return;

        if (totalDy > totalDx * 1.15) {
          touchAxisLockRef.current = 'vertical';
          pointerIdRef.current = null;
          return;
        }

        touchAxisLockRef.current = 'horizontal';
        isDraggingRef.current = true;
        setIsDragging(true);
        velocityRef.current = 0;
      }

      if (touchAxisLockRef.current !== 'horizontal') return;

      const deltaFrames = -pixelsToFrames(dx);
      phaseRef.current = wrapPhase(phaseRef.current + deltaFrames);
      const instantVel = deltaFrames / dt;
      velocityRef.current = velocityRef.current * 0.55 + Math.max(-180, Math.min(180, instantVel)) * 0.45;
      lastClientXRef.current = e.clientX;
      lastMoveTimeRef.current = now;
      return;
    }

    // Desktop mouse: drag rotation OR subtle cursor hover influence
    if (isDraggingRef.current && pointerIdRef.current === e.pointerId) {
      const deltaFrames = -pixelsToFrames(dx);
      phaseRef.current = wrapPhase(phaseRef.current + deltaFrames);
      const instantVel = deltaFrames / dt;
      velocityRef.current = velocityRef.current * 0.6 + Math.max(-220, Math.min(220, instantVel)) * 0.4;
      lastClientXRef.current = e.clientX;
      lastMoveTimeRef.current = now;
    } else if (!isDraggingRef.current) {
      // Subtle hover inertia when sweeping cursor across garment area
      if (Math.abs(dx) > 0 && Math.abs(dx) < 120) {
        const hoverFrames = -pixelsToFrames(dx) * 0.42;
        const targetVel = hoverFrames / dt;
        velocityRef.current = velocityRef.current * 0.78 + Math.max(-65, Math.min(65, targetVel)) * 0.22;
      }
      lastClientXRef.current = e.clientX;
      lastMoveTimeRef.current = now;
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current === e.pointerId) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore release errors
      }
      if (isDraggingRef.current) {
        resumeAutoAtRef.current = performance.now() + RESUME_DELAY_MS;
      }
      isDraggingRef.current = false;
      setIsDragging(false);
      pointerIdRef.current = null;
      touchAxisLockRef.current = 'none';
    }
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    lastClientXRef.current = e.clientX;
    lastMoveTimeRef.current = performance.now();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      phaseRef.current = wrapPhase(phaseRef.current - 3);
      resumeAutoAtRef.current = performance.now() + RESUME_DELAY_MS;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      phaseRef.current = wrapPhase(phaseRef.current + 3);
      resumeAutoAtRef.current = performance.now() + RESUME_DELAY_MS;
    }
  };

  return (
    <div
      ref={containerRef}
      role="img"
      tabIndex={0}
      aria-label="Interactive 360-degree view of the PLATINUM X Brand Bible Tee. Drag left or right to rotate."
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
      className={`relative w-full h-full select-none touch-pan-y focus-visible:outline-1 focus-visible:outline-white/40 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
      {/* Pure black radial edge fade to hide canvas rectangle cleanly on #000000 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_64%,#000000_98%)]"
      />
    </div>
  );
}
