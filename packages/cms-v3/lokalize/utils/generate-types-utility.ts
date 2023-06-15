import { removeIdsFromKeys } from '@corona-dashboard/common';
import flat from 'flat';
import fs from 'fs-extra';
import mapValues from 'lodash/mapValues';
import path from 'path';
import prettier from 'prettier';
import { fileURLToPath } from 'url';

const { flatten, unflatten } = flat;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const localeDirectory = path.resolve(
  __dirname,
  '..', // lokalize
  '..', // cms-v3 TODO: change this to cms as we are getting rid of the old CMS folder
  '..', // packages
  'app/src/locale'
);

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
    fs.writeFile(
      // path.join(localeDirectory, 'site-text.d.ts'),
      path.join(localeDirectory, 'site-text-v3.d.ts'), // TODO: remove this line once we've removed the old CMS folder
      body,
      { encoding: 'utf8' },
      (error) => (error ? reject(error) : resolve())
    )
  );
};
