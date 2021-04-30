/**
 * THIS SCRIPT WILL POTENTIALLY BREAK PRODUCTION BUILD IF RAN HALFWAY SPRINT
 *
 * This script prunes any LokalizeText documents from the production dataset
 * that are not present in the development dataset anymore. It is purely a
 * cleanup mechanism, as additional unused keys have no effect on the
 * application.
 *
 * This code should be executed only right after a major release at which point
 * we can be fairly certain that whatever keys are not in the development
 * dataset can also be removed from production.
 *
 * As an extra this script will also look at any text documents that are in
 * development but not yet in production and add those. Normally documents
 * should flow via the mutations => sync-additions script, but there might be an
 * edge case were things fall through. Syncing those documents here will assure
 * that we can always have production mirror development exactly. This is based
 * on the assumption that it can not hurt to inject a new key to production that
 * has been created around release time since these documents typically contain
 * placeholder texts.
 *
 * @TODO to make this completely convenient and less scary we could choose to
 * move these documents to a different type (e.g. "lokalizeText__deprecated"),
 * instead of deleting them. If we then by accident delete a production key that
 * is still in use, we can run a script to simply restore the last batch of
 * moved documents. Not sure if Sanity allows you to update a document by
 * changing its _type field, but we can be a bit more clever about it.
 */

import { assert } from '@corona-dashboard/common';
import { difference } from 'lodash';
import prompts from 'prompts';
import { getClient } from '../client';
import { LokalizeText } from './types';

const devClient = getClient('development');
const prdClient = getClient('production');

(async function run() {
  {
    const response = await prompts([
      {
        type: 'confirm',
        name: 'isConfirmed',
        message:
          'This script deletes keys from the production dataset. Are you aware of this?',
        initial: false,
      },
    ]);

    if (!response.isConfirmed) {
      process.exit(0);
    }
  }

  const allDevTexts = (await devClient.fetch(`*[_type == 'lokalizeText'] |
    order(subject asc)`)) as LokalizeText[];

  const allPrdTexts = (await prdClient.fetch(`*[_type == 'lokalizeText'] |
    order(subject asc)`)) as LokalizeText[];

  const allDevKeys = allDevTexts.map((x) => x.key);
  const allPrdKeys = allPrdTexts.map((x) => x.key);

  const prdKeysMissingInDev = difference(allPrdKeys, allDevKeys);

  /**
   * Maybe there could be an edge-case where a text addition on dev didn't make
   * it to prd and is also not in the mutation log anymore. We might as well fix
   * that here now we have all the data.
   */
  const devKeysMissingInPrd = difference(allDevKeys, allPrdKeys);

  /**
   * Additions
   */
  if (devKeysMissingInPrd.length > 0) {
    const prdTransaction = prdClient.transaction();

    for (const key of devKeysMissingInPrd) {
      const document = allDevTexts.find((x) => x.key === key);

      assert(document, `Unable to locate document for key ${key}`);

      const documentToInject: LokalizeText = {
        ...document,
        /**
         * At this point we can not assume that this flag is still set like it was
         * when the CLI command added the document, because in the meantime we
         * could hit publish in development which clears the flag. So all text
         * that are injected into production get this flag set here to be sure
         * they show up as "new" there.
         */
        is_newly_added: true,
        /**
         * To know how often communication changes these texts we need to clear
         * the counter from any publish actions we did ourselves in development.
         */
        publish_count: 0,
      };

      prdTransaction.createOrReplace(documentToInject);
    }

    await prdTransaction.commit();

    console.log(
      'Successfully injected missing lokalize texts for keys:',
      devKeysMissingInPrd
    );
  }

  /**
   * Deletions
   */
  if (prdKeysMissingInDev.length > 0) {
    const response = await prompts([
      {
        type: 'confirm',
        name: 'isConfirmed',
        message: `The following keys will be deleted from production:\n\n${prdKeysMissingInDev.join(
          '\n'
        )}\n\nAre you absolutely sure you want this to happen?`,
        initial: false,
      },
    ]);

    if (!response.isConfirmed) {
      process.exit(0);
    }

    const prdTransaction = prdClient.transaction();

    for (const key of prdKeysMissingInDev) {
      const document = allPrdTexts.find((x) => x.key === key);

      assert(document, `Unable to locate document for key ${key}`);

      prdTransaction.delete(document._id);
    }

    await prdTransaction.commit();

    console.log(
      `Successfully deleted ${prdKeysMissingInDev.length} lokalize for keys`
    );
  }
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});
