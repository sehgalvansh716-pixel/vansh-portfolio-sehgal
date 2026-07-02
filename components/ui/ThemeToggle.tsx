"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-btn-teal-bg/10 backdrop-blur-md border border-btn-teal-border/30" />;
  }

  const handleToggle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={`Toggle Theme. Current: ${theme}`}
      title={`Current Theme: ${theme}`}
      className="flex items-center justify-center w-9 h-9 rounded-full bg-btn-teal-bg/10 backdrop-blur-md border border-btn-teal-border/30 border-t-btn-teal-top/40 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_3px_rgb(var(--btn-teal-top)/0.2),inset_0_-1px_4px_rgba(0,0,0,0.2)] text-brand-white hover:bg-btn-teal-bg/20 hover:border-btn-teal-border/50 hover:shadow-[0_6px_15px_rgba(0,0,0,0.15),inset_0_1px_3px_rgb(var(--btn-teal-top)/0.4)] transition-all duration-300"
    >
      {theme === "light" && <Sun size={18} className="animate-in spin-in-180 duration-500" />}
      {theme === "dark" && <Moon size={18} className="animate-in spin-in-180 duration-500" />}
      {theme === "system" && <Monitor size={18} className="animate-in zoom-in-50 duration-500" />}
    </button>
  );
}
