"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { siteConfig } from "@/data/site.config";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%", once: true },
          delay: index * 0.1,
        }
      );
    });

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  return (
    <section
      id="recommendations"
      aria-label="Testimonials and Recommendations"
      className="relative py-28 px-6 bg-brand-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-accent-primary/60" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            07 — Recommendations
          </span>
        </div>

        <h2
          className="font-display font-bold mb-16"
          style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          What people
          <br />
          <span className="gradient-text">are saying.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteConfig.testimonials.map((test, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-accent-primary/30 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.05)]"
            >
              <Quote size={28} className="text-accent-primary/30 mb-6" aria-hidden="true" />
              <p className="font-body text-brand-white/80 text-sm leading-relaxed mb-8 flex-1">
                "{test.quote}"
              </p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary/20 to-transparent flex items-center justify-center font-display font-bold text-accent-primary">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-mono text-xs font-semibold text-brand-white">{test.name}</h4>
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted mt-0.5">
                    {test.role} • {test.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
