import path from 'path';

const appBasePath = path.join(
  __dirname,
  '..', // src
  '..', // cli
  '..', // packages
  'app'
);

export const jsonDirectory = path.join(appBasePath, 'public', 'json');

export const localeDirectory = path.join(appBasePath, 'src', 'locale');

export const schemaDirectory = path.join(appBasePath, 'schema');
