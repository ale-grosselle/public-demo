const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React's built-in cache function is now enabled by default in Next.js 16
  turbopack: {
    root: path.resolve(__dirname, '../..'), // Set the monorepo root
  },
};

module.exports = nextConfig;