const withLess = require('next-with-less');

const nextConfig = withLess({
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
  experimental: {
    forceSwcTransforms: true,
  },
}); 

module.exports = nextConfig
