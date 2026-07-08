"use client";
import { useState, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import { siteConfig } from "@/data/site.config";
import { Menu, X, Download } from "lucide-react";
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
  const [resumeOpen, setResumeOpen] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setResumeOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPreloaderComplete = () => {
      const header = document.querySelector("[data-nav-item]") as HTMLElement;
      if (!header) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        header.style.opacity = "1";
        return;
      }
      const tl = gsap.timeline();
      tl.fromTo(
        header,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.15 }
      );

      const links = header.querySelectorAll("[data-nav-anim]");
      if (links.length) {
        tl.fromTo(
          links,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" },
          "-=0.4"
        );
      }
    };

    window.addEventListener("preloaderComplete", onPreloaderComplete);
    return () => window.removeEventListener("preloaderComplete", onPreloaderComplete);
  }, []);

  // Body scroll lock and focus trap for mobile menu
  useEffect(() => {
    const mainContent = document.querySelector("main");
    const footer = document.querySelector("footer");

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      if (mainContent) mainContent.setAttribute("inert", "true");
      if (footer) footer.setAttribute("inert", "true");
    } else {
      document.body.style.overflow = "";
      if (mainContent) mainContent.removeAttribute("inert");
      if (footer) footer.removeAttribute("inert");
    }
    return () => {
      document.body.style.overflow = "";
      if (mainContent) mainContent.removeAttribute("inert");
      if (footer) footer.removeAttribute("inert");
    };
  }, [menuOpen]);

  // Mobile menu stagger animation
  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        "[data-mobile-link]",
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.5)", delay: 0.2 }
      );
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
            ? "py-3 bg-brand-black/50 backdrop-blur-md border-b border-white/10 shadow-sm"
            : "py-6 bg-transparent",
        ].join(" ")}
      >
        <nav
          suppressHydrationWarning
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
          <ul suppressHydrationWarning className="hidden md:flex items-center gap-2" role="list">
            {navLinks.map((link) => (
              <li key={link.href} data-nav-anim>
                <a
                  href={link.href}
                  onClick={(e) => smoothScroll(e, link.href)}
                  className="font-mono text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full premium-glass text-brand-white hover:text-accent-primary transition-all duration-[600ms] inline-block"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div data-nav-anim>
              <MagneticButton className="hidden md:block">
                <a
                  href="#contact"
                  onClick={(e) => smoothScroll(e, "#contact")}
                  className="font-mono text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full bg-btn-indigo-bg/10 backdrop-blur-md border border-btn-indigo-border/30 border-t-btn-indigo-top/40 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_3px_rgb(var(--btn-indigo-top)/0.2),inset_0_-1px_4px_rgba(0,0,0,0.2)] text-brand-white hover:bg-btn-indigo-bg/20 hover:border-btn-indigo-border/50 hover:shadow-[0_6px_15px_rgba(0,0,0,0.15),inset_0_1px_3px_rgb(var(--btn-indigo-top)/0.4)] transition-all duration-[600ms]"
                >
                  Hire Me
                </a>
              </MagneticButton>
            </div>
            <div data-nav-anim>
              <MagneticButton className="hidden md:block">
                <button
                  onClick={() => setResumeOpen(true)}
                  className="font-mono text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full bg-btn-teal-bg/10 backdrop-blur-md border border-btn-teal-border/30 border-t-btn-teal-top/40 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_3px_rgb(var(--btn-teal-top)/0.2),inset_0_-1px_4px_rgba(0,0,0,0.2)] text-brand-white hover:bg-btn-teal-bg/20 hover:border-btn-teal-border/50 hover:shadow-[0_6px_15px_rgba(0,0,0,0.15),inset_0_1px_3px_rgb(var(--btn-teal-top)/0.4)] transition-all duration-[600ms]"
                >
                  Resume
                </button>
              </MagneticButton>
            </div>

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
        className={`fixed inset-y-0 right-0 w-full max-w-xs bg-brand-black/90 backdrop-blur-xl border-l border-white/10 z-[60] flex flex-col p-8 pt-24 transition-transform duration-400 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-6 right-6 text-brand-white"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
        <ul suppressHydrationWarning className="flex flex-col gap-3" role="list">
          {navLinks.map((link) => (
            <li key={link.href} data-mobile-link>
              <a
                href={link.href}
                onClick={(e) => smoothScroll(e, link.href)}
                className="font-mono text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded-full premium-glass text-brand-white hover:text-accent-primary transition-all duration-[600ms] block text-center"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-4 flex flex-col gap-3" data-mobile-link>
            <a
              href="#contact"
              onClick={(e) => smoothScroll(e, "#contact")}
              className="font-mono text-xs uppercase tracking-widest px-5 py-3 rounded-full bg-accent-primary text-brand-white shadow-md hover:shadow-lg transition-all duration-[600ms] block text-center"
            >
              Hire Me
            </a>
            <a
              href={siteConfig.resumeUrl}
              download
              className="font-mono text-xs uppercase tracking-widest px-5 py-3 rounded-full glass hover:bg-white/10 text-brand-white transition-all duration-[600ms] block text-center"
            >
              Download Resume
            </a>
          </li>
        </ul>
      </div>

      {/* ─── Resume Preview Modal ────────────────────────────── */}
      {resumeOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Resume Preview"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-brand-black/80 backdrop-blur-md"
            onClick={() => setResumeOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Panel */}
          <div className="relative w-full max-w-4xl h-[90svh] premium-glass rounded-3xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
              <div>
                <h2 className="font-display font-bold text-brand-white text-lg">Vansh Sehgal — Resume</h2>
                <p className="font-mono text-xs text-muted uppercase tracking-widest">Preview Only</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={siteConfig.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full premium-glass text-brand-white hover:text-accent-primary transition-all duration-[600ms]"
                >
                  <Download size={13} />
                  Download
                </a>
                <button
                  onClick={() => setResumeOpen(false)}
                  aria-label="Close resume preview"
                  className="p-2 rounded-full premium-glass text-brand-white hover:text-accent-primary transition-all duration-[600ms]"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Resume Viewer */}
            <div className="flex-1 relative bg-brand-black flex items-center justify-center">
              {siteConfig.resumeUrl.endsWith('.pdf') ? (
                <iframe
                  src={siteConfig.resumeUrl}
                  className="w-full h-full border-0 absolute inset-0 z-10"
                  title="Vansh Sehgal Resume Preview"
                  aria-label="Resume document preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center z-10">
                  <p className="text-brand-white font-display text-lg mb-2">Resume is in .docx format</p>
                  <p className="text-muted/80 font-mono text-sm max-w-md mb-6">
                    Web browsers cannot preview Microsoft Word documents natively (and online viewers like Google Docs don't work on localhost).
                  </p>
                  <a
                    href={siteConfig.resumeUrl}
                    download
                    className="font-mono text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-full bg-accent-primary text-brand-white hover:bg-accent-primary/80 transition-all"
                  >
                    Download Resume Instead
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
