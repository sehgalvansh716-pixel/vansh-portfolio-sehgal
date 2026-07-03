"use client";

import Spline from "@splinetool/react-spline";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

interface Scene3DProps {
  onLoad?: () => void;
}

export default function Scene3D({ onLoad }: Scene3DProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Use the new light theme URL for light mode, and the old one for dark mode
  const splineUrl = resolvedTheme === "light"
    ? "https://prod.spline.design/AIxCbBhMOcGcGWfi/scene.splinecode?v=1"
    : "https://prod.spline.design/dkOIG6QkkWhpsDWl/scene.splinecode?v=2";

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto opacity-90 overflow-hidden flex items-center justify-center">
      {mounted && isMobile ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover mix-blend-screen dark:mix-blend-normal opacity-80"
          onLoadedData={() => {
            if (onLoad) onLoad();
          }}
        >
          <source src="/videos/mobile-hero.mp4" type="video/mp4" />
        </video>
      ) : mounted ? (
        <Spline 
          scene={splineUrl} 
          style={{ width: '100%', height: '100%' }}
          onLoad={onLoad}
        />
      ) : null}
    </div>
  );
}
