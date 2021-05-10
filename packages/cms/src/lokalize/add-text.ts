/**
 * Add one or multiple texts to the Sanity "Lokalize" dataset.
 */
import { set, uniq } from 'lodash';
import prompts from 'prompts';
import { getClient } from '../client';
import { appendTextMutation } from './logic';
import { LokalizeText } from './types';

(async function run() {
  const client = getClient();

  /**
   * @TODO We could cache the subjects in a temp location on disk and update
   * them every time this CLI is run. This way we can avoid having to wait for
   * the query to return.
   */
  const allTexts = (await client
    .fetch(`*[_type == 'lokalizeText']`)
    .catch((err) => {
      throw new Error(`Failed to fetch texts: ${err.message}`);
    })) as LokalizeText[];

  const allSubjects = uniq(allTexts.map((x) => x.subject));

  const subjectChoices = allSubjects.map((x) => ({ title: x, value: x }));

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

      const key = `${textDocument.subject}.${textDocument.path}`;
      await appendTextMutation('add', key);

      console.log(`Successfully created ${key}`);
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

  const text: Omit<LokalizeText, '_id'> = {
    _type: 'lokalizeText',
    key: `${subject}.${response.path}`,
    subject,
    path: response.path,
    is_newly_added: true,
    publish_count: 0,
    should_display_empty: false,
    text: {
      _type: 'localeText',
      nl: response.nl,
      en: response.en,
    },
  };

  return text;
}
