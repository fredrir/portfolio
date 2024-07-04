/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/cv',
          destination: '/cv.pdf', 
        },
      ];
    },
  };

export default nextConfig;
