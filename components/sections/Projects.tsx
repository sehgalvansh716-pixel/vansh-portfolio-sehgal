"use client";
import { useState } from "react";
import Image from "next/image";
import { projects } from "@/data/projects.data";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % projects.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);

  return (
    <section id="projects" aria-label="Projects and Portfolio" className="relative bg-brand-black min-h-[100svh] flex flex-col justify-center py-24 overflow-hidden">
      
      {/* ─── DESKTOP SPLIT-SCREEN CAROUSEL (lg and up) ─── */}
      <div className="hidden lg:grid grid-cols-2 relative w-full max-w-[1600px] mx-auto px-16 xl:px-24">
        
        {/* Left Column: Text & Navigation */}
        <div className="flex flex-col justify-center relative z-10 pr-12">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-px w-8 bg-accent-primary/60" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
              04 — Projects
            </span>
          </div>

          <div className="relative h-[350px] xl:h-[400px] w-full max-w-xl">
            {projects.map((p, index) => (
              <div 
                key={p.id}
                className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-center ${
                  activeIndex === index 
                    ? 'opacity-100 translate-x-0 pointer-events-auto delay-100' 
                    : 'opacity-0 -translate-x-8 pointer-events-none'
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent-primary/80 mb-4 block">
                  {p.category}
                </span>
                <h2 
                  className="font-display font-bold mb-6 text-brand-white" 
                  style={{ fontSize: "clamp(32px, 3.5vw, 56px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
                >
                  {p.title}
                </h2>
                <p className="font-body text-brand-white/70 text-base xl:text-lg mb-8 leading-relaxed">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-10">
                  {p.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full premium-glass text-brand-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div>
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-full premium-glass text-brand-white hover:text-accent-primary transition-all duration-[600ms] group"
                  >
                    View Live Project
                    <ExternalLink size={14} className="group-hover:rotate-45 transition-transform duration-[600ms]" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 mt-8 xl:mt-12">
            <button 
              onClick={handlePrev}
              aria-label="Previous project"
              className="p-4 rounded-full premium-glass text-brand-white hover:text-accent-primary transition-all duration-[600ms] group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={handleNext}
              aria-label="Next project"
              className="p-4 rounded-full premium-glass text-brand-white hover:text-accent-primary transition-all duration-[600ms] group"
            >
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="font-mono text-xs text-brand-white/40 ml-4 tracking-widest">
              {String(activeIndex + 1).padStart(2, '0')} <span className="mx-1">/</span> {String(projects.length).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="flex items-center justify-center relative z-0">
          <div className="w-full aspect-[4/5] xl:aspect-[3/4] max-h-[80vh] relative">
            {projects.map((p, index) => {
              const hasImage = p.liveUrl.startsWith("/images/");
              return (
                <div 
                  key={p.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    activeIndex === index 
                      ? 'opacity-100 scale-100 pointer-events-auto z-10' 
                      : 'opacity-0 scale-95 pointer-events-none z-0'
                  }`}
                >
                  <div className="w-full h-full premium-glass rounded-3xl overflow-hidden relative p-2 shadow-2xl">
                    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-brand-black group">
                      {hasImage ? (
                        <>
                          <Image
                            src={p.liveUrl}
                            alt={p.title}
                            fill
                            className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority={index === 0}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent opacity-60 pointer-events-none" />
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-brand-black relative">
                          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${p.coverColor}22 0%, transparent 70%)` }} />
                          <h3 className="font-display text-4xl font-bold text-brand-white/20 tracking-tighter text-center px-4">
                            {p.title}
                          </h3>
                          <p className="font-mono text-sm text-accent-primary/50 mt-4 uppercase tracking-widest">
                            Preview Unavailable
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── MOBILE CAROUSEL (under lg) ─── */}
      <div className="lg:hidden flex flex-col px-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-accent-primary/60" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            04 — Projects
          </span>
        </div>

        {/* Mobile Image Container */}
        <div className="relative w-full aspect-[4/5] mb-8">
          {projects.map((p, index) => {
            const hasImage = p.liveUrl.startsWith("/images/");
            return (
              <div 
                key={p.id}
                className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  activeIndex === index 
                    ? 'opacity-100 scale-100 pointer-events-auto z-10' 
                    : 'opacity-0 scale-95 pointer-events-none z-0'
                }`}
              >
                <div className="w-full h-full premium-glass rounded-3xl overflow-hidden relative p-2 shadow-2xl">
                  <div className="w-full h-full relative rounded-2xl overflow-hidden bg-brand-black">
                    {hasImage ? (
                      <Image
                        src={p.liveUrl}
                        alt={p.title}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={index === 0}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-brand-black relative">
                        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${p.coverColor}22 0%, transparent 70%)` }} />
                        <h3 className="font-display text-3xl font-bold text-brand-white/20 tracking-tighter text-center px-4">
                          {p.title}
                        </h3>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Text Container */}
        <div className="relative w-full h-[320px]">
          {projects.map((p, index) => (
            <div 
              key={p.id}
              className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
                activeIndex === index 
                  ? 'opacity-100 translate-x-0 pointer-events-auto delay-100' 
                  : 'opacity-0 -translate-x-4 pointer-events-none'
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent-primary/80 mb-3 block">
                {p.category}
              </span>
              <h2 className="font-display font-bold mb-4 text-brand-white text-3xl">
                {p.title}
              </h2>
              <p className="font-body text-brand-white/70 text-base mb-6 leading-relaxed line-clamp-3">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {p.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full premium-glass text-brand-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div>
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 font-mono text-xs font-semibold uppercase tracking-widest px-6 py-3.5 rounded-full premium-glass text-brand-white hover:text-accent-primary transition-all duration-[600ms]"
                >
                  View Live Project
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex items-center justify-between w-full mt-4">
          <button 
            onClick={handlePrev}
            aria-label="Previous project"
            className="p-4 rounded-full premium-glass text-brand-white hover:text-accent-primary transition-all duration-[600ms] active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="font-mono text-xs text-brand-white/40 tracking-widest">
            {String(activeIndex + 1).padStart(2, '0')} <span className="mx-1">/</span> {String(projects.length).padStart(2, '0')}
          </div>

          <button 
            onClick={handleNext}
            aria-label="Next project"
            className="p-4 rounded-full premium-glass text-brand-white hover:text-accent-primary transition-all duration-[600ms] active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </section>
  );
}
