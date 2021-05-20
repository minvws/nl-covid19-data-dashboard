import { getClient } from '../../client';
import { LokalizeText } from '../types';

export async function fetchExistingKeys() {
  const client = getClient();

  const allTexts = (await client
    .fetch(`*[_type == 'lokalizeText']`)
    .catch((err) => {
      throw new Error(`Failed to fetch texts: ${err.message}`);
    })) as LokalizeText[];

  return allTexts.map((x) => x.key);
}
