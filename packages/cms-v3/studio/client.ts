import { createClient } from '@sanity/client';
// import dotenv from 'dotenv';
// TODO: Sanity complains about path not being available in the browser. Fix.
// import path from 'path';

// dotenv.config({
//   path: path.resolve(process.cwd(), '.env.local'),
// });

// TODO:
//  - clean this up
//  - properly type this
//  - use .env variables
const isDevelopBuild = process.env.NEXT_PUBLIC_PHASE === 'develop';

export const client = createClient({
  projectId: '5mog5ask',
  apiVersion: '2023-05-03',
  dataset: undefined ?? 'development',
  // dataset: isDevelopBuild ? 'development' : 'production',
  useCdn: false,
  // TODO: Figure out how to retrieve the token from the ENV file
  token: process.env.SANITY_TOKEN,
});
