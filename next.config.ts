import type { NextConfig } from "next";

// Uploaded images are served from the Neon Object Storage bucket (see src/lib/storage.ts)
const storageEndpoint = process.env.AWS_ENDPOINT_URL_S3?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: storageEndpoint ? [new URL(`${storageEndpoint}/portfolio-images/**`)] : [],
  },
  experimental: {
    serverActions: {
      // Admin forms upload images and the resume PDF (max 4 MB each, see src/lib/storage.ts).
      // Vercel caps request bodies at 4.5 MB, so keep a single upload under that.
      bodySizeLimit: "5mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
