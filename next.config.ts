import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false as any,
  async redirects() {
    return [
      // Fix .html URLs indexed by Google
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
      // Fix wrong slug variations Google has indexed
      {
        source: '/blogs',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/aboutus',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about_us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/our-services',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/our-services.html',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/blogs.html',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/about-us.html',
        destination: '/about',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
