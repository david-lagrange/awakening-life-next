import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  images: {
    domains: ['dpp7zurk3x6wp.cloudfront.net', 'd1944sk4pyzciq.cloudfront.net'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'https://main.d2a428892sprkl.amplifyapp.com',
        'https://development.d2a428892sprkl.amplifyapp.com',
        'https://awakeninglife.ai',
        'http://awakeninglife.ai',
        'localhost:3000',
        // Add any other domains you want to trust
      ],
    },
  },
};

export default nextConfig;
