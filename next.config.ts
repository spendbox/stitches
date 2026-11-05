import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Logos are shrunk in the browser first; this leaves room for the odd larger file.
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
