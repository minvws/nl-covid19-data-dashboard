import path from 'path';
import { getDirectoryName } from '../../studio/utils/get-directory-name';

const __dirname = getDirectoryName();

export const localeDirectory = path.resolve(
  __dirname,
  '..', // lokalize
  '..', // cms
  '..', // packages
  'app/src/locale'
);

export const localeReferenceDirectory = path.resolve(
  __dirname,
  '..', // lokalize
  '..', // cms
  '.lokalize-reference'
);
