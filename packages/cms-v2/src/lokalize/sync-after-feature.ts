/**
 * This script is meant to run once a feature branch gets merged into develop.
 * It reads mutations that have been performed on the Sanity development dataset
 * as part of the work on the feature branch.
 *
 * 1. New texts are injected to the production dataset, so communication can
 *    already start preparing them for release.
 * 2. Texts that were marked for deletion are _actually_ deleted from the
 *    development dataset. Deletions can not happen immediately because it would
 *    break other development branches, so keys are marked and only deleted by
 *    this script when the feature gets merged.
 * 3. Move mutations are made final by mutating the key of the original document.
 *    This is comparable with a delete mutation as the original document will no
 *    longer be available at the original key.
 */

import { LokalizeText } from '@corona-dashboard/app/src/types/cms';
import { hasValueAtKey } from 'ts-is-present';
import { getClient } from '../client';
import { AddMutation, DeleteMutation, finalizeMoveMutations, getCollapsedAddDeleteMutations, getCollapsedMoveMutations, readTextMutations } from './logic';

(async function run() {
  const mutations = await readTextMutations();

  const addDeleteMutations = getCollapsedAddDeleteMutations(mutations);
  const moveMutations = getCollapsedMoveMutations(mutations);

  /**
   * We synchronize move mutations before deletions. That way we prevent
   * accidental deletions in possible edge cases where the same key was deleted
   * and moved. The mutations collapsing logic happens for add/delete and move
   * separately and is therefore not 100% correct in figuring out what should
   * eventually happen to a key.
   *
   * We would rather have a delete fail than a move, because the latter can
   * result in valuable document loss. We can however manually patch a failed
   * delete mutation by simply re-deleting the data from JSON output.
   */
  await finalizeMoveMutations('development', moveMutations);

  const deletions = addDeleteMutations.filter(hasValueAtKey('action', 'delete' as const));

  await applyDeletionsToDevelopment(deletions);

  const additions = addDeleteMutations.filter(hasValueAtKey('action', 'add' as const));

  await syncAdditionsToProduction(additions);
})().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});

async function syncAdditionsToProduction(mutations: AddMutation[]) {
  if (mutations.length === 0) {
    console.log('There are no mutations that result in keys to add');
    return;
  }

  /**
   * Workaround for add mutations that have no document id yet, so that we can
   * lookup the document by key.
   */
  const allPublishedTexts = (await getClient('development').fetch(`*[_type == 'lokalizeText' && !(_id in path("drafts.**"))] |
   order(subject asc)`)) as LokalizeText[];

  const devClient = await getClient('development');
  const prdClient = await getClient('production');
  const prdTransaction = getClient('production').transaction();

  let successCount = 0;
  let failureCount = 0;

  for (const mutation of mutations) {
    /**
     * Because not all mutation have written a document_id in the mutations file
     * yet, we need to workaround this with a find.
     */
    const document = mutation.document_id
      ? ((await devClient.getDocument(mutation.document_id)) as LokalizeText | undefined)
      : allPublishedTexts.find((x) => x.key === mutation.key);

    if (document) {
      const documentToInject: LokalizeText = {
        ...document,
        /**
         * The newly added flag always needs to be true when injecting to
         * production because in the development document it might have been set
         * to false as a result of publishing text changes.
         */
        is_newly_added: true,
        /**
         * To know how often communication changes these texts we need to clear
         * the counter from any publish actions we did ourselves in development.
         */
        publish_count: 0,
      };

      /**
       * Double check to see if the given key doesn't already exist on production
       */
      const count = await prdClient.fetch(`count(*[_type == 'lokalizeText' && key == '${documentToInject.key}'])`);

      if (count === 0) {
        /**
         * Using createIfNotExist we can safely run the script multiple times and
         * we will never overwrite what has already been edited in the production
         * set.
         */
        prdTransaction.createIfNotExists(documentToInject);
        successCount++;
      } else {
        console.warn(`A lokalize document with key ${documentToInject.key} already exists. Skipped adding a new one.`);
      }
    } else {
      /**
       * This should never happen, but it is also not severe enough to
       * completely halt the script
       */
      console.warn(`An addition for key ${mutation.key} was requested, but the document can not be found in the development dataset`);

      failureCount++;
    }
  }

  await prdTransaction.commit();

  if (failureCount === 0) {
    console.log(`Successfully injected all ${successCount} text keys (if they didn't exist already)`);
  } else {
    console.log(`Injected ${successCount} text keys. Failed to add ${failureCount}`);
  }
}

/**
 * Remove the documents that were marked for deletion from the development set.
 * Here we intentionally DO NOT USE the document id from the mutation log, but
 * look up the document by key. This way, if a text got both deleted AND moved
 * somehow, we can play it safe. By first processing move mutations, and after
 * that execute the deletes based on key, the deletes will always fail if the
 * move was done first, because the move will mutate the key of the original
 * document and the delete will not be able to find it again.
 */
async function applyDeletionsToDevelopment(deletions: DeleteMutation[]) {
  if (deletions.length === 0) {
    console.log('There are no mutations that result in keys to delete');
    return;
  }

  /**
   * Query both published and draft documents, because we want to delete both
   * from development.
   */
  const allTexts = (await getClient('development').fetch(`*[_type == 'lokalizeText'] |
 order(subject asc)`)) as LokalizeText[];

  /**
   * We need to find both draft and published versions of the document
   */
  const documentIdsToDelete = deletions.flatMap(({ key }) => allTexts.filter((x) => x.key === key)).map((x) => x._id);

  const devTransaction = getClient('development').transaction();

  documentIdsToDelete.forEach((x) => devTransaction.delete(x));

  await devTransaction.commit();

  console.log(`Deleted ${documentIdsToDelete.length} text documents (including draft versions)`);
}
