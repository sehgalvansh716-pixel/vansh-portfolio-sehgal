"use client";
import { siteConfig } from "@/data/site.config";

export default function MarqueeStrip() {
  const words = [...siteConfig.marqueeWords, ...siteConfig.marqueeWords];

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-white/5 py-4 bg-surface/40"
    >
      <div
        className="marquee-track flex whitespace-nowrap"
        style={{ animation: "marquee 35s linear infinite" }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            className="font-mono text-xs uppercase tracking-[0.35em] text-brand-white/25 mx-8 flex items-center gap-8"
          >
            {word}
            <span className="inline-block w-1 h-1 rounded-full bg-accent-primary/40" />
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {words.map((word, i) => (
          <span
            key={`dup-${i}`}
            className="font-mono text-xs uppercase tracking-[0.35em] text-brand-white/25 mx-8 flex items-center gap-8"
          >
            {word}
            <span className="inline-block w-1 h-1 rounded-full bg-accent-primary/40" />
          </span>
        ))}
      </div>
    </div>
  );
}
