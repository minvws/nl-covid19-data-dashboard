import { assert } from '@corona-dashboard/common';
import sanityClient, { ClientConfig, SanityClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
});

/**
 * Sanity uses some predefined env variable names.
 * For more info see: https://www.sanity.io/docs/studio-environment-variables
 *
 * Below we are using env vars instead of reading from sanity.json since it
 * makes the code a little more flexible and also easier to move to CLI package
 * where it probably fits better.
 */

assert(
  process.env.SANITY_STUDIO_API_PROJECT_ID,
  'Missing SANITY_STUDIO_API_PROJECT_ID env var'
);

assert(
  process.env.SANITY_STUDIO_API_DATASET,
  'Missing SANITY_STUDIO_API_DATASET env var'
);

const clientConfig: ClientConfig = {
  apiVersion: '2021-03-25',
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_API_DATASET,
  token: process.env.SANITY_STUDIO_TOKEN,
  useCdn: false,
};

export function getClient(dataset?: string) {
  return dataset
    ? sanityClient({ ...clientConfig, dataset })
    : sanityClient(clientConfig);
}
