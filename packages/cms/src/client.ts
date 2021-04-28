import sanityClient from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import sanityConfig from '../sanity.json';

/**
 * @TODO load dotenv elsewhere maybe and take dataset from env
 */
dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
});

export const client = sanityClient({
  apiVersion: '2021-03-25',
  dataset: 'development',
  projectId: sanityConfig.api.projectId,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});
