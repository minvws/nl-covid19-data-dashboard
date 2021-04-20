import { assert } from '@corona-dashboard/common';
/**
 * We could provide features via the Context API, but since this doesn't change
 * at runtime I don't see any advantage doing so. An import is the most basic
 * implementation.
 */
import { features } from '~/config/features';

export function useFeature(name: string) {
  const feature = features.find((x) => x.name === name);

  assert(feature, `Failed using an unknown feature: ${name}`);

  return feature;
}
