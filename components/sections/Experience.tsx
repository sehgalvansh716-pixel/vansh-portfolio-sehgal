"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { siteConfig } from "@/data/site.config";

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const pathsRef = useRef<(SVGPathElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // Fallback to CSS (cards stay visible statically)

    // Use gsap.context for bulletproof React cleanup and StrictMode safety
    const ctx = gsap.context(() => {
      linesRef.current.forEach((triggerDiv, i) => {
        const card = cardsRef.current[i];
        if (!triggerDiv || !card) return;
        
        const isFromLeft = i % 2 === 0;
        const isMobile = window.innerWidth < 768;
        const startX = isFromLeft ? (isMobile ? -20 : -50) : (isMobile ? 20 : 50);

        // Continuous scrub timeline tied to the block div wrapper
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerDiv, 
            start: "top 80%", // Wider activation window
            end: "bottom 20%", 
            scrub: 1, // Smooth scrub
          }
        });

        // 1. Reveal the dashed line container from top to bottom
        // Using fromTo ensures that if GSAP fails, the CSS state (visible) is preserved.
        tl.fromTo(triggerDiv, 
          { clipPath: "inset(0% -100% 100% -100%)" }, // Negative left/right inset to prevent horizontal clipping
          { clipPath: "inset(0% -100% 0% -100%)", duration: 1, ease: "none" }
        )
        // 2. Slide the card into the center
        .fromTo(card, 
          { xPercent: startX, opacity: 0 },
          { xPercent: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.7" // Starts halfway through the line reveal
        );
      });
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  const featuredExperience = siteConfig.experience.find(e => "featured" in e && e.featured);
  const timelineExperiences = siteConfig.experience.filter(e => !("featured" in e && e.featured));

  return (
    <section
      id="experience"
      ref={sectionRef}
      aria-label="Work Experience and Training"
      className="relative pt-12 pb-28 px-6 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 60%, rgba(16,185,129,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-accent-primary/60" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            03 — Experience
          </span>
        </div>

        <h2
          ref={headingRef}
          className="font-display font-bold mb-12"
          style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          The journey
          <br />
          <span className="gradient-text">so far.</span>
        </h2>

        {/* ── SprayKart Featured Card (Static Base) ──────────────────────────── */}
        {featuredExperience && (
          <div className="relative z-20 max-w-4xl mx-auto overflow-hidden rounded-3xl premium-glass border-l-4 border-l-accent-primary p-8 lg:p-10 shadow-2xl bg-black/50 backdrop-blur-lg">
            {/* Live pulse badge */}
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-primary" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent-primary">Currently Here</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">
              {/* Left: company info */}
              <div className="flex-shrink-0 mb-6 lg:mb-0 lg:w-56">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2 block">{featuredExperience.period}</span>
                <h3 className="font-display font-bold text-brand-white mb-1 text-2xl xl:text-3xl">{featuredExperience.company}</h3>
                <p className="font-mono text-sm text-accent-primary">{featuredExperience.role}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featuredExperience.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: bullets */}
              <ul className="space-y-4 flex-1">
                {featuredExperience.bullets.map((bullet, j) => (
                  <li key={j} className="flex gap-3 items-start text-brand-white/70 font-body text-sm lg:text-base leading-relaxed">
                    <span className="text-accent-primary mt-1.5 shrink-0 text-base" aria-hidden="true">›</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── Animated Curvy Timeline ──────────────────────────── */}
        <div className="relative flex flex-col items-center w-full max-w-4xl mx-auto -mt-4 z-10">
          {timelineExperiences.map((exp, i) => {
            const isLeftLoop = i % 2 === 0;
            return (
              <div key={exp.id} className="w-full flex flex-col items-center">
                
                {/* SVG Curvy Connecting Line Wrapper */}
                <div 
                  ref={(el) => { linesRef.current[i] = el; }}
                  className="w-full h-24 md:h-36 flex justify-center overflow-visible my-2"
                >
                  <svg 
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none" 
                    className="w-[150px] md:w-[220px] h-full opacity-80 drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] text-brand-white"
                  >
                    <path 
                      ref={(el) => { pathsRef.current[i] = el; }}
                      // The math here draws a beautiful bezier curve strictly within the 0-100 viewBox to prevent cutoff!
                      d={isLeftLoop ? "M 50 0 C 5 20, 5 80, 50 100" : "M 50 0 C 95 20, 95 80, 50 100"}
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeDasharray="4 4" 
                      vectorEffect="non-scaling-stroke"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                
                {/* Center-locking Slide-in Card */}
                <div 
                  ref={(el) => { cardsRef.current[i] = el; }}
                  className="w-full max-w-2xl relative z-10"
                >
                  <article className="premium-glass p-7 md:p-8 rounded-3xl border border-white/5 border-l-2 border-l-accent-primary/50 shadow-2xl bg-black/40 backdrop-blur-md transition-shadow duration-300 hover:shadow-accent-primary/10">
                    <ExpCardContent exp={exp} />
                  </article>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  );
}

function ExpCardContent({ exp }: { exp: typeof siteConfig.experience[number] }) {
  return (
    <>
      <div className="mb-2">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
          {exp.period}
        </span>
      </div>
      <h3 className="font-display font-bold text-brand-white mb-0.5" style={{ fontSize: "clamp(18px, 2vw, 24px)" }}>
        {exp.company}
      </h3>
      {exp.via && (
        <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent-primary/70 mb-2">
          {exp.via}
        </p>
      )}
      <p className="font-mono text-sm text-accent-primary mb-4">{exp.role}</p>
      <ul className="space-y-3 mb-6 text-left">
        {exp.bullets.map((bullet, j) => (
          <li key={j} className="flex gap-3 items-start text-brand-white/70 font-body text-sm leading-relaxed">
            <span className="text-accent-primary mt-1.5 shrink-0" aria-hidden="true">›</span>
            {bullet}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 justify-start">
        {exp.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20 shadow-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}
