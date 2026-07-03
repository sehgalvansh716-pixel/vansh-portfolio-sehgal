"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-[100dvh] flex flex-col items-center justify-center bg-brand-black px-6 text-center relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-primary/10 via-brand-black to-brand-black z-0" />
      
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="reveal font-display font-bold text-[clamp(100px,20vw,200px)] leading-none text-brand-white tracking-tighter">
          4<span className="text-accent-primary">0</span>4
        </h1>
        <div className="reveal h-px w-24 bg-accent-primary/50 my-6" />
        <p className="reveal font-mono text-sm uppercase tracking-widest text-brand-white/50 mb-10 max-w-sm">
          The requested trajectory does not exist in this environment.
        </p>
        
        <div className="reveal">
          <MagneticButton>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-mono text-xs font-semibold uppercase tracking-widest glass text-brand-white hover:bg-white/10 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Return to Base
            </Link>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
