/**
 * Add one or multiple texts to the Sanity "Lokalize" dataset.
 */

import { set } from 'lodash';
import prompts from 'prompts';
import { client } from '../client';
import { LokalizeText } from './types';

(async function run() {
  const allTexts = (await client
    .fetch(`*[_type == 'lokalizeText']`)
    .catch((err) => {
      throw new Error(`Failed to fetch texts: ${err.message}`);
    })) as LokalizeText[];

  const allSubjects = Object.keys(
    allTexts.reduce((acc, x) => set(acc, x.subject, true), {})
  );

  const subjectChoices = Object.keys(
    allTexts.reduce((acc, x) => set(acc, x.subject, true), {})
  ).map((x) => ({ title: x, value: x }));

  const response = await prompts([
    {
      type: 'confirm',
      name: 'listSubjects',
      message: 'List existing subjects?',
      initial: false,
    },
    {
      type: (_, values) => (values.listSubjects ? 'select' : null),
      name: 'subject',
      message: `Select a subject`,
      choices: subjectChoices,
    },
    {
      type: (_, values) => (values.listSubjects ? null : 'text'),
      name: 'subject',
      message: `What is the subject?`,
      format: (x: string) => x.toLowerCase(),
      validate: (x: string) => !allSubjects.includes(x),
    },
  ]);

  const { subject } = response;

  let continueCreating = true;

  while (continueCreating) {
    const textDocument = await createTextDocumentForSubject(subject, allTexts);

    console.table(textDocument);

    const response = await prompts(
      [
        {
          type: 'confirm',
          name: 'confirmed',
          message: 'Is this what you want to add?',
        },
        {
          type: 'confirm',
          name: 'continue',
          message: 'Create another text in the same subject?',
        },
      ],
      {
        onCancel: () => {
          continueCreating = false;
        },
      }
    );

    if (response.confirmed) {
      await client.create(textDocument);

      console.log(
        `Successfully created ${textDocument.subject}.${textDocument.path}`
      );
    }

    if (!response.continue) {
      continueCreating = false;
    }
  }
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});

async function createTextDocumentForSubject(
  subject: string,
  allTexts: LokalizeText[]
) {
  const response = await prompts([
    {
      type: 'text',
      name: 'path',
      message: 'What is the path in dot notation?',
      format: (x: string) => x.toLowerCase(),
      /**
       * Do not allow creating a text with a path that already exists
       */
      validate: (x: string) =>
        allTexts.find((text) => text.path == x) === undefined,
    },
    {
      type: 'text',
      name: 'nl',
      message: 'What is the Dutch text?',
      format: (x: string) => x.trim(),
      validate: (x: string) => x.length > 1,
    },
    {
      type: 'text',
      name: 'en',
      message: 'What is the English text? (optional)',
      format: (x: string) => {
        const value = x.trim();
        return value.length > 0 ? value : undefined;
      },
    },
  ]);

  return {
    _type: 'lokalizeText',
    subject,
    path: response.path,
    lokalize_path: `${subject}.${response.path}`.split('.').join('::'),
    text: {
      _type: 'localeText',
      nl: response.nl,
      en: response.en,
    },
  };
}
