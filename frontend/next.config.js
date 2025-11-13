/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
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
  

  // async rewrites() {
  //   if (process.env.NODE_ENV === 'development') {
  //     return [
  //       {
  //         source: '/alist/:path*',
  //         destination: 'http://localhost:3001/portfolio:path*',
  //       },
  //     ];
  //   }
  //   if (process.env.NODE_ENV === 'production') {
  //     return [
  //       {
  //         source: '/alist/:path*',
  //         destination: 'https://deploy-euyc.onrender.com/portfolio:path*',
  //       },
  //     ];
  //   }
    
  //   return [];
  // },
};