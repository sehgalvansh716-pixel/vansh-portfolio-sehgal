"use client";

import dynamic from "next/dynamic";

const SmoothScroller = dynamic(() => import("@/components/ui/SmoothScroller"), { ssr: false });

export function ClientOnlyWrappers() {
  return (
    <>
      <SmoothScroller />
    </>
  );
}
