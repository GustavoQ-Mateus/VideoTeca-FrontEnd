import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
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
