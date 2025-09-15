import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // next.config.js
  images: {
    domains: ['gateway.pinata.cloud'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
