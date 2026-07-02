"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), { ssr: false });
const SmoothScroller = dynamic(() => import("@/components/ui/SmoothScroller"), { ssr: false });

export function ClientOnlyWrappers() {
  return (
    <>
      <CustomCursor />
      <SmoothScroller />
    </>
  );
}
