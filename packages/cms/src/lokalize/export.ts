/**
 * This script exports LokalizeText documents from Sanity as a locale JSON file,
 * and strips any keys that have been marked by the key-mutations.csv file as a
 * result of text changes via the CLI.
 */
import meow from 'meow';
import prompts from 'prompts';
import { fetchLocalTextsFromCacheFlatten, getLocalMutations } from './logic';
import { exportLokalizeTexts } from './logic/export';

const cli = meow(
  `
    Usage
      $ lokalize:export

    Options
      --drafts Include draft documents
      --dataset Define dataset to export, default is "development"
      --production Export keys without document-ids in the keys

    Examples
      $ lokalize:export --drafts --dataset=development
      $ lokalize:export --dataset=development --production
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
      production: {
        type: 'boolean',
      },
    },
  }
);

(async function run() {
  const dataset = cli.flags.dataset;

  const { hasMutations, mutations } = await checkMutations();

  if (hasMutations && !cli.flags.production) {
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

  await exportLokalizeTexts(dataset, cli.flags.drafts, !cli.flags.production);

  console.log(`Export dataset "${dataset}" completed`);
})().catch((err) => {
  console.error(`Export failed: ${err.message}`);
  process.exit(1);
});

async function checkMutations() {
  const hasCachedTexts = await fetchLocalTextsFromCacheFlatten()
    .then(() => true)
    .catch(() => false);

  const mutations = hasCachedTexts ? await getLocalMutations() : undefined;

  return {
    hasMutations: mutations
      ? [...mutations.add, ...mutations.delete, ...mutations.move].length > 0
      : false,
    mutations,
  };
}
