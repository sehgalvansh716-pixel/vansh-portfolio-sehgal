"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { siteConfig } from "@/data/site.config";
import { Award, ExternalLink, CheckCircle, Clock } from "lucide-react";

const certImages: Record<number, string> = {
  0: "/images/certs/deloitte.png",
  2: "/images/certs/google-ai.png",
  3: "/images/certs/hku.png",
  4: "/images/certs/frankfinn.png",
  5: "/images/certs/deo.png",
};

export default function Testimonials() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    cardsRef.current.forEach((card) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 95%", once: true },
        }
      );
    });

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  return (
    <section
      id="testimonials"
      aria-label="Certifications and Achievements"
      className="relative py-28 px-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-accent-primary/60" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            05 — Certifications
          </span>
        </div>

        <h2
          className="font-display font-bold mb-16"
          style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          Verified
          <br />
          <span className="gradient-text">credentials.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.certifications.map((cert, i) => {
            const hasImage = certImages[i] !== undefined;
            const isInProgress = cert.year === "In Progress";
            return (
              <div
                key={cert.name}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-accent-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]"
              >
                {/* Certificate image or gradient header */}
                <div className="relative h-44 overflow-hidden">
                  {hasImage ? (
                    <>
                      <Image
                        src={certImages[i]}
                        alt={`${cert.name} certificate`}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to bottom, transparent 40%, rgba(8,10,9,0.95) 100%)",
                        }}
                      />
                    </>
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(52,211,153,0.04) 50%, rgba(8,10,9,0.8) 100%)`,
                      }}
                    >
                      {/* Decorative certificate pattern */}
                      <div className="relative flex flex-col items-center gap-3 opacity-30">
                        <div className="w-12 h-12 rounded-full border-2 border-accent-primary flex items-center justify-center">
                          <Award size={22} className="text-accent-primary" />
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, k) => (
                            <div key={k} className="w-8 h-0.5 bg-accent-primary rounded-full" />
                          ))}
                        </div>
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, k) => (
                            <div key={k} className="w-5 h-0.5 bg-accent-primary/60 rounded-full" />
                          ))}
                        </div>
                      </div>

                      {/* Issuer badge overlay */}
                      <div className="absolute top-4 left-4">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-accent-primary/60">
                          {cert.issuer.split("·")[0].trim()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={[
                        "flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border",
                        isInProgress
                          ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                          : "bg-accent-primary/15 text-accent-primary border-accent-primary/30",
                      ].join(" ")}
                    >
                      {isInProgress ? (
                        <Clock size={9} aria-hidden="true" />
                      ) : (
                        <CheckCircle size={9} aria-hidden="true" />
                      )}
                      {isInProgress ? "In Progress" : "Verified"}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <h3
                    className="font-display font-semibold text-brand-white leading-snug"
                    style={{ fontSize: "15px" }}
                  >
                    {cert.name}
                  </h3>

                  <p className="font-body text-muted text-xs leading-relaxed flex-1">
                    {cert.issuer}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="font-mono text-xs text-brand-white/40">{cert.year}</span>
                    {cert.link !== "#" ? (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Verify ${cert.name} certificate`}
                        className="flex items-center gap-1.5 font-mono text-xs text-accent-primary hover:text-accent-secondary transition-colors duration-200"
                      >
                        Verify <ExternalLink size={11} aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="font-mono text-xs text-brand-white/20 flex items-center gap-1.5">
                        Credential <Award size={11} aria-hidden="true" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
