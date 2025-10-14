import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better mobile performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Optimize images for mobile
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Enable compression
  compress: true,
  
  // Optimize for mobile-first
  poweredByHeader: false,
  
  // Enable static optimization
  trailingSlash: false,

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;