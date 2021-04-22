require('@next/env').loadEnvConfig('./');

const withPlugins = require('next-compose-plugins');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const sitemap = require('./generate-sitemap.js');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const COMMIT_ID = process.env.NEXT_PUBLIC_COMMIT_ID || 'no-version-found';

const sanityImages = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/`;
const sanityFiles = `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/`;

const nextConfig = {
  env: {
    COMMIT_ID,
  },

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
      {
        domain: 'coronadashboard.nl',
        defaultLocale: 'nl',
      },
      {
        domain: 'coronadashboard.rijksoverheid.nl',
        defaultLocale: 'nl',
      },
      {
        domain: 'coronadashboard.government.com',
        defaultLocale: 'en',
      },
      // For convenience, the deploy previews are configured as well
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

  async headers() {
    /* The CSP is disabled on development builds */
    const contentSecurityPolicy =
      process.env.NODE_ENV === 'production'
        ? "default-src 'self' statistiek.rijksoverheid.nl; img-src 'self' statistiek.rijksoverheid.nl data:; style-src 'self' 'unsafe-inline'; script-src 'self' statistiek.rijksoverheid.nl;"
        : '';

    return [
      {
        source: '/:any*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
          {
            key: 'Referrer-Policy',
            value: 'origin',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubdomains;',
          },
        ],
      },
    ];
  },

  rewrites: () => [
    {
      source: '/cms-images/:path*',
      destination: `${sanityImages}/:path*`,
    },
    {
      source: '/cms-files/:path*',
      destination: `${sanityFiles}/:path*`,
    },
  ],

  webpack(config, { isServer }) {
    if (
      isServer &&
      process.env.DISABLE_SITEMAP !== '1' &&
      !process.env.DISABLE_SITEMAP
    ) {
      sitemap.generateSitemap(
        process.env.NEXT_PUBLIC_LOCALE,
        process.env.NEXT_PUBLIC_SANITY_DATASET,
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
      );
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
