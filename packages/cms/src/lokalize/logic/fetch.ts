import flatten from 'flat';
import fs from 'fs';
import mapKeys from 'lodash/mapKeys';
import path from 'path';
import { getClient } from '../../client';
import { LokalizeText } from '../types';
import { localeDirectory } from './export';

export async function fetchExistingKeys() {
  const client = getClient();

  const allTexts = await client
    .fetch<LokalizeText[]>(`*[_type == 'lokalizeText']`)
    .catch((err) => {
      throw new Error(`Failed to fetch texts: ${err.message}`);
    });

  return allTexts.map((x) => x.key);
}

export async function fetchLocalTextsFlatten() {
  const texts = JSON.parse(
    fs.readFileSync(path.join(localeDirectory, 'nl_export.json'), {
      encoding: 'utf-8',
    })
  );

  const flattenTexts = mapKeys(
    flatten<unknown, Record<string, string>>(texts),
    (_value, key) => (key.includes('.') ? key : `__root.${key}`)
  );

  return flattenTexts as Record<string, string>;
}
