/**
 * This script reads LokalizeText mutations that have been performed on the
 * Sanity development dataset via the CLI (as a result of work on feature
 * branches) and figures out what texts need to be added to the production
 * dataset.
 *
 * Any text document that has been added and not deleted afterwards is a
 * candidate. This script can safely be run multiple times as it will only
 * create texts in production if they didn't exist already.
 *
 * This mechanism is very basic and not designed to be fully correct. For
 * example, it will not delete entries that have first been added to production
 * and later were deleted from development. This is to avoid complexity and
 * minimize risk.
 *
 * This mechanism mainly serves as a convenient way to automatically keep track
 * of what texts got created a part of the current sprint, and add these texts
 * to production so that they can be prepared and released.
 *
 * After each release the log will be cleared (to avoid edge cases with actions
 * cancelling each other out). Also after each release we could
 * clean up the production set to making a diff on the keys from development to
 * see which ones can be removed from production. These two tasks could be
 * bundled into one script; sync deletions and clear mutation history.
 */

import sanityClient from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
// import sanityConfig from '../../sanity.json';
import { collapseTextMutations, readTextMutations } from './logic';

/**
 * @TODO load dotenv elsewhere maybe and take dataset from env
 */
dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
});

const sharedConfig = {
  apiVersion: '2021-03-25',
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
  token: process.env.SANITY_STUDIO_TOKEN,
  useCdn: false,
};

const devClient = sanityClient({
  ...sharedConfig,
  dataset: 'development',
});

const prdClient = sanityClient({
  ...sharedConfig,
  dataset: 'production',
});

const TWO_WEEKS_IN_MS = 2 * 7 * 24 * 60 * 60 * 1000;
const TWO_WEEKS_AGO = new Date(Date.now() - TWO_WEEKS_IN_MS).toISOString();

(async function run() {
  const mutations = await readTextMutations();

  console.log('mutations', mutations);

  /**
   * @TODO Pass all existing text keys from development and use those to figure
   * out what to add or delete. That would probably be safer than collapsing the
   * history because the history might get cleared. Or a re-add much
   * later after a delete might result in 0 because the delete is still in the
   * history as well
   */
  const collapsedMutations = collapseTextMutations(mutations);

  const addMutations = collapsedMutations.filter((x) => x.action === 'add');

  /**
   * Delete mutations are only executed when they appeared more then two weeks
   * ago on the development dataset. This way we never accidentally delete keys
   * that are still in use.
   */
  const deleteMutations = collapsedMutations.filter(
    (x) => x.action === 'delete' && x.timestamp < TWO_WEEKS_AGO
  );

  // {
  //   const results = await devClient.fetch(`*[_type == 'lokalizeText'] |
  //     order(subject asc)`
  //   );

  //   console.log('Dev has docs', results.length);
  // }

  // {
  //   const results = await prdClient.fetch(`*[_type == 'lokalizeText'] |
  //     order(subject asc)`
  //   );

  //   console.log('Prd has docs', results.length);
  // }
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});
