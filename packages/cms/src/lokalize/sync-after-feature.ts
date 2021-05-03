/**
 * This script is meant to run once a feature branch gets merged into develop.
 * It reads mutations that have been performed on the Sanity development dataset
 * as part of the work on the feature branch.
 *
 * - New texts are injected to the production dataset, so communication
 *   can already start preparing them for release.
 * - Texts that were marked for deletion are _actually_ deleted from the
 *   development dataset. Deletions can not happen immediately because it would
 *   break other development branches, so keys are marked and only deleted by
 *   this script when the feature gets merged.
 */

import { isDefined } from 'ts-is-present';
import { getClient } from '../client';
import {
  collapseTextMutations,
  readTextMutations,
  TextMutation,
} from './logic';
import { LokalizeText } from './types';

(async function run() {
  const mutations = await readTextMutations();

  const collapsedMutations = collapseTextMutations(mutations);

  const additions = collapsedMutations.filter((x) => x.action === 'add');

  const deletions = collapsedMutations.filter((x) => x.action === 'delete');

  if (!additions.length && !deletions.length) {
    /**
     * No need to query documents if there are no mutations
     */
    return;
  }

  const allDevTexts = (await getClient('development')
    .fetch(`*[_type == 'lokalizeText'] |
  order(subject asc)`)) as LokalizeText[];

  await applyDeletionsToDevelopment(deletions, allDevTexts);

  await syncAdditionsToProduction(additions, allDevTexts);
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});

async function syncAdditionsToProduction(
  additions: TextMutation[],
  allTextDocuments: LokalizeText[]
) {
  if (additions.length === 0) {
    console.log('There are no mutations that result in keys to add');
    process.exit(0);
  }

  const prdTransaction = getClient('production').transaction();

  let successCount = 0;
  let failureCount = 0;

  for (const addition of additions) {
    const document = allTextDocuments.find((x) => x.key === addition.key);

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
}

async function applyDeletionsToDevelopment(
  deletions: TextMutation[],
  allTextDocuments: LokalizeText[]
) {
  if (deletions.length === 0) {
    console.log('There are no mutations that result in keys to delete');
    process.exit(0);
  }

  let successCount = 0;
  let failureCount = 0;

  const documentIdsToDelete = deletions
    .map(({ key }) => allTextDocuments.find((x) => x.key === key))
    .map((x) => x?._id)
    .filter(isDefined);

  if (documentIdsToDelete.length !== deletions.length) {
    /**
     * This should not happen, but maybe it's not severe enough to halt this
     * process as that could lead to more problems. Since this script is meant
     * to be run automatically after merge we should probably just delete
     * whatever keys we can.
     */
    console.warn(
      `There were ${deletions.length} deletions requested, but only ${documentIdsToDelete} documents were found in the dataset.`
    );

    failureCount = deletions.length - documentIdsToDelete.length;
  }

  const devTransaction = getClient('development').transaction();

  documentIdsToDelete.forEach((x) => devTransaction.delete(x));

  await devTransaction.commit();

  successCount = documentIdsToDelete.length;

  if (failureCount === 0) {
    console.log(`Successfully deleted all ${successCount} text keys`);
  } else {
    console.log(
      `Deleted ${successCount} text keys. Failed to add ${failureCount}`
    );
  }
}
