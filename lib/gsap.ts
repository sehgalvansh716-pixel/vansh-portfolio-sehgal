"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable);

export { gsap, ScrollTrigger, SplitText, Draggable };
