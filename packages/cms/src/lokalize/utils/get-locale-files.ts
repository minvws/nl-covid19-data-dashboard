import flat from 'flat';
import fs from 'fs';
import mapKeys from 'lodash/mapKeys';
import path from 'path';
import { localeDirectory, localeReferenceDirectory } from './locale-directories';

const { flatten } = flat;

export const getLocaleFlatTexts = async () => {
  const texts = JSON.parse(
    fs.readFileSync(path.join(localeDirectory, 'nl_export.json'), {
      encoding: 'utf-8',
    })
  );

  const flatTexts = mapKeys(flatten<unknown, Record<string, string>>(texts), (_value, key) => (key.includes('.') ? key : `__root.${key}`));

  return flatTexts as Record<string, string>;
};

export const getLocaleReferenceTexts = async () => {
  const referencePath = path.join(localeReferenceDirectory, 'nl_export.json');

  try {
    const texts = JSON.parse(
      fs.readFileSync(referencePath, {
        encoding: 'utf-8',
      })
    );

    const flatTexts = mapKeys(flatten<unknown, Record<string, string>>(texts), (_value, key) => (key.includes('.') ? key : `__root.${key}`));
    return flatTexts as Record<string, string>;
  } catch (err) {
    return;
  }
};
