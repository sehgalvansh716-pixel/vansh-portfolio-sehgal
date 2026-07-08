"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("@/components/ui/Scene3D"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-brand-black" />,
});
import { gsap } from "@/lib/gsap";
import { SplitText } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import { siteConfig } from "@/data/site.config";
import Preloader from "@/components/ui/Preloader";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const parallaxBoxRef = useRef<HTMLDivElement>(null);
  const [currentTagline, setCurrentTagline] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Listen for global preloader completion
  useEffect(() => {
    const onPreloaderComplete = () => setPreloaderDone(true);
    window.addEventListener("preloaderComplete", onPreloaderComplete);
    return () => window.removeEventListener("preloaderComplete", onPreloaderComplete);
  }, []);

  // ─── Kinetic H1 Entry ────────────────────────────────────────
  useEffect(() => {
    if (!preloaderDone) return; // Wait for the cinematic preloader to finish its exit animation!

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
      const tl = gsap.timeline({ delay: 0.1 }); // Less delay since preloader handled the pause
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
  }, [preloaderDone]);

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

  // ─── Mouse Parallax ──────────────────────────────────────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!parallaxBoxRef.current) return;
      
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 40; // max 20px shift
      const y = (e.clientY / innerHeight - 0.5) * 40;

      gsap.to(parallaxBoxRef.current, {
        x,
        y,
        rotationY: x * 0.2,
        rotationX: -y * 0.2,
        ease: "power2.out",
        duration: 1.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
    <Preloader isLoaded={isLoaded} />

    <section
      id="hero"
      aria-label="Hero — Introduction"
      className="relative flex items-center justify-center overflow-hidden transition-colors duration-500 bg-brand-black"
      style={{ height: "100dvh" }}
    >
      {/* Subtle animated gradient background instead of video */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-colors duration-500 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-primary/10 via-brand-black to-brand-black"
        style={{ zIndex: 0 }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 transition-colors duration-500"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, var(--glass-border) 0%, transparent 70%), linear-gradient(to bottom, var(--brand-black) 0%, transparent 20%, transparent 70%, var(--brand-black) 100%)",
        }}
      />

      {/* Custom 3D Background — isolated GPU layer so card hover never moves it */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          willChange: "transform",
          transform: "translateZ(0)",
          contain: "strict",
        }}
      >
        <Scene3D onLoad={() => setIsLoaded(true)} />
      </div>

      {/* Text content */}
      <div
        ref={parallaxBoxRef}
        className="relative text-center px-6 max-w-5xl mx-auto glass p-12 shadow-2xl pointer-events-none"
        style={{ zIndex: 10, background: "rgba(255, 255, 255, 0.05)", transformStyle: "preserve-3d" }}
      >
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="mb-6 flex items-center justify-center gap-3"
          style={{ opacity: 0 }}
        >
          <div className="h-px w-12 bg-accent-primary/60" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            Available for opportunities
          </span>
          <div className="h-px w-12 bg-accent-primary/60" />
        </div>

        {/* Main H1 */}
        <h1
          ref={headlineRef}
          className="font-display font-bold text-brand-white mb-4"
          style={{
            fontSize: "clamp(42px, 8vw, 96px)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
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
          <span className="font-mono text-base text-accent-primary tracking-wider font-medium">
            {displayText}
            <span className="blink-cursor ml-0.5">█</span>
          </span>
        </div>

        {/* CTA Row */}
        <div
          ref={ctaRef}
          className="flex items-center justify-center gap-4 flex-wrap pointer-events-auto"
          style={{ opacity: 0 }}
        >
          <MagneticButton>
            <a
              href={siteConfig.resumeUrl}
              download
              id="hero-download-resume"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-mono text-sm font-semibold uppercase tracking-widest btn-liquid btn-liquid-filled text-brand-white hover:-translate-y-1 transition-all duration-300 pointer-events-auto"
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
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-mono text-sm uppercase tracking-widest btn-liquid text-brand-white transition-all duration-300 pointer-events-auto"
            >
              Let&apos;s Connect
            </a>
          </MagneticButton>
        </div>


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
        <span className="font-mono text-xs tracking-[0.3em] text-brand-white/40">
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
    </>
  );
}
