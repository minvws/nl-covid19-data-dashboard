const withPlugins = require('next-compose-plugins');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const sitemap = require('./generate-sitemap.js');

const withTM = require('next-transpile-modules')([
  'internmap', // `internmap` is a dependency of `d3-array`
  'geometric',
]);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const COMMIT_ID = process.env.NEXT_PUBLIC_COMMIT_ID || 'no-version-found';

const nextConfig = {
  env: {
    COMMIT_ID,
  },

  /**
   * Our static preview environment cannot handle requests like `/{pagename}`
   * which should resolve to `{pagename}.html`.
   * The `trailingSlash: true` will export the pages as `/{pagename}/index.html`.
   *
   * read more:
   * https://nextjs.org/docs/api-reference/next.config.js/exportPathMap#adding-a-trailing-slash
   */
  trailingSlash: process.env.BUILD_TARGET === 'preview',

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
    domains: [
      //Production environments
      // {
      //   domain: 'coronadashboard.nl',
      //   defaultLocale: 'nl',
      // },
      // {
      //   domain: 'coronadashboard.rijksoverheid.nl',
      //   defaultLocale: 'nl',
      // },
      // {
      //   domain: 'coronadashboard.government.com',
      //   defaultLocale: 'en',
      // },
      // For convenience, the deploy previews are configured as well
      // { domain: 'nl-covid19-data-dashboard.vercel.app', defaultLocale: 'nl' },
      // { domain: 'en-covid19-data-dashboard.vercel.app', defaultLocale: 'en' },
      {
        domain: 'develop-en-covid19-data-dashboard.vercel.app',
        defaultLocale: 'en',
      },
      {
        domain: 'master-en-covid19-data-dashboard.vercel.app',
        defaultLocale: 'en',
      },
      {
        domain: 'develop-nl-covid19-data-dashboard.vercel.app',
        defaultLocale: 'nl',
      },
      {
        domain: 'master-nl-covid19-data-dashboard.vercel.app',
        defaultLocale: 'nl',
      },
    ],
  },

  webpack(config, { isServer, webpack, defaultLoaders }) {
    if (
      isServer &&
      process.env.DISABLE_SITEMAP !== '1' &&
      !process.env.DISABLE_SITEMAP
    ) {
      sitemap.generateSitemap(process.env.NEXT_PUBLIC_LOCALE);
    }

    /** To prevent importing two languages, we use the NormalModuleReplacementPlugin plugin
     *  We match any import that uses APP_LOCALE and replace it with the value of
     *  process.env.NEXT_PUBLIC_LOCALE
     *  e.g. ~/src/locale/APP_LOCALE.json becomes ~/src/locale/nl.json
     */
    var appLocale = process.env.NEXT_PUBLIC_LOCALE || 'nl';

    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /(.*)APP_LOCALE(\.*)/,
        function (resource) {
          resource.request = resource.request.replace(
            /APP_LOCALE/,
            `${appLocale}`
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

    /**
     * All d3-* packages needs to be transpiled to make them ie11 compatible.
     * For some reason `next-transpile-modules` doesn't pick them up properly.
     */
    config.module.rules.push({
      test: /\.js$/,
      loader: defaultLoaders.babel,
      include: /[\\/]node_modules[\\/](d3-.*|react-use-measure)[\\/]/,
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

const plugins = [withTM, withBundleAnalyzer];

module.exports = withPlugins(plugins, nextConfig);
