import path from 'path';

const appBasePath = path.join(
  __dirname,
  '..', // cli
  '..', // packages
  'app'
);

export const localeDirectory = path.join(appBasePath, 'src', 'locale');

export const jsonDirectory = path.join(appBasePath, 'public', 'json');

export const schemaDirectory = path.join(appBasePath, 'schema');
