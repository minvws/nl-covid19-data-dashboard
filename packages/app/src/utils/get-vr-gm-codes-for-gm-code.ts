import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';
import { vrCodeByGmCode } from '~/data/vr-code-by-gm-code';

/**
 * This method looks up all the municipality codes that belong to the same safety region
 * as the given municipality code.
 *
 * @param code
 */
export function getVrGmCodesForGmCode(code: string): string[] | undefined {
  const vrcode = vrCodeByGmCode[code];
  return vrcode ? gmCodesByVrCode[vrcode] : undefined;
}
