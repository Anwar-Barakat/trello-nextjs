import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Radix UI primitives resolve correctly in Next.js build
  webpack: (config) => {
    // Initialize alias object if not present
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    // Alias @radix-ui/primitive to top-level module
    config.resolve.alias["@radix-ui/primitive"] = path.resolve(
      __dirname,
      "node_modules",
      "@radix-ui",
      "primitive"
    );
    // Alias @radix-ui/react-primitive similarly
    config.resolve.alias["@radix-ui/react-primitive"] = path.resolve(
      __dirname,
      "node_modules",
      "@radix-ui",
      "react-primitive"
    );
    return config;
  },
  images: {
    domains: ["utfs.io", "img.clerk.com", "images.unsplash.com"],
  },
};

export default nextConfig;
