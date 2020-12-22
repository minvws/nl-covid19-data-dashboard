import municipalCodeToRegionCodeLookup from '~/data/municipalCodeToRegionCodeLookup';
import regionCodeToMunicipalCodeLookup from '~/data/regionCodeToMunicipalCodeLookup';

/**
 * This method looks up all the municipal codes that belong to the same safety region
 * as the given municipal code.
 *
 * @param code
 */
export function getSafetyRegionMunicipalsForMunicipalCode(
  code: string
): string[] | undefined {
  const vrcode = municipalCodeToRegionCodeLookup[code];
  const municipalCodes = vrcode
    ? regionCodeToMunicipalCodeLookup[vrcode]
    : undefined;

  return municipalCodes;
}
