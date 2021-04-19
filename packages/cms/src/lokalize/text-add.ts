/**
 * Add one or multiple texts to the Sanity "Lokalize" dataset.
 */

import { set } from 'lodash';
import prompts from 'prompts';
import { client } from '../client';
import { LokalizeText } from './types';

(async function run() {
  const newSubjectResponse = await prompts([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Are you creating a new subject?',
    },
  ]);

  if (newSubjectResponse.confirmed) {
    const response = await prompts([
      {
        type: 'text',
        name: 'subject',
        message: `What is the subject?`,
        format: (x: string) => x.toLowerCase(),
      },
    ]);

    const { subject } = response;

    while (true) {
      const textDocument = await createTextDocumentForSubject(subject);

      const response = await prompts([
        {
          type: 'confirm',
          name: 'confirmed',
          message: `Does this look correct? \n\n
            ${JSON.stringify(textDocument, null, 2)}`,
        },
      ]);

      if (response.confirmed) {
        console.log('@TODO create text', textDocument);
      }

      /**
       * @TODO Here we could do something clever, where we reuse the subject and ask the
       * user to add more texts. It would be more convenient when you have to add
       * multiple texts for the same subject.
       */
      continue;
    }
  } else {
    const allTexts = (await client
      .fetch(`*[_type == 'lokalizeText']`)
      .catch((err) => {
        throw new Error(`Failed to fetch texts: ${err.message}`);
      })) as LokalizeText[];

    const choices = Object.keys(
      allTexts.reduce((acc, x) => set(acc, x.subject, true), {})
    ).map((x) => ({ title: x, value: x }));

    const response = await prompts([
      {
        type: 'select',
        name: 'subject',
        message: `What is the subject?`,
        choices,
      },
    ]);

    const { subject } = response;

    while (true) {
      const textDocument = await createTextDocumentForSubject(subject);

      const response = await prompts([
        {
          type: 'confirm',
          name: 'confirmed',
          message: `Does this look correct? \n\n
            ${JSON.stringify(textDocument, null, 2)}`,
        },
      ]);

      if (response.confirmed) {
        console.log('@TODO create text', textDocument);
      }

      /**
       * @TODO Here we could do something clever, where we reuse the subject and ask the
       * user to add more texts. It would be more convenient when you have to add
       * multiple texts for the same subject.
       */

      continue;
    }
  }
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});

async function createTextDocumentForSubject(subject: string) {
  const response = await prompts([
    {
      type: 'text',
      name: 'path',
      message: `What is the path in dot notation?`,
      format: (x: string) => x.toLowerCase(),
    },
    {
      type: 'text',
      name: 'nl',
      message: `What is the Dutch text?`,
      format: (x: string) => x.trim(),
      validate: (x: string) => x.length > 1,
    },
    {
      type: 'text',
      name: 'en',
      message: `What is the English text? (optional)`,
      format: (x: string) => x.trim(),
    },
  ]);

  return {
    _type: 'lokalizeText',
    subject,
    path: response.path,
    lokalize_path: `${`${subject}.${response.path}`.split('.').join('::')}`,
    text: {
      _type: 'localeText',
      nl: response.nl,
      en: response.en,
    },
  };
}
