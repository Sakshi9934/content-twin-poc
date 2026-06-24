import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  distDir: process.env.NEXTJS_DIST_DIR || '.next',
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'edge*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'xmc-*.**',
        port: '',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  rewrites: async () => {
    return [
      // ...
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);