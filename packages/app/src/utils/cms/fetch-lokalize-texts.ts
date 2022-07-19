import { LokalizeText } from '~/types/cms';
import { getClient } from './client';
import { createFlatTexts } from '@corona-dashboard/common';

export const fetchLokalizeTexts = async (dataset: string) => {
  const client = getClient(dataset);
  const documents: LokalizeText[] = await client.fetch(
    `*[_type == 'lokalizeText' && (defined(key)) && !(_id in path('drafts.**'))] | order(key asc)`
  );
  return createFlatTexts(documents, false);
};
