"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function RibbonDivider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);

  // The certifications/experience text repeated to ensure it fills the long path
  const ribbonText = "• Google Data Analytics • Deloitte Consulting • JPMorgan Chase • KPMG • AI Automation Workflow • SQL & Tableau Certified • Strategic Operations • Business Intelligence ".repeat(3);

  useEffect(() => {
    if (!textPathRef.current) return;

    // Animate the text flowing along the ribbon
    // By animating startOffset, the text physically moves along the curved SVG path
    gsap.fromTo(textPathRef.current, 
      { attr: { startOffset: "100%" } },
      { 
        attr: { startOffset: "-50%" }, 
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1, // Smooth scrolling effect
        }
      }
    );
  }, []);

  return (
    <div ref={containerRef} className="w-full h-48 md:h-72 flex justify-center items-center my-16 overflow-hidden">
      <svg 
        viewBox="0 0 1000 300" 
        className="w-full max-w-6xl h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]"
      >
        <defs>
          {/* 
            This path creates a massive, swirling "Rollercoaster Loop".
            M -100,150 -> start offscreen left
            C 200,150 300,50 500,50 -> curve up
            C 700,50 800,250 500,250 -> loop down and back
            C 200,250 300,150 800,150 -> cross over itself and go right
            L 1100,150 -> end offscreen right
          */}
          <path 
            id="swirlPath" 
            d="M -100,150 C 200,150 300,50 500,50 C 700,50 800,250 500,250 C 200,250 300,150 800,150 C 900,150 1000,150 1100,150" 
            fill="none" 
          />
        </defs>

        {/* Visual representation of the ribbon (the glowing track) */}
        <path 
          d="M -100,150 C 200,150 300,50 500,50 C 700,50 800,250 500,250 C 200,250 300,150 800,150 C 900,150 1000,150 1100,150" 
          fill="none" 
          stroke="var(--accent-primary)" 
          strokeWidth="30" 
          strokeLinecap="round"
          opacity="0.1" 
        />
        
        {/* Inner glow line */}
        <path 
          d="M -100,150 C 200,150 300,50 500,50 C 700,50 800,250 500,250 C 200,250 300,150 800,150 C 900,150 1000,150 1100,150" 
          fill="none" 
          stroke="var(--brand-white)" 
          strokeWidth="1" 
          opacity="0.3" 
        />

        {/* The Text mapping onto the Ribbon Path */}
        <text 
          className="font-mono text-sm md:text-base font-bold uppercase tracking-widest"
          fill="var(--brand-white)"
        >
          <textPath 
            ref={textPathRef}
            href="#swirlPath" 
            startOffset="100%"
          >
            {ribbonText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
