const withPlugins = require('next-compose-plugins');
const withPrefresh = require('@prefresh/next');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  env: {
    // Lookup from mounted configmap in K8s:
    REACT_APP_DATA_SRC: '/json/',
  },
  webpack(config, { dev, isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: { typescript: false },
        },
      ],
      issuer: {
        test: /\.(js|ts)x?$/,
      },
    });

    // Move Preact into the framework chunk instead of duplicating in routes:
    const splitChunks = config.optimization && config.optimization.splitChunks;
    if (splitChunks) {
      const cacheGroups = splitChunks.cacheGroups;
      const test = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;
      if (cacheGroups.framework) {
        cacheGroups.preact = Object.assign({}, cacheGroups.framework, { test });
        // if you want to merge the 2 small commons+framework chunks:
        cacheGroups.commons.name = 'framework';
      } else {
        cacheGroups.preact = { name: 'commons', chunks: 'all', test };
      }
    }

    // Install webpack aliases:
    const aliases = config.resolve.alias || (config.resolve.alias = {});
    aliases.react = aliases['react-dom'] = 'preact/compat';

    // Automatically inject Preact DevTools:
    if (dev && !isServer) {
      const entry = config.entry;
      config.entry = () =>
        entry().then((entries) => {
          entries['main.js'] = ['preact/debug'].concat(
            entries['main.js'] || []
          );
          return entries;
        });
    }

    return config;
  },
};

module.exports = withPlugins([withBundleAnalyzer, withPrefresh], nextConfig);
