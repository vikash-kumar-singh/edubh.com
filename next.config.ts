import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir:
    process.env.NODE_ENV === "development"
      ? "node_modules/.cache/edubh-next-dev"
      : ".next",
  reactCompiler: process.env.NODE_ENV === "production",
  experimental: {
    optimizePackageImports: ["@tabler/icons-react", "framer-motion"],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    if (process.env.NODE_ENV === "development") {
      config.cache = false;
    }

    const fileLoaderRule = config.module.rules.find(
      (rule: {
        test?: { test?: (value: string) => boolean };
        issuer?: unknown;
        resourceQuery?: { not?: RegExp[] };
        exclude?: RegExp;
      }) => rule.test?.test?.(".svg")
    );

    if (!fileLoaderRule || !fileLoaderRule.resourceQuery?.not) {
      return config;
    }

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ["@svgr/webpack"],
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;



