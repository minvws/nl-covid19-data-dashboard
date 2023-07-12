import { createClient } from '@sanity/client';

export const client = createClient({
  apiVersion: '2023-05-03',
  dataset: 'development',
  projectId: '5mog5ask',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
