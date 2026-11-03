import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
const apiOrigin = (() => {
  try {
    return api ? new URL(api).origin : "";
  } catch {
    return "";
  }
})();

/**
 * Content-Security-Policy (T22.1).
 *
 * - script-src keeps 'unsafe-inline' because the App Router injects inline
 *   bootstrap/flight scripts without a nonce. A nonce-based CSP would force
 *   every page to be dynamically rendered (no static optimisation); the risk is
 *   mitigated by React's output escaping, no `dangerouslySetInnerHTML` with
 *   user data, `object-src 'none'`, `base-uri 'self'` and `frame-ancestors`.
 * - 'unsafe-eval' and ws: are only added in development (React Refresh/HMR).
 * - img-src allows https: because legacy catalogue covers may point to
 *   external image hosts; posters/proofs are served by the API origin.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https: ${apiOrigin}`.trim(),
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigin}${isDev ? " ws: wss:" : ""}`.trim(),
  "media-src 'self' blob:",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "worker-src 'self' blob:",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ]),
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async rewrites() {
    return api
      ? [
          {
            source: "/api/v1/posters/:id",
            destination: `${api}/api/v1/posters/:id`,
          },
        ]
      : [];
  },
};
export default nextConfig;
