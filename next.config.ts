import type { NextConfig } from "next";
import { isProduction } from "./src/lib/env";

const nextConfig: NextConfig = {
  // robots.txt is advisory and does not stop indexing of URLs found via
  // inbound links, so preview also answers with an explicit noindex header.
  async headers() {
    if (isProduction) return [];

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "cdn.sanity.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
