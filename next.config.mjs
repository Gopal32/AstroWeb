import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ✅ remote patterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "astro-ways.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.ap-south-1.amazonaws.com",
        pathname: "/astro-ways.ai/**",
      },
      {
        // ✅ ADD THIS (your error domain)
        protocol: "https",
        hostname: "astrosway-service.s3.amazonaws.com",
        pathname: "/**",
      },
    ],

    // ✅ OR use domains (optional alternative)
    domains: ["astrosway-service.s3.amazonaws.com"],
  },
};

export default withNextIntl(nextConfig);