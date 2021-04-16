import { vr } from '~/data/vr';
import { gm } from '~/data/gm';

/**
 * This function returns the safety region information for the given
 * municipality.
 *
 * @param code
 */
export function getSafetyRegionForMunicipalityCode(
  code: string
): { name: string; code: string; id: number } | undefined {
  const municipality = gm.find((x) => x.gemcode === code);

  if (!municipality) return;

  const regio = vr.find((x) => x.code === municipality.safetyRegion);

  return regio;
}
