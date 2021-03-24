import flatten from 'flat';
import fs from 'fs';
import get from 'lodash/get';
import path from 'path';

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
  key,
  description: '',
  translations: {
    nl: value,
    en: get(english, key),
  },
}));

console.dir(objects);
