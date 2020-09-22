import municipalities from 'data/gemeente_veiligheidsregio.json';
import regios from 'data';

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

  const regio = regios.find(
    (regio) => regio.code === municipality.safetyRegion
  );

  return regio;
}
