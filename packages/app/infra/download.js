const download = require('download');
const API_URL =
  process.env.API_URL ||
  'https://coronadashboard.rijksoverheid.nl/json/latest-data.zip';
(async () => {
  await download(API_URL, './public/json', {
    extract: true,
  });
})();
