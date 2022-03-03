import { assert } from '@corona-dashboard/common';
import { GetStaticPropsContext } from 'next';
import { isDefined } from 'ts-is-present';
import { getVrGmCodesForGmCode } from '~/utils/get-vr-gm-codes-for-gm-code';

export function filterByRegionMunicipalities<T extends { gmcode: string }>(
  choroplethData: T[],
  context: GetStaticPropsContext
) {
  const municipalCode = context.params?.code as string | undefined;

  assert(
    isDefined(municipalCode),
    `[${filterByRegionMunicipalities.name}] No municipalCode in context params`
  );

  const regionCodes = getVrGmCodesForGmCode(municipalCode);

  assert(
    isDefined(regionCodes),
    `[${filterByRegionMunicipalities.name}] No regionCodes found for ${municipalCode}`
  );

  return choroplethData.filter((x) => regionCodes.includes(x.gmcode));
}
