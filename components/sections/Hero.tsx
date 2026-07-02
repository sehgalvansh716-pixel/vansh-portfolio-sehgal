"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";
import { SplitText } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import { siteConfig } from "@/data/site.config";
import { ChevronDown } from "lucide-react";
import HeroCanvasLoader from "@/components/ui/HeroCanvasLoader";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), { ssr: false });

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const distortionRef = useRef<number>(0);

  const [currentTagline, setCurrentTagline] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [holdUsed, setHoldUsed] = useState(false);
  const [showHold, setShowHold] = useState(true);

  // ─── Kinetic H1 Entry ────────────────────────────────────────
  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set([el, eyebrowRef.current, ctaRef.current, scrollIndicatorRef.current], { opacity: 1 });
      return;
    }

    let split: InstanceType<typeof SplitText> | null = null;
    try {
      split = new SplitText(el, { type: "chars,words" });
      gsap.set(el, { opacity: 1 }); // Make parent visible so child chars can be seen
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo(
        split.chars,
        { y: 120, opacity: 0, rotateX: -90 },
        { y: 0, opacity: 1, rotateX: 0, stagger: 0.04, duration: 0.8, ease: "back.out(1.7)", transformOrigin: "0% 50% -50px" }
      )
        .fromTo(eyebrowRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.3")
        .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.2")
        .fromTo(scrollIndicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.1");
    } catch {
      gsap.set([el, eyebrowRef.current, ctaRef.current, scrollIndicatorRef.current], { opacity: 1 });
    }

    return () => { split?.revert(); };
  }, []);

  // ─── Typewriter Role Cycling ─────────────────────────────────
  useEffect(() => {
    const taglines = siteConfig.taglines as readonly string[];
    const current = taglines[currentTagline];
    let timeout: ReturnType<typeof setTimeout>;

    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false);
        setCurrentTagline((prev) => (prev + 1) % taglines.length);
        return;
      }
      timeout = setTimeout(() => {
        setDisplayText((t) => t.slice(0, -1));
      }, 40);
    } else {
      if (displayText.length === current.length) {
        timeout = setTimeout(() => setIsDeleting(true), 2200);
        return;
      }
      timeout = setTimeout(() => {
        setDisplayText(current.slice(0, displayText.length + 1));
      }, 55);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTagline]);

  // ─── Hold-to-Distort ─────────────────────────────────────────
  const handleMouseDown = () => {
    gsap.to(distortionRef, { current: 1.0, duration: 0.6, ease: "power2.out" });
    if (!holdUsed) {
      setHoldUsed(true);
      setTimeout(() => setShowHold(false), 1500);
    }
  };
  const handleMouseUp = () => {
    gsap.to(distortionRef, { current: 0, duration: 0.8, ease: "power2.inOut" });
  };

  return (
    <section
      id="hero"
      aria-label="Hero — Introduction"
      className="relative flex items-center justify-center overflow-hidden transition-colors duration-500"
      style={{ height: "100dvh", backgroundColor: "var(--hero-bg-solid)" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background video - Dark Mode */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="hero-video-dark absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-500"
        style={{ zIndex: 0, filter: "var(--video-invert)" }}
      >
        <source src="/video/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Background video - Light Mode */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="hero-video-light absolute inset-0 w-full h-full object-cover opacity-[0.85] transition-all duration-500"
        style={{ zIndex: 0, filter: "var(--video-invert)" }}
      >
        <source src="/video/hero-bg-light.mp4" type="video/mp4" />
      </video>

      <div
        aria-hidden="true"
        className="absolute inset-0 transition-colors duration-500"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, var(--glass-border) 0%, transparent 70%), linear-gradient(to bottom, var(--hero-bg-solid) 0%, transparent 20%, transparent 70%, var(--hero-bg-solid) 100%)",
        }}
      />

      {/* Bottom feather and blur transition */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-48 pointer-events-none transition-colors duration-500"
        style={{
          zIndex: 0,
          background: "linear-gradient(to top, var(--hero-bg-solid) 10%, transparent 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          maskImage: "linear-gradient(to top, black 20%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 20%, transparent 100%)"
        }}
      />

      {/* R3F Particle overlay */}
      <Suspense fallback={<HeroCanvasLoader />}>
        <HeroCanvas distortionRef={distortionRef} />
      </Suspense>

      {/* Text content */}
      <div
        className="relative text-center px-6 max-w-5xl mx-auto"
        style={{ zIndex: 10 }}
      >
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="mb-6 flex items-center justify-center gap-3"
          style={{ opacity: 0 }}
        >
          <div className="h-px w-12 bg-accent-primary/60 [.light_&]:shadow-[0_1px_2px_rgba(0,0,0,0.4)]" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary [.light_&]:[text-shadow:0_1px_3px_rgba(0,0,0,0.6),0_1px_2px_rgba(0,0,0,0.3)]">
            Available for opportunities
          </span>
          <div className="h-px w-12 bg-accent-primary/60 [.light_&]:shadow-[0_1px_2px_rgba(0,0,0,0.4)]" />
        </div>

        {/* Main H1 */}
        <h1
          ref={headlineRef}
          className="font-display font-bold text-brand-white mb-4"
          style={{
            fontSize: "clamp(52px, 9vw, 110px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            opacity: 0,
          }}
        >
          {siteConfig.name}
        </h1>

        {/* Typewriter subtitle */}
        <div
          className="mt-6 mb-10 h-8 flex items-center justify-center"
          aria-live="polite"
          aria-label={`Current role: ${siteConfig.taglines[currentTagline]}`}
        >
          <span className="font-mono text-base text-accent-primary tracking-wider [.light_&]:[text-shadow:0_1px_3px_rgba(0,0,0,0.6),0_1px_2px_rgba(0,0,0,0.3)]">
            {displayText}
            <span className="blink-cursor ml-0.5">█</span>
          </span>
        </div>

        {/* CTA Row */}
        <div
          ref={ctaRef}
          className="flex items-center justify-center gap-4 flex-wrap"
          style={{ opacity: 0 }}
        >
          <MagneticButton>
            <a
              href={siteConfig.resumeUrl}
              download
              id="hero-download-resume"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-mono text-sm font-semibold uppercase tracking-widest bg-btn-indigo-bg/15 backdrop-blur-md border border-btn-indigo-border/30 border-t-btn-indigo-top/40 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_3px_rgb(var(--btn-indigo-top)/0.25),inset_0_-1px_4px_rgba(0,0,0,0.2)] text-brand-white hover:bg-btn-indigo-bg/30 hover:border-btn-indigo-border/50 hover:shadow-[0_6px_15px_rgba(0,0,0,0.15),inset_0_1px_3px_rgb(var(--btn-indigo-top)/0.45)] transition-all duration-300 hover:scale-105"
            >
              Download Resume
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href="#contact"
              id="hero-lets-connect"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-mono text-sm uppercase tracking-widest bg-btn-indigo-bg/5 backdrop-blur-md border border-btn-indigo-border/20 border-t-btn-indigo-top/30 shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_0_1px_2px_rgb(var(--btn-indigo-top)/0.15),inset_0_-1px_4px_rgba(0,0,0,0.1)] text-brand-white/90 hover:bg-btn-indigo-bg/15 hover:border-btn-indigo-border/40 hover:text-brand-white hover:shadow-[0_6px_15px_rgba(0,0,0,0.1),inset_0_1px_2px_rgb(var(--btn-indigo-top)/0.3)] transition-all duration-300"
            >
              Let&apos;s Connect
            </a>
          </MagneticButton>
        </div>

        {/* Hold hint */}
        {showHold && (
          <p
            className="mt-8 font-mono text-xs uppercase tracking-[0.25em] text-brand-white/20 transition-opacity duration-500"
            style={{ opacity: holdUsed ? 0 : 1 }}
            aria-hidden="true"
          >
            HOLD to distort
          </p>
        )}
      </div>

      {/* Vertical sidebar text */}
      <div
        aria-hidden="true"
        className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block"
        style={{
          writingMode: "vertical-rl",
          transform: "translateY(-50%) rotate(180deg)",
          zIndex: 10,
        }}
      >
        <span className="font-mono text-xs tracking-[0.3em] text-brand-white/25">
          Est. 2023 · Delhi, India
        </span>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 10, opacity: 0 }}
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-white/40">
          scroll to explore
        </span>
        <ChevronDown
          size={16}
          className="text-brand-white/40 animate-bounce-slow"
        />
      </div>
    </section>
  );
}
