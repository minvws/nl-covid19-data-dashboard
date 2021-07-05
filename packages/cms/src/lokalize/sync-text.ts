import { assert } from '@corona-dashboard/common';
import {
  appendTextMutation,
  fetchLocalTextsFromCacheFlatten,
  fetchLocalTextsFlatten,
} from './logic';

(async function run() {
  const oldKeys = Object.keys(await fetchLocalTextsFromCacheFlatten());
  const newKeys = Object.keys(await fetchLocalTextsFlatten());

  const removedKeyIdPairs = oldKeys
    .filter((key) => !newKeys.includes(key))
    .map(parseKeyWithId);

  const addedKeyIdPairs = newKeys
    .filter((key) => !oldKeys.includes(key))
    .map(parseKeyWithId);

  const mutations: Record<'add' | 'move' | 'delete', Record<string, string>> = {
    add: {},
    move: {},
    delete: {},
  };

  removedKeyIdPairs.forEach(([key, id]) => {
    mutations.delete[id] = key;
  });

  addedKeyIdPairs.forEach(([key, id]) => {
    if (mutations.delete[id]) {
      delete mutations.delete[id];
      mutations.move[id] = key;
    } else {
      mutations.add[key] = key;
    }
  });

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

function parseKeyWithId(keyWithId: string) {
  const [key, id] = keyWithId.split('__@');
  return [key, id] as [key: string, id: string];
}
