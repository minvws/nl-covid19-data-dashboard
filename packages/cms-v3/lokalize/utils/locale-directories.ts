import path from 'path';
import { getDirectoryName } from '../../studio/utils/get-directory-name';

// TODO: This is not really a utility, should it be moved elsewhere?
const __dirname = getDirectoryName();

export const localeDirectory = path.resolve(
  __dirname,
  '..', // lokalize
  '..', // cms-v3 TODO: change this to cms as we are getting rid of the old CMS folder
  '..', // packages
  'app/src/locale'
);

export const localeReferenceDirectory = path.resolve(
  __dirname,
  '..', // lokalize
  '..', // cms-v3 TODO: change this to cms as we are getting rid of the old CMS folder
  '.lokalize-reference'
);
