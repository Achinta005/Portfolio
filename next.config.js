/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '', // Leave empty if no specific port
        pathname: '/**', // Allow all paths
      },
      {
        protocol: 'https',
        hostname: 'achintahazra.shop',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'portfolio-frontend-dtcj.onrender.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'portfolio-backend-3gcq.onrender.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.microlink.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Optionally, add other configurations here
};