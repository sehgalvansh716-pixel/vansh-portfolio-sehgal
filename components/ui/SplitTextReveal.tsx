"use client";
import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

type Props = {
  children: string;
  type?: "chars" | "words" | "lines";
  delay?: number;
  stagger?: number;
  from?: gsap.TweenVars;
  className?: string;
  as?: React.ElementType;
};

export default function SplitTextReveal({
  children,
  type = "words",
  delay = 0,
  stagger = 0.05,
  from = { y: 40, opacity: 0 },
  className = "",
  as: Tag = "span",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const split = new SplitText(el, { type });
    const targets =
      type === "chars"
        ? split.chars
        : type === "lines"
        ? split.lines
        : split.words;

    const anim = gsap.from(targets, {
      ...from,
      stagger,
      duration: 0.7,
      ease: "power3.out",
      delay,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });

    return () => {
      anim.kill();
      split.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [type, delay, stagger, from]);

  return (
    // @ts-expect-error — dynamic tag
    <Tag ref={ref} className={`overflow-hidden ${className}`}>
      {children}
    </Tag>
  );
}
