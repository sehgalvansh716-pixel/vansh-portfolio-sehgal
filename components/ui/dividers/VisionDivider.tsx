"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function VisionDivider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const outerGearsRef = useRef<SVGGElement>(null);
  const innerIrisRef = useRef<SVGGElement>(null);
  const pupilRef = useRef<SVGGElement>(null);
  const circuitsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!outerGearsRef.current || !innerIrisRef.current || !pupilRef.current || !circuitsRef.current) return;

    gsap.set(outerGearsRef.current.children, { scale: 0, opacity: 0, transformOrigin: "center" });
    gsap.set(innerIrisRef.current.children, { scale: 0, opacity: 0, transformOrigin: "center" });
    gsap.set(pupilRef.current, { scale: 0, opacity: 0, transformOrigin: "center" });
    
    Array.from(circuitsRef.current.children).forEach(path => {
      const length = (path as SVGPathElement).getTotalLength?.() || 500;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        end: "bottom 30%",
        scrub: 1.5,
      },
    });

    // Assemble the eye mechanically
    tl.to(outerGearsRef.current.children, { scale: 1, opacity: 1, duration: 1, stagger: 0.1, ease: "back.out(1.5)" })
      .to(innerIrisRef.current.children, { scale: 1, opacity: 1, duration: 0.8, stagger: 0.1, ease: "back.out(2)" }, "-=0.6")
      .to(pupilRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.4")
      .to(circuitsRef.current.children, { strokeDashoffset: 0, opacity: 1, duration: 1.5, stagger: 0.05, ease: "power1.inOut" }, "-=0.2");

    // Continuous rotation for gears
    gsap.to(outerGearsRef.current, { rotation: 360, duration: 60, repeat: -1, ease: "none", transformOrigin: "center" });
    gsap.to(innerIrisRef.current, { rotation: -360, duration: 40, repeat: -1, ease: "none", transformOrigin: "center" });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-64 md:h-80 flex justify-center items-center my-12 overflow-hidden">
      <svg 
        viewBox="-400 -200 800 400" 
        className="w-full max-w-4xl h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        fill="none" 
      >
        <defs>
          <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Data Circuits (Background) */}
        <g ref={circuitsRef} stroke="var(--brand-white)" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" strokeLinejoin="round">
          {/* Left circuits */}
          <path d="M -80,0 L -120,-40 L -200,-40 L -220,-20 L -350,-20" />
          <path d="M -90,20 L -140,70 L -250,70 L -280,100 L -380,100" />
          <path d="M -60,60 L -80,120 L -150,120 L -180,150" />
          <path d="M -60,-60 L -100,-120 L -180,-120 L -210,-150" />
          
          {/* Right circuits */}
          <path d="M 80,0 L 120,40 L 200,40 L 220,20 L 350,20" />
          <path d="M 90,-20 L 140,-70 L 250,-70 L 280,-100 L 380,-100" />
          <path d="M 60,-60 L 80,-120 L 150,-120 L 180,-150" />
          <path d="M 60,60 L 100,120 L 180,120 L 210,150" />
          
          {/* Circuit nodes (dots) */}
          <circle cx="-350" cy="-20" r="3" fill="var(--accent-primary)" />
          <circle cx="-380" cy="100" r="3" fill="var(--accent-primary)" />
          <circle cx="-180" cy="150" r="3" fill="var(--brand-white)" />
          <circle cx="-210" cy="-150" r="3" fill="var(--brand-white)" />
          
          <circle cx="350" cy="20" r="3" fill="var(--accent-primary)" />
          <circle cx="380" cy="-100" r="3" fill="var(--accent-primary)" />
          <circle cx="180" cy="-150" r="3" fill="var(--brand-white)" />
          <circle cx="210" cy="150" r="3" fill="var(--brand-white)" />
        </g>

        {/* Outer Mechanical Gears & Eye Shape */}
        <g ref={outerGearsRef} stroke="var(--brand-white)" strokeWidth="1.5">
          {/* Main Owl / Eye frame */}
          <path d="M -150,0 Q 0,-150 150,0 Q 0,150 -150,0 Z" strokeWidth="2" opacity="0.4" />
          <path d="M -120,0 Q 0,-110 120,0 Q 0,110 -120,0 Z" strokeWidth="1" opacity="0.6" strokeDasharray="5 5" />
          
          {/* Gear rings */}
          <circle cx="0" cy="0" r="85" strokeWidth="2" strokeDasharray="10 15" opacity="0.5" />
          <circle cx="0" cy="0" r="75" strokeWidth="1" opacity="0.3" />
          <circle cx="0" cy="0" r="95" strokeWidth="1" strokeDasharray="2 8" opacity="0.8" />
        </g>

        {/* Inner Iris Layers */}
        <g ref={innerIrisRef} stroke="url(#cyberGrad)" strokeWidth="2">
          {/* Cybernetic aperture blades */}
          <path d="M 0,-60 L 20,-20 L 60,0 L 20,20 L 0,60 L -20,20 L -60,0 L -20,-20 Z" opacity="0.6" fill="url(#cyberGrad)" fillOpacity="0.1" />
          <circle cx="0" cy="0" r="50" strokeWidth="3" strokeDasharray="30 10" filter="url(#neonGlow)" />
          <circle cx="0" cy="0" r="40" strokeWidth="1" strokeDasharray="2 4" opacity="0.8" />
          <circle cx="0" cy="0" r="30" strokeWidth="4" opacity="0.4" />
        </g>

        {/* Glowing Pupil */}
        <g ref={pupilRef}>
          <circle cx="0" cy="0" r="15" fill="#020617" stroke="var(--accent-primary)" strokeWidth="3" filter="url(#neonGlow)" />
          <circle cx="0" cy="0" r="6" fill="var(--brand-white)" filter="url(#neonGlow)" className="animate-pulse" />
          {/* Crosshair inside pupil */}
          <line x1="-20" y1="0" x2="20" y2="0" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="-20" x2="0" y2="20" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
