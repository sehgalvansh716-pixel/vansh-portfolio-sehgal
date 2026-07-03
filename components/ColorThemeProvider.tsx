"use client";

import { useEffect } from "react";

// This script runs synchronously before React hydration to prevent color flashing (FOUC).
const ThemeScript = `
  (function() {
    try {
      var themes = ["theme-blue", "theme-emerald", "theme-purple"];
      var randomTheme = themes[Math.floor(Math.random() * themes.length)];
      if (randomTheme !== "theme-blue") {
        document.documentElement.classList.add(randomTheme);
      }
    } catch (e) {}
  })();
`;

export default function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  // No localStorage needed anymore since it's truly random per refresh
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ThemeScript }} />
      {children}
    </>
  );
}
