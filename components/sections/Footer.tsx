"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { siteConfig } from "@/data/site.config";
import { Linkedin, Mail, Phone, ArrowUp } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ctrlRef = useRef({ x: 720, y: 60 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    // GSAP quickTo for control point
    const xTo = gsap.quickTo(ctrlRef.current, "x", { duration: 0.15, ease: "power2.out" });
    const yTo = gsap.quickTo(ctrlRef.current, "y", { duration: 0.15, ease: "power2.out" });

    const updatePath = () => {
      const { x, y } = ctrlRef.current;
      path.setAttribute("d", `M 0 60 Q ${x} ${y} 1440 60`);
    };

    const animate = () => {
      updatePath();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const onMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (1440 / rect.width);
      const my = (e.clientY - rect.top) * (120 / rect.height);
      xTo(mx);
      yTo(my);
    };

    const onLeave = () => {
      gsap.to(ctrlRef.current, {
        x: 720,
        y: 60,
        duration: 1.2,
        ease: "elastic.out(1, 0.4)",
      });
    };

    const playTone = () => {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 220 + Math.random() * 440;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch { /* AudioContext blocked or not supported */ }
    };

    svg.addEventListener("mousemove", onMove);
    svg.addEventListener("mouseleave", onLeave);
    svg.addEventListener("mousedown", playTone);

    return () => {
      cancelAnimationFrame(rafRef.current);
      svg.removeEventListener("mousemove", onMove);
      svg.removeEventListener("mouseleave", onLeave);
      svg.removeEventListener("mousedown", playTone);
    };
  }, []);

  const scrollToTop = () => {
    document.querySelector("#hero")?.scrollIntoView({ behavior: "smooth" });
  };

  const smoothNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer aria-label="Site footer" className="relative pt-20 pb-10 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Left: Name + tagline */}
          <div>
            <p className="font-display font-bold text-2xl text-brand-white mb-2">
              <span className="text-accent-primary">V</span>ansh Sehgal
            </p>
            <p className="font-body text-muted text-sm leading-relaxed max-w-xs">
              Business Operations & Data Analyst.<br />
              AI-augmented. Data-driven. Delhi, India.
            </p>
          </div>

          {/* Center: Nav */}
          <nav aria-label="Footer navigation">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-5">Navigation</p>
            <ul className="space-y-3" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => smoothNav(e, link.href)}
                    className="font-body text-brand-white/50 text-sm hover:text-accent-primary transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Socials + back to top */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-5">Connect</p>
              <div className="flex gap-4">
                <SocialIcon
                  href={siteConfig.linkedin}
                  label="LinkedIn profile"
                  icon={<Linkedin size={16} />}
                />
                <SocialIcon
                  href={`mailto:${siteConfig.email}`}
                  label="Send email"
                  icon={<Mail size={16} />}
                />
                <SocialIcon
                  href={`tel:${siteConfig.phone}`}
                  label="Call phone"
                  icon={<Phone size={16} />}
                />
              </div>
            </div>

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="mt-8 md:mt-0 self-start md:self-end w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-brand-white/50 hover:border-accent-primary hover:text-accent-primary transition-all duration-300"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        {/* SVG Wave interaction */}
        <div className="mb-6">
          <p
            aria-hidden="true"
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-white/20 text-center mb-3"
          >
            Dare to touch
          </p>
          <svg
            ref={svgRef}
            viewBox="0 0 1440 120"
            aria-hidden="true"
            data-cursor="wave"
            preserveAspectRatio="none"
            className="w-full cursor-none"
            style={{ height: "60px" }}
          >
            <path
              ref={pathRef}
              d="M 0 60 Q 720 60 1440 60"
              fill="none"
              stroke="rgba(16,185,129,0.35)"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Bottom strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6 border-t border-white/5">
          <p className="font-mono text-[11px] text-brand-white/25 tracking-wider">
            © {currentYear} Vansh Sehgal · Built with Next.js · Deployed on Vercel
          </p>
          <a
            href={siteConfig.resumeUrl}
            download
            className="font-mono text-[10px] uppercase tracking-widest text-accent-primary/50 hover:text-accent-primary transition-colors duration-200"
          >
            Download Resume
          </a>
        </div>
        
        {/* AI Built Badge */}
        <div className="pt-8 pb-4 text-center">
          <p className="font-display font-bold text-lg text-brand-white uppercase tracking-widest opacity-80">
            THIS IS TOTALLY BUILD BY AN AI
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-xl glass flex items-center justify-center text-brand-white/50 hover:text-accent-primary hover:border-accent-primary/40 transition-all duration-300"
    >
      {icon}
    </a>
  );
}
