import path from 'path';

/**
 * Fully qualified path to the json data files
 */
export const jsonBasePath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'public',
  'json'
);

export const localeBasePath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'locale'
);
