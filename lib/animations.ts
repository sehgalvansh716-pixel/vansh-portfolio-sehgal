"use client";
import { gsap, ScrollTrigger, SplitText } from "./gsap";

/**
 * Animates an H1's characters with a cinematic entry.
 * Uses SplitText to break the heading into individual chars.
 */
export function heroHelineReveal(el: HTMLElement, delay = 0.3) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    gsap.set(el, { opacity: 1 });
    return null;
  }
  const split = new SplitText(el, { type: "chars,words" });
  const tl = gsap.timeline({ delay });
  tl.from(split.chars, {
    y: 120,
    opacity: 0,
    rotateX: -90,
    stagger: 0.04,
    duration: 0.8,
    ease: "back.out(1.7)",
    transformOrigin: "0% 50% -50px",
  });
  return { tl, split };
}

/**
 * Reveals section <h2> titles word by word on scroll entry.
 */
export function sectionHeadingReveal(el: HTMLElement, triggerEl?: Element) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const split = new SplitText(el, { type: "words,lines" });
  gsap.fromTo(
    split.words,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.06,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: triggerEl || el,
        start: "top 80%",
        once: true,
      },
    }
  );
}

/**
 * Scroll-scrub character reveal — creates "scroll to read" typewriter feel.
 */
export function bodyTextScrubReveal(el: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const split = new SplitText(el, { type: "chars" });
  gsap.fromTo(
    split.chars,
    { opacity: 0 },
    {
      opacity: 1,
      stagger: 0.008,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        end: "bottom 55%",
        scrub: 1,
      },
    }
  );
}

/**
 * Stagger fade-up for lists of elements (pills, cards, etc.)
 */
export function staggerFadeUp(
  els: Element[],
  triggerEl: Element,
  options?: { y?: number; stagger?: number; delay?: number }
) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  gsap.fromTo(
    els,
    { y: options?.y ?? 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: options?.stagger ?? 0.05,
      duration: 0.65,
      ease: "power3.out",
      delay: options?.delay ?? 0,
      scrollTrigger: {
        trigger: triggerEl,
        start: "top 82%",
        once: true,
      },
    }
  );
}

/**
 * Animate a number counter from 0 to target on scroll entry.
 */
export function countUpAnimation(el: HTMLElement, target: number, suffix = "", triggerEl?: Element) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    el.textContent = target + suffix;
    return;
  }

  // Initialize text content so it's not blank before trigger
  el.textContent = "0" + suffix;

  // Use a proxy object for GSAP to animate safely without reading the DOM string
  const obj = { val: 0 };
  gsap.fromTo(
    obj,
    { val: 0 },
    {
      val: target,
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = Math.round(obj.val) + suffix;
      },
      scrollTrigger: {
        trigger: triggerEl || el,
        start: "top 95%",
        once: true,
      },
    }
  );
}

/**
 * Slide-in from left or right — used for alternating timeline cards.
 */
export function slideInFrom(el: HTMLElement, direction: "left" | "right") {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  gsap.fromTo(
    el,
    { x: direction === "left" ? -60 : 60, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        once: true,
      },
    }
  );
}

/**
 * Hero-to-About transition: scales down and fades hero headline as user scrolls.
 */
export function heroParallaxOut(el: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  gsap.to(el, {
    scale: 0.75,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  });
}

/**
 * Progress bar animate from 0 to target width on scroll.
 */
export function progressBarReveal(el: HTMLElement, targetWidth: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    gsap.set(el, { width: targetWidth });
    return;
  }

  gsap.fromTo(
    el,
    { width: "0%" },
    {
      width: targetWidth,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    }
  );
}

export { gsap, ScrollTrigger, SplitText };
