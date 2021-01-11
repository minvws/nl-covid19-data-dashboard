import path from 'path';

const appBasePath = path.join(
  __dirname,
  '..', // src
  '..', // cli
  '..', // packages
  'app'
);

export const jsonDirectory = path.join(appBasePath, 'public', 'json');

export const schemaDirectory = path.join(appBasePath, 'schema');
