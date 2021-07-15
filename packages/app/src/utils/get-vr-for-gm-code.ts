import { gmData } from '~/data/gm';
import { vrData } from '~/data/vr';

/**
 * This function returns the safety region information for the given
 * municipality.
 *
 * @param code
 */
export function getVrForGmCode(
  code: string
): { name: string; code: string; id: number } | undefined {
  const gm = gmData.find((x) => x.gmCode === code);

  if (!gm) return;

  const regio = vrData.find((x) => x.code === gm.vrCode);

  return regio;
}
