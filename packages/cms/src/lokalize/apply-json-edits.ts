import { assert } from '@corona-dashboard/common';
import chalk from 'chalk';
import prompts from 'prompts';
import { getClient } from '../client';
import {
  appendTextMutation,
  exportLokalizeTexts,
  getLocalMutations,
  readReferenceTexts,
} from './logic';

/**
 * Read the contents of the (edited) local export JSON file and compare it to
 * the most recent export in `.lokalize-reference` to see if there are any
 * changes. Prompt the user with these changes before writing to the mutations
 * log file and possibly adding new documents to Sanity.
 */
(async function run() {
  const referenceTexts = await readReferenceTexts();

  assert(
    referenceTexts,
    `Failed to read reference texts. Please run lokalize:export first.`
  );

  const mutations = await getLocalMutations(referenceTexts);

  const choices = [
    ...mutations.add.map(
      (mutation) =>
        ({
          title: chalk.green(`add:\t\t${mutation.key}`),
          value: { type: 'add', mutation },
        } as const)
    ),
    ...mutations.delete.map(
      (mutation) =>
        ({
          title: chalk.red(`delete:\t${mutation.key}`),
          value: { type: 'delete', mutation },
        } as const)
    ),
    ...mutations.move.map(
      (mutation) =>
        ({
          title: `move:\t\t${mutation.key} → ${mutation.moveTo}`,
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

  const devClient = getClient('development');

  for (const choice of response.keys) {
    if (choice.type === 'delete') {
      const { key, documentId } = choice.mutation;
      await appendTextMutation({ action: 'delete', key, documentId });
      /**
       * The actual deletion of documents from Sanity is postponed to
       * sync-after-feature to not break other branches.
       */
    }

    if (choice.type === 'add') {
      const { key, text } = choice.mutation;
      /**
       * First create the document in Sanity, so that we can store the document
       * id in the mutations log. We need this id later to sync to production,
       * because both datasets share their document ids for lokalize texts.
       */
      const document = await devClient.create(createTextDocument(key, text));

      await appendTextMutation({
        action: 'add',
        key,
        documentId: document._id,
      });
    }

    if (choice.type === 'move') {
      const { key, documentId, moveTo } = choice.mutation;

      await appendTextMutation({ action: 'move', key, documentId, moveTo });
    }
  }

  console.log('Updating text export...');

  await exportLokalizeTexts({
    dataset: 'development',
    appendDocumentIdToKey: true,
  });

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
   * Subject is extracted from the key, because we use that to query/group texts
   * in the Sanity UI.
   */
  const [subject] = key.split('.');

  return {
    _type: 'lokalizeText',
    key,
    subject,
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
