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

export function useVariantsTableData(
  data: NlVariantsValue,
  countriesOfOrigin: CountriesOfOrigin,
  differences: NationalDifference
): VariantRow[] {
  return useMemo(() => {
    return variants
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
      });
  }, [data, countriesOfOrigin, differences]);
}
