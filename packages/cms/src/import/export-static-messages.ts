import sanityClient from '@sanity/client';
import dotenv from 'dotenv';
import { unflatten } from 'flat';
import fs from 'fs';
import path from 'path';
import sanityConfig from '../../sanity.json';

dotenv.config({
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

client.fetch(`*[_type == 'message']`).then((result: any[]) => {
  const nl = result.map((x) => {
    const key = x._id.split('::').join('.');
    return {
      [key]: x.translations.nl,
    };
  });
  const en = result.map((x) => {
    const key = x._id.split('::').join('.');
    return {
      [key]: x.translations.en,
    };
  });
  fs.writeFileSync('nl.json', JSON.stringify(unflatten(nl)), {
    encoding: 'utf8',
  });
  fs.writeFileSync('en.json', JSON.stringify(unflatten(en)), {
    encoding: 'utf8',
  });
});
