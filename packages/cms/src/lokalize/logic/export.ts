/**
 * This script exports LokalizeText documents from Sanity as a locale JSON file,
 * and strips any keys that have been marked by the key-mutations.csv file as a
 * result of text changes via the CLI.
 */
import { LokalizeText } from '@corona-dashboard/app/src/types/cms';
import { createFlatTexts, removeIdsFromKeys } from '@corona-dashboard/common';
import flatten, { unflatten } from 'flat';
import fs from 'fs-extra';
import mapValues from 'lodash/mapValues';
import path from 'path';
import prettier from 'prettier';
import { hasValueAtKey } from 'ts-is-present';
import { getCollapsedAddDeleteMutations, readTextMutations } from '.';
import { getClient } from '../../client';
import { getCollapsedMoveMutations } from './mutations';

export const localeDirectory = path.resolve(
  __dirname,
  '..', // lokalize
  '..', // src
  '..', // cms
  '..', // packages
  'app/src/locale'
);

export const localeReferenceDirectory = path.resolve(
  __dirname,
  '..', // lokalize
  '..', // src
  '..', // cms
  '.lokalize-reference'
);

/**
 * Make sure the cache directory exists
 */
fs.ensureDirSync(localeReferenceDirectory);

/**
 * @TODO:
 * - remove add / delete cli
 */

export async function exportLokalizeTexts(
  dataset?: string,
  includeDrafts = false,
  appendDocumentIdToKey = false
) {
  const client = getClient(dataset);
  /**
   * The client will load drafts by default because it is authenticated with a
   * token. If the `drafts` flag is not set to true, we will manually exclude
   * draft-documents on query-level.
   */
  const draftsQueryPart = includeDrafts ? '' : '&& !(_id in path("drafts.**"))';

  const documents: LokalizeText[] = await client.fetch(
    `*[_type == 'lokalizeText' ${draftsQueryPart}] | order(key asc)`
  );

  const mutations = await readTextMutations();

  const deletedKeys = getCollapsedAddDeleteMutations(mutations)
    .filter(hasValueAtKey('action', 'delete' as const))
    .map((x) => x.key);

  /**
   * When a text has been moved as part of a feature branch, the document is not
   * actually changed in Sanity, but a temporary new document is created instead
   * which contains the new (move_to) key. This way we do not break other
   * branches depending on the targeted document. For the user who moved the
   * document, we filter out these keys during export so that according their
   * JSON the moved keys do not exist anymore.
   *
   * Once the feature branch gets merged we then actually mutate the key
   * property of the original document, and remove the temporarily document
   * which was holding that key.
   */
  const movedKeys = getCollapsedMoveMutations(mutations).map((x) => x.key);

  const flatTexts = createFlatTexts({
    documents,
    excludedKeys: [...deletedKeys, ...movedKeys],
    appendDocumentIdToKey,
  });

  await writePrettyJson(
    unflatten(flatTexts.nl, { object: true }),
    path.join(localeDirectory, 'nl_export.json')
  );

  await writePrettyJson(
    unflatten(flatTexts.en, { object: true }),
    path.join(localeDirectory, 'en_export.json')
  );

  await writePrettyJson(
    unflatten(flatTexts.nl, { object: true }),
    path.join(localeReferenceDirectory, 'nl_export.json')
  );

  await writePrettyJson(
    unflatten(flatTexts.en, { object: true }),
    path.join(localeReferenceDirectory, 'en_export.json')
  );

  await generateTypes();
}

async function writePrettyJson(data: Record<string, unknown>, path: string) {
  const json = prettier.format(JSON.stringify(data), { parser: 'json' });
  return new Promise<void>((resolve, reject) =>
    fs.writeFile(path, json, { encoding: 'utf8' }, (err) =>
      err ? reject(err) : resolve()
    )
  );
}

export async function generateTypes() {
  const data = flatten(
    JSON.parse(
      fs.readFileSync(path.join(localeDirectory, 'nl_export.json'), {
        encoding: 'utf-8',
      })
    )
  ) as Record<string, string>;

  const siteTextObj = removeIdsFromKeys(mapValues(data, () => '@string'));
  const siteTextString = JSON.stringify(siteTextObj, null, 2).replace(
    /\"\@string\"/g,
    'string'
  );

  const body = `export interface SiteText ${siteTextString}`;

  return new Promise<void>((resolve, reject) =>
    fs.writeFile(
      path.join(localeDirectory, 'site-text.d.ts'),
      body,
      { encoding: 'utf8' },
      (err) => (err ? reject(err) : resolve())
    )
  );
}
