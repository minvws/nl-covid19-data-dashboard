import flatten from 'flat';
import fs from 'fs';
import get from 'lodash/get';
import path from 'path';

const { default: PQueue } = require('p-queue');

import sanityClient from '@sanity/client';
import sanityConfig from '../../sanity.json';

// Set up the Sanity client
const config = {
  dataset: 'development',
  projectId: sanityConfig.api.projectId,
  token:
    'skIgqrSoqBIW9EOPaz9IijLikKUSRDT2vtnMG0Et3OPEIC5h3cIhiJpnzvY8DoFx7B27L3eoUF7lJk08DIM6RUWclpe8yY7AwPzQZ6ITmd0ApJV7UZF3coH9d0EaieHapq0dQRLfseEarIb9oZNdI1AmPv5pG5qfAUusLMwm1yNM3he0HaeC',
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
