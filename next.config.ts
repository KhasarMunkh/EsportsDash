import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    remotePatterns: [new URL('https://cdn.pandascore.co/images/**')],
};

export default nextConfig;
