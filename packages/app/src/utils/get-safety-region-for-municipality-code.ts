import { vr } from '~/data/vr';
import municipalities from '~/data/municipal-search-data';

/**
 * This function returns the safety region information for the given
 * municipality.
 *
 * @param code
 */
export function getSafetyRegionForMunicipalityCode(
  code: string
): { name: string; code: string; id: number } | undefined {
  const municipality = municipalities.find((mun) => mun.gemcode === code);

  if (!municipality) return undefined;

  const regio = vr.find((x) => x.code === municipality.safetyRegion);

  return regio;
}
