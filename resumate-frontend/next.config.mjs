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
  // Static export for Netlify deployment
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  experimental: {
    outputFileTracingExcludes: {
      '*': ['node_modules/@swc/core-linux-x64-gnu', 'node_modules/@swc/core-linux-x64-musl'],
    },
  },
}

export default nextConfig
