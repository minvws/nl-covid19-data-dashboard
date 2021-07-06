import { assert } from '@corona-dashboard/common';
import { appendTextMutation, getLocalMutations } from './logic';

(async function run() {
  const { mutations, removedKeyIdPairs } = await getLocalMutations();

  for (const [_id, key] of Object.entries(mutations.delete)) {
    await appendTextMutation('delete', key);
  }

  for (const [_id, key] of Object.entries(mutations.add)) {
    await appendTextMutation('add', key);
  }

  for (const [id, key] of Object.entries(mutations.move)) {
    const oldKey = removedKeyIdPairs.find((x) => x[1] === id)?.[0];
    assert(oldKey, `could not find old key for id ${id}`);

    await appendTextMutation('delete', oldKey);
    await appendTextMutation('add_via_move', key);
  }
})().catch((err) => {
  console.error('An error occurred:', err.message);
  process.exit(1);
});
