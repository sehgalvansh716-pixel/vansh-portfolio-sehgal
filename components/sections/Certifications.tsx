"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { siteConfig } from "@/data/site.config";
import { Award, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Certifications() {
  const certs = siteConfig.certifications;
  const [currentIndex, setCurrentIndex] = useState(Math.floor(certs.length / 2));
  const [selectedCertImage, setSelectedCertImage] = useState<string | null>(null);
  const [slideDirection, setSlideDirection] = useState<number>(0);
  
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Touch state
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Initial reveal animation
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !sectionRef.current) return;
    
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } }
    );
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // To handle wrapping around
  const next = useCallback(() => {
    setSlideDirection(1);
    setCurrentIndex((prev) => (prev + 1) % certs.length);
  }, [certs.length]);

  const prev = useCallback(() => {
    setSlideDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + certs.length) % certs.length);
  }, [certs.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedCertImage) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev, selectedCertImage]);

  // GSAP Animation Engine for Coverflow
  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      let diff = index - currentIndex;
      const half = Math.floor(certs.length / 2);
      if (diff > half) diff -= certs.length;
      if (diff < -half) diff += certs.length;

      const isCenter = diff === 0;

      if (Math.abs(diff) > 2) {
        gsap.to(card, {
          opacity: 0,
          xPercent: diff > 0 ? 100 : -100,
          scale: 0.5,
          zIndex: 0,
          duration: 0.4, // Doubled speed
          ease: "power2.inOut",
          pointerEvents: "none"
        });
        return;
      }

      const targetScale = isCenter ? 1 : Math.abs(diff) === 1 ? 0.75 : 0.55;
      const targetX = diff * 50; 
      const targetZIndex = 10 - Math.abs(diff);
      const targetOpacity = isCenter ? 1 : Math.abs(diff) === 1 ? 0.8 : 0.4;
      const targetBlur = isCenter ? 0 : Math.abs(diff) === 1 ? 4 : 8;
      
      const currentZ = Number(gsap.getProperty(card, "zIndex")) || 0;
      if (targetZIndex < currentZ) {
        gsap.set(card, { zIndex: targetZIndex });
      } else if (targetZIndex > currentZ) {
        gsap.set(card, { zIndex: targetZIndex, delay: 0.15 }); // Scaled delay for 0.4s animation
      }

      // Master motion tween (Translation, Scale, Opacity)
      gsap.to(card, {
        xPercent: targetX,
        scale: targetScale,
        opacity: targetOpacity,
        duration: 0.4, // Doubled speed
        ease: "power2.inOut",
        pointerEvents: isCenter ? "auto" : "auto", 
        overwrite: "auto"
      });

      // Transient Motion Blur Skew & Blur Spike
      if (slideDirection !== 0) {
        const skewAmount = slideDirection * -3;
        
        // Custom Timeline: Spike blur in 0.1s, then take 0.4s to deblur.
        // This starts deblurring exactly 0.3s before the 0.4s slide finishes.
        const tl = gsap.timeline({ overwrite: "auto" });
        tl.to(card, {
          skewX: skewAmount,
          filter: `blur(${targetBlur + 4}px)`, 
          duration: 0.1,
          ease: "power1.out"
        }).to(card, {
          skewX: 0,
          filter: `blur(${targetBlur}px)`,
          duration: 0.4,
          ease: "power2.out"
        });
      } else {
        // Base case when no slide direction (initial load)
        gsap.to(card, {
          skewX: 0,
          filter: `blur(${targetBlur}px)`,
          duration: 0.4,
          ease: "power2.inOut",
          overwrite: "auto"
        });
      }
    });
    
    // Reset slide direction 500ms later (when the deblur timeline finishes)
    const timer = setTimeout(() => setSlideDirection(0), 500);
    return () => clearTimeout(timer);
  }, [currentIndex, certs.length, slideDirection]);

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      next();
    }
    if (isRightSwipe) {
      prev();
    }
    // Reset touch coordinates
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <>
      <section
        id="certifications"
        ref={sectionRef}
        aria-label="Certifications and Achievements"
        className="relative py-28 px-6 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.05) 0%, transparent 60%)",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
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

          {/* Carousel Container */}
          <div 
            className="relative flex items-center justify-center w-full min-h-[400px] h-[50vh] max-h-[700px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            
            {/* Left Button - Hidden on mobile, visible on medium+ */}
            <button
              onClick={prev}
              className="hidden md:flex absolute left-4 md:left-10 z-30 p-4 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 items-center justify-center"
              style={{
                background: "linear-gradient(145deg, rgba(59, 130, 246, 0.25), rgba(255, 255, 255, 0.05))",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 10px rgba(59, 130, 246, 0.2)",
                color: "rgba(255,255,255,0.9)"
              }}
              aria-label="Previous Certificate"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Right Button - Hidden on mobile, visible on medium+ */}
            <button
              onClick={next}
              className="hidden md:flex absolute right-4 md:right-10 z-30 p-4 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 items-center justify-center"
              style={{
                background: "linear-gradient(145deg, rgba(59, 130, 246, 0.25), rgba(255, 255, 255, 0.05))",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 10px rgba(59, 130, 246, 0.2)",
                color: "rgba(255,255,255,0.9)"
              }}
              aria-label="Next Certificate"
            >
              <ChevronRight size={28} />
            </button>

            {/* Cards wrapper */}
            <div className="relative w-full h-full flex items-center justify-center perspective-1000">
              {certs.map((cert, index) => {
                const certWithImage = cert as any;
                // We use opacity 0 initially so GSAP controls their reveal instantly on mount
                return (
                  <div
                    key={cert.name + index}
                    ref={(el) => { cardsRef.current[index] = el; }}
                    className="absolute w-[85vw] sm:w-[65vw] md:w-[50vw] lg:w-[45vw] xl:w-[40vw] max-w-[800px] aspect-[1.414/1] cursor-pointer group"
                    style={{ willChange: "transform, opacity, filter, z-index" }}
                    onClick={() => {
                      if (index === currentIndex && certWithImage.image) {
                        setSelectedCertImage(certWithImage.image);
                      } else {
                        // Click a side card to slide to it
                        setSlideDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                      }
                    }}
                  >
                    {/* Card Content */}
                    <div className="w-full h-full rounded-2xl md:rounded-3xl overflow-hidden premium-glass flex flex-col border border-white/10 shadow-2xl bg-black/40 backdrop-blur-md transition-shadow duration-300 group-hover:shadow-accent-primary/20">
                      
                      {/* Image Area */}
                      <div 
                        className="relative w-full h-full overflow-hidden bg-black" 
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        {certWithImage.image ? (
                          <>
                            <Image
                              src={certWithImage.image}
                              alt={`${cert.name} certificate`}
                              fill
                              className="object-cover object-center pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 60vw"
                              draggable={false}
                            />
                            {/* Center hover indicator */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/20">
                              <div className="bg-black/40 backdrop-blur-md p-4 rounded-full border border-white/20 text-white shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                <Maximize2 size={28} />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900/50">
                            <Award size={60} className="text-accent-primary opacity-50" />
                          </div>
                        )}
                      </div>
                      
                      {/* Floating Text Badge */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[450px] p-3 rounded-2xl bg-btn-teal-bg/10 backdrop-blur-md border border-btn-teal-border/30 border-t-btn-teal-top/40 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_3px_rgb(var(--btn-teal-top)/0.2),inset_0_-1px_4px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center pointer-events-none z-20 transition-all duration-300">
                        <h3 className="font-display font-semibold text-brand-white text-sm md:text-base leading-tight line-clamp-1 drop-shadow-md text-center">
                          {cert.name}
                        </h3>
                        <div className="flex items-center justify-center mt-1.5 gap-2">
                          <span className="font-body text-muted text-xs md:text-sm truncate drop-shadow-sm text-center">
                            {cert.issuer}
                          </span>
                          <span className="font-mono text-[9px] md:text-[10px] text-brand-white shrink-0 border border-btn-teal-border/50 px-2 py-0.5 rounded-full bg-btn-teal-bg/20 shadow-sm">
                            {cert.year}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Certificate Modal */}
      {selectedCertImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-xl transition-opacity"
          onClick={() => setSelectedCertImage(null)}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div 
            className="relative max-w-6xl max-h-[95vh] w-full h-full rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Transparent overlay over image to block drag/right-click */}
            <div 
              className="absolute inset-0 z-10 bg-transparent cursor-zoom-out" 
              onClick={() => setSelectedCertImage(null)}
            />
            
            <Image
              src={selectedCertImage}
              alt="Certificate Full View"
              fill
              className="object-contain select-none pointer-events-none"
              sizes="100vw"
              draggable={false}
              priority
            />

            <button
              onClick={() => setSelectedCertImage(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-20 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-md transition-all duration-300 border border-white/20 shadow-xl hover:scale-110 active:scale-95"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

