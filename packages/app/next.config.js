"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const next_compose_plugins_1 = __importDefault(require("next-compose-plugins"));
const lodash_webpack_plugin_1 = __importDefault(require("lodash-webpack-plugin"));
const generate_sitemap_1 = require("./generate-sitemap");
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const COMMIT_ID = process.env.NEXT_PUBLIC_COMMIT_ID || 'no-version-found';
const nextConfig = {
    env: {
        COMMIT_ID,
    },
    /**
     * Enables react strict mode https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
     */
    reactStrictMode: true,
    /*i18n: {
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
    },*/
    webpack(config, { isServer }) {
        if (isServer &&
            process.env.DISABLE_SITEMAP !== '1' &&
            !process.env.DISABLE_SITEMAP) {
            generate_sitemap_1.generateSitemap(process.env.NEXT_PUBLIC_LOCALE, process.env.NEXT_PUBLIC_SANITY_DATASET, process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
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
        config.resolve.alias = Object.assign({}, config.resolve.alias);
        config.plugins.push(new lodash_webpack_plugin_1.default({
            // See https://github.com/lodash/lodash-webpack-plugin#feature-sets
            paths: true,
        }));
        return config;
    },
};
const plugins = [withBundleAnalyzer];
module.exports = next_compose_plugins_1.default(plugins, nextConfig);
