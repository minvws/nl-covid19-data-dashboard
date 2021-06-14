import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appBasePath = path.join(
  __dirname,
  '..', // cli
  '..', // packages
  'app'
);

export const localeDirectory = path.join(appBasePath, 'src', 'locale');

export const defaultJsonDirectory = path.join(appBasePath, 'public', 'json');

export const schemaDirectory = path.join(appBasePath, 'schema');

export const featureFlagsConfigFile = path.join(
  appBasePath,
  'src',
  'config',
  'features.ts'
);
