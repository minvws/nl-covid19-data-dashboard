import { LokalizeText } from '@corona-dashboard/app/src/types/cms';
import { getClient } from '../../client';

/**
 * The path field in LokalizeText is no longer used. The key and subject fields
 * gives us enough information to work with. This script strips the path from
 * existing documents. It will need to be executed once on development and once
 * on the production dataset after the next release.
 *
 * Then it can be deleted.
 */
(async function run() {
  const client = getClient('development');

  const documents = (await client.fetch(
    `*[_type == 'lokalizeText']`
  )) as LokalizeText[];

  const transaction = client.transaction();

  documents.forEach((doc) => transaction.patch(doc._id, { unset: ['path'] }));

  await transaction.commit();
})().catch((err) => {
  console.error(`Transaction failed: ${err.message}`);
  process.exit(1);
});
