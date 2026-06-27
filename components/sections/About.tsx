"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { SplitText } from "@/lib/gsap";
import { siteConfig } from "@/data/site.config";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const accentFrameRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        try {
          const split = new SplitText(headingRef.current, { type: "words" });
          gsap.from(split.words, {
            y: 40,
            opacity: 0,
            stagger: 0.06,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 80%", once: true },
          });
        } catch { /* SplitText unavailable */ }
      }

      // Bio character-level scroll scrub
      if (bioRef.current) {
        try {
          const split = new SplitText(bioRef.current, { type: "chars" });
          gsap.from(split.chars, {
            opacity: 0.1,
            stagger: 0.008,
            ease: "none",
            scrollTrigger: {
              trigger: bioRef.current,
              start: "top 75%",
              end: "bottom 55%",
              scrub: 1,
            },
          });
        } catch { /* SplitText unavailable */ }
      }

      // Photo slide in
      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: photoRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      // Accent frame parallax
      if (accentFrameRef.current) {
        gsap.to(accentFrameRef.current, {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }

      // Stat container stagger fade up
      if (statsRef.current) {
        const statCards = statsRef.current.children;
        gsap.fromTo(
          statCards,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: statsRef.current, start: "top 95%", once: true },
          }
        );
      }

      // No count-up animation: stats render as static values
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="About Vansh Sehgal"
      className="relative py-28 px-6"
    >
      {/* Background gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-accent-primary/60" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            01 — About
          </span>
        </div>

        <h2
          ref={headingRef}
          className="font-display font-bold mb-16"
          style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          The person behind
          <br />
          <span className="gradient-text">the data.</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Photo + Stats */}
          <div>
            <div ref={photoRef} className="relative inline-block mb-10">
              {/* Accent frame */}
              <div
                ref={accentFrameRef}
                aria-hidden="true"
                className="absolute -bottom-4 -right-4 w-full h-full border-2 border-accent-primary/25 rounded-2xl"
              />
              {/* Photo */}
              <div className="relative rounded-2xl overflow-hidden w-72 h-80">
                <Image
                  src="/images/avatar.jpg"
                  alt="Vansh Sehgal — Business Operations & Data Analyst, Delhi"
                  fill
                  className="object-cover transition-all duration-500 hover:grayscale-0"
                  style={{ filter: "grayscale(15%)" }}
                  sizes="(max-width: 768px) 100vw, 288px"
                  priority
                />
                {/* Gradient overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(8,10,9,0.4) 0%, transparent 50%)",
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 gap-6"
            >
              {siteConfig.stats.map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-5">
                  <p
                    className="font-display font-bold text-brand-white leading-none mb-1"
                    style={{ fontSize: "clamp(48px, 6vw, 72px)" }}
                  >
                    <span>
                      {stat.value}{stat.suffix}
                    </span>
                  </p>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Bio + Journey link */}
          <div className="space-y-8">
            <p
              ref={bioRef}
              className="font-body text-brand-white/75 leading-relaxed"
              style={{ fontSize: "clamp(15px, 1.5vw, 17px)" }}
            >
              {siteConfig.bio}
            </p>

            {/* Education capsules */}
            <div className="space-y-3">
              {siteConfig.education.map((edu) => (
                <div
                  key={edu.degree}
                  className="glass rounded-xl px-5 py-4 flex items-start justify-between gap-4"
                >
                  <div>
                    <h3 className="font-display font-semibold text-brand-white text-sm mb-0.5">
                      {edu.degree}
                    </h3>
                    <p className="font-body text-muted text-xs">{edu.institution}</p>
                  </div>
                  <span
                    className={[
                      "font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0",
                      edu.status === "In Progress"
                        ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
                        : "bg-white/5 text-muted border border-white/10",
                    ].join(" ")}
                  >
                    {edu.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Journey link */}
            <a
              href="#experience"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#experience")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-accent-primary hover:gap-4 transition-all duration-300"
            >
              <span>→ My Journey</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
