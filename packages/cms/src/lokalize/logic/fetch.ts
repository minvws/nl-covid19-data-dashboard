import fs from 'fs';
import path from 'path';
import flatten from 'flat';
import { getClient } from '../../client';
import { LokalizeText } from '../types';
import { localeDirectory } from './export';
import mapKeys from 'lodash/mapKeys';

export async function fetchExistingKeys() {
  const client = getClient();

  const allTexts = (await client
    .fetch(`*[_type == 'lokalizeText']`)
    .catch((err) => {
      throw new Error(`Failed to fetch texts: ${err.message}`);
    })) as LokalizeText[];

  return allTexts.map((x) => x.key);
}

export async function fetchLocalTextsFlatten() {
  const texts = JSON.parse(
    fs.readFileSync(path.join(localeDirectory, 'nl_export.json'), {
      encoding: 'utf-8',
    })
  );

  const flattenTexts = mapKeys(
    flatten(texts) as Record<string, string>,
    (_value, key) => (key.includes('.') ? key : `__root.${key}`)
  );

  return flattenTexts as Record<string, string>;
}
