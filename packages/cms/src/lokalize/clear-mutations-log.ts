/**
 * Clear the key mutation history, and compare the keys in the development and
 * production datasets to see what items should be deleted from production.
 */

import { clearLogFile } from './logic';
import prompts from 'prompts';

(async function run() {
  const response = await prompts([
    {
      type: 'confirm',
      name: 'isConfirmed',
      message:
        'This script should only be executed at the end of a release cycle. Are you aware of this?',
      initial: false,
    },
  ]);

  if (!response.isConfirmed) {
    process.exit(0);
  }

  clearLogFile();
})().catch((err) => {
  console.error(`Clear failed: ${err.message}`);
  process.exit(1);
});
