"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";

// ─── Config ──────────────────────────────────────────────────────────────────
const TOTAL_FRAMES  = 240;
const PRELOAD_COUNT = 30;   // more frames preloaded before start
const SCROLL_VH     = 560;

// Set to true temporarily to log frame indices in the browser console
const DEBUG = false;

const FRAME_PATH = (n: number) =>
  `/frames/frame_${String(n).padStart(4, "0")}.webp`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth < 768;

function getFrameIndices(mobile: boolean): number[] {
  const step = mobile ? 2 : 1;
  const out: number[] = [];
  for (let i = 1; i <= TOTAL_FRAMES; i += step) out.push(i);
  return out;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CpuScrollAnimation() {
  const wrapperRef        = useRef<HTMLDivElement>(null);
  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const framesRef         = useRef<(HTMLImageElement | null)[]>([]);
  const frameIndicesRef   = useRef<number[]>([]);
  const frameCountRef     = useRef(0);         // FIX #5: avoid stale closure in onUpdate
  const currentFrameRef   = useRef(0);
  const lastDrawnFrameRef = useRef(0);         // FIX #3: fallback to last successfully drawn
  const rafRef            = useRef<number | null>(null);
  const readyRef          = useRef(false);
  const dprRef            = useRef(1);

  // ── FIX #6: draw always fills background first — no clearRect blank flash ──
  // ── FIX #1: setTransform re-applied every call — no zoomed-in rogue frame ──
  // ── FIX #3: fallback to lastDrawnFrame if requested frame isn't loaded yet ─
  const drawFrame = (requestedIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameCount = frameCountRef.current;
    // FIX #1: hard clamp — ensure idx never goes out of array bounds
    const safeIdx = Math.min(frameCount - 1, Math.max(0, requestedIdx));

    // FIX #3: if this frame isn't ready, fall back to last successfully drawn
    let img = framesRef.current[safeIdx];
    let drawIdx = safeIdx;
    if (!img || !img.complete || img.naturalWidth === 0) {
      drawIdx = lastDrawnFrameRef.current;
      img = framesRef.current[drawIdx];
      if (!img || !img.complete || img.naturalWidth === 0) return;
    }

    const dpr = dprRef.current;
    const cw  = canvas.width  / dpr;   // CSS pixel width from buffer
    const ch  = canvas.height / dpr;   // CSS pixel height from buffer
    if (cw === 0 || ch === 0) return;

    // FIX #1: re-apply transform every draw — immune to context state loss
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const iw    = img.naturalWidth;
    const ih    = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const dw    = iw * scale;
    const dh    = ih * scale;
    const dx    = (cw - dw) / 2;
    const dy    = (ch - dh) / 2;

    // FIX #6: fillRect with bg colour — never a transparent/white gap
    ctx.fillStyle = "#080A09";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);

    lastDrawnFrameRef.current = drawIdx;
  };

  // ── FIX #7: single RAF path only — no competing draw sources ─────────────
  // currentFrameRef updated synchronously so the guard in onUpdate is always
  // fresh even when GSAP fires many updates before the RAF callback fires.
  const scheduleFrame = (idx: number) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    currentFrameRef.current = idx;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      drawFrame(idx);
    });
  };

  // ── Image loader ──────────────────────────────────────────────────────────
  const loadFrame = (arrayIdx: number): Promise<void> =>
    new Promise((resolve) => {
      if (framesRef.current[arrayIdx]) { resolve(); return; }
      const img = new Image();
      img.onload = () => {
        framesRef.current[arrayIdx] = img;
        // FIX #3: if this was the pending current frame, redraw immediately
        if (readyRef.current && arrayIdx === currentFrameRef.current) {
          scheduleFrame(arrayIdx);
        }
        resolve();
      };
      img.onerror = () => resolve();
      img.src = FRAME_PATH(frameIndicesRef.current[arrayIdx]);
    });

  const loadRemaining = async (startIdx: number, total: number) => {
    const BATCH = 10;
    for (let i = startIdx; i < total; i += BATCH) {
      const batch: Promise<void>[] = [];
      for (let j = i; j < Math.min(i + BATCH, total); j++) batch.push(loadFrame(j));
      await Promise.all(batch);
      await new Promise((r) => setTimeout(r, 16));
    }
  };

  useEffect(() => {
    const canvas  = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const mobile      = isMobile();
    const indices     = getFrameIndices(mobile);
    const frameCount  = indices.length;
    frameIndicesRef.current = indices;
    frameCountRef.current   = frameCount;
    framesRef.current       = new Array(frameCount).fill(null);

    // ── Resize ─────────────────────────────────────────────────────────────
    const resizeCanvas = () => {
      const dpr = mobile
        ? Math.min(window.devicePixelRatio * 0.75, 1.5)
        : Math.min(window.devicePixelRatio, 2);
      dprRef.current  = dpr;
      canvas.width    = window.innerWidth  * dpr;
      canvas.height   = window.innerHeight * dpr;
      // drawFrame re-applies setTransform internally — no separate call needed
      drawFrame(currentFrameRef.current);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ── Preload + reveal ────────────────────────────────────────────────────
    const initialLoad = async () => {
      const preloadCount = Math.min(PRELOAD_COUNT, frameCount);
      await Promise.all(Array.from({ length: preloadCount }, (_, i) => loadFrame(i)));
      drawFrame(currentFrameRef.current); // draw frame 0 (or wherever scroll is)
      readyRef.current = true;
      loadRemaining(preloadCount, frameCount);
    };
    initialLoad();

    // ── GSAP ScrollTrigger ──────────────────────────────────────────────────
    // FIX #4/#5: scrub:true = exact 1:1 scroll mapping, no GSAP smoothing tween
    // that causes oscillation at the pin/unpin boundary.
    const st = ScrollTrigger.create({
      trigger:    wrapper,
      start:      "top top",
      end:        `+=${SCROLL_VH}vh`,
      pin:        true,
      pinSpacing: true,
      scrub:      true,
      // When re-entering from below (scrolling back up after passing the end),
      // GSAP re-activates the pin (sets position:fixed on the wrapper). During
      // this DOM mutation there is one browser paint tick where the canvas has
      // not been repainted. The onUpdate guard (clampedIdx !== currentFrameRef)
      // correctly skips the draw because the frame index hasn't changed — but
      // the canvas still needs a synchronous repaint to avoid the flash.
      onEnterBack: () => {
        drawFrame(currentFrameRef.current);
      },
      onUpdate: (self) => {
        if (!readyRef.current) return;

        // Single continuous frame index — same formula for both scroll directions.
        // Math.round ensures the same scroll position always maps to the same
        // frame index whether scrolling forward or backward (no asymmetric snap).
        // Formula: frameNumber (1-based) = clamp(round(progress × (N-1)) + 1, 1, N)
        //          arrayIndex  (0-based) = frameNumber - 1
        const progress    = Math.min(1, Math.max(0, self.progress));
        const frameNumber = Math.min(frameCount, Math.max(1,
          Math.round(progress * (frameCount - 1)) + 1
        ));
        const clampedIdx  = frameNumber - 1; // 0-based array index

        if (DEBUG) {
          console.log(
            `[CPU] prog=${progress.toFixed(5)}  frameNum=${frameNumber}  ` +
            `idx=${clampedIdx}  current=${currentFrameRef.current}  lastDrawn=${lastDrawnFrameRef.current}`
          );
        }

        // Guard: only schedule a draw when the frame actually changes
        if (clampedIdx !== currentFrameRef.current) {
          scheduleFrame(clampedIdx);
        }
      },
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      st.kill();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      framesRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapperRef}
      id="cpu-animation"
      aria-label="CPU disassembly animation"
      style={{ width: "100%", height: "100vh", overflow: "hidden", position: "relative", background: "#080A09" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          display: "block",
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          // Solid background on the canvas itself — if the canvas buffer is
          // momentarily blank during GSAP pin transitions, the section colour
          // shows instead of the page theme background bleeding through.
          backgroundColor: "#080A09",
        }}
      />
      {/* Top edge fade */}
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to bottom, #080A09, transparent)", pointerEvents: "none", zIndex: 2 }} />
      {/* Bottom edge fade */}
      <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to top, #080A09, transparent)", pointerEvents: "none", zIndex: 2 }} />
    </div>
  );
}
