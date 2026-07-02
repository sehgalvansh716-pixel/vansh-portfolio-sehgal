"use client";
import { useState, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import { siteConfig } from "@/data/site.config";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const header = document.querySelector("[data-nav-item]") as HTMLElement;
    if (!header) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      header.style.opacity = "1";
      return;
    }
    // Use fromTo so header is never permanently stuck invisible
    gsap.fromTo(
      header,
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.15 }
    );
  }, []);

  // Drawer animation
  useEffect(() => {
    const drawer = document.querySelector("[data-mobile-menu]") as HTMLElement;
    if (!drawer) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (menuOpen) {
      drawer.style.display = "flex";
      if (!reduced) gsap.from(drawer, { x: "100%", duration: 0.4, ease: "power3.out" });
    } else {
      if (!reduced) {
        gsap.to(drawer, {
          x: "100%",
          duration: 0.35,
          ease: "power3.in",
          onComplete: () => { drawer.style.display = "none"; },
        });
      } else {
        drawer.style.display = "none";
      }
    }
  }, [menuOpen]);

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <header
        data-nav-item
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "py-3 bg-brand-black/80 backdrop-blur-xl"
            : "py-6 bg-transparent",
        ].join(" ")}
      >
        <nav
          aria-label="Main navigation"
          className="max-w-7xl mx-auto px-6 flex items-center justify-between"
        >
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => smoothScroll(e, "#hero")}
            className="font-display font-bold text-lg text-brand-white tracking-tight"
            aria-label="Vansh Sehgal — Back to top"
          >
            <span className="text-accent-primary">V</span>S
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-2" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => smoothScroll(e, link.href)}
                  className="font-mono text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full bg-[#042f2e]/10 backdrop-blur-md border border-[#0d9488]/30 border-t-[#2dd4bf]/40 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_3px_rgba(45,212,191,0.2),inset_0_-1px_4px_rgba(0,0,0,0.2)] text-brand-white hover:bg-[#042f2e]/20 hover:border-[#0d9488]/50 hover:shadow-[0_6px_15px_rgba(0,0,0,0.15),inset_0_1px_3px_rgba(45,212,191,0.4)] hover:text-accent-primary transition-all duration-300 inline-block"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <MagneticButton className="hidden md:block">
              <a
                href={siteConfig.resumeUrl}
                download
                className="font-mono text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full bg-[#042f2e]/10 backdrop-blur-md border border-[#0d9488]/30 border-t-[#2dd4bf]/40 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_3px_rgba(45,212,191,0.2),inset_0_-1px_4px_rgba(0,0,0,0.2)] text-brand-white hover:bg-[#042f2e]/20 hover:border-[#0d9488]/50 hover:shadow-[0_6px_15px_rgba(0,0,0,0.15),inset_0_1px_3px_rgba(45,212,191,0.4)] transition-all duration-300"
              >
                Resume
              </a>
            </MagneticButton>

            <button
              className="md:hidden text-brand-white p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <div
        data-mobile-menu
        aria-label="Mobile navigation"
        style={{ display: "none" }}
        className="fixed inset-y-0 right-0 w-full max-w-xs bg-surface border-l border-white/10 z-[60] flex-col p-8 pt-24"
      >
        <button
          className="absolute top-6 right-6 text-brand-white"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
        <ul className="flex flex-col gap-3" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => smoothScroll(e, link.href)}
                className="font-mono text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded-full bg-[#042f2e]/10 backdrop-blur-md border border-[#0d9488]/30 border-t-[#2dd4bf]/40 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_3px_rgba(45,212,191,0.2),inset_0_-1px_4px_rgba(0,0,0,0.2)] text-brand-white hover:bg-[#042f2e]/20 hover:border-[#0d9488]/50 hover:shadow-[0_6px_15px_rgba(0,0,0,0.15),inset_0_1px_3px_rgba(45,212,191,0.4)] hover:text-accent-primary transition-all duration-300 block text-center"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-4">
            <a
              href={siteConfig.resumeUrl}
              download
              className="font-mono text-xs uppercase tracking-widest px-5 py-3 rounded-full border border-accent-primary/40 text-accent-primary hover:bg-accent-primary hover:text-brand-black transition-all duration-300 inline-block"
            >
              Download Resume
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
