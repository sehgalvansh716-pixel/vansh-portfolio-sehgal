"use client";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  glow?: boolean;
};

export default function GlassCard({ children, className = "", glow = false }: Props) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl p-6",
        "bg-white/[0.03] backdrop-blur-md",
        "border border-white/10",
        "transition-all duration-300 ease-out",
        "hover:border-white/20 hover:bg-white/[0.06]",
        "hover:-translate-y-1",
        glow ? "animate-pulse-glow" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Glow gradient overlay */}
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-primary/40 to-transparent"
        />
      )}
      {children}
    </div>
  );
}
