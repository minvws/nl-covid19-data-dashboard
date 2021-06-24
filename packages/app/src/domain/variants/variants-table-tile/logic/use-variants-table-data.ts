import {
  DifferenceDecimal,
  NationalDifference,
  NlVariantsValue,
} from '@corona-dashboard/common';
import { useMemo } from 'react';
import { SiteText } from '~/locale';
import { colors } from '~/style/theme';

type CountriesOfOrigin = SiteText['covid_varianten']['landen_van_herkomst'];

export type Variant = typeof variants[number];

const variants = [
  'alpha',
  'beta',
  'gamma',
  'delta',
  'eta',
  'epsilon',
  'theta',
  'kappa',
  'lambda',
  'other',
] as const;

export type VariantRow = {
  variant: Variant;
  countryOfOrigin: string;
  occurrence: number;
  percentage: number;
  difference?: DifferenceDecimal;
  color: string;
  sampleSize: number;
};

/**
 * This hook maps a NlVariantsValue instance to a list of VariantRows.
 *
 * Each set of variant data (alpha, beta, etc) is mapped to one row and
 * its country of origin, data color and difference is added.
 *
 * Finally the list gets sorted with the highest percentage on top and
 * the 'other' variant always last in the list.
 */
export function useVariantsTableData(
  data: NlVariantsValue,
  countriesOfOrigin: CountriesOfOrigin,
  differences: NationalDifference
): VariantRow[] {
  return useMemo(
    () =>
      variants
        .map((variant) => ({
          variant,
          countryOfOrigin: countriesOfOrigin[variant],
          occurrence: data[`${variant}_occurrence` as const],
          percentage: data[`${variant}_percentage` as const],
          difference: differences[`variants__${variant}_percentage` as const],
          color: colors.data.variants[variant],
          sampleSize: data.sample_size,
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
        }),
    [data, countriesOfOrigin, differences]
  );
}
