import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["instance02"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "qasimkamran-website-assets.s3.amazonaws.com",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
