/**
 * Request to delete one or multiple texts from the Sanity "Lokalize" dataset.
 * This doesn't actually delete the key from the dataset straight away, but only
 * writes to the mutations log.
 *
 * This prevents us from breaking the build for other branches that still depend
 * on those keys.
 *
 * After this script an export will be triggered, and the export will then
 * apply the mutations to the output. This way you can write your feature branch
 * with a set of texts that have mutations that only apply to your branch.
 */
import meow from 'meow';
import prompts from 'prompts';
import {
  appendTextMutation,
  exportLokalizeTexts,
  fetchExistingKeys,
} from './logic';

(async function run() {
  const cli = meow(
    `
      Usage
        $ delete-text

      Options
        --key, -k The text key to delete in dot-notation.

      Examples
        $ delete-text -k some.existing.path
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

  const existingKeys = await fetchExistingKeys();

  const initialKey = cli.flags.key;

  let deletionsCounter = 0;

  const choices = existingKeys.map((x) => ({ title: x, value: x }));

  if (initialKey) {
    /**
     * When an initial key is provided via the --key flag we do not show a multi
     * select, because there is no nice state before you start typing. It always
     * shows a full list of choices.
     */
    const response = await prompts([
      {
        type: 'text',
        name: 'key',
        initial: initialKey,
        message: `What is the key?`,
        validate: (x) => existingKeys.includes(x),
      },
      {
        type: 'confirm',
        name: 'confirmed',
        message: (prev) => {
          return `Are you sure you want to delete key: ${prev}`;
        },
      },
    ]);

    if (response.confirmed) {
      appendTextMutation('delete', response.key);
      deletionsCounter++;
    }
  } else {
    const response = await prompts([
      {
        type: 'autocompleteMultiselect',
        name: 'keys',
        message: `What keys do you want to delete?`,
        choices,
      },
      {
        type: (prev) => (prev.length > 0 ? 'confirm' : null),
        name: 'confirmed',
        message: (_prev, values) => {
          return `Are you sure you want to delete:\n\n${values.keys.join(
            '\n'
          )}`;
        },
      },
    ]);

    if (response.confirmed) {
      for (const key of response.keys) {
        appendTextMutation('delete', key);
        deletionsCounter++;
      }
    }
  }

  if (deletionsCounter > 0) {
    console.log(`Marked ${deletionsCounter} documents for deletion`);
    console.log('Updating text export...');
    await exportLokalizeTexts();
  } else {
    console.log('No documents were marked for deletion');
  }
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});
