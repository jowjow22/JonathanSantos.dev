import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media2.dev.to',
        pathname: '/dynamic/image/**',
      },
    ],
  },

}

export default nextConfig
