import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    domains: [
      'qmuwbcgojrs3hjgf.public.blob.vercel-storage.com'
    ],
  },
};

export default nextConfig;
