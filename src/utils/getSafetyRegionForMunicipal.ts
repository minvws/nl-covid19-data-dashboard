import municipalCodeToRegionCodeLookup from 'data/municipalCodeToRegionCodeLookup';
import regionCodeToMunicipalCodeLookup from 'data/regionCodeToMunicipalCodeLookup';

export default function getSafetyRegionForMunicipal(
  code: string
): string[] | undefined {
  const vrcode = municipalCodeToRegionCodeLookup[code];
  const municipalCodes = vrcode
    ? regionCodeToMunicipalCodeLookup[vrcode]
    : undefined;

  return municipalCodes;
}
