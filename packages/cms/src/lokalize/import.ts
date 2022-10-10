/**
 * This script imports LokalizeText documents from Sanity as a locale JSON file,
 * and strips any keys that have been marked by the key-mutations.csv file as a
 * result of text changes via the CLI.
 */
import { isEmpty } from 'lodash';
import meow from 'meow';
import { outdent } from 'outdent';
import prompts from 'prompts';
import { getLocalMutations, readReferenceTexts } from './logic';
import { importLokalizeTexts } from './logic/import';

const cli = meow(
  `
    Usage
      $ lokalize:import

    Options
      --dataset Define dataset to import, default is "development"
      --clean-json Export without document-ids in the keys

    Examples
      $ lokalize:import --dataset=development
      $ lokalize:import --dataset=development --clean-json
`,
  {
    flags: {
      dataset: {
        type: 'string',
        default: 'development',
      },
      cleanJson: {
        type: 'boolean',
      },
    },
  }
);

(async function run() {
  const dataset = cli.flags.dataset;

  console.log(`We are exporting the shortcopy and translations from the ${dataset} dataset`);
  console.log(`There's a chance this command will fail if you don't have a valid Sanity token set in packages/cms/.env.local`);

  const referenceTexts = await readReferenceTexts();

  if (referenceTexts) {
    const mutations = await getLocalMutations(referenceTexts);

    if (!isEmpty(mutations.add) || !isEmpty(mutations.delete) || !isEmpty(mutations.move)) {
      const response = await prompts([
        {
          type: 'confirm',
          name: 'isConfirmed',
          message: outdent`
            There are local changes. Are you sure you want to overwrite these with an import?

            ${JSON.stringify(mutations, null, 2)}
          `,
          initial: false,
        },
      ]);

      if (!response.isConfirmed) {
        process.exit(0);
      }
    }
  }

  await importLokalizeTexts({
    dataset,
    appendDocumentIdToKey: !cli.flags.cleanJson,
  });

  console.log(`Import dataset "${dataset}" completed`);
})().catch((err) => {
  console.error(`Import failed: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
