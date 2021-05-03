/**
 * Delete one of multiple texts from the Sanity "Lokalize" dataset.
 */
import { assert } from '@corona-dashboard/common';
import { isEmpty } from 'lodash';
import prompts from 'prompts';
import { getClient } from '../client';
import { appendTextMutation } from './logic';
import { LokalizeText } from './types';

(async function run() {
  const client = getClient('development');
  /**
   * We are assuming you know the subject of the text you want to delete. Then
   * we don't have to fetch all texts in advance.
   */
  const subjectResponse = await prompts([
    {
      type: 'text',
      name: 'subject',
      message: `What is the subject?`,
    },
  ]);

  const { subject } = subjectResponse;

  {
    /**
     * Fetch all texts in given subject
     */
    const allTexts = (await client
      .fetch(
        `*[_type == 'lokalizeText' && subject == '${subject}']| order(path asc)`
      )
      .catch((err) => {
        throw new Error(`Failed to fetch localizeTexts: ${err.message}`);
      })) as LokalizeText[];

    assert(
      !isEmpty(allTexts),
      `There are no known texts for subject ${subject}`
    );

    const choices = allTexts.map((x) => ({ title: x.path, value: x.path }));

    const response = await prompts([
      {
        type: 'multiselect',
        name: 'paths',
        message: `What path in ${subjectResponse.subject}?`,
        choices,
        validate: (x) => x.length > 0,
      },
      {
        type: (prev) => (prev.length > 0 ? 'confirm' : null),
        name: 'confirmed',
        message: (_prev, values) => {
          return `Are you sure you want to delete:\n\n${values.paths
            .map((x: string) => `${subject}.${x}`)
            .join('\n')}`;
        },
      },
    ]);

    if (response.confirmed) {
      const documentIdsToDelete = allTexts
        .filter((x) => response.paths.includes(x.path))
        .map((x) => x._id);

      const transaction = documentIdsToDelete.reduce(
        (tx, id) => tx.delete(id),
        client.transaction()
      );

      await transaction.commit();

      for (const path of response.paths) {
        const key = `${subject}.${path}`;
        appendTextMutation('delete', key);
      }

      console.log(
        `Successfully deleted ${documentIdsToDelete.length} documents`
      );
    } else {
      console.log('No documents were deleted');
    }
  }
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});
