import chalk from 'chalk';
import meow from 'meow';
import prompts from 'prompts';
import { getClient } from '../client';
import { createTextDocument } from './logic/create-text-document';

/**
 * This script allows a developer to manually add a lokalize document to Sanity (either to the development or production dataset)
 * Usually this script shouldn't be required to be used, because all mutations to the lokalize documents should ideally be
 * handled by editing the `nl_export.json` file and running the `lokalize:apply-json-edits` command.
 * But if a situation arises where the mutations file becomes out of sync with the Sanity dataset, this script can help fix this.
 */
const cli = meow(
  `
        Usage
          $ lokalize:add
    
        Options
          --dataset Define dataset that the new key/value will be added to, default is "development"
    
        Examples
          $ lokalize:add --dataset=production
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

  const newKeyResponse = (await prompts({
    type: 'text',
    name: 'newKey',
    message: 'Specify the name of the new key:',
    onState,
  })) as { newKey: string };

  if (!newKeyResponse.newKey.length) {
    console.error(chalk.red('Please provide a valid name'));
    process.exit(1);
  }
  const count = await sanityClient.fetch(`count(*[_type == 'lokalizeText' && key == '${newKeyResponse.newKey}'])`);
  if (count > 0) {
    console.error(chalk.red(`A document with key '${newKeyResponse.newKey}' already exists`));
    process.exit(1);
  }

  const newValueResponse = (await prompts({
    type: 'text',
    name: 'newValue',
    message: 'Specify a value for the new key:',
    onState,
  })) as { newValue: string };

  if (!newValueResponse.newValue.length) {
    console.error(chalk.red('Please provide a valid value'));
    process.exit(1);
  }

  await sanityClient.create(createTextDocument(newKeyResponse.newKey, newValueResponse.newValue));

  console.log(chalk.green(`New lokalize document with key '${newKeyResponse.newKey}' and value '${newValueResponse.newValue}' was created`));
})().catch((err) => {
  console.error(chalk.red('An error occurred:'), err.message);
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
