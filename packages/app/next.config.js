const withPlugins = require('next-compose-plugins');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const sitemap = require('./generate-sitemap.js');

const withTM = require('next-transpile-modules')([
  '@visx/tooltip',
  '@visx/event',
]);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// const commitHash = require('child_process')
//   .execSync('git rev-parse --short HEAD')
//   .toString()
//   .trim();

const i18Settings = {
  // These are all the locales you want to support in
  // your application
  locales: ['en-GB', 'nl-NL'],
  // This is the default locale you want to be used when visiting
  // a non-locale prefixed path e.g. `/hello`
  defaultLocale: 'nl-NL',
  // This is a list of locale domains and the default locale they
  // should handle (these are only required when setting up domain routing)
  domains: [
    {
      domain: process.env.PREVIEW_SERVER_EN,
      defaultLocale: 'en-GB',
    },
    {
      domain: process.env.PREVIEW_SERVER_NL,
      defaultLocale: 'nl-NL',
    },
  ],
};

const nextConfig = {
  env: {
    COMMIT_ID: 'replace-me-later-with-a-real-git-hash',
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

if (process.env.IS_PREVIEW_SERVER) {
  nextConfig.i18n = i18Settings;
}

const plugins = [withTM, withBundleAnalyzer];

module.exports = withPlugins(plugins, nextConfig);
