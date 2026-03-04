import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ssl.pstatic.net", // 네이버 기본 프로필
      },
      {
        protocol: "https",
        hostname: "phinf.pstatic.net", // 네이버 사용자 설정 프로필
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // 구글 프로필
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net", // 카카오 프로필
      },
      {
        protocol: "http",
        hostname: "*.kakaocdn.net",
      },
    ],
  },
};

export default nextConfig;
