import { Municipal } from 'types/data.d';

import municipalities from 'data/gemeente_veiligheidsregio.json';
import { getSafetyRegionData } from './safetyregion-data';

export interface IMunicipalityData {
  data: Municipal;
  lastGenerated: string;
}

interface IPaths {
  paths: Array<{ params: { code: string } }>;
  fallback: boolean;
}

export const getMunicipalityData = getSafetyRegionData;

/*
 * getMunicipalityPaths creates an array of all the allowed
 * `/veiligheidsregio/[code]` routes. This should be used
 * together with `getMunicipalityData`.
 */
export function getMunicipalityPaths(): () => IPaths {
  return function () {
    const paths = municipalities.map((municipality) => ({
      params: { code: municipality.gemcode },
    }));

    // { fallback: false } means other routes should 404.
    return { paths, fallback: false };
  };
}
