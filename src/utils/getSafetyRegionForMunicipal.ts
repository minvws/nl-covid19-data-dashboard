import municipalCodeToRegionCodeLookup from 'data/municipalCodeToRegionCodeLookup';
import regionCodeToMunicipalCodeLookup from 'data/regionCodeToMunicipalCodeLookup';

export default function getSafetyRegionForMunicipal(
  code: string | string[] | undefined
): [string, string[] | undefined] {
  const municipalCode = typeof code === 'string' ? code : 'unknown';

  const vrcode = municipalCodeToRegionCodeLookup[municipalCode];
  const municipalCodes = vrcode
    ? regionCodeToMunicipalCodeLookup[vrcode]
    : undefined;

  return [municipalCode, municipalCodes];
}
