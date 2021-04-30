/**
 * Request to delete one or multiple texts from the Sanity "Lokalize" dataset.
 * This doesn't actually delete the key from the dataset straight away, but only
 * write to the mutations log.
 *
 * This prevents us from breaking the build for other branches that still depend
 * on those keys.
 *
 * After this script an export will be triggered, and the export will then
 * apply the mutations to the output. This way you can write your feature branch
 * with a set of texts that have mutations that only apply to your branch.
 */
import { assert } from '@corona-dashboard/common';
import { isEmpty } from 'lodash';
import prompts from 'prompts';
import { getClient } from '../client';
import { appendTextMutation } from './logic';
import { LokalizeText } from './types';

(async function run() {
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
    const allTexts = (await getClient()
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
      for (const path of response.paths) {
        const key = `${subject}.${path}`;
        appendTextMutation('delete', key);
      }

      console.log(`Marked ${response.paths} documents for deletion`);
    } else {
      console.log('No documents were marked for deletion');
    }
  }
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});
