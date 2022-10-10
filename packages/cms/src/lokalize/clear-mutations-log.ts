/**
 * Clear the key mutation history
 */
import { clearMutationsLogFile } from './logic';
import prompts from 'prompts';

(async function run() {
  const response = await prompts([
    {
      type: 'confirm',
      name: 'isConfirmed',
      message: 'This script should typically only be executed at the end of a release cycle. It is also part of the sync-after-release script. Are you aware of this?',
      initial: false,
    },
  ]);

  if (!response.isConfirmed) {
    process.exit(0);
  }

  clearMutationsLogFile();
})().catch((err) => {
  console.error(`Clear failed: ${err.message}`);
  process.exit(1);
});
