const withPlugins = require('next-compose-plugins');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const sitemap = require('./src/tools/sitemap/generate-sitemap.js');

const withTM = require('next-transpile-modules')([
  '@visx/tooltip',
  '@visx/event',
]);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim();

const nextConfig = {
  env: {
    COMMIT_ID: commitHash,
  },
  reactStrictMode: true, // Enables react strict mode https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode

  webpack(config, { isServer }) {
    if (
      isServer &&
      process.env.DISABLE_SITEMAP !== '1' &&
      !process.env.DISABLE_SITEMAP
    ) {
      sitemap.generateSitemap(process.env.NEXT_PUBLIC_LOCALE);
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: false,
            dimensions: true,
            svgo: false,
          },
        },
      ],
      issuer: {
        test: /\.(js|ts)x?$/,
      },
    });

    config.plugins.push(
      new LodashModuleReplacementPlugin({
        // See https://github.com/lodash/lodash-webpack-plugin#feature-sets
        paths: true,
      })
    );

    return config;
  },
};

const plugins = [withTM, withBundleAnalyzer];

module.exports = withPlugins(plugins, nextConfig);
