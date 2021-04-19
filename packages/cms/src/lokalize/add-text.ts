/**
 * Add a text to the Sanity "Lokalize" dataset
 */

import { imageResizeTargets } from '@corona-dashboard/common';
import download from 'download';
import fs from 'fs-extra';
import { chunk } from 'lodash';
import fetch from 'node-fetch';
import { getConfig } from './logic';

(async function run() {
  const { dataset, projectId } = await getConfig();

  console.log('🎉 Done.\n');
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});
