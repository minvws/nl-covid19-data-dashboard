/**
 * Delete one of multiple texts from the Sanity "Lokalize" dataset.
 */

import prompts from 'prompts';
import { client } from '../client';
import { LokalizeText } from './types';
import { set } from 'lodash';
import { exists } from 'node:fs';

(async function run() {
  // const allTexts = (await client
  //   .fetch(`*[_type == 'lokalizeText']`)
  //   .catch((err) => {
  //     throw new Error(`Failed to fetch texts: ${err.message}`);
  //   })) as LokalizeText[];

  // const choices = Object.keys(
  //   allTexts.reduce((acc, x) => set(acc, x.subject, true), {})
  // ).map((x) => ({ title: x, value: x }));

  const subjectResponse = await prompts([
    {
      type: 'text',
      name: 'subject',
      message: `What is the subject?`,
    },
  ]);

  const { subject } = subjectResponse;

  {
    const choices = await client
      .fetch(
        `*[_type == 'lokalizeText' && subject == '${subject}']| order(path asc)`
      )
      .then((result: LokalizeText[]) =>
        result.map((x) => ({ title: x.path, value: x.path }))
      )
      .catch((err) => {
        throw new Error(`Failed to fetch localizeTexts: ${err.message}`);
      });

    if (choices.length === 0) {
      console.log(`There are no known texts for subject ${subject}`);
      process.exit(1);
    }

    const response = await prompts([
      {
        type: 'multiselect',
        name: 'paths',
        message: `What path in ${subjectResponse.subject}?`,
        choices: choices,
      },
      {
        type: 'confirm',
        name: 'confirmed',
        message: (_, values) =>
          `Are you sure you want to delete:\n\n${values.paths
            .map((x: string) => `${subject}.${x}`)
            .join('\n')}`,
      },
    ]);

    if (response.confirmed) {
      console.log('@TODO Deleting stuff...');
    } else {
      console.log('Nothing got deleted');
    }
  }
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});
