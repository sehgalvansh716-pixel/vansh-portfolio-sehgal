"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function AscensionDivider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountainBackRef = useRef<SVGGElement>(null);
  const mountainMidRef = useRef<SVGGElement>(null);
  const mountainFrontRef = useRef<SVGGElement>(null);
  const dataGridRef = useRef<SVGGElement>(null);
  const barChartRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!mountainBackRef.current || !mountainMidRef.current || !mountainFrontRef.current || !dataGridRef.current || !barChartRef.current) return;

    const mountains = [
      ...Array.from(mountainBackRef.current.children),
      ...Array.from(mountainMidRef.current.children),
      ...Array.from(mountainFrontRef.current.children),
    ];

    mountains.forEach(path => {
      const length = (path as SVGPathElement).getTotalLength?.() || 2000;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
    });

    gsap.set(dataGridRef.current.children, { scaleY: 0, opacity: 0, transformOrigin: "bottom center" });
    gsap.set(barChartRef.current.children, { scaleY: 0, opacity: 0, transformOrigin: "bottom center" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
        end: "bottom 30%",
        scrub: 1.5,
      },
    });

    // Draw mountains back to front
    tl.to(mountainBackRef.current.children, { strokeDashoffset: 0, opacity: 0.3, duration: 1, ease: "power1.inOut" })
      .to(mountainMidRef.current.children, { strokeDashoffset: 0, opacity: 0.6, duration: 1, ease: "power1.inOut" }, "-=0.7")
      .to(mountainFrontRef.current.children, { strokeDashoffset: 0, opacity: 1, duration: 1, ease: "power1.inOut" }, "-=0.7")
      // Grow data grid and bar charts
      .to(dataGridRef.current.children, { scaleY: 1, opacity: 0.15, duration: 1, stagger: 0.02, ease: "power2.out" }, "-=0.5")
      .to(barChartRef.current.children, { scaleY: 1, opacity: 0.8, duration: 1, stagger: 0.1, ease: "back.out(1.2)" }, "-=0.5");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-64 md:h-80 flex justify-center items-center my-12 overflow-hidden">
      <svg 
        viewBox="0 0 1000 300" 
        className="w-full max-w-5xl h-full drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        fill="none" 
      >
        <defs>
          <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gridGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
          <filter id="peakGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Data Grid Background */}
        <g ref={dataGridRef} stroke="url(#gridGrad)" strokeWidth="1">
          {Array.from({ length: 40 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 25} y1="0" x2={i * 25} y2="300" />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 25} x2="1000" y2={i * 25} opacity="0.5" />
          ))}
        </g>

        {/* Back Mountains */}
        <g ref={mountainBackRef} stroke="var(--brand-white)" strokeWidth="1" opacity="0.3">
          <path d="M 0,280 L 150,180 L 250,220 L 350,150 L 500,240 L 650,120 L 800,200 L 950,100 L 1000,140" fill="url(#mountainGrad)" fillOpacity="0.1" />
        </g>

        {/* Mid Mountains */}
        <g ref={mountainMidRef} stroke="var(--brand-white)" strokeWidth="1.5" opacity="0.6">
          <path d="M 0,300 L 100,220 L 200,260 L 300,180 L 450,250 L 600,160 L 750,230 L 900,140 L 1000,200" fill="url(#mountainGrad)" fillOpacity="0.2" />
        </g>

        {/* Front Mountains */}
        <g ref={mountainFrontRef} stroke="var(--accent-primary)" strokeWidth="2.5" filter="url(#peakGlow)">
          <path d="M 0,300 L 200,200 L 300,250 L 450,150 L 550,180 L 750,100 L 850,150 L 1000,50" fill="url(#mountainGrad)" fillOpacity="0.4" />
          {/* Mountain inner ridge lines */}
          <path d="M 200,200 L 200,300 M 450,150 L 450,300 M 750,100 L 750,300 M 1000,50 L 1000,300" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />
        </g>

        {/* Glowing Bar Charts matching front mountain peaks */}
        <g ref={barChartRef} stroke="#38bdf8" strokeWidth="15" strokeLinecap="round" opacity="0.8">
          <line x1="200" y1="300" x2="200" y2="200" />
          <line x1="450" y1="300" x2="450" y2="150" />
          <line x1="750" y1="300" x2="750" y2="100" />
          <line x1="1000" y1="300" x2="1000" y2="50" />
          
          {/* Secondary bars */}
          <line x1="220" y1="300" x2="220" y2="230" strokeWidth="6" opacity="0.6" />
          <line x1="420" y1="300" x2="420" y2="200" strokeWidth="6" opacity="0.6" />
          <line x1="720" y1="300" x2="720" y2="150" strokeWidth="6" opacity="0.6" />
          <line x1="970" y1="300" x2="970" y2="90" strokeWidth="6" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
