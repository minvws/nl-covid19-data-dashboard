/**
 * Clear the key mutation history, and compare the keys in the development and
 * production datasets to see what items should be deleted from production.
 */

import { clearLogFile } from './logic';

(async function run() {
  clearLogFile();
})().catch((err) => {
  console.error(`Clear failed: ${err.message}`);
  process.exit(1);
});
