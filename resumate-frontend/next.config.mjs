/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // Avoid Webpack WasmHash on Node 22 which can throw on undefined buffer length
    // Use a stable, non-wasm hashing function instead
    if (!config.output) config.output = {}
    config.output.hashFunction = 'sha256'
    // Keep module/chunk ids deterministic for reproducible builds
    if (!config.optimization) config.optimization = {}
    config.optimization.moduleIds = 'deterministic'
    config.optimization.chunkIds = 'deterministic'
    return config
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
}

export default nextConfig
