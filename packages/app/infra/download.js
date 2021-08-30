/* eslint-disable no-console */

const path = require('path');
const config = { path: path.resolve('.env.local') };
require('dotenv').config(config);
const download = require('download');
const decompress = require('decompress');

const API_URL =
  process.env.API_URL ||
  'https://coronadashboard.rijksoverheid.nl/json/latest-data.zip';

console.log(
  'The download command will read the download URL from your .env.local settings'
);
console.log(
  'If you want to download from a different URL than the default, make sure to set the API_URL ENV var'
);
console.log(`Downloading json data from this location: ${API_URL}`);

const filename = 'latest-data.zip';
const jsonPath = path.join('.', 'public', 'json');
const zipPath = path.join(jsonPath, filename);

(async () => {
  await download(API_URL, jsonPath, {
    filename: filename,
  });

  await decompress(zipPath, jsonPath, {
    strip: 1,
  });
})();
