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
  /**
   * Enables react strict mode
   * https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
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

  /**
   * More header management is done by the next.server.js for the HTML pages and JS/CSS assets.
   */
  async headers() {
    return [
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
    config.optimization.chunkIds = 'size';
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
