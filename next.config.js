/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'cdn.buttercms.com',
            pathname: '/**',
          },
        ],
        unoptimized:true
      },
}

module.exports = nextConfig
