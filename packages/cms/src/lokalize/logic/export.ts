/**
 * This script exports LokalizeText documents from Sanity as a locale JSON file,
 * and strips any keys that have been marked by the key-mutations.csv file as a
 * result of text changes via the CLI.
 */
import { LokalizeText } from '@corona-dashboard/app/src/types/cms';
import { createFlatTexts, removeIdsFromKeys } from '@corona-dashboard/common';
import flatten, { unflatten } from 'flat';
import fs from 'fs-extra';
import JsonToTS from 'json-to-ts';
import mapValues from 'lodash/mapValues';
import { outdent } from 'outdent';
import path from 'path';
import prettier from 'prettier';
import { readTextMutations } from '.';
import { getClient } from '../../client';
import { simulateDeleteMutations, simulateMoveMutations } from './mutations';

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

export async function exportLokalizeTexts({
  dataset,
  includeDrafts = false,
  appendDocumentIdToKey = false,
}: {
  dataset?: string;
  includeDrafts?: boolean;
  appendDocumentIdToKey?: boolean;
}) {
  /**
   * Make sure the reference directory exists
   */
  fs.ensureDirSync(localeReferenceDirectory);

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

  /**
   * We simulate local mutations as if they already happened to the documents in
   * Sanity. This way the user gets an up-to-date version of JSON output, but
   * the documents in Sanity are left untouched to not break other feature
   * branches in the meantime.
   *
   * Moves are applied before deletions, to prevent losing documents in edge
   * cases.
   */
  const mutatedDocuments = simulateDeleteMutations(
    simulateMoveMutations(documents, mutations),
    mutations
  );

  const flatTexts = createFlatTexts(mutatedDocuments, appendDocumentIdToKey);

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

  const textsFlat = removeIdsFromKeys(mapValues(data, () => '@string'));

  const textsObject = unflatten(textsFlat, { object: true });

  const textsTypeString = JSON.stringify(textsObject, null, 2).replace(
    /\"\@string\"/g,
    'string'
  );

  const body = outdent`
    /**
     * This file was auto-generated from the lokalize export script. It doesn't
     * output fully valid TS interfaces but the compiler doesn't seem
     * to care.
     */

     export interface SiteText ${textsTypeString}
  `;

  /**
   * The above seems to work but doesn't output real Typscript syntax. Maybe we
   * can use something that generates actual TS interfaces. Attempt below...
   */
  // let string = '';

  // JsonToTS(textsObject).forEach((typeInterface) => {string += typeInterface;
  // });

  // const body = `export interface SiteText ${string}`;

  return new Promise<void>((resolve, reject) =>
    fs.writeFile(
      path.join(localeDirectory, 'site-text.d.ts'),
      body,
      { encoding: 'utf8' },
      (err) => (err ? reject(err) : resolve())
    )
  );
}
