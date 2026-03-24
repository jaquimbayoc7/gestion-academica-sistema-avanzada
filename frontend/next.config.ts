import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Needed for Docker production build
};

export default nextConfig;
