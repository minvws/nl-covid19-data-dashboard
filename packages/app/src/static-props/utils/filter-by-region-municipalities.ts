import { assert } from '@corona-dashboard/common';
import { GetStaticPropsContext } from 'next';
import { isDefined } from 'ts-is-present';
import { getVrMunicipalsForMunicipalCode } from '~/utils/get-vr-municipals-for-municipal-code';

export function filterByRegionMunicipalities<T extends { gmcode: string }>(
  choroplethData: T[],
  context: GetStaticPropsContext
) {
  const municipalCode = context.params?.code as string | undefined;

  assert(isDefined(municipalCode), 'No municipalCode in context params');

  const regionCodes = getVrMunicipalsForMunicipalCode(municipalCode);

  assert(isDefined(regionCodes), `No regionCodes found for ${municipalCode}`);

  return choroplethData.filter((x) => regionCodes.includes(x.gmcode));
}
