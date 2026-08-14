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
    ];
  },
  // Both pages load their assets with relative paths, so they have to be
  // served from the directory URL. A rewrite keeps the browser at the bare
  // path, where "./app.js" resolves to "/app.js" and 404s; redirecting
  // moves the browser to the working URL instead. No loop with
  // trailingSlash:false, because the destination is not the slash form.
  async redirects() {
    return [
      {
        source: "/dutch-home",
        destination: "/dutch-home/index.html",
        permanent: false,
      },
      {
        source: "/mib-doc-challenge",
        destination: "/mib-doc-challenge/index.html",
        permanent: false,
      },
      {
        source: "/CINET",
        destination: "/CINET/index.html",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
