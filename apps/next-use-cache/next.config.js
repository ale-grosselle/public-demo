const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  // Enable React's built-in cache function is now enabled by default in Next.js 16
  turbopack: {
    root: path.resolve(__dirname, '../..'), // Set the monorepo root
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
