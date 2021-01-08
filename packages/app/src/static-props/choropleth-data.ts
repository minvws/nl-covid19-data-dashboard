import path from 'path';
import { Municipalities, Regions } from '~/types/data';
import { loadJsonFromFile } from './utils/load-json-from-file';

export interface ChoroplethSettings<T1, T2> {
  vr?: (collection: Regions) => T1;
  gm?: (collection: Municipalities) => T2;
}

export function getChoroplethData<T1, T2>(
  settings?: ChoroplethSettings<T1, T2>
) {
  const filterVr = settings?.vr || (() => null);
  const filterGm = settings?.gm || (() => null);

  return {
    vr: filterVr(vrCollection) as T1,
    gm: filterGm(gmCollection) as T2,
  };
}

const vrCollection = loadJsonFromFile<Regions>(
  path.join(process.cwd(), 'public', 'json', 'VR_COLLECTION.json')
);

const gmCollection = loadJsonFromFile<Municipalities>(
  path.join(process.cwd(), 'public', 'json', 'GM_COLLECTION.json')
);
