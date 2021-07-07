// @ts-ignore Creates a ts-node compile error at "run-time"
import getUserConfig from '@sanity/cli/lib/util/getUserConfig';
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
  useCdn: false,
};

export function getClient(dataset = 'development') {
  /**
   * This is an undocumented feature. Taken from the Sanity CLI code.
   */
  const tokenFromLogIn = getUserConfig().get('authToken');

  return sanityClient({
    ...clientConfig,
    dataset,
    token: tokenFromLogIn || process.env.SANITY_TOKEN,
  });
}
