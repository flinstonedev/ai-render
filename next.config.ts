import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "graphiql",
    "@graphiql/react",
    "@graphiql/plugin-explorer",
    "@graphiql/toolkit",
  ],
};

export default nextConfig;
