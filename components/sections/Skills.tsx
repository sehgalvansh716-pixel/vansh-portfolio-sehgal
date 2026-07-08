"use client";
import { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";
import { gsap } from "@/lib/gsap";
import { SplitText } from "@/lib/gsap";
import { skillCategories, aiCapabilities } from "@/data/skills.data";
import {
  Globe, Palette, ShieldCheck, Lock, FileText, BarChart2,
  Bot, GitBranch, TestTube2, Cloud, Accessibility, Plug, Rocket, Cpu,
  Terminal, Zap, Search, TrendingUp, Database, PieChart, Table, Settings, Folder,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Globe, Palette, ShieldCheck, Lock, FileText, BarChart2,
  Bot, GitBranch, TestTube2, Cloud, Accessibility, Plug, Rocket, Cpu,
  Terminal, Zap, Search, TrendingUp, Database, PieChart, Table, Settings, Folder,
};

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<HTMLDivElement>(null);
  const progressBars = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
          { scale: 0.5, opacity: 0 },
          {
            scale: 1, opacity: 1, stagger: 0.03, duration: 0.5, ease: "back.out(1.5)",
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

      // Spline zoom out
      if (splineRef.current) {
        gsap.fromTo(
          splineRef.current,
          { scale: 1.15, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 1.5, ease: "power2.out",
            scrollTrigger: { trigger: splineRef.current, start: "top 80%", once: true },
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

  // Emulate hover states for the transparent cards so they glow when hovered, 
  // without stealing mouse events from the 3D Spline canvas behind them!
  useEffect(() => {
    if (!mounted || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardsContainerRef.current) return;
      const cards = cardsContainerRef.current.querySelectorAll<HTMLDivElement>("[data-ai-card]");
      
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        // Check if mouse is inside the card's bounding box
        const isHovered = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
        
        if (isHovered) {
          card.classList.add("hover-emulate");
        } else {
          card.classList.remove("hover-emulate");
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mounted, isMobile]);

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
                      className="font-mono text-sm px-4 py-2 rounded-full premium-glass text-brand-white/80 hover:text-accent-primary cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Languages & Soft Skills Strip ────────────── */}
        <div className="mb-20">
          <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-brand-white/70 mb-8">
            Languages &amp; Soft Skills
          </h3>
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
            {/* Languages */}
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-accent-primary mb-4">Languages</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { lang: "Hindi", level: "Native" },
                  { lang: "English", level: "Fluent" },
                ].map(({ lang, level }) => (
                  <div key={lang} className="premium-glass rounded-2xl px-5 py-3.5 flex items-center gap-3">
                    <span className="font-display font-semibold text-brand-white text-sm">{lang}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent-primary/15 text-accent-primary border border-accent-primary/20">
                      {level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-white/10 self-stretch" aria-hidden="true" />

            {/* Soft Skills */}
            <div className="flex-1">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-accent-primary mb-4">Soft Skills</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: "🤝", label: "Client Relations" },
                  { icon: "🧠", label: "Analytical Thinking" },
                  { icon: "⚡", label: "Fast Learner" },
                  { icon: "🌏", label: "Cross-Cultural Comm." },
                  { icon: "📋", label: "Conflict Resolution" },
                  { icon: "🎯", label: "Detail-Oriented" },
                  { icon: "💡", label: "Problem Solving" },
                  { icon: "🔄", label: "Adaptability" },
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    className="premium-glass font-mono text-xs text-brand-white/80 hover:text-accent-primary px-3.5 py-2 rounded-full flex items-center gap-2 cursor-default"
                  >
                    <span aria-hidden="true">{icon}</span>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── AI-Augmented Skill Stack ──────────────── */}
        <div className="relative pt-12 pb-12 mt-12 min-h-[800px]">
          {/* Spline Background */}
          <div ref={splineRef} className="absolute inset-0 z-0 opacity-100 lg:px-24" style={{ maskImage: "radial-gradient(ellipse at center, black 50%, transparent 80%)" }}>
            {mounted && !isMobile && (
              <Spline scene="https://prod.spline.design/KAkn-w7hlauc9CcD/scene.splinecode" />
            )}
          </div>

          <div className="relative z-10 mb-10 pointer-events-none">
            <h3 className="font-display font-bold text-brand-white mb-2" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
              AI-Augmented Skill Stack
            </h3>
            <p className="font-body text-muted text-sm">
              AI systems and toolchains I operate and build with.
            </p>
          </div>

          <div
            ref={cardsContainerRef}
            className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pointer-events-none"
          >
            {aiCapabilities.map((cap, i) => {
              const Icon = iconMap[cap.icon] || Globe;
              
              // Form a U-Shape on large screens with the 12 items
              let lgClass = "";
              if (i === 0) lgClass = "lg:col-start-1 lg:row-start-1";
              else if (i === 1) lgClass = "lg:col-start-4 lg:row-start-1";
              else if (i === 2) lgClass = "lg:col-start-1 lg:row-start-2";
              else if (i === 3) lgClass = "lg:col-start-4 lg:row-start-2";
              else if (i === 4) lgClass = "lg:col-start-1 lg:row-start-3";
              else if (i === 5) lgClass = "lg:col-start-4 lg:row-start-3";
              else if (i === 6) lgClass = "lg:col-start-1 lg:row-start-4";
              else if (i === 7) lgClass = "lg:col-start-4 lg:row-start-4";
              else if (i === 8) lgClass = "lg:col-start-1 lg:row-start-5";
              else if (i === 9) lgClass = "lg:col-start-2 lg:row-start-5";
              else if (i === 10) lgClass = "lg:col-start-3 lg:row-start-5";
              else if (i === 11) lgClass = "lg:col-start-4 lg:row-start-5";

              return (
                <div
                  key={cap.name}
                  data-ai-card
                  className={`premium-glass rounded-2xl p-5 group ${lgClass}`}
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
