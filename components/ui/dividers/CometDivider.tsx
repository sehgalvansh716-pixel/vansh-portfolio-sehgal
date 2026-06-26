"use client";

import { useEffect, useRef, useMemo } from "react";
import { gsap } from "@/lib/gsap";

// Simple deterministic pseudo-random number generator to prevent React Hydration errors
function createPRNG(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export default function CometDivider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tailLayersRef = useRef<SVGGElement>(null);
  const particlesRef = useRef<SVGGElement>(null);
  const earthRef = useRef<SVGGElement>(null);
  const coreRef = useRef<SVGGElement>(null);

  // Procedurally generate high-density details deterministically
  const details = useMemo(() => {
    const prng = createPRNG(12345); // Fixed seed
    const particles = [];
    
    // Generate 150 tail particles
    for (let i = 0; i < 150; i++) {
      const progress = prng(); 
      const spread = (1 - progress) * 80; 
      
      const baseX = 100 + (500 * progress);
      const baseY = 20 + (160 * progress);
      
      const x = parseFloat((baseX + (prng() - 0.5) * spread).toFixed(2));
      const y = parseFloat((baseY + (prng() - 0.5) * spread).toFixed(2));
      
      const size = parseFloat((prng() * 2 + 0.5).toFixed(2));
      const opacity = parseFloat((progress * prng()).toFixed(2)); 
      
      particles.push({ id: i, x, y, size, opacity });
    }

    // Generate Earth city lights
    const cityLights = [];
    for (let i = 0; i < 200; i++) {
      const angle = prng() * Math.PI;
      const cx = parseFloat((500 + Math.cos(angle) * 800).toFixed(2));
      const cy = parseFloat((1100 - Math.sin(angle) * 780).toFixed(2)); 
      if (cy > 320 && cx > -100 && cx < 1100) {
        cityLights.push({ 
          id: i, 
          cx, 
          cy, 
          r: parseFloat((prng() * 1.5).toFixed(2)), 
          opacity: parseFloat((prng() * 0.8).toFixed(2)) 
        });
      }
    }

    return { particles, cityLights };
  }, []);

  useEffect(() => {
    if (!tailLayersRef.current || !earthRef.current || !coreRef.current || !particlesRef.current) return;

    // Reset tail strokes
    Array.from(tailLayersRef.current.children).forEach(tail => {
      const length = (tail as SVGPathElement).getTotalLength?.() || 2000;
      gsap.set(tail, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
    });

    gsap.set(earthRef.current.children, { opacity: 0, y: 50 });
    gsap.set(coreRef.current, { scale: 0, opacity: 0, transformOrigin: "center", rotation: -45 });
    gsap.set(particlesRef.current.children, { scale: 0, opacity: 0, transformOrigin: "center" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
        end: "bottom 30%",
        scrub: 1.5,
      },
    });

    tl.to(earthRef.current.children, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power2.out" })
      .to(tailLayersRef.current.children, { strokeDashoffset: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: "power1.inOut" }, "-=0.8")
      .to(particlesRef.current.children, { scale: 1, opacity: (i, target) => target.getAttribute('data-op'), duration: 0.5, stagger: 0.005, ease: "power2.out" }, "-=1.2")
      .to(coreRef.current, { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(2)" }, "-=0.5");

    // Continuous animations
    gsap.to(particlesRef.current.children, {
      x: "-=20",
      y: "-=10",
      opacity: 0,
      duration: "random(0.5, 2)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: { each: 0.01, from: "random" }
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-64 md:h-96 flex justify-center items-center my-12 overflow-hidden">
      <svg 
        viewBox="0 0 1000 400" 
        className="w-full max-w-6xl h-full drop-shadow-2xl"
        fill="none" 
      >
        <defs>
          {/* Realistic Atmospheric Entry Colors */}
          <linearGradient id="cometFire" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="#ef4444" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#f97316" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <linearGradient id="cometCore" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="70%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <linearGradient id="earthAtmo" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="20%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
          <filter id="hyperBlur">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* --- PERFECTLY SMOOTH EARTH HORIZON --- */}
        <g ref={earthRef}>
          {/* Deep Atmosphere Glow */}
          <path d="M -200,450 Q 500,220 1200,450" stroke="url(#earthAtmo)" strokeWidth="100" filter="url(#hyperBlur)" />
          {/* Secondary Atmosphere */}
          <path d="M -100,420 Q 500,280 1100,420" stroke="#0ea5e9" strokeWidth="25" opacity="0.4" filter="url(#softBlur)" />
          <path d="M -50,390 Q 500,300 1050,390" stroke="#38bdf8" strokeWidth="8" opacity="0.6" filter="url(#softBlur)" />
          
          {/* Solid Earth Surface (Smooth Curve) */}
          <path d="M -100,390 Q 500,310 1100,390 L 1100,500 L -100,500 Z" fill="#020617" />
          <path d="M -100,390 Q 500,310 1100,390" stroke="#0ea5e9" strokeWidth="2" opacity="0.8" />

          {/* City Lights */}
          <g fill="#fcd34d" filter="url(#softBlur)">
            {details.cityLights.map((light, i) => (
              <circle key={`light-${i}`} cx={light.cx} cy={light.cy} r={light.r} opacity={light.opacity} />
            ))}
          </g>
        </g>

        {/* --- COMET TAILS --- */}
        <g ref={tailLayersRef}>
          {/* Broad diffuse plasma trail */}
          <path d="M 0,0 Q 300,100 600,180" stroke="url(#cometFire)" strokeWidth="80" strokeLinecap="round" filter="url(#hyperBlur)" opacity="0.5" />
          <path d="M 50,20 Q 350,120 600,180" stroke="url(#cometFire)" strokeWidth="40" strokeLinecap="round" filter="url(#softBlur)" opacity="0.7" />
          
          {/* Inner intense energy beams */}
          <path d="M 100,40 Q 400,140 600,180" stroke="url(#cometCore)" strokeWidth="15" strokeLinecap="round" filter="url(#softBlur)" />
          <path d="M 150,60 Q 450,160 600,180" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          <path d="M 120,30 Q 350,130 600,180" stroke="#fef08a" strokeWidth="3" strokeDasharray="20 10" opacity="0.8" />
          <path d="M 80,60 Q 300,150 600,180" stroke="#f97316" strokeWidth="2" strokeDasharray="15 15" opacity="0.6" />
        </g>
        
        {/* --- COMET PARTICLES --- */}
        <g ref={particlesRef} fill="#facc15">
          {details.particles.map((p, i) => (
            <circle key={`p-${i}`} cx={p.x} cy={p.y} r={p.size} data-op={p.opacity} filter="url(#softBlur)" />
          ))}
        </g>

        {/* --- ASTEROID CORE --- */}
        <g ref={coreRef}>
          {/* Massive Core Glow */}
          <circle cx="600" cy="180" r="50" fill="url(#coreGlow)" />
          <circle cx="600" cy="180" r="15" fill="#ffffff" filter="url(#softBlur)" />
          
          {/* Jagged Low-Poly Rock */}
          <polygon 
            points="
              585,175 595,165 610,168 618,178 
              612,190 600,195 590,192 582,185
            " 
            fill="#ffffff" 
          />
          <polygon 
            points="
              595,165 605,160 615,165 610,168
            " 
            fill="#facc15" opacity="0.8"
          />
          <polygon 
            points="
              582,185 590,192 585,198 578,190
            " 
            fill="#f97316" opacity="0.9"
          />
          
          {/* Breaking Fragments */}
          <polygon points="570,160 575,158 572,165" fill="#ffffff" />
          <polygon points="560,180 562,175 565,182" fill="#facc15" />
          <polygon points="580,205 585,200 588,208" fill="#f97316" />
        </g>
      </svg>
    </div>
  );
}
