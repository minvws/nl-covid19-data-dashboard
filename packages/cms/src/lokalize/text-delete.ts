/**
 * Add a text to the Sanity "Lokalize" dataset
 */

import prompts from 'prompts';
import { client } from '../client';
import { LokalizeText } from './types';

(async function run() {
  const subjectResponse = await prompts([
    {
      type: 'text',
      name: 'subject',
      message: `What is the subject?`,
    },
  ]);

  const choices = await client
    .fetch(
      `*[_type == 'lokalizeText' && subject == 'charts']| order(subject asc)`
    )
    .then((result: LokalizeText[]) =>
      result.map((x) => ({ title: x.path, value: x.path }))
    )
    .catch((err) => {
      throw new Error(`Failed to fetch localizeTexts: ${err.message}`);
    });

  const pathsResponse = await prompts([
    {
      type: 'multiselect',
      name: 'paths',
      message: `What path in ${subjectResponse.subject}?`,
      choices: choices,
    },
  ]);

  console.log(pathsResponse.paths);

  const confirmResponse = await prompts([
    {
      type: 'confirm',
      name: 'confirmed',
      message: `Are you sure you want to delete:\n\n${pathsResponse.paths
        .map((x: string) => `${subjectResponse.subject}.${x}`)
        .join('\n')}`,
    },
  ]);

  if (confirmResponse.confirmed) {
    console.log('@TODO Deleting stuff...');
  } else {
    console.log('Nothing got deleted');
  }
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});
