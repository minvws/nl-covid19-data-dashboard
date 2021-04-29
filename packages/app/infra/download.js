const path = require('path');
const config = { path: path.resolve('.env.local') };
require('dotenv').config(config);
const download = require('download');

const API_URL =
  process.env.API_URL ||
  'https://coronadashboard.rijksoverheid.nl/json/latest-data.zip';

// eslint-disable-next-line no-console
console.log(`Downloading json data from this location: ${API_URL}`);

(async () => {
  await download(API_URL, './public/json', {
    extract: true,
    strip: 1, // strip `/protos`-directory
  });
})();
