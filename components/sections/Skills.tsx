"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SplitText } from "@/lib/gsap";
import { skillCategories, aiCapabilities } from "@/data/skills.data";
import {
  Globe, Palette, ShieldCheck, Lock, FileText, BarChart2,
  Bot, GitBranch, TestTube2, Cloud, Accessibility, Plug, Rocket, Cpu,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Globe, Palette, ShieldCheck, Lock, FileText, BarChart2,
  Bot, GitBranch, TestTube2, Cloud, Accessibility, Plug, Rocket, Cpu,
};

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const progressBars = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        try {
          const split = new SplitText(headingRef.current, { type: "words" });
          gsap.from(split.words, {
            y: 40, opacity: 0, stagger: 0.06, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 80%", once: true },
          });
        } catch { /* noop */ }
      }

      // Skill pills stagger
      if (pillsRef.current) {
        const pills = pillsRef.current.querySelectorAll("[data-pill]");
        gsap.fromTo(
          pills,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.03, duration: 0.5, ease: "power2.out",
            scrollTrigger: { trigger: pillsRef.current, start: "top 95%", once: true },
          }
        );
      }

      // AI cards stagger
      if (cardsContainerRef.current) {
        const cards = cardsContainerRef.current.querySelectorAll("[data-ai-card]");
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.05, duration: 0.65, ease: "power3.out",
            scrollTrigger: { trigger: cardsContainerRef.current, start: "top 95%", once: true },
          }
        );
      }

      // Progress bar animations
      progressBars.current.forEach((bar) => {
        if (!bar) return;
        gsap.from(bar, {
          width: "0%",
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: bar, start: "top 90%", once: true },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-label="Skills and Competencies"
      className="relative py-28 px-6 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 80% 30%, rgba(16,185,129,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-accent-primary/60" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            02 — Skills
          </span>
        </div>

        <h2
          ref={headingRef}
          className="font-display font-bold mb-16"
          style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          What I bring
          <br />
          <span className="gradient-text">to the table.</span>
        </h2>

        {/* ─── Core Skills Pills ───────────────────────── */}
        <div className="mb-20">
          <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-brand-white/70 mb-8">
            Core Competencies
          </h3>
          <div ref={pillsRef} className="space-y-6">
            {skillCategories.map((cat) => (
              <div key={cat.category}>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-accent-primary mb-3">
                  {cat.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      data-pill
                      className="font-mono text-sm px-4 py-2 rounded-full border border-white/15 bg-white/5 text-brand-white/80 hover:border-accent-primary/60 hover:text-accent-primary hover:bg-accent-primary/5 transition-all duration-300 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── AI-Augmented Skill Stack ──────────────── */}
        <div>
          <div className="mb-10">
            <h3 className="font-display font-bold text-brand-white mb-2" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
              AI-Augmented Skill Stack
            </h3>
            <p className="font-body text-muted text-sm">
              AI systems and toolchains I operate and build with.
            </p>
          </div>

          <div
            ref={cardsContainerRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {aiCapabilities.map((cap, i) => {
              const Icon = iconMap[cap.icon] || Globe;
              return (
                <div
                  key={cap.name}
                  data-ai-card
                  data-cursor="card"
                  className="glass rounded-2xl p-5 group hover:-translate-y-1 hover:border-accent-primary/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <Icon size={20} className="text-accent-primary shrink-0" aria-hidden="true" />
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-white/80 text-right leading-tight">
                      {cap.name}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className="font-body text-brand-white/55 text-xs mb-4 leading-relaxed overflow-hidden"
                    style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                  >
                    {cap.description}
                  </p>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        ref={(el) => { progressBars.current[i] = el; }}
                        className="h-full rounded-full"
                        style={{
                          width: `${cap.score * 10}%`,
                          background: "linear-gradient(90deg, #10B981, #34D399)",
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs font-medium text-accent-primary shrink-0">
                      {cap.score}/10
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
