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
import { collapseTextMutations, readTextMutations } from '.';
import { getClient } from '../../client';

export const localeDirectory = path.resolve(
  __dirname,
  '..', // lokalize
  '..', // src
  '..', // cms
  '..', // packages
  'app/src/locale'
);

export const localeCacheDirectory = path.resolve(
  __dirname,
  '..', // lokalize
  '..', // src
  '..', // cms
  '.sanity-lokalize-cache'
);

/**
 * Make sure the cache directory exists
 */
fs.ensureDirSync(localeCacheDirectory);

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
   * token. If the `drafts` flag is not set to true, we will manually
   * exclude draft-documents on query-level.
   */
  const draftsQueryPart = includeDrafts ? '' : '&& !(_id in path("drafts.**"))';

  const documents: LokalizeText[] = await client.fetch(
    `*[_type == 'lokalizeText' ${draftsQueryPart}] | order(key asc)`
  );

  const mutations = await readTextMutations();

  const deletedKeys = collapseTextMutations(mutations)
    .filter((x) => x.action === 'delete')
    .map((x) => x.key);

  const flatTexts = createFlatTexts({
    documents,
    deletedKeys,
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
    path.join(localeCacheDirectory, 'nl_export.json')
  );

  await writePrettyJson(
    unflatten(flatTexts.en, { object: true }),
    path.join(localeCacheDirectory, 'en_export.json')
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
