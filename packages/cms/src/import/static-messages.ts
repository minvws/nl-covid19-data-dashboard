import flatten from 'flat';
import fs from 'fs';
import get from 'lodash/get';
import path from 'path';
import { assert } from '@corona-dashboard/common';

import sanityConfig from '../../sanity.json';

import sanityClient from '@sanity/client';
// assert(
//   process.env.NEXT_PUBLIC_SANITY_DATASET,
//   'NEXT_PUBLIC_SANITY_DATASET is undefined'
// );

// assert(
//   process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//   'NEXT_PUBLIC_SANITY_PROJECT_ID is undefined'
// );

const config = {
  dataset: 'development',
  projectId: sanityConfig.api.projectId,
  useCdn: false,
};

export const client = sanityClient(config);

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
