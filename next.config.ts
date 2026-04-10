import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles output automatically, no need for standalone
  typescript: {
    // Ignore build errors during development, remove in production
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
