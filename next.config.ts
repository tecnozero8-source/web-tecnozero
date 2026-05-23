import type { NextConfig } from "next";

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://region1.analytics.google.com",
  "frame-src https://webpay.transbank.cl https://webpay3gint.transbank.cl",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://webpay.transbank.cl https://webpay3gint.transbank.cl",
  "upgrade-insecure-requests",
].join("; ")

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",            value: "nosniff" },
          { key: "X-Frame-Options",                   value: "SAMEORIGIN" },
          { key: "Referrer-Policy",                   value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",                value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security",         value: "max-age=31536000; includeSubDomains; preload" },
          { key: "Cross-Origin-Opener-Policy",        value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy",      value: "same-origin" },
          { key: "Content-Security-Policy",           value: CSP },
        ],
      },
    ]
  },
};

export default nextConfig;
