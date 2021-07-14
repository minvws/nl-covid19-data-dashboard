/**
 * Add one or multiple texts to the Sanity "Lokalize" dataset.
 */
import meow from 'meow';
import prompts from 'prompts';
import { getClient } from '../client';
import {
  appendTextMutation,
  exportLokalizeTexts,
  fetchExistingKeys,
  fetchLocalTextsFlatten,
} from './logic';

let additionsCounter = 0;

(async function run() {
  const cli = meow(
    `
      Usage
        $ add-text

      Options
        --key, -k The new text key to add in dot-notation
        --sync -s Sync locally added texts to nl_export.json to Sanity

      Examples
        $ add-text -k some.unique.path
        $ add-text --sync
    `,
    {
      flags: {
        key: {
          type: 'string',
          alias: 'k',
        },
        sync: {
          type: 'boolean',
          alias: 's',
        },
      },
    }
  );

  const existingKeys = await fetchExistingKeys();

  if (cli.flags.sync) {
    const localTextsFlatten = await fetchLocalTextsFlatten();

    const newKeys = Object.keys(localTextsFlatten).filter(
      (key) => !existingKeys.includes(key)
    );

    const response: { keys: string[] } = await prompts({
      type: 'multiselect',
      name: 'keys',
      message: 'Select the local keys to add to Sanity:',
      choices: newKeys.map((key) => ({
        title: `${key}: ${localTextsFlatten[key]}`,
        value: key,
      })),
      onState,
    });

    if (response.keys.length) {
      const client = getClient();

      const textDocuments = response.keys.map((key) =>
        createTextDocument(key, localTextsFlatten[key])
      );

      for (const textDocument of textDocuments) {
        await client.create(textDocument);

        await appendTextMutation('add', textDocument.key);

        console.log(`Successfully created ${textDocument.key}`);

        existingKeys.push(textDocument.key);

        additionsCounter++;
      }
    }

    return;
  }

  while (true) {
    const textDocument = await createTextDocumentFromPrompt(
      existingKeys,
      cli.flags.key
    );

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
        const client = getClient();

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
        break;
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
    if (additionsCounter > 0) {
      console.log('Updating text export...');
      exportLokalizeTexts().finally(() => {
        process.exit(0);
      });
    } else {
      process.nextTick(() => {
        process.exit(0);
      });
    }
  }
}

async function createTextDocumentFromPrompt(
  existingKeys: string[],
  initialKey?: string
) {
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
         * https://regexr.com/5t2lg
         */
        return (
          existingKeys.find((key) => key === x) === undefined &&
          /^[a-z_]+(\.[a-z0-9_]+)+$/.test(x)
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

  return createTextDocument(response.key, response.nl, response.en);
}

function createTextDocument(key: string, nl: string, en = '') {
  /**
   * Here we split the key into a subject and (remaining) path. This is required
   * for the way LokalizeText documents are queried in Sanity. But possibly we
   * can work with just the key and omit subject+path from the object.
   *
   * @TODO see if key is enough to build the UI in Sanity.
   */
  const [subject, ...pathElements] = key.split('.');
  const path = pathElements.join('.');

  return {
    _type: 'lokalizeText',
    key,
    subject,
    path,
    is_newly_added: true,
    publish_count: 0,
    should_display_empty: false,
    text: {
      _type: 'localeText',
      nl,
      en,
    },
  };
}
