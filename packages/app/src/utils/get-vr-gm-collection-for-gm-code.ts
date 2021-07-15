import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';
import { vrCodeByGmCode } from '~/data/vr-code-by-gm-code';

/**
 * This method looks up all the municipal codes that belong to the same safety region
 * as the given municipal code.
 *
 * @param code
 */
export function getVrGmCollectionForGmCode(code: string): string[] | undefined {
  const vrcode = vrCodeByGmCode[code];
  const gmCodes = vrcode ? gmCodesByVrCode[vrcode] : undefined;

  return gmCodes;
}
