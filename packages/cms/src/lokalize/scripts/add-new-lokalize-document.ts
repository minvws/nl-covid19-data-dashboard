import { createClient } from '@sanity/client';
import chalk from 'chalk';
import meow from 'meow';
import prompts from 'prompts';
import { client } from '../../studio/client';
import { onState } from '../../studio/utils/abort-process';
import { createLokalizeTextDocument } from '../utils/create-lokalize-text-document';
import { initialiseEnvironmentVariables } from '../utils/initialise-environment-variables';

/**
 * This script allows a developer to manually add a lokalize document to Sanity (either to the development or production dataset)
 * Usually this script shouldn't be required to be used, because all mutations to the lokalize documents should ideally be
 * handled by editing the `nl_export.json` file and running the `lokalize:apply-json-edits` command.
 * But if a situation arises where the mutations file becomes out of sync with the Sanity dataset, this script can help fix this.
 */

const cliCommand = `
  Usage
    $ lokalize:add

  Options
    --dataset Define dataset that the new key/value will be added to, default is "development"

  Examples
    $ lokalize:add --dataset=production
`;

const cli = meow(cliCommand, {
  flags: {
    dataset: {
      type: 'string',
      default: 'development',
    },
  },
});

const generateTerminalPrompt = async (name: string, message: string, client?: ReturnType<typeof createClient>) => {
  const prompt = await prompts({
    type: 'text',
    name: name,
    message: `${message}:`,
    onState,
  });

  if (!prompt[name].length) {
    console.error(chalk.red('Please provide a valid value.'));
    process.exit(1);
  }

  // Check for the count only when the prompt being created is for the Key of the new lokalize document.
  const count =
    name === 'newKey' && client
      ? await client.fetch(`//groq 
      count(*[_type == 'lokalizeText' && key == '${prompt[name]}'])
    `)
      : undefined;

  if (count && count > 0) {
    console.error(chalk.red(`A document with key '${prompt[name]}' already exists`));
    process.exit(1);
  }

  return prompt;
};

(async function run() {
  await initialiseEnvironmentVariables();
  const dataset = cli.flags.dataset;

  const sanityClient = client.withConfig({ dataset, token: process.env.SANITY_API_TOKEN });

  const newKeyPrompt = await generateTerminalPrompt('newKey', 'Specify the name of the new key', sanityClient);
  const newValuePromptNL = await generateTerminalPrompt('newValue', 'Specify a value in Dutch for the new key');
  const newValuePromptEN = await generateTerminalPrompt('newValue', 'Specify a value in English for the new key');

  await sanityClient.create(createLokalizeTextDocument(newKeyPrompt.newKey, newValuePromptNL.newValue, newValuePromptEN.newValue));

  console.log(
    chalk.green(`
    New lokalize document with key '${newKeyPrompt.newKey}' and values of '${newValuePromptNL.newValue}' and '${newValuePromptEN.newValue}' was created.
  `)
  );
})().catch((error) => {
  console.error(chalk.red('An error occurred:'), error.message);
  process.exit(1);
});
