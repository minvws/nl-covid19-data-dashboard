import { LokalizeText } from '@corona-dashboard/app/src/types/cms';
import { assert, ID_PREFIX, removeIdsFromKeys } from '@corona-dashboard/common';
import { parse } from '@fast-csv/parse';
import fs from 'fs';
import lodash from 'lodash';
import { EOL } from 'os';
import path from 'path';
import { hasValueAtKey, isDefined } from 'ts-is-present';
import { client } from '../../studio/client';
import { getDirectoryName } from '../../studio/utils/get-directory-name';
import { getLocaleFlatTexts } from './get-locale-files';
import { initialiseEnvironmentVariables } from './initialise-environment-variables';

const { sortBy } = lodash;

const __dirname = getDirectoryName(import.meta.url);
const MUTATIONS_LOG_FILE = path.join(__dirname, '../key-mutations.csv');

/**
 * CSV header names should correspond with TextMutation object properties,
 * because the read code interprets it without mapping.
 */
const CSV_HEADER = `timestamp,action,key,document_id,move_to${EOL}`;
export const MOVE_PLACEHOLDER_ID_PREFIX = '__move_placeholder_';

type Action = 'add' | 'delete' | 'move';

/**
 * To keep the number of CSV columns constant we use a placeholder for empty
 * values. This is possibly not needed.
 */
const NO_VALUE = '__';

export type AddMutation = {
  action: 'add';
  timestamp: string;
  key: string;
  document_id?: string;
};

export type DeleteMutation = {
  action: 'delete';
  timestamp: string;
  /**
   * Deletes are executed based on key and not document id. This is to prevent edge-cases where move and deletes
   * were performed on the same key. We execute move first, so it always prevails over delete.
   */
  key: string;
};

export type MoveMutation = {
  action: 'move';
  timestamp: string;
  key: string;
  document_id: string;
  move_to: string;
};

export type TextMutation = AddMutation | DeleteMutation | MoveMutation;

export const clearMutationsLogFile = () => {
  try {
    fs.writeFileSync(MUTATIONS_LOG_FILE, CSV_HEADER);
  } catch (err) {
    if (err instanceof Error) console.error(`Failed to clear mutations log file ${MUTATIONS_LOG_FILE}: ${err.message}`);
  }
};

type AppendTextMutationArgs = {
  action: Action;
  key: string;
  documentId: string;
  moveTo?: string;
};

export const appendTextMutation = ({ action, key, documentId, moveTo }: AppendTextMutationArgs) => {
  const timestamp = new Date().toISOString();

  try {
    const line = `${timestamp},${action},${key},${documentId},${moveTo ?? NO_VALUE}${EOL}`;

    fs.appendFileSync(MUTATIONS_LOG_FILE, line);
  } catch (err) {
    if (err instanceof Error) console.error(`Failed to write mutation to file ${MUTATIONS_LOG_FILE}: ${err.message}`);
  }
};

export const readTextMutations = () => {
  return new Promise<TextMutation[]>((resolve, reject) => {
    const mutations: TextMutation[] = [];

    const stream = parse({ headers: true })
      .on('error', (err) => reject(err))
      .on('data', (x) => mutations.push(x))
      .on('end', () => resolve(mutations));

    stream.write(fs.readFileSync(MUTATIONS_LOG_FILE));
    stream.end();
  });
};

/**
 * This function collapses the mutations so that an add + delete (or vice-versa)
 * doesn't result in any sync action. It will return the action together with
 * the last mutation timestamp for that key. Deletions are filtered out so that
 * we can run sync-after-feature half-way during the sprint to pass keys to the
 * production / communication team to prepare for release. Deletions are handled
 * differently via the sync-after-release script.
 *
 * Move actions excluded from this logic for now. In theory you can move
 * something from x.a => x.b => x.c => x.a, which should then be a noop, but
 * that doesn't seem trivial to detect.
 *
 * It's hard to wrap your head around all the edge cases that could happen from
 * moving keys together with add/delete mutations. So I think one simplified
 * approach could be:
 *
 * - First apply all add and move mutations in chronological order, so
 *   effectively x.a => x.b => x.c => x.a will still result in a no-op.
 * - Then apply any delete mutations and see if the targeted key still exist.
 *
 * This prioritizes moves over deletes, but if a delete fails as part of an
 * edge-case we can easily re-delete this key. However if a move fails it is
 * much more harmful since valuable text documents and their history might get
 * lost.
 */
export const getCollapsedAddDeleteMutations = (mutations: TextMutation[]): (AddMutation | DeleteMutation)[] => {
  const weightByAction = { add: 1, delete: -1 } as const;

  const sortedMutations = sortBy(mutations, (mutation) => mutation.timestamp);

  const collapsedKeys = sortedMutations.reduce((acc, mutation) => {
    if (mutation.action === 'move') {
      return acc;
    }

    const previousWeight = acc[mutation.key]?.weight || 0;

    acc[mutation.key] = {
      /**
       * We will perform deletes by only writing to the mutation log, to
       * prevent a delete in a feature branch from breaking the develop branch
       * builds. But this also means that we have no easy way to prevent you
       * from running multiple delete actions on the same key. To make the
       * collapse work properly, we need to limit the "amount of deletes" to
       * one when summing. This is done by clipping the weight to -1.
       */
      weight: Math.max(weightByAction[mutation.action] + previousWeight, -1),
      timestamp: mutation.timestamp,
      document_id: mutation.action === 'add' ? mutation.document_id : undefined,
    };
    return acc;
  }, {} as Record<string, { weight: number; timestamp: string; document_id?: string }>);

  /**
   * Because new keys are added immediately, but deletions are only scheduled
   * for later. We still need to mark the keys that were first newly created,
   * but later deleted as action "delete" otherwise they will not be removed
   * from the dataset.
   *
   * On the other hand, if a key existed already and as part of this branch was
   * deleted and re-added again, we do NOT want to delete the key. That is an
   * edge case but an important one.
   *
   * By keeping a list of keys that got added first (and then whatever) we can
   * determine once the final weight/action was 0/noop whether the key still
   * needs to be deleted.
   */
  const firstActionByKey = sortedMutations.reduce((acc, mutation) => {
    if (!acc[mutation.key]) {
      acc[mutation.key] = mutation.action;
    }
    return acc;
  }, {} as Record<string, Action>);

  const keysThatWereAddedAtFirst: string[] = Object.entries(firstActionByKey)
    .filter(([_key, action]) => action === 'add')
    .map(([key]) => key);

  return Object.entries(collapsedKeys)
    .map(([key, { weight, timestamp, document_id }]) => {
      switch (true) {
        case weight > 0:
          return {
            key,
            action: 'add',
            timestamp,
            document_id,
          } as AddMutation;

        case weight < 0:
        case keysThatWereAddedAtFirst.includes(key):
          return {
            key,
            action: 'delete',
            timestamp,
          } as DeleteMutation;

        default:
          return undefined;
      }
    })
    .filter(isDefined);
};

export const getCollapsedMoveMutations = (mutations: TextMutation[]) => {
  const sortedMoveMutations = sortBy(mutations, (x) => x.timestamp).filter(hasValueAtKey('action', 'move' as const));

  const finalDestinationPerId = sortedMoveMutations.reduce((acc, { document_id, move_to }) => {
    acc[document_id] = move_to;
    return acc;
  }, {} as Record<string, string>);

  const result = sortedMoveMutations.reduce((acc, { timestamp, key, action, document_id }) => {
    /**
     * Only store a move mutation for the first time it occurred for a certain
     * key/document_id, and then use final destination calculated earlier.
     */
    if (acc[key]) {
      return acc;
    }

    acc[key] = {
      timestamp,
      action,
      key,
      document_id,
      move_to: finalDestinationPerId[document_id],
    };
    return acc;
  }, {} as Record<string, MoveMutation>);

  return Object.values(result);
};

/**
 * Grab the local exports JSON file and compare it to the reference document
 * that was last exported from Sanity to figure out what mutations have been
 * made.
 */
export const getLocalMutations = async (referenceTexts: Record<string, string>) => {
  const newTexts = await getLocaleFlatTexts();
  const newTextsWithPlainKeys = removeIdsFromKeys(newTexts);
  const oldKeys = Object.keys(referenceTexts);
  const newKeys = Object.keys(newTexts);

  const removals = oldKeys.filter((key) => !newKeys.includes(key)).map(parseKeyWithId);

  const additions = newKeys.filter((key) => !oldKeys.includes(key)).map(parseKeyWithId);

  const mutations = {
    add: [] as { key: string; text: string }[],
    move: [] as {
      key: string;
      documentId: string;
      moveTo: string;
    }[],
    delete: [] as { key: string; documentId: string }[],
  };

  /**
   * First we consider all removals to be delete mutations
   */
  removals.forEach(([key, id]) => {
    mutations.delete.push({ key, documentId: id });
  });

  /**
   * Then for every new key that appeared, see if there was a key with the same
   * document id that got deleted. In those cases the mutation was actually a
   * move instead of a separate add/delete
   */
  additions.forEach(([key, id]) => {
    const deleted = mutations.delete.find((x) => x.documentId === id);

    if (deleted) {
      /**
       * If so, we remove this one from the delete mutations and store it as a
       * move mutation.
       */
      mutations.delete = mutations.delete.filter((x) => x !== deleted);
      mutations.move.push({
        key: deleted.key,
        moveTo: key,
        documentId: id,
      });
    } else {
      /**
       * If not, we can store it as an add mutation
       */
      mutations.add.push({ key, text: newTextsWithPlainKeys[key] });
    }
  });

  return mutations;
};

function parseKeyWithId(keyWithId: string) {
  const [key, id] = keyWithId.split(ID_PREFIX);
  return [key, id] as [key: string, id: string];
}

/**
 * Apply the moves by deleting the placeholder document and mutating the key of
 * the original document to set it to the new moveTo key.
 */
export const finalizeMoveMutations = async (dataset: 'development' | 'production', moves: MoveMutation[]) => {
  await initialiseEnvironmentVariables();
  const sanityClient = client.withConfig({ dataset, token: process.env.SANITY_AUTH_TOKEN });
  const transaction = sanityClient.transaction();

  for (const { document_id, move_to } of moves) {
    try {
      const originalDocument = await sanityClient.getDocument(document_id);

      assert(originalDocument, `Failed to locate move original document in dataset ${dataset}`);

      if (originalDocument.key === move_to) {
        console.log(`Document ${document_id} was already moved`);
      }

      transaction.patch(document_id, {
        set: {
          key: move_to,
          subject: move_to.split('.')[0],
        },
      });
    } catch (err) {
      if (err instanceof Error) console.error(`Move failed for document ${document_id}: ${err.message}`);
    }
  }

  await transaction.commit();
};

export const simulateDeleteMutations = (documents: LokalizeText[], mutations: TextMutation[]) => {
  const deletedKeys = getCollapsedAddDeleteMutations(mutations)
    .filter(hasValueAtKey('action', 'delete' as const))
    .map((x) => x.key);

  return documents.filter((x) => !deletedKeys.includes(x.key));
};

export const simulateMoveMutations = (documents: LokalizeText[], mutations: TextMutation[]) => {
  const moveMutations = getCollapsedMoveMutations(mutations);

  return [...documents].map((doc) => {
    const mutation = moveMutations.find((x) => x.key === doc.key);

    if (!mutation) {
      return doc;
    }

    return {
      ...doc,
      key: mutation.move_to,
    };
  });
};
