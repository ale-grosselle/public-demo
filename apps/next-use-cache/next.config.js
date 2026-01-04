const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  //cacheMaxMemorySize: 1000,
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
