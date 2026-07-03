/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent SSR errors from Three.js / GSAP browser-only APIs
  experimental: {},
  webpack: (config) => {
    // Fixes for Three.js ESM modules
    config.externals = config.externals || [];
    return config;
  },
  turbopack: {},
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 100],
  },
};

export default nextConfig;
