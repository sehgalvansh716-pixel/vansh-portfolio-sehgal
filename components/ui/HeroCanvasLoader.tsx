"use client";

import { Loader2 } from "lucide-react";

export default function HeroCanvasLoader() {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 1 }}
      aria-label="Loading interactive background"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex items-center justify-center w-12 h-12">
          {/* Glowing background blob */}
          <div className="absolute inset-0 bg-accent-primary/20 rounded-full blur-md animate-pulse-glow" />
          
          {/* Spinning Loader */}
          <Loader2 
            size={24} 
            className="text-accent-primary animate-spin relative z-10" 
            aria-hidden="true" 
          />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-brand-white/40 animate-pulse">
          Loading Canvas...
        </span>
      </div>
    </div>
  );
}
