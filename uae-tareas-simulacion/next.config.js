const withLess = require('next-with-less');

const nextConfig = withLess({
  reactStrictMode: true,
  swcMinify: true,
});

module.exports = nextConfig
