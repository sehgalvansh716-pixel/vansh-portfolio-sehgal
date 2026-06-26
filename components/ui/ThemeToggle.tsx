"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-[#042f2e]/10 backdrop-blur-md border border-[#0d9488]/30" />;
  }

  const isLight = theme === "light";

  return (
    <button
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label="Toggle Theme"
      className="flex items-center justify-center w-9 h-9 rounded-full bg-[#042f2e]/10 backdrop-blur-md border border-[#0d9488]/30 border-t-[#2dd4bf]/40 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_3px_rgba(45,212,191,0.2),inset_0_-1px_4px_rgba(0,0,0,0.2)] text-brand-white hover:bg-[#042f2e]/20 hover:border-[#0d9488]/50 hover:shadow-[0_6px_15px_rgba(0,0,0,0.15),inset_0_1px_3px_rgba(45,212,191,0.4)] transition-all duration-300"
    >
      {isLight ? (
        <Sun size={18} className="animate-in spin-in-180 duration-500" />
      ) : (
        <Moon size={18} className="animate-in spin-in-180 duration-500" />
      )}
    </button>
  );
}
