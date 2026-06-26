"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Suspense, useEffect, useState } from "react";
import { useTheme } from "next-themes";

function VortexParticles({ distortionRef }: { distortionRef: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  const COUNT = 1800;

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT;
      const angle = t * Math.PI * 36;
      const radius = 0.3 + t * 3;
      const spread = (Math.random() - 0.5) * 0.6;
      arr[i * 3]     = Math.cos(angle) * radius + spread;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
      arr[i * 3 + 2] = Math.sin(angle) * radius + spread;
    }
    return arr;
  }, []);

  const basePositions = useMemo(() => positions.slice(), [positions]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;
    const distortion = distortionRef.current;
    const t = timeRef.current;

    for (let i = 0; i < COUNT; i++) {
      const x = basePositions[i * 3];
      const y = basePositions[i * 3 + 1];
      const z = basePositions[i * 3 + 2];

      if (distortion > 0.01) {
        const noise = Math.sin(x * 3.0 + t) * Math.cos(y * 2.0 + t);
        const dir = new THREE.Vector3(x, y, z).normalize();
        pos[i * 3]     = x + dir.x * noise * distortion * 0.8;
        pos[i * 3 + 1] = y + dir.y * noise * distortion * 0.8;
        pos[i * 3 + 2] = z + dir.z * noise * distortion * 0.8;
      } else {
        pos[i * 3]     = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
      }
    }

    geo.attributes.position.needsUpdate = true;

    // Slow vortex rotation
    pointsRef.current.rotation.y += 0.0008;
  });

  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={isLight ? "#059669" : "#10B981"}
        size={isLight ? 0.025 : 0.018}
        sizeAttenuation
        transparent
        opacity={isLight ? 0.7 : 0.55}
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}

type Props = {
  distortionRef: React.MutableRefObject<number>;
};

export default function HeroCanvas({ distortionRef }: Props) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <VortexParticles distortionRef={distortionRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
