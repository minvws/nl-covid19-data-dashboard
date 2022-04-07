require('@next/env').loadEnvConfig('./');

const withPlugins = require('next-compose-plugins');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withTranspileModules = require('next-transpile-modules')([
  'd3-geo',
  'd3-array',
  'globby',
  'internmap',
]);
const path = require('path');
const { DuplicatesPlugin } = require('inspectpack/plugin');

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  throw new Error('Provide NEXT_PUBLIC_SANITY_DATASET');
}

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('Provide NEXT_PUBLIC_SANITY_PROJECT_ID');
}

const IS_PRODUCTION_BUILD = process.env.NODE_ENV === 'production';
const IS_DEVELOPMENT_PHASE = process.env.NEXT_PUBLIC_PHASE === 'develop';

const SANITY_PATH = `${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;
const SIX_MONTHS_IN_SECONDS = 15768000;

const STATIC_ASSET_MAX_AGE_IN_SECONDS = 14 * 24 * 60 * 60; // two weeks
const STATIC_ASSET_HTTP_DATE = new Date(
  Date.now() + STATIC_ASSET_MAX_AGE_IN_SECONDS * 1000
).toUTCString();

// When municipal reorganizations happened we want to redirect to the new municipality when
// using the former municipality code. `from` contains the old municipality codes and `to` is
// the new municipality code to link to.
const gmRedirects = [
  {
    from: ['0370'],
    to: '0439',
  },
  {
    from: ['0398', '0416'],
    to: '1980',
  },
  {
    from: ['1685', '0856'],
    to: '1991',
  },
  {
    from: ['0756', '1684', '0786', '0815', '1702'],
    to: '1982',
  },
  {
    from: ['0457'],
    to: '0363',
  },
];

const nextConfig = {
  experimental:
    IS_PRODUCTION_BUILD && !IS_DEVELOPMENT_PHASE
      ? {
          outputStandalone: true,
          outputFileTracingRoot: path.join(__dirname, '../../'),
        }
      : undefined,

  /**
   * Enables react strict mode
   * https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
   */
  reactStrictMode: true,

  poweredByHeader: false,

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

    /**
     * Configure english domain when it's available on the environment variables
     */
    domains: [
      {
        domain: process.env.DOMAIN_EN ?? 'coronadashboard.government.nl',
        defaultLocale: 'en',
      },
    ],
  },

  async headers() {
    const contentSecurityPolicy =
      IS_PRODUCTION_BUILD && !IS_DEVELOPMENT_PHASE
        ? "default-src 'self'; img-src 'self' statistiek.rijksoverheid.nl data:; style-src 'self' 'unsafe-inline'; script-src 'self' statistiek.rijksoverheid.nl; font-src 'self'; frame-ancestors 'none'; object-src 'none'; form-action 'none';"
        : "default-src 'self'; img-src 'self' statistiek.rijksoverheid.nl data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline' statistiek.rijksoverheid.nl; font-src 'self'; frame-ancestors 'none'; object-src 'none'; form-action 'none'; connect-src 'self' 5mog5ask.api.sanity.io * ws: wss:;";

    return [
      {
        source: '/:all*',
        locale: false,
        headers: [
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: `max-age=${SIX_MONTHS_IN_SECONDS}; includeSubdomains; preload`,
          },
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=()',
          },
          {
            key: 'Cache-Control',
            value: `public, max-age=${STATIC_ASSET_MAX_AGE_IN_SECONDS}`,
          },
          {
            key: 'Vary',
            value: 'content-type',
          },
          {
            key: 'Expires',
            value: STATIC_ASSET_HTTP_DATE,
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|png|woff|woff2)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=9999999999, must-revalidate',
          },
        ],
      },
      {
        source: '/:all*(html)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, public',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/gemeente/(g|G)(m|M):nr(\\d{4})/:page*',
          destination: '/gemeente/GM:nr/:page*',
        },
        {
          source: '/veiligheidsregio/(v|V)(r|R):nr(\\d{2})/:page*',
          destination: '/veiligheidsregio/VR:nr/:page*',
        },
        {
          source: `/cms-(files|images)/:filename`,
          destination: `https://cdn.sanity.io/images/${SANITY_PATH}/:filename`,
        },
      ],
    };
  },

  async redirects() {
    return [
      {
        source: '/over-risiconiveaus',
        destination: '/',
        permanent: false,
      },
      {
        source: '/actueel',
        destination: '/',
        permanent: false,
      },
      {
        source: '/apple-touch-icon.png',
        destination: '/images/touch-icon.png',
        permanent: false,
      },
      {
        source: '/apple-touch-icon-120x120-precomposed.png',
        destination: '/images/touch-icon.png',
        permanent: false,
      },
      {
        source: '/apple-touch-icon-120x120.png',
        destination: '/images/touch-icon.png',
        permanent: false,
      },
      {
        source: '/apple-touch-icon-152x152-precomposed.png',
        destination: '/images/touch-icon.png',
        permanent: false,
      },
      {
        source: '/apple-touch-icon-152x152.png',
        destination: '/images/touch-icon.png',
        permanent: false,
      },
      {
        source: '/apple-touch-icon-precomposed.png',
        destination: '/images/touch-icon.png',
        permanent: false,
      },
      {
        source: '/regio',
        destination: '/veiligheidsregio',
        permanent: false,
      },
      {
        source: '/gemeente/:vr(vr|VR|vR|Vr):nr(\\d{2}):slash(/{0,1}):page*',
        destination: '/veiligheidsregio/VR:nr',
        permanent: false,
      },
      {
        source:
          '/veiligheidsregio/:gm(gm|GM|gM|Gm):nr(\\d{4}):slash(/{0,1}):page*',
        destination: '/gemeente/GM:nr',
        permanent: false,
      },
      {
        source: '/veiligheidsregio/:code/risiconiveau',
        destination: '/veiligheidsregio/:code',
        permanent: true,
      },
      ...gmRedirects.map(({ from, to }) => ({
        source: `/gemeente/:gm(gm|GM|gM|Gm):nr(${from.join('|')})/:page*`,
        destination: `/gemeente/GM${to}/:page*`,
        permanent: true,
      })),
    ];
  },

  /**
   * Enable source maps in production, because we want people to report readable
   * stack traces from the error boundaries feature.
   */
  productionBrowserSourceMaps: true,

  webpack(config) {
    config.optimization.chunkIds = 'named';
    config.module.rules.push({
      test: /\.svg$/,
      type: 'asset',
      use: 'svgo-loader',
      generator: {
        filename: 'static/image/[name].[hash][ext]',
      },
      parser: {
        dataUrlCondition: {
          maxSize: 2 * 1024, // only inline SVG's < 2kB
        },
      },
    });

    config.resolve.alias = {
      ...config.resolve.alias,
    };

    const duplicatePackageResolves = [
      ['balanced-match', '../../node_modules/balanced-match'],
      ['d3-array', '../../node_modules/d3-array'],
      ['d3-color', '../../node_modules/d3-scale/node_modules/d3-color'],
      ['d3-geo', '../../node_modules/d3-geo'],
      [
        'd3-interpolate',
        '../../node_modules/d3-scale/node_modules/d3-interpolate',
      ],
      ['react-is', '../../node_modules/react-is'],
      [
        'unist-util-visit-parents',
        '../../node_modules/unist-util-visit-parents',
      ],
    ];

    duplicatePackageResolves.forEach(([packageName, resolvedPath]) => {
      config.resolve.alias[packageName] = path.resolve(__dirname, resolvedPath);
    });

    config.plugins.push(
      new LodashModuleReplacementPlugin({
        // See https://github.com/lodash/lodash-webpack-plugin#feature-sets
        paths: true,
      })
    );

    if (process.env.NODE_ENV === 'production') {
      // See https://github.com/formidablelabs/inspectpack/#plugin
      config.plugins.push(
        new DuplicatesPlugin({
          verbose: true,
        })
      );
    }

    return config;
  },
};

const plugins = [withBundleAnalyzer];

module.exports = withPlugins(plugins, withTranspileModules(nextConfig));
