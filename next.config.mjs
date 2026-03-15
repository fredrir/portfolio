/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qjckbuvcttgbkxyzbnzr.supabase.co",
        pathname: "/storage/v1/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/cv/nb",
        destination: "/cv-nb.pdf",
      },
      {
        source: "/cv/en",
        destination: "/cv-en.pdf",
      },
    ];
  },
};

export default nextConfig;
