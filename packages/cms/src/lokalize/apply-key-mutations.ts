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
 * After each release the log will be cleared (to avoid possible edge cases with
 * actions on the same keys spanning multiple releases
 * cancelling each other out). After each release we can
 * clean up the production set by making a diff with all the keys from development to
 * see which ones can be removed from production. These two tasks could be
 * bundled into one script; sync deletions and clear mutation history.
 */

import { getClient } from '../client';
import { collapseTextMutations, readTextMutations } from './logic';

const devClient = getClient('development');
const prdClient = getClient('production');

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
