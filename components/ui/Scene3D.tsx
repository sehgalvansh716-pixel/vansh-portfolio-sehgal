"use client";

import Spline from "@splinetool/react-spline";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface Scene3DProps {
  onLoad?: () => void;
}

export default function Scene3D({ onLoad }: Scene3DProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use the new light theme URL for light mode, and the old one for dark mode
  const splineUrl = resolvedTheme === "light"
    ? "https://prod.spline.design/AIxCbBhMOcGcGWfi/scene.splinecode?v=1"
    : "https://prod.spline.design/dkOIG6QkkWhpsDWl/scene.splinecode?v=2";

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto opacity-90 overflow-hidden">
      {mounted && (
        <Spline 
          scene={splineUrl} 
          style={{ width: '100%', height: '100%' }}
          onLoad={onLoad}
        />
      )}
    </div>
  );
}
