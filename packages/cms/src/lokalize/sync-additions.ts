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
 * actions on the same keys spanning multiple releases cancelling each other
 * out). After each release we can clean up the production set by making a diff
 * with all the keys from development to see which ones can be removed from
 * production. These two tasks could be bundled into one script; sync deletions
 * and clear mutation history.
 */

import { LokalizeText } from './types';
import { getClient } from '../client';
import { collapseTextMutations, readTextMutations } from './logic';

const devClient = getClient('development');
const prdClient = getClient('production');

(async function run() {
  const mutations = await readTextMutations();

  const collapsedMutations = collapseTextMutations(mutations);

  const additions = collapsedMutations.filter((x) => x.action === 'add');

  const allDevTexts = (await devClient.fetch(`*[_type == 'lokalizeText'] |
    order(subject asc)`)) as LokalizeText[];

  const prdTransaction = prdClient.transaction();

  let successCount = 0;
  let failureCount = 0;

  if (additions.length === 0) {
    console.log('There are no mutations that result in additional keys');
    process.exit(0);
  }

  for (const addition of additions) {
    const document = allDevTexts.find((x) => x.key === addition.key);

    if (document) {
      const documentToInject: LokalizeText = {
        ...document,
        /**
         * At this point we can not assume that this flag is still set like it
         * was when the CLI command added the document, because in the meantime
         * we could hit publish in development which clears the flag. So all
         * text that are injected into production get this flag set here to be
         * sure they show up as "new" there.
         */
        is_newly_added: true,
        /**
         * To know how often communication changes these texts we need to clear
         * the counter from any publish actions we did ourselves in development.
         */
        publish_count: 0,
      };

      /**
       * Using createIfNotExist we can safely run the script multiple times and
       * we will never overwrite what has already been edited in the production
       * set.
       */
      prdTransaction.createIfNotExists(documentToInject);
      successCount++;
    } else {
      /**
       * This should never happen, but it is also not severe enough to
       * completely halt the script
       */
      console.warn(
        `An addition for key ${addition.key} was requested, but the document can not be found in the development dataset`
      );

      failureCount++;
    }
  }

  await prdTransaction.commit();

  if (failureCount === 0) {
    console.log(`Successfully injected all ${successCount} text keys`);
  } else {
    console.log(
      `Injected ${successCount} text keys. Failed to add ${failureCount}`
    );
  }
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});
