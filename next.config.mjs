/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
  reactStrictMode: false,
  trailingSlash: false,
  compress:true,
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
    reactCompiler: {
      compilationMode: 'infer', // Compiler 自己推导优化
    },
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/directories',
        statusCode: 301,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['public-storage-hub.s3.us-west-1.amazonaws.com'],
  },
};

export default nextConfig;
