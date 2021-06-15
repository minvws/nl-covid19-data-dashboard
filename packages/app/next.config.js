require('@next/env').loadEnvConfig('./');

const withPlugins = require('next-compose-plugins');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const nextDomainsConfig = require('./next.domains.config');

const nextConfig = {
  /**
   * Enables react strict mode https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
   */
  reactStrictMode: true,

  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['nl', 'en'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello` or a (sub)domain that's not mapped to a locale.
    defaultLocale: 'nl',
    // When localeDetection is set to false Next.js will no longer automatically
    // redirect based on the user's preferred locale and will only provide locale information
    // detected from either the locale based domain or locale path as described above.
    localeDetection: false,
    // This is a list of locale domains and the default locale they
    // should handle (these are only required when setting up domain routing)
    // Note: subdomains must be included in the domain value to be matched e.g. "fr.example.com".
    domains: nextDomainsConfig,
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: false,
            dimensions: true,
            svgo: false,
            /**
             * Forward ref to the root SVG tag
             */
            ref: true,
          },
        },
      ],
      issuer: {
        test: /\.(js|ts)x?$/,
      },
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

    return config;
  },
};

const plugins = [withBundleAnalyzer];

module.exports = withPlugins(plugins, nextConfig);
