import { NlVariants, NlVariantsVariantValue } from '@corona-dashboard/common';
import { maxBy } from 'lodash';
import { isDefined } from 'ts-is-present';

export type VariantSidebarValue = {
  name: string;
} & NlVariantsVariantValue;

export function getVariantSidebarValue(nlVariants: NlVariants | undefined) {
  if (!isDefined(nlVariants) || !isDefined(nlVariants.values)) {
    return null;
  }

  return maxBy(
    nlVariants.values.map<VariantSidebarValue>((x) => ({
      name: x.name,
      ...x.last_value,
    })),
    (x) => x.percentage
  );
}
