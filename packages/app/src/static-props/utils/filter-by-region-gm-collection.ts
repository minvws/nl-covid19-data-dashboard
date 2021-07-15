import { assert } from '@corona-dashboard/common';
import { GetStaticPropsContext } from 'next';
import { isDefined } from 'ts-is-present';
import { getVrGmCollectionForGmCode } from '~/utils/get-vr-gm-collection-for-gm-code';

export function filterByRegionGmCollection<T extends { gmcode: string }>(
  choroplethData: T[],
  context: GetStaticPropsContext
) {
  const gmCode = context.params?.code as string | undefined;

  assert(isDefined(gmCode), 'No municipalCode in context params');

  const regionCodes = getVrGmCollectionForGmCode(gmCode);

  assert(isDefined(regionCodes), `No regionCodes found for ${gmCode}`);

  return choroplethData.filter((x) => regionCodes.includes(x.gmcode));
}
