import type { NextConfig } from "next";

/**
 * MarketVerse — Next.js configuration
 * - Transpiles Three.js packages for proper tree-shaking
 * - Sets up image domains for external product images
 * - Strict mode for React 19 concurrency
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Transpile Three.js so webpack can handle ESM modules correctly
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/v1/:path*`, // Proxy to Backend
      },
    ];
  },
  // Silence the "punycode" deprecation from webpack internals
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
