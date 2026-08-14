import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/cardline/privacy",
        destination: "/cardline/privacy.html",
      },
      {
        source: "/cardline/support",
        destination: "/cardline/support.html",
      },
      {
        source: "/dutch-home",
        destination: "/dutch-home/index.html",
      },
    ];
  },
};

export default nextConfig;
