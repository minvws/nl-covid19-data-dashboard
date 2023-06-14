import { removeIdsFromKeys } from '@corona-dashboard/common';
import flat from 'flat';
import fs from 'fs-extra';
import mapValues from 'lodash/mapValues';
import path from 'path';
import prettier from 'prettier';
import { localeDirectory } from './locale-directories';

const { flatten, unflatten } = flat;

export const generateTypesUtility = async () => {
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
       * DO NOT MODIFY IT BY HAND.
       */
      export interface SiteText ${textsTypeString}
    `,
    { parser: 'typescript' }
  );

  return new Promise<void>((resolve, reject) =>
    fs.writeFile(path.join(localeDirectory, 'site-text.d.ts'), body, { encoding: 'utf8' }, (error) => (error ? reject(error) : resolve()))
  );
};
