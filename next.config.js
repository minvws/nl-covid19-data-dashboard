const withPlugins = require('next-compose-plugins');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  env: {
    // REACT_APP_DATA_SRC: 'http://localhost:8000/json/',
    // REACT_APP_DATA_SRC: 'public/json/',
    // Lookup from mounted configmap in K8s:
    REACT_APP_DATA_SRC: '/json/',
  },
  webpack(config, { dev, isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    });

    // Install webpack aliases:
    const aliases = config.resolve.alias || (config.resolve.alias = {});
    aliases.react = aliases['react-dom'] = 'preact/compat';

    // inject Preact DevTools
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

module.exports = withPlugins([withBundleAnalyzer], nextConfig);
