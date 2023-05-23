/* eslint-disable no-console */

const path = require('path');
const config = { path: path.resolve('.env.local') };
require('dotenv').config(config);
const download = require('download');
const decompress = require('decompress');

const ACTIVE_DATA_URL = process.env.ACTIVE_DATA_URL || 'https://coronadashboard.rijksoverheid.nl/json/latest-data.zip';
const ARCHIVED_DATA_URL = process.env.ARCHIVED_DATA_URL || 'https://coronadashboard.rijksoverheid.nl/json/archived/latest-archived-data.zip';

const downloadAndUnzip = (url, destination, filename) => {
  (async () => {
    await download(url, destination, { filename });

    const zipPath = path.join(destination, filename);
    await decompress(zipPath, destination, {
      strip: 1,
    });
  })();
};

console.log('The download command will read the download URLs from your .env.local settings');
console.log('If you want to download from a different URL than the default, make sure to set the ACTIVE_DATA_URL and/or ARCHIVED_DATA_URL ENV vars');

console.log(`Downloading active data json from this location: ${ACTIVE_DATA_URL}`);
downloadAndUnzip(ACTIVE_DATA_URL, path.join('.', 'public', 'json'), 'latest-data.zip');

console.log(`Downloading archived data json from this location: ${ARCHIVED_DATA_URL}`);
downloadAndUnzip(ARCHIVED_DATA_URL, path.join('.', 'public', 'json', 'archived'), 'latest-archived-data.zip');
