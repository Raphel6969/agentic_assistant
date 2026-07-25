/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_PLANNER_URL: process.env.NEXT_PUBLIC_PLANNER_URL || "http://localhost:8000",
    NEXT_PUBLIC_PLANNER_WS_URL: process.env.NEXT_PUBLIC_PLANNER_WS_URL || "ws://localhost:8000",
  },
};

export default nextConfig;
