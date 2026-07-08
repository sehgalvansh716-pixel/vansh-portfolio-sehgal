"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface PreloaderProps {
  isLoaded: boolean;
}

export default function Preloader({ isLoaded }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hasTriggeredExit = useRef(false);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const exitTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    const ctx = gsap.context(() => {
      // Create a slow timeline that crawls to 99%
      tlRef.current = gsap.timeline();
      
      tlRef.current.to(counterRef.current, {
        innerHTML: 99,
        duration: 3,
        snap: { innerHTML: 1 },
        ease: "power2.out",
      }, 0);
      
      tlRef.current.to(progressRef.current, {
        scaleX: 0.99,
        duration: 3,
        ease: "power2.out",
      }, 0);
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (isLoaded && !hasTriggeredExit.current) {
      hasTriggeredExit.current = true;
      
      // Kill the slow crawl to 99 immediately
      if (tlRef.current) {
        tlRef.current.kill();
      }
      
      exitTlRef.current = gsap.timeline();
      
      exitTlRef.current.to(counterRef.current, {
        innerHTML: 100,
        duration: 0.4,
        snap: { innerHTML: 1 },
        ease: "power2.out",
      }, 0)
      .to(progressRef.current, {
        scaleX: 1,
        duration: 0.4,
        ease: "power2.out",
      }, 0)
      .to(containerRef.current, {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
        delay: 0.2, // Tiny pause at 100% to let the user register it
        onComplete: () => {
          document.body.style.overflow = "";
          window.dispatchEvent(new Event("preloaderComplete"));
        }
      });
    }
  }, [isLoaded]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-brand-black flex flex-col items-center justify-center text-brand-white"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="font-mono text-[10vw] md:text-[6vw] font-bold tracking-tighter leading-none flex items-baseline">
          <span ref={counterRef}>0</span>
          <span className="text-[0.5em] text-accent-primary ml-2">%</span>
        </div>
        
        <div className="h-[2px] w-48 md:w-64 bg-white/10 relative overflow-hidden">
           <div 
             ref={progressRef}
             className="absolute inset-y-0 left-0 bg-accent-primary w-full origin-left"
             style={{ transform: "scaleX(0)" }}
           />
        </div>
        
        <div className="flex items-center gap-3 mt-4">
           <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
           <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-white/50">
             System Initializing
           </span>
        </div>
      </div>
    </div>
  );
}
