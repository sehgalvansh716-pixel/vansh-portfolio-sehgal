"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects, type Project } from "@/data/projects.data";

const categories = ["All", "Projects", "Training", "Tools"] as const;
type Category = (typeof categories)[number];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<Category>("All");

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter(
          (p) => p.category.toLowerCase() === activeFilter.toLowerCase()
        );

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll("[data-project-card]");
      if (cards.length === 0) return;
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 95%",
            once: true,
          },
        }
      );
    }
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, [filtered]);

  // Animate filter change
  const handleFilter = (cat: Category) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && gridRef.current) {
      const cards = gridRef.current.querySelectorAll("[data-project-card]");
      gsap.to(cards, {
        scale: 0.95,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setActiveFilter(cat);
          setTimeout(() => {
            const newCards = gridRef.current?.querySelectorAll("[data-project-card]");
            if (newCards) {
              gsap.from(newCards, {
                y: 20,
                opacity: 0,
                stagger: 0.08,
                duration: 0.4,
                ease: "power2.out",
              });
            }
          }, 50);
        },
      });
    } else {
      setActiveFilter(cat);
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-label="Projects and Portfolio"
      className="relative py-28 px-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 70% 50%, var(--glass-border) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-accent-primary/60" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            04 — Projects
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <h2
            className="font-display font-bold"
            style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            Selected
            <br />
            <span className="gradient-text">work.</span>
          </h2>

          {/* Filter tabs */}
          <div role="tablist" aria-label="Filter projects by category" className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeFilter === cat}
                onClick={() => handleFilter(cat)}
                className={[
                  "font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-300",
                  activeFilter === cat
                    ? "bg-accent-primary text-white border-accent-primary shadow-lg"
                    : "glass text-muted hover:border-accent-primary/40 hover:text-accent-primary",
                ].join(" ")}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stacking Cards */}
        <div
          ref={gridRef}
          className="flex flex-col gap-6"
        >
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} total={filtered.length} tall={i % 3 === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, tall, index, total }: { project: Project; tall: boolean; index: number; total: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);



  const isAI = project.title.toLowerCase().includes("ai");
  let imageOpacityClasses = "";
  if (isAI) {
    // AI card: full opacity in both dark and light mode
    imageOpacityClasses = "opacity-100 group-hover:opacity-100";
  } else {
    // Standard cards: full opacity
    imageOpacityClasses = "opacity-100 group-hover:opacity-100";
  }

  return (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      ref={cardRef}
      data-project-card
      className="relative overflow-hidden rounded-2xl group cursor-pointer block glass transition-all duration-300 hover:shadow-xl sticky"
      style={{
        minHeight: tall ? "480px" : "380px",
        willChange: "transform",
        textDecoration: "none",
        top: `calc(10vh + ${index * 30}px)`,
        zIndex: index + 1,
        transform: `scale(${1 - (total - index - 1) * 0.02})`, // Optional slight scale down for depth
      }}
    >
      {/* Background Document Preview */}
      {project.liveUrl.startsWith("/images/") && (
        <div className="absolute inset-0 z-0">
          <Image
            src={project.liveUrl}
            alt={`${project.title} preview`}
            fill
            className={`object-cover object-top blur-sm group-hover:blur-none grayscale transition-all duration-700 ${imageOpacityClasses}`}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, var(--brand-black) 30%, ${project.coverColor}88 65%, transparent 100%)`,
        }}
      />

      {/* Shimmer top edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)" }}
      />

      {/* View arrow — top right */}
      <div
        data-view-arrow
        aria-hidden="true"
        className="absolute top-6 right-6 font-mono text-xs uppercase tracking-widest text-accent-primary opacity-0 -translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
      >
        → VIEW
      </div>

      {/* Category badge */}
      <div className="absolute top-6 left-6">
        <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20 backdrop-blur-md">
          {project.category}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 p-7 z-10">
        <h3
          className="font-display font-bold text-brand-white mb-2"
          style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
        >
          {project.title}
        </h3>
        <p className="font-body text-brand-white/80 text-sm mb-4 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white/5 text-brand-white/70 border border-brand-white/10 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
