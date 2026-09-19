import type { NextConfig } from "next"

const r2PublicUrl = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : undefined

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
      ...(r2PublicUrl ? [{ hostname: r2PublicUrl }] : []),
    ],
  },
}

export default nextConfig
