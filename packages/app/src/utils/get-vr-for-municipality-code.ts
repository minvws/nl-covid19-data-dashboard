import { gmData } from '~/data/gm';
import { vrData } from '~/data/vr';

/**
 * This function returns the safety region information for the given
 * municipality.
 *
 * @param code
 */
export function getVrForMunicipalityCode(
  code: string
): { name: string; code: string; id: number } | undefined {
  const municipality = gmData.find((x) => x.gemcode === code);

  if (!municipality) return;

  const regio = vrData.find((x) => x.code === municipality.vrCode);

  return regio;
}
