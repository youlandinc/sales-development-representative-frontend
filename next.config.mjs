/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
  reactStrictMode: false,
  trailingSlash: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  experimental: {
    // missingSuspenseWithCSRBailout: false,
    // staleTimes: {
    //   dynamic: 0,
    //   static: 0,
    // },
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // logging: {
  // fetches: {
  // fullUrl: true,
  // hmrRefresh: true,
  // },
  // },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/contacts/directory',
  //       statusCode: 301,
  //     },
  //     {
  //       source: '/contacts',
  //       destination: '/contacts/directory',
  //       statusCode: 301,
  //     },
  //   ];
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
  // images: {
  //   domains: ['youland-common-images.s3.us-west-1.amazonaws.com'],
  // },
};

export default nextConfig;
