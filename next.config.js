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

    // if (!dev) {
    //   // Move Preact into the framework chunk instead of duplicating in routes:
    //   const splitChunks =
    //     config.optimization && config.optimization.splitChunks;
    //   if (splitChunks) {
    //     const cacheGroups = splitChunks.cacheGroups;
    //     const test = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;
    //     if (cacheGroups.framework) {
    //       cacheGroups.preact = Object.assign({}, cacheGroups.framework, {
    //         test,
    //       });
    //       // if you want to merge the 2 small commons+framework chunks:
    //       cacheGroups.commons.name = 'framework';
    //     } else {
    //       cacheGroups.preact = { name: 'commons', chunks: 'all', test };
    //     }
    //   }

    //   // Install webpack aliases:
    //   const aliases = config.resolve.alias || (config.resolve.alias = {});
    //   aliases.react = aliases['react-dom'] = 'preact/compat';
    // }

    return config;
  },
};

const plugins = [withTM, withBundleAnalyzer];

module.exports = withPlugins(plugins, nextConfig);
