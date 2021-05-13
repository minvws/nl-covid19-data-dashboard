/**
 * Add one or multiple texts to the Sanity "Lokalize" dataset.
 */
import meow from 'meow';
import prompts from 'prompts';
import { getClient } from '../client';
import { appendTextMutation, exportLokalizeTexts } from './logic';
import { LokalizeText } from './types';

(async function run() {
  const cli = meow(
    `
      Usage
        $ add-text

      Options
        --key, -k The new text key to add in dot-notation

      Examples
        $ add-text -k some.unique.path
    `,
    {
      flags: {
        key: {
          type: 'string',
          alias: 'k',
        },
      },
    }
  );

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

  const existingKeys = allTexts.map((x) => x.key);

  let additionsCounter = 0;

  while (true) {
    const textDocument = await createTextDocument(existingKeys, cli.flags.key);

    console.log({
      key: textDocument.key,
      nl: textDocument.text.nl,
      en: textDocument.text.en,
    });

    {
      const response = await prompts([
        {
          type: 'confirm',
          name: 'confirmed',
          message: 'Is this correct?',
          onState,
        },
      ]);

      if (response.confirmed) {
        await client.create(textDocument);

        await appendTextMutation('add', textDocument.key);

        console.log(`Successfully created ${textDocument.key}`);

        existingKeys.push(textDocument.key);

        additionsCounter++;
      }
    }
    {
      const response = await prompts([
        {
          type: 'confirm',
          name: 'continue',
          message: 'Add another text?',
          onState,
        },
      ]);

      if (!response.continue) {
        if (additionsCounter > 0) {
          console.log('Updating text export...');
          await exportLokalizeTexts();
        }
        process.exit();
      }
    }
  }
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});

/**
 * There is currently no native way to exit prompts on ctrl-c. This is a
 * workaround that needs to be added to every prompts instance. For more info
 * see: https://github.com/terkelg/prompts/issues/252#issuecomment-778683666
 */
function onState(state: { aborted: boolean }) {
  if (state.aborted) {
    process.nextTick(() => {
      process.exit(0);
    });
  }
}

async function createTextDocument(existingKeys: string[], initialKey?: string) {
  const response = await prompts([
    {
      type: 'text',
      name: 'key',
      message: 'What is the key? (Use snake_cased.dot.notation)',
      initial: initialKey,
      validate: (x: string) => {
        /**
         * Validation requires the key to be new and also to only contain
         * lower-snake-case paths in dot notation.
         *
         * @TODO improve the regexp so that the key is not allowed to end in a
         * dot. https://regex101.com/r/RJaXUv/1
         */
        return (
          existingKeys.find((key) => key === x) === undefined &&
          /^([a-z_]+\.?)+$/.test(x)
        );
      },
      onState,
    },
    {
      type: 'text',
      name: 'nl',
      message: 'What is the Dutch text?',
      format: (x: string) => x.trim(),
      validate: (x: string) => x.length > 1,
      onState,
    },
    {
      type: 'text',
      name: 'en',
      message: 'What is the English text? (optional)',
      format: (x: string) => {
        const value = x.trim();
        return value.length > 0 ? value : undefined;
      },
      onState,
    },
  ]);

  /**
   * Here we split the key into a subject and (remaining) path. This is required
   * for the way LokalizeText documents are queried in Sanity. But possibly we
   * can work with just the key and omit subject+path from the object.
   *
   * @TODO see if key is enough to build the UI in Sanity.
   */
  const [subject, ...pathElements] = response.key.split('.');
  const path = pathElements.join('.');

  const text: Omit<LokalizeText, '_id'> = {
    _type: 'lokalizeText',
    key: response.key,
    subject,
    path,
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
