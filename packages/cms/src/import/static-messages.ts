import dotenv from 'dotenv';
import flatten from 'flat';
import fs, { exists } from 'fs';
import get from 'lodash/get';
import path from 'path';

const { default: PQueue } = require('p-queue');

import sanityClient from '@sanity/client';
import sanityConfig from '../../sanity.json';

const result = dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
});

// Set up the Sanity client
const config = {
  dataset: 'development',
  projectId: sanityConfig.api.projectId,
  token: process.env.SANITY_TOKEN,
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
  _id: key,
  key,
  description: '',
  translations: {
    default: value,
    en: get(english, key),
  },
}));

// Now for the magic part. Let's turn it into Sanity documents!
const queue = new PQueue({
  concurrency: 4,
  interval: 1000 / 25,
});

objects.forEach((obj) => {
  queue.add(() =>
    client
      .createIfNotExists(obj)
      .then((res) => {
        console.log('Document was created (or was already present)');
      })
      .catch((err) => {
        console.error('Document creation error:');
        console.error(err);
      })
  );
});
