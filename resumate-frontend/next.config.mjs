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
  // Dynamic Next.js app with API routes - no static export
  outputFileTracingExcludes: {
    '*': ['node_modules/@swc/core-linux-x64-gnu', 'node_modules/@swc/core-linux-x64-musl'],
  },
  // Disable build tracing to avoid Windows permission issues during development
  outputFileTracing: process.env.NODE_ENV === 'production',
}

export default nextConfig
