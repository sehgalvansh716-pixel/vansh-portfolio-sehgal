"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { siteConfig } from "@/data/site.config";

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // The progress line grows as the user scrolls through the section
    if (lineRef.current) {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%", // Line starts growing when top of section hits center of viewport
            end: "bottom 50%", // Finishes growing when bottom of section hits center
            scrub: true,
          },
        }
      );
    }

    // Left cards slide in
    const leftCards = document.querySelectorAll("[data-exp-left]");
    leftCards.forEach((card) => {
      gsap.fromTo(
        card,
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 80%", once: true },
        }
      );
    });

    // Right cards slide in
    const rightCards = document.querySelectorAll("[data-exp-right]");
    rightCards.forEach((card) => {
      gsap.fromTo(
        card,
        { x: 50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 80%", once: true },
        }
      );
    });

    // Dots light up exactly when the progress line hits them (center of screen)
    const dots = document.querySelectorAll("[data-exp-dot]");
    dots.forEach((dot) => {
      const core = dot.querySelector("[data-dot-core]");
      const ring = dot.querySelector("[data-dot-ring]");
      
      ScrollTrigger.create({
        trigger: dot,
        start: "top 50%", 
        onEnter: () => {
          gsap.to(core, { backgroundColor: "#10B981", borderColor: "#10B981", duration: 0.3 });
          gsap.fromTo(ring, 
            { scale: 1, opacity: 1, borderColor: "rgba(16,185,129,0.8)" },
            { scale: 2, opacity: 0, repeat: -1, duration: 1.5, ease: "power1.out" }
          );
        },
        onLeaveBack: () => {
          gsap.to(core, { backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.2)", duration: 0.3 });
          gsap.killTweensOf(ring);
          gsap.set(ring, { opacity: 0 });
        }
      });
    });

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  const experiences = siteConfig.experience;

  return (
    <section
      id="experience"
      ref={sectionRef}
      aria-label="Work Experience and Training"
      className="relative py-28 px-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 30% 60%, rgba(16,185,129,0.04) 0%, transparent 60%)",
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
          className="font-display font-bold mb-20"
          style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          The journey
          <br />
          <span className="gradient-text">so far.</span>
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Dim background track (visible on mobile + desktop) */}
          <div
            className="absolute left-[15px] lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-px bg-white/10"
            aria-hidden="true"
          />
          {/* Bright progress track (grows down) */}
          <div
            ref={lineRef}
            className="absolute left-[15px] lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-accent-primary origin-top"
            aria-hidden="true"
          />

          <div className="space-y-12 lg:space-y-0">
            {experiences.map((exp, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={exp.id}
                  className="relative pl-12 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-12"
                  style={{ marginBottom: "4rem" }}
                >
                  {/* Interactive Dot */}
                  <div
                    data-exp-dot
                    className="absolute left-[15px] lg:left-1/2 top-8 -translate-x-1/2 flex items-center justify-center z-10"
                    aria-hidden="true"
                  >
                    <div data-dot-core className="w-3 h-3 rounded-full bg-brand-black border-2 border-white/20 transition-colors duration-300" />
                    <div data-dot-ring className="absolute w-5 h-5 rounded-full border border-transparent" />
                  </div>

                  {/* Left card */}
                  {isLeft ? (
                    <>
                      <article
                        data-exp-left
                        className="glass rounded-2xl p-7 lg:text-right lg:border-r lg:border-r-accent-primary/10 border-l-2 border-l-accent-primary/30 lg:border-l-0 mb-4 lg:mb-0 relative before:absolute before:right-[-12px] before:top-8 before:w-3 before:h-px before:bg-accent-primary/30 hidden lg:block"
                      >
                        <ExpCardContent exp={exp} />
                      </article>
                      
                      {/* Mobile version for "Left" cards since mobile is always right-aligned */}
                      <article
                        data-exp-right
                        className="glass rounded-2xl p-7 border-l-2 border-l-accent-primary/30 lg:hidden"
                      >
                        <ExpCardContent exp={exp} />
                      </article>
                      <div className="hidden lg:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden lg:block" />
                      <article
                        data-exp-right
                        className="glass rounded-2xl p-7 border-l-2 border-l-accent-primary/30 relative before:absolute before:left-[-12px] before:top-8 before:w-3 before:h-px before:bg-accent-primary/30 hidden lg:block"
                      >
                        <ExpCardContent exp={exp} />
                      </article>

                      {/* Mobile version for "Right" cards */}
                      <article
                        data-exp-right
                        className="glass rounded-2xl p-7 border-l-2 border-l-accent-primary/30 lg:hidden"
                      >
                        <ExpCardContent exp={exp} />
                      </article>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpCardContent({ exp }: { exp: typeof siteConfig.experience[number] }) {
  return (
    <>
      <div className="mb-1">
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
      <ul className="space-y-2 mb-5 text-left">
        {exp.bullets.map((bullet, j) => (
          <li key={j} className="flex gap-2 items-start text-brand-white/60 font-body text-sm leading-relaxed">
            <span className="text-accent-primary mt-1.5 shrink-0" aria-hidden="true">›</span>
            {bullet}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 justify-start">
        {exp.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}
