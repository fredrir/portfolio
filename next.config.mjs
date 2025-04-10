/** @type {import('next').NextConfig} */
const nextConfig = {
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
