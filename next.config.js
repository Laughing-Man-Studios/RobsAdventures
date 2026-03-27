/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    transpilePackages: ['react-leaflet', '@react-leaflet/core'],
  },
};

module.exports = nextConfig
