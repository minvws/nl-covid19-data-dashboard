/**
 * This script imports LokalizeText documents from Sanity as a locale JSON file,
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

export async function importLokalizeTexts({ dataset, appendDocumentIdToKey = false }: { dataset?: string; appendDocumentIdToKey?: boolean }) {
  /**
   * Make sure the reference directory exists
   */
  fs.ensureDirSync(localeReferenceDirectory);

  const client = getClient(dataset);

  const documents: LokalizeText[] = await client.fetch(`*[_type == 'lokalizeText' && (defined(key)) && !(_id in path('drafts.**'))] | order(key asc)`);

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
  const mutatedDocuments = simulateDeleteMutations(simulateMoveMutations(documents, mutations), mutations);

  const flatTexts = createFlatTexts(mutatedDocuments, appendDocumentIdToKey);

  await writePrettyJson(unflatten(flatTexts.nl, { object: true }), path.join(localeDirectory, 'nl_export.json'));

  await writePrettyJson(unflatten(flatTexts.en, { object: true }), path.join(localeDirectory, 'en_export.json'));

  await writePrettyJson(unflatten(flatTexts.nl, { object: true }), path.join(localeReferenceDirectory, 'nl_export.json'));

  await writePrettyJson(unflatten(flatTexts.en, { object: true }), path.join(localeReferenceDirectory, 'en_export.json'));

  await generateTypes();
}

async function writePrettyJson(data: Record<string, unknown>, path: string) {
  const json = prettier.format(JSON.stringify(data), { parser: 'json' });
  return new Promise<void>((resolve, reject) => fs.writeFile(path, json, { encoding: 'utf8' }, (err) => (err ? reject(err) : resolve())));
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

  const textsTypeString = JSON.stringify(textsObject, null, 2).replace(/\"\@string\"/g, 'string');

  const body = prettier.format(
    `
      /**
       * This file was auto-generated from the lokalize export script.
       */
      export interface SiteText ${textsTypeString}
    `,
    { parser: 'typescript' }
  );

  return new Promise<void>((resolve, reject) => fs.writeFile(path.join(localeDirectory, 'site-text.d.ts'), body, { encoding: 'utf8' }, (err) => (err ? reject(err) : resolve())));
}
