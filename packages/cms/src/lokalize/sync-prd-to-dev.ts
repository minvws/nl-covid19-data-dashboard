import { LokalizeText } from '@corona-dashboard/app/src/types/cms';
import { chunk } from 'lodash';
import { getClient } from '../client';

const NO_DRAFTS = '!(_id in path("drafts.**"))';
/**
 * This script takes all the existing published texts from production and
 * injects those in to the corresponding documents in the development set.
 *
 * This way we can work on develop with up-to-date Lokalize content.
 *
 * Both datasets should use the same document ids.
 */
(async function run() {
  const prdClient = getClient('production');
  const devClient = getClient('development');

  const prdDocuments = (await prdClient.fetch(
    `*[_type == 'lokalizeText' && ${NO_DRAFTS}]`
  )) as LokalizeText[];

  const devDocuments = (await prdClient.fetch(
    `*[_type == 'lokalizeText' && ${NO_DRAFTS}]`
  )) as LokalizeText[];

  const devDocumentIds = devDocuments.map((x) => x._id);

  const transaction = devClient.transaction();

  /**
   * Only sync the documents that are still existing in the development set
   */
  const documentsToSync = prdDocuments.filter((x) =>
    devDocumentIds.includes(x._id)
  );

  const CHUNK_SIZE = 500;
  const chunks = chunk(documentsToSync, CHUNK_SIZE);

  for (const [index, documents] of chunks.entries()) {
    console.log(
      `Syncing ${(index + 1) * CHUNK_SIZE}/${documentsToSync.length}`
    );
    documents.forEach((doc) => {
      transaction.patch(doc._id, {
        set: {
          'text.nl': doc.text.nl,
          'text.en': doc.text.en,
          should_display_empty: doc.should_display_empty,
          /**
           * Never copy over the key and subject properties, because these
           * could have been mutated by move operations in development.
           */
        },
      });
    });

    await transaction.commit();
  }
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});
