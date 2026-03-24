import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false as any,
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:path*.html',
        destination: '/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
