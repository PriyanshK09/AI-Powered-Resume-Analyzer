/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Using external logo API (img.logo.dev) for company logos in hero carousel
    // Keep unoptimized for static export; add remotePatterns for future optimization flexibility
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.logo.dev',
      },
    ],
  },
  // Removed static export to enable dynamic server routes (auth APIs, cookies, middleware)
  // If you need a static marketing export later, consider a dual-build approach.
  distDir: 'out',
}

export default nextConfig
