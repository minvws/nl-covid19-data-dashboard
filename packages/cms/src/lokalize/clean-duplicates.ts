import chalk from 'chalk';
import meow from 'meow';
import prompts from 'prompts';
import { getClient } from '../client';

/**
 * This tool should ideally never needed to be used. It was written after some bugs were determined in the
 * apply-json-edits script where sometimes duplicate keys ended up in the Sanity dataset, and this tool
 * allowed for an easy way to fix those errors.
 *
 * After the apply-json-edits script was fixed, duplicates shouldn't occur anymore. But, if for some reason
 * they happen again, this tool can assist in making fixes.
 *
 */
type LokalizeText = {
  _id: string;
  key: string;
  text: {
    _type: string;
    nl: string;
    en: string;
  };
};

const cli = meow(
  `
      Usage
        $ lokalize:dedupe
  
      Options
        --dataset Define dataset to export, default is "development"
  
      Examples
        $ lokalize:dedupe --dataset=production
  `,
  {
    flags: {
      dataset: {
        type: 'string',
        default: 'development',
      },
    },
  }
);

(async function run() {
  const dataset = cli.flags.dataset;
  const sanityClient = getClient(dataset);

  const texts = await sanityClient.fetch<LokalizeText[]>("*[_type == 'lokalizeText' && !(_id in path('drafts.**'))]{_id, key, text}");

  const duplicates = texts.reduce<Record<string, LokalizeText[]>>((aggr: any, text: any) => {
    if (!aggr[text.key]) {
      aggr[text.key] = [];
    }
    aggr[text.key].push(text);
    return aggr;
  }, {} as Record<string, LokalizeText[]>);

  Object.keys(duplicates).forEach((key) => {
    if (duplicates[key].length < 2) {
      delete duplicates[key];
    }
  });

  if (Object.keys(duplicates).length === 0) {
    console.log('No duplicate keys found...');
    process.exit(0);
  }

  const choices = Object.entries(duplicates)
    .map(([key, duplicates]) => {
      return duplicates.map(
        (duplicate) =>
          ({
            title: chalk.green(`${key}\t\t${duplicate.text.nl}`),
            value: duplicate,
          } as const)
      );
    })
    .flat();

  const duplicateResponse = (await prompts({
    type: 'multiselect',
    name: 'keys',
    message: 'Select the duplicate lokalize texts that will be deleted:',
    choices,
    onState,
  })) as { keys: typeof choices[number]['value'][] };

  const completeDeletions = findCompleteDeletions(duplicateResponse.keys, duplicates);

  if (completeDeletions.size > 0) {
    const response = await prompts([
      {
        type: 'confirm',
        name: 'isConfirmed',
        message: `The following keys will be deleted completely (all documents were selected): ${Array.from(completeDeletions).join(', ')}.\nAre you sure?`,
        initial: false,
      },
    ]);

    if (!response.isConfirmed) {
      process.exit(0);
    }
  }

  await Promise.all(duplicateResponse.keys.map((x) => sanityClient.delete(x._id)));
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

function findCompleteDeletions(responseTexts: LokalizeText[], duplicates: Record<string, LokalizeText[]>) {
  const responseDuplicates = responseTexts.reduce<Record<string, LokalizeText[]>>((aggr: any, text: any) => {
    if (!aggr[text.key]) {
      aggr[text.key] = [];
    }
    aggr[text.key].push(text);
    return aggr;
  }, {} as Record<string, LokalizeText[]>);

  return Object.keys(responseDuplicates).reduce((aggr, key) => {
    if (responseDuplicates[key].length === duplicates[key].length) {
      aggr.add(key);
    }
    return aggr;
  }, new Set<string>());
}
