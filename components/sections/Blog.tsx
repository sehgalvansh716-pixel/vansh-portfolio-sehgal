"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { siteConfig } from "@/data/site.config";
import { ArrowUpRight, BookOpen } from "lucide-react";

export default function Blog() {
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%", once: true },
          delay: index * 0.15,
        }
      );
    });

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  return (
    <section
      id="insights"
      aria-label="Blog and Insights"
      className="relative py-28 px-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.03) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-accent-primary/60" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            08 — Insights
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <h2
            className="font-display font-bold"
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Thoughts &
            <br />
            <span className="gradient-text">perspectives.</span>
          </h2>
          
          <a
            href="#"
            className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brand-white hover:text-accent-primary transition-colors duration-300"
          >
            View all posts 
            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteConfig.blogs.map((blog, i) => (
            <a
              key={i}
              href={blog.link}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group flex flex-col p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-accent-primary/40 hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.05)]"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent-primary/80">
                  {blog.date}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-brand-white/50 group-hover:bg-accent-primary/20 group-hover:text-accent-primary transition-colors duration-300">
                  <BookOpen size={14} />
                </div>
              </div>

              <h3 className="font-display font-semibold text-xl text-brand-white mb-3 group-hover:text-accent-primary transition-colors duration-300">
                {blog.title}
              </h3>
              
              <p className="font-body text-brand-white/60 text-sm leading-relaxed mb-8 flex-1">
                {blog.summary}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 group-hover:border-accent-primary/20 transition-colors duration-300">
                <span className="font-mono text-xs text-muted">
                  {blog.readTime}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs text-accent-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Read article <ArrowUpRight size={12} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
