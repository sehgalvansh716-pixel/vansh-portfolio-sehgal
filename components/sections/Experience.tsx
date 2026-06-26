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

    // Timeline connector line draw
    if (lineRef.current) {
      gsap.from(lineRef.current, {
        scaleY: 0,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1,
        },
      });
    }

    // Left cards slide in from left
    const leftCards = document.querySelectorAll("[data-exp-left]");
    leftCards.forEach((card) => {
      gsap.fromTo(
        card,
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 95%", once: true },
        }
      );
    });

    // Right cards slide in from right
    const rightCards = document.querySelectorAll("[data-exp-right]");
    rightCards.forEach((card) => {
      gsap.fromTo(
        card,
        { x: 50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 95%", once: true },
        }
      );
    });

    // Dots pulse on enter
    const dots = document.querySelectorAll("[data-exp-dot]");
    dots.forEach((dot) => {
      gsap.fromTo(
        dot,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)",
          scrollTrigger: { trigger: dot, start: "top 95%", once: true },
        }
      );
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
          {/* Center vertical line (desktop) */}
          <div
            ref={lineRef}
            className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-primary/60 via-accent-primary/20 to-transparent"
            aria-hidden="true"
          />

          <div className="space-y-12 lg:space-y-0">
            {experiences.map((exp, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={exp.id}
                  className="lg:grid lg:grid-cols-2 lg:gap-12 relative"
                  style={{ marginBottom: "4rem" }}
                >
                  {/* Center dot (desktop) */}
                  <div
                    data-exp-dot
                    className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 items-center justify-center"
                    aria-hidden="true"
                  >
                    <div className="w-3 h-3 rounded-full bg-accent-primary shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                    <div className="absolute w-5 h-5 rounded-full border border-accent-primary/30 animate-ping" />
                  </div>

                  {/* Left card */}
                  {isLeft ? (
                    <>
                      <article
                        data-exp-left
                        className="glass rounded-2xl p-7 lg:text-right border-l-2 border-l-accent-primary/30 lg:border-l-0 mb-4 lg:mb-0"
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
                        className="glass rounded-2xl p-7 border-l-2 border-l-accent-primary/30"
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
