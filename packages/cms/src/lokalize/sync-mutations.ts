import chalk from 'chalk';
import prompts from 'prompts';
import { getClient } from '../client';
import {
  appendTextMutation,
  exportLokalizeTexts,
  getLocalMutations,
} from './logic';

(async function run() {
  const mutations = await getLocalMutations();

  const choices = [
    ...mutations.add.map(
      (mutation) =>
        ({
          title: chalk.green(`add:    ${mutation.key}`),
          value: { type: 'add', mutation },
        } as const)
    ),
    ...mutations.delete.map(
      (mutation) =>
        ({
          title: chalk.red(`delete: ${mutation.key}`),
          value: { type: 'delete', mutation },
        } as const)
    ),
    ...mutations.move.map(
      (mutation) =>
        ({
          title: `move:   ${mutation.oldKey} → ${mutation.key}`,
          value: { type: 'move', mutation },
        } as const)
    ),
  ];

  if (!choices.length) return console.log('\nNo changes to sync\n');

  const response = (await prompts({
    type: 'multiselect',
    name: 'keys',
    message: 'Select the mutations to sync to Sanity:',
    choices,
    onState,
  })) as { keys: typeof choices[number]['value'][] };

  if (!response.keys.length) return console.log('\nNo mutations selected\n');

  for (const choice of response.keys) {
    if (choice.type === 'delete') {
      const { key } = choice.mutation;
      await appendTextMutation('delete', key);
    }

    if (choice.type === 'add') {
      const { key, text } = choice.mutation;
      await appendTextMutation('add', key);
      await getClient().create(createTextDocument(key, text));
    }

    if (choice.type === 'move') {
      const { key, text, oldKey } = choice.mutation;
      await appendTextMutation('delete', oldKey);
      await appendTextMutation('add_via_move', key);
      await getClient().create(createTextDocument(key, text));
    }
  }

  console.log('Updating text export...');
  await exportLokalizeTexts();

  console.log(
    'Successfully applied the following mutations:\n',
    JSON.stringify(response.keys, null, 2)
  );
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});

function createTextDocument(key: string, nl: string, en = '') {
  /**
   * Here we split the key into a subject and (remaining) path. This is required
   * for the way LokalizeText documents are queried in Sanity. But possibly we
   * can work with just the key and omit subject+path from the object.
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
