import sanityClient, { ClientConfig } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import sanityJson from '../sanity.json';

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

const clientConfig: ClientConfig = {
  apiVersion: '2021-03-25',
  projectId: sanityJson.api.projectId,
  dataset: sanityJson.api.dataset,
  token: process.env.SANITY_STUDIO_TOKEN,
  useCdn: false,
};

export function getClient(dataset?: string) {
  return dataset
    ? sanityClient({ ...clientConfig, dataset })
    : sanityClient(clientConfig);
}
