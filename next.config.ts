import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (smallest), fall back to WebP, then original format
    formats: ["image/avif", "image/webp"],
    // Declare allowed quality values (used by next/image quality prop)
    qualities: [75, 80, 85, 90],
    remotePatterns: [],
  },
};

export default nextConfig;
