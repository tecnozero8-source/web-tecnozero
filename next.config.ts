import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
  // NOTE: Fix 307→301 redirect for tecnozero.cl → www.tecnozero.cl
  // in Vercel Dashboard → Project Settings → Domains → tecnozero.cl
  // Change redirect type from "Temporary" to "301 Permanent"
};

export default nextConfig;
