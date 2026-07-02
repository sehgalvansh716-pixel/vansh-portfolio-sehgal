"use client";

import { useEffect, useRef, useMemo } from "react";
import { gsap } from "@/lib/gsap";

export default function ConstellationDivider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const webRef = useRef<SVGGElement>(null);
  const nodesRef = useRef<SVGGElement>(null);
  const nebulaRef = useRef<SVGEllipseElement>(null);

  // Deterministic generation of 100 constellation nodes using a Lissajous curve / spiral
  const constellationData = useMemo(() => {
    const nodes = [];
    const lines = [];
    const numNodes = 80;
    
    for (let i = 0; i < numNodes; i++) {
      const t = i * 0.2;
      const x = parseFloat((500 + 450 * Math.sin(3 * t) * Math.cos(t)).toFixed(2));
      const y = parseFloat((150 + 120 * Math.sin(2 * t)).toFixed(2));
      const radius = i % 5 === 0 ? 4 : (i % 3 === 0 ? 2 : 1);
      const isPrimary = i % 5 === 0;
      
      nodes.push({ id: i, x, y, radius, isPrimary });
      
      // Connect to previous 2 nodes to create a dense web
      if (i > 0) lines.push({ x1: x, y1: y, x2: nodes[i - 1].x, y2: nodes[i - 1].y, opacity: 0.5 });
      if (i > 2) lines.push({ x1: x, y1: y, x2: nodes[i - 3].x, y2: nodes[i - 3].y, opacity: 0.2 });
      if (i > 8 && i % 4 === 0) lines.push({ x1: x, y1: y, x2: nodes[i - 8].x, y2: nodes[i - 8].y, opacity: 0.1 });
    }
    
    return { nodes, lines };
  }, []);

  useEffect(() => {
    if (!webRef.current || !nodesRef.current || !nebulaRef.current) return;

    // Reset lines
    Array.from(webRef.current.children).forEach((line) => {
      const length = (line as SVGLineElement).getTotalLength?.() || 200;
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
    });

    // Reset nodes
    gsap.set(nodesRef.current.children, { scale: 0, transformOrigin: "center center", opacity: 0 });
    
    // Reset nebula
    gsap.set(nebulaRef.current, { scale: 0.5, opacity: 0, transformOrigin: "center center" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
        end: "bottom 30%",
        scrub: 1.5,
      },
    });

    // Animate nebula, then nodes popping in, then lines connecting them
    tl.to(nebulaRef.current, { scale: 1, opacity: 0.8, duration: 1, ease: "power2.out" })
      .to(nodesRef.current.children, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.02, ease: "back.out(2)" }, "-=0.5")
      .to(webRef.current.children, { strokeDashoffset: 0, opacity: (i, target) => target.getAttribute('stroke-opacity') || 0.5, duration: 1.5, stagger: 0.01, ease: "power2.inOut" }, "-=0.8");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-64 md:h-96 flex justify-center items-center my-12 overflow-hidden">
      <svg 
        viewBox="0 0 1000 300" 
        className="w-full max-w-5xl h-full drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        fill="none" 
      >
        <defs>
          <radialGradient id="nebulaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(var(--btn-indigo-border))" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Deep Space Nebula */}
        <ellipse ref={nebulaRef} cx="500" cy="150" rx="400" ry="150" fill="url(#nebulaGrad)" filter="url(#nodeGlow)" />

        {/* Dense Web Connections */}
        <g ref={webRef} stroke="var(--brand-white)" strokeWidth="0.5">
          {constellationData.lines.map((line, i) => (
            <line 
              key={`line-${i}`} 
              x1={line.x1} y1={line.y1} 
              x2={line.x2} y2={line.y2} 
              strokeOpacity={line.opacity} 
            />
          ))}
        </g>
        
        {/* Constellation Nodes */}
        <g ref={nodesRef}>
          {constellationData.nodes.map((node, i) => (
            <g key={`node-${i}`}>
              <circle 
                cx={node.x} cy={node.y} 
                r={node.radius} 
                fill={node.isPrimary ? "var(--accent-primary)" : "var(--brand-white)"} 
                filter={node.isPrimary ? "url(#nodeGlow)" : "none"}
                className={node.isPrimary ? "animate-pulse" : ""}
              />
              {node.isPrimary && (
                <circle cx={node.x} cy={node.y} r={node.radius / 2} fill="#ffffff" />
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
