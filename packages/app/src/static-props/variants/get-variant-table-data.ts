import { DifferenceDecimal, NlVariants } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { colors } from '~/style/theme';

export type VariantRow = {
  variant: string;
  countryOfOrigin: string;
  occurrence: number;
  percentage: number;
  difference: DifferenceDecimal;
  color: string;
};

export function getVariantTableData(nlVariants: NlVariants | undefined) {
  if (!isDefined(nlVariants) || !isDefined(nlVariants.variants)) {
    return [];
  }

  return nlVariants.variants
    .map<VariantRow>((variant) => ({
      variant: variant.name,
      countryOfOrigin: '',
      occurrence: variant.last_value.occurrence,
      percentage: variant.last_value.percentage,
      difference: {
        difference: 0,
        new_date_unix: 0,
        old_date_unix: 0,
        old_value: 0,
      },
      color: (colors.data.variants as Record<string, string>)[variant.name],
    }))
    .sort((rowA, rowB) => {
      // Make sure the 'other' variant is always sorted last
      if (rowA.variant === 'other') {
        return 1;
      }
      if (rowB.variant === 'other') {
        return -1;
      }
      return rowB.percentage - rowA.percentage;
    });
}
