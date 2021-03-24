import flatten from 'flat';
import fs from 'fs';
import get from 'lodash/get';
import path from 'path';

import sanityClient from '@sanity/client';
import sanityConfig from '../../sanity.json';

// Set up the Sanity client
const config = {
  dataset: 'development',
  projectId: sanityConfig.api.projectId,
  useCdn: false,
};
export const client = sanityClient(config);

// Flatten the languages in objects
const dutch = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../app/src/locale/nl.json'), {
    encoding: 'utf8',
  })
);
const english = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../app/src/locale/en.json'), {
    encoding: 'utf8',
  })
);

const objects = Object.entries(flatten(dutch)).map(([key, value]) => ({
  _type: 'message',
  id: key,
  key,
  description: '',
  translations: {
    default: value,
    en: get(english, key),
  },
}));

console.dir(objects);

// Now for the magic part. Let's turn it into Sanity documents!
