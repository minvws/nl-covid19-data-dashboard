import { LokalizeText } from '@corona-dashboard/app/src/types/cms';
import { createFlatTexts } from '@corona-dashboard/common';
import flat from 'flat';
import fs from 'fs-extra';
import path from 'path';
import prettier from 'prettier';
import { client } from '../../studio/client';
import { generateTypesUtility } from './generate-types-utility';
import { localeDirectory, localeReferenceDirectory } from './locale-directories';
import { readTextMutations, simulateDeleteMutations, simulateMoveMutations } from './mutation-utilities';

const writePrettyJson = async (data: Record<string, unknown>, path: string) => {
  const json = prettier.format(JSON.stringify(data), { parser: 'json' });

  return new Promise<void>((resolve, reject) => fs.writeFile(path, json, { encoding: 'utf8' }, (err) => (err ? reject(err) : resolve())));
};

/**
 * This script imports LokalizeText documents from Sanity as a locale JSON file,
 * and strips any keys that have been marked by the key-mutations.csv file as a
 * result of text changes via the CLI.
 */

type importLokalizeTextsArgs = { dataset?: string; appendDocumentIdToKey?: boolean };

export const importLokalizeTexts = async ({ dataset, appendDocumentIdToKey = false }: importLokalizeTextsArgs) => {
  const { unflatten } = flat;
  const sanityClient = client.withConfig({ dataset });

  // Make sure the reference directory exists
  fs.ensureDirSync(localeReferenceDirectory);

  const documents: LokalizeText[] = await sanityClient.fetch(`//groq
    *[_type == 'lokalizeText' && (defined(key)) && !(_id in path('drafts.**'))] | order(key asc)
  `);

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

  await generateTypesUtility();
};
