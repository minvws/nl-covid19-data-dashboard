/**
 * This script exports LokalizeText documents from Sanity as a locale JSON file,
 * and strips any keys that have been marked by the key-mutations.csv file as a
 * result of text changes via the CLI.
 */
import { isEmpty } from 'lodash';
import meow from 'meow';
import prompts from 'prompts';
import { getLocalMutations, readReferenceTexts } from './logic';
import { exportLokalizeTexts } from './logic/export';

const cli = meow(
  `
    Usage
      $ lokalize:export

    Options
      --drafts Include draft documents
      --dataset Define dataset to export, default is "development"
      --clean-json Export without document-ids in the keys

    Examples
      $ lokalize:export --drafts --dataset=development
      $ lokalize:export --dataset=development --clean-json
`,
  {
    flags: {
      drafts: {
        type: 'boolean',
      },
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

  const referenceTexts = await readReferenceTexts();

  if (referenceTexts) {
    const mutations = await getLocalMutations(referenceTexts);

    if (
      (mutations && !isEmpty(mutations.add)) ||
      !isEmpty(mutations.delete) ||
      !isEmpty(mutations.move)
    ) {
      const response = await prompts([
        {
          type: 'confirm',
          name: 'isConfirmed',
          message: `
  There are local changes. Are you sure you want to overwrite these with an export?
  ${JSON.stringify(mutations, null, 2)}
  `.trim(),
          initial: false,
        },
      ]);

      if (!response.isConfirmed) {
        process.exit(0);
      }
    }
  }

  await exportLokalizeTexts({
    dataset,
    includeDrafts: cli.flags.drafts,
    appendDocumentIdToKey: !cli.flags.cleanJson,
  });

  console.log(`Export dataset "${dataset}" completed`);
})().catch((err) => {
  console.error(`Export failed: ${err.message}`);
  process.exit(1);
});
