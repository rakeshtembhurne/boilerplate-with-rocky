import path from "path";
import { fileURLToPath } from "url";

import("./env.mjs");

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '.'),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "*.inference-dog.workers.dev",
      },
      {
        protocol: "https",
        hostname: "openrouter.ai",
      },
    ],
  },
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
