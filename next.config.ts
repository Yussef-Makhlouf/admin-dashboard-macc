import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/admin',
  assetPrefix: '/admin',
  images: {
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
