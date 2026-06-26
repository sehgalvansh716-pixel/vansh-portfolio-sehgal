"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ring = ringRef.current!;
    const dot = dotRef.current!;
    const label = labelRef.current!;

    // GSAP quickTo for smooth inertia lag on ring
    const xTo = gsap.quickTo(ring, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.6, ease: "power3.out" });

    let mx = 0, my = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Dot snaps instantly
      gsap.set(dot, { x: mx - 3, y: my - 3 });

      // Ring follows with lag
      xTo(mx - 20);
      yTo(my - 20);
    };

    const onEnterLink = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const isCard = target.closest("[data-cursor='card']");
      const isFooterWave = target.closest("[data-cursor='wave']");

      gsap.to(ring, { scale: isCard ? 2.5 : isFooterWave ? 0.3 : 1.5, duration: 0.3, ease: "power2.out" });
      gsap.to(ring, { backgroundColor: "rgba(4, 47, 46, 0.2)", borderColor: "rgba(13, 148, 136, 0.5)", duration: 0.3 });
      if (!isCard && !isFooterWave) {
        gsap.to(label, { opacity: 1, duration: 0.2 });
      }
    };

    const onLeaveLink = () => {
      gsap.to(ring, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
      gsap.to(ring, { backgroundColor: "rgba(4, 47, 46, 0.1)", borderColor: "rgba(13, 148, 136, 0.3)", duration: 0.3 });
      gsap.to(label, { opacity: 0, duration: 0.2 });
    };

    document.addEventListener("mousemove", onMove);

    // Attach to all interactive elements
    const attachCursor = () => {
      const interactives = document.querySelectorAll("a, button, [data-cursor]");
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
    };
    attachCursor();

    // Re-attach after DOM changes (for dynamic content)
    const observer = new MutationObserver(attachCursor);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "rgba(4, 47, 46, 0.1)",
          border: "1px solid rgba(13, 148, 136, 0.3)",
          borderTopColor: "rgba(45, 212, 191, 0.4)",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(45, 212, 191, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(12px) saturate(150%)",
          WebkitBackdropFilter: "blur(12px) saturate(150%)",
          pointerEvents: "none",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform",
        }}
      >
        <span
          ref={labelRef}
          style={{
            opacity: 0,
            fontSize: 9,
            fontFamily: "var(--font-jetbrains)",
            color: "#10B981",
            letterSpacing: "0.08em",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          VIEW
        </span>
      </div>

      {/* Inner dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "#10B981",
          boxShadow: "0 0 8px rgba(16,185,129,0.6)",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
        }}
      />
    </>
  );
}
