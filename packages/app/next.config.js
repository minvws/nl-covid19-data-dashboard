const withPlugins = require('next-compose-plugins');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const sitemap = require('./generate-sitemap.js');

const withTM = require('next-transpile-modules')([
  // `internmap` is a dependency of `d3-array`
  'internmap',
  // `react-use-measure` is a dependency of `@visx/tooltip`
  'react-use-measure',
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
  webpack(config, { isServer, defaultLoaders }) {
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

    /**
     * All d3-* packages needs to be transpiled to make them ie11 compatible.
     * For some reason `next-transpile-modules` doesn't pick them up properly.
     */
    config.module.rules.push({
      test: /\.js$/,
      loader: defaultLoaders.babel,
      include: /[\\/]node_modules[\\/](d3-.*)[\\/]/,
    });

    config.resolve.alias = {
      ...config.resolve.alias,

      /**
       * react-spring is a dependency of @visx/xychart and the default import
       * is not ie11-compatible. We'll use an alias to point the import to a
       * common js version of that library.
       *
       * @TODO currently disabled because we don't depend on @visx/xychart
       * yet, but I'll leave it here for future reference.
       */
      // 'react-spring$': 'react-spring/web.cjs',
      // 'react-spring/renderprops$': 'react-spring/renderprops.cjs',
    };

    config.plugins.push(
      new LodashModuleReplacementPlugin({
        // See https://github.com/lodash/lodash-webpack-plugin#feature-sets
        paths: true,
      })
    );

    /**
     * Add the polyfill.js file to our entries
     */
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      if (
        entries['main.js'] &&
        !entries['main.js'].includes('./src/polyfills.js')
      ) {
        entries['main.js'].unshift('./src/polyfills.js');
      }
      return entries;
    };

    return config;
  },
};

const plugins = [withTM, withBundleAnalyzer];

module.exports = withPlugins(plugins, nextConfig);
