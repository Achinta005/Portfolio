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
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Add API proxy for development
  async rewrites() {
    // Only use proxy in development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/python/:path*',
          destination: 'http://localhost:5000/:path*',
        },
      ];
    }
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/api/python/:path*',
          destination: 'https://deploy-euyc.onrender.com/:path*',
        },
      ];
    }
    
    return [];
  },
};