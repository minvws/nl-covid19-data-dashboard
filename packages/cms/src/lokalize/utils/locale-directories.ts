import path from 'path';
import { getDirectoryName } from '../../studio/utils/get-directory-name';

const __dirname = getDirectoryName(import.meta.url);

export const localeDirectory = path.resolve(
  __dirname,
  '..', // utils
  '..', // lokalize
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
