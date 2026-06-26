"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function LionDivider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftManeRef = useRef<SVGGElement>(null);
  const rightManeRef = useRef<SVGGElement>(null);
  const faceRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!leftManeRef.current || !rightManeRef.current || !faceRef.current || !eyesRef.current) return;

    const allManePaths = [
      ...Array.from(leftManeRef.current.children),
      ...Array.from(rightManeRef.current.children)
    ];

    gsap.set(allManePaths, { strokeDasharray: 500, strokeDashoffset: 500, opacity: 0 });
    gsap.set(faceRef.current.children, { strokeDasharray: 300, strokeDashoffset: 300, opacity: 0 });
    gsap.set(eyesRef.current.children, { scale: 0, opacity: 0, transformOrigin: "center" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        end: "bottom 30%",
        scrub: 1.5,
      },
    });

    tl.to(faceRef.current.children, { strokeDashoffset: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power2.out" })
      .to(eyesRef.current.children, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, "-=0.5")
      .to(allManePaths, { strokeDashoffset: 0, opacity: 1, duration: 1.5, stagger: 0.05, ease: "power2.out" }, "-=0.8");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-64 md:h-80 flex justify-center items-center my-12 overflow-hidden">
      <svg 
        viewBox="-500 -300 1000 600" 
        className="w-full max-w-4xl h-full drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        fill="none" 
      >
        <defs>
          <linearGradient id="lionGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#065f46" stopOpacity="0.2" />
          </linearGradient>
          <filter id="eyeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- LEFT SIDE MANE --- */}
        <g ref={leftManeRef} stroke="url(#lionGlow)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Inner Mane Layers */}
          <path d="M 0,-150 Q -50,-180 -100,-150 Q -80,-120 -50,-100" opacity="0.8" />
          <path d="M -50,-100 Q -120,-110 -150,-60 Q -100,-50 -70,-30" opacity="0.9" />
          <path d="M -70,-30 Q -160,-20 -180,30 Q -110,40 -80,60" opacity="0.8" />
          <path d="M -80,60 Q -170,90 -160,150 Q -100,120 -60,110" opacity="0.7" />
          <path d="M -60,110 Q -120,170 -80,220 Q -40,180 0,160" opacity="0.8" />
          
          {/* Outer Mane Layers */}
          <path d="M 0,-200 Q -80,-250 -160,-200 Q -120,-140 -80,-120" strokeWidth="1" opacity="0.5" />
          <path d="M -80,-120 Q -180,-150 -230,-70 Q -150,-40 -100,-20" strokeWidth="1" opacity="0.6" />
          <path d="M -100,-20 Q -220,-10 -250,60 Q -160,70 -110,80" strokeWidth="1" opacity="0.5" />
          <path d="M -110,80 Q -220,130 -200,210 Q -130,160 -80,140" strokeWidth="1" opacity="0.6" />
          <path d="M -80,140 Q -160,230 -100,290 Q -40,220 0,200" strokeWidth="1" opacity="0.4" />
          
          {/* Wispy Mane Strands */}
          <path d="M -150,-60 Q -200,-90 -220,-150" strokeWidth="0.5" opacity="0.3" />
          <path d="M -180,30 Q -260,20 -280,-20" strokeWidth="0.5" opacity="0.3" />
          <path d="M -160,150 Q -230,200 -260,250" strokeWidth="0.5" opacity="0.3" />
        </g>

        {/* --- RIGHT SIDE MANE (Mirrored) --- */}
        <g ref={rightManeRef} transform="scale(-1, 1)" stroke="url(#lionGlow)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Inner Mane Layers */}
          <path d="M 0,-150 Q -50,-180 -100,-150 Q -80,-120 -50,-100" opacity="0.8" />
          <path d="M -50,-100 Q -120,-110 -150,-60 Q -100,-50 -70,-30" opacity="0.9" />
          <path d="M -70,-30 Q -160,-20 -180,30 Q -110,40 -80,60" opacity="0.8" />
          <path d="M -80,60 Q -170,90 -160,150 Q -100,120 -60,110" opacity="0.7" />
          <path d="M -60,110 Q -120,170 -80,220 Q -40,180 0,160" opacity="0.8" />
          
          {/* Outer Mane Layers */}
          <path d="M 0,-200 Q -80,-250 -160,-200 Q -120,-140 -80,-120" strokeWidth="1" opacity="0.5" />
          <path d="M -80,-120 Q -180,-150 -230,-70 Q -150,-40 -100,-20" strokeWidth="1" opacity="0.6" />
          <path d="M -100,-20 Q -220,-10 -250,60 Q -160,70 -110,80" strokeWidth="1" opacity="0.5" />
          <path d="M -110,80 Q -220,130 -200,210 Q -130,160 -80,140" strokeWidth="1" opacity="0.6" />
          <path d="M -80,140 Q -160,230 -100,290 Q -40,220 0,200" strokeWidth="1" opacity="0.4" />
          
          {/* Wispy Mane Strands */}
          <path d="M -150,-60 Q -200,-90 -220,-150" strokeWidth="0.5" opacity="0.3" />
          <path d="M -180,30 Q -260,20 -280,-20" strokeWidth="0.5" opacity="0.3" />
          <path d="M -160,150 Q -230,200 -260,250" strokeWidth="0.5" opacity="0.3" />
        </g>

        {/* --- FACE DETAILS --- */}
        <g ref={faceRef} stroke="var(--brand-white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
          {/* Forehead / Nose Bridge */}
          <path d="M -30,-80 L 0,-40 L 30,-80" />
          <path d="M -30,-80 L -15,0 L 0,20 L 15,0 L 30,-80" />
          
          {/* Snout / Nose */}
          <path d="M -20,60 L 0,80 L 20,60 Z" fill="var(--brand-white)" opacity="0.1" />
          <path d="M 0,80 L 0,100" />
          <path d="M -30,110 Q 0,130 30,110" />
          <path d="M -15,120 Q 0,140 15,120" strokeWidth="1" opacity="0.5" />

          {/* Cheeks / Jawline */}
          <path d="M -70,20 Q -60,80 -30,110" />
          <path d="M 70,20 Q 60,80 30,110" />
          <path d="M -60,110 Q 0,170 60,110" strokeWidth="1" opacity="0.4" />
          
          {/* Whiskers Left */}
          <path d="M -30,70 L -120,60" strokeWidth="1" opacity="0.4" />
          <path d="M -35,80 L -130,85" strokeWidth="1" opacity="0.4" />
          <path d="M -30,90 L -110,110" strokeWidth="1" opacity="0.4" />
          
          {/* Whiskers Right */}
          <path d="M 30,70 L 120,60" strokeWidth="1" opacity="0.4" />
          <path d="M 35,80 L 130,85" strokeWidth="1" opacity="0.4" />
          <path d="M 30,90 L 110,110" strokeWidth="1" opacity="0.4" />
        </g>

        {/* --- EYES --- */}
        <g ref={eyesRef}>
          {/* Left Eye */}
          <path d="M -60,-20 Q -40,-30 -20,-10 Q -40,0 -60,-20" fill="#020617" stroke="var(--accent-primary)" strokeWidth="1.5" />
          <circle cx="-35" cy="-15" r="4" fill="var(--brand-white)" filter="url(#eyeGlow)" />
          <circle cx="-35" cy="-15" r="1.5" fill="#020617" />
          
          {/* Right Eye */}
          <path d="M 60,-20 Q 40,-30 20,-10 Q 40,0 60,-20" fill="#020617" stroke="var(--accent-primary)" strokeWidth="1.5" />
          <circle cx="35" cy="-15" r="4" fill="var(--brand-white)" filter="url(#eyeGlow)" />
          <circle cx="35" cy="-15" r="1.5" fill="#020617" />
        </g>
      </svg>
    </div>
  );
}
