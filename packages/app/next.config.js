const withPlugins = require('next-compose-plugins');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const sitemap = require('./generate-sitemap.js');

const withTM = require('next-transpile-modules')([
  '@visx/scale',
  '@visx/event',
  '@visx/tooltip',
  '@corona-dashboard/common',
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
  webpack(config, { isServer, webpack }) {
    if (
      isServer &&
      process.env.DISABLE_SITEMAP !== '1' &&
      !process.env.DISABLE_SITEMAP
    ) {
      sitemap.generateSitemap(process.env.NEXT_PUBLIC_LOCALE);
    }

    // To prevent importing two languages, we use the NormalModuleReplacementPlugin plugin
    // We match any import that uses APP_TARGET and replace it with the value of
    // process.env.NEXT_PUBLIC_LOCALE
    // e.g. ~/src/locale/APP_TARGET.json becomes ~/src/locale/nl.json
    var appTarget = process.env.NEXT_PUBLIC_LOCALE || 'nl';

    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /(.*)APP_TARGET(\.*)/,
        function (resource) {
          resource.request = resource.request.replace(
            /APP_TARGET/,
            `${appTarget}`
          );
        }
      )
    );

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
