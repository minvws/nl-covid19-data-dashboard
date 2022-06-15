/**
 * More header management is done by the next.server.js for the HTML pages and JS/CSS assets.
 */
async function headers() {
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
}

module.exports = {
  headers,
};
