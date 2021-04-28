import path from 'path';
import fs from 'fs';
import { EOL } from 'os';
import { parse } from '@fast-csv/parse';
import { set } from 'lodash';

const MUTATIONS_LOG_FILE = path.join(__dirname, 'key-mutations.csv');
const HEADER = `timestamp,action,key${EOL}`;

interface TextMutation {
  timestamp: string;
  action: 'add' | 'delete';
  key: string;
}

export function clearLogFile() {
  try {
    fs.writeFileSync(MUTATIONS_LOG_FILE, HEADER);
  } catch (err) {
    console.error(
      `Failed to clear mutations log file ${MUTATIONS_LOG_FILE}: ${err.message}`
    );
  }
}

export function appendTextMutation(action: 'add' | 'delete', key: string) {
  const timestamp = new Date().toISOString();

  try {
    const line = `${timestamp},${action},${key}${EOL}`;
    fs.appendFileSync(MUTATIONS_LOG_FILE, line);
  } catch (err) {
    console.error(
      `Failed to write mutation to file ${MUTATIONS_LOG_FILE}: ${err.message}`
    );
  }
}

export function readTextMutations() {
  return new Promise<TextMutation[]>((resolve, reject) => {
    let mutations: TextMutation[] = [];

    const stream = parse({ headers: true })
      .on('error', (err) => reject(err))
      .on('data', (x) => mutations.push(x))
      .on('end', (rowCount: number) => {
        console.log(`Parsed ${rowCount} rows`);
        resolve(mutations);
      });

    stream.write(fs.readFileSync(MUTATIONS_LOG_FILE));
    stream.end();
  });
}

/**
 * This function collapses the mutations so that an add + delete (or vice-versa)
 * doesn't result in any sync action. It will return the action to take together
 * with the last mutation timestamp for that key. This way we can choose to
 * filter out "delete" actions or postpone any delete actions for x days, making
 * it possible to delete items from the production dataset without risking
 * deleting keys for items that might still be in use by the time the sync is
 * ran.
 */
export function collapseTextMutations(mutations: TextMutation[]) {
  const weightByAction = {
    add: 1,
    delete: -1,
  } as const;

  const collapsedKeys = mutations.reduce((acc, mut) => {
    const prev = acc[mut.key] || { weight: 0, timestamp: 0 };

    return set(acc, mut.key, {
      weight: weightByAction[mut.action] + prev.weight,
      timestamp: mut.timestamp,
    });
  }, {} as Record<string, { weight: number; timestamp: string }>);

  return (
    Object.entries(collapsedKeys)
      // For these keys the actions cancelled each other out
      .filter(([__key, v]) => v.weight === 0)
      // For the others we map the data back to mutation objects
      .map(
        ([key, { weight, timestamp }]) =>
          ({
            key,
            action: weight > 0 ? 'add' : 'delete',
            timestamp,
          } as TextMutation)
      )
  );
}
