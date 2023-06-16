import { createClient } from '@sanity/client';

export const client = createClient({
  apiVersion: '2023-05-03',
  dataset: import.meta.env.SANITY_STUDIO_DATASET,
  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  token: import.meta.env.SANITY_STUDIO_API_TOKEN,
  useCdn: false,
});
