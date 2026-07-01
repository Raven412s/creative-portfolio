import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "leetcard.jacoblin.cool",
      },
    ],
  },
};

export default nextConfig;
