import { LokalizeText } from '@corona-dashboard/app/src/types/cms';
import lodash from 'lodash';
import { outdent } from 'outdent';
import prompts from 'prompts';
import { client } from '../../studio/client';
import { lokalizeDocumentsWithoutDrafts } from '../utils/queries';
import { initialiseEnvironmentVariables } from '../utils/initialise-environment-variables';

const { chunk } = lodash;

/**
 * This script takes all the existing published texts from production and
 * injects those into the corresponding documents in the development set.
 *
 * This way we can work on develop with up-to-date Lokalize content.
 *
 * Both datasets should use the same document ids.
 */
(async () => {
  const response = await prompts([
    {
      type: 'confirm',
      name: 'isConfirmed',
      message: outdent`
          This script takes all texts from production and overwrites the corresponding texts in development. If previously released texts in development have been altered to use a different amount of interpolating variables, these changes will be lost.

          Are you sure you want to continue?
      `,
      initial: false,
    },
  ]);

  if (!response.isConfirmed) process.exit(0);

  await initialiseEnvironmentVariables();

  const developmentClient = client.withConfig({ dataset: 'development', token: process.env.SANITY_API_TOKEN });
  const productionClient = client.withConfig({ dataset: 'production', token: process.env.SANITY_API_TOKEN });

  const developmentDocuments = (await developmentClient.fetch(lokalizeDocumentsWithoutDrafts)) as LokalizeText[];
  const productionDocuments = (await productionClient.fetch(lokalizeDocumentsWithoutDrafts)) as LokalizeText[];

  const developmentDocumentIds = developmentDocuments.map((document) => document._id);
  const transaction = developmentClient.transaction();

  /**
   * Only sync the documents that are still existing in the development set,
   * because some might have been deleted in the meantime.
   */
  const documentsToSync = productionDocuments.filter((document) => developmentDocumentIds.includes(document._id));

  const CHUNK_SIZE = 500;
  const chunks = chunk(documentsToSync, CHUNK_SIZE);

  for (const [index, documents] of chunks.entries()) {
    console.log(`Syncing ${(index + 1) * CHUNK_SIZE}/${documentsToSync.length}`);

    documents.forEach((document) => {
      transaction.patch(document._id, {
        set: {
          'text.nl': document?.text?.nl,
          'text.en': document?.text?.en,
          should_display_empty: document.should_display_empty,
          /**
           * Never copy over the key and subject properties! Because these could
           * have been mutated by move operations in development.
           */
        },
      });
    });

    await transaction.commit();
  }
})().catch((error) => {
  console.error('An error occurred:', error.message);
  process.exit(1);
});
