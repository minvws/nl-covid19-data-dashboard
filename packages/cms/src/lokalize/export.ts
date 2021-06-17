/**
 * This script exports LokalizeText documents from Sanity as a locale JSON file,
 * and strips any keys that have been marked by the key-mutations.csv file as a
 * result of text changes via the CLI.
 */
import meow from 'meow';
import path from 'path';
import { exportLokalizeTexts } from './logic/export';

const cli = meow(
  `
    Usage
      $ lokalize:export

    Options
      --drafts Include draft documents
      --dataset Define dataset to export, default is "development"

    Examples
      $ lokalize:export --drafts --dataset=development
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
    },
  }
);

(async function run() {
  const dataset = cli.flags.dataset;

  await exportLokalizeTexts(dataset, cli.flags.drafts);

  console.log(`Export dataset "${dataset}" completed`);
})().catch((err) => {
  console.error(`Export failed: ${err.message}`);
  process.exit(1);
});
