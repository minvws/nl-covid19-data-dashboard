import {
  colors,
  NlNamedDifference,
  NlVariants,
  NlVariantsVariant,
  NamedDifferenceDecimal,
} from '@corona-dashboard/common';
import { first } from 'lodash';
import { isDefined, isPresent } from 'ts-is-present';
import { colorMatch } from './get-variant-order-colors';
import { Variants } from '../variants-table-tile/types';

export type VariantRow = {
  variant: keyof Variants;
  percentage: number | null;
  difference?: NamedDifferenceDecimal | null;
  color: string;
};

const EMPTY_VALUES = {
  variantTable: null,
  dates: {
    date_of_report_unix: 0,
    date_start_unix: 0,
    date_end_unix: 0,
  },
  sampleSize: 0,
} as const

export type VariantTableData = ReturnType<typeof getVariantTableData>;

export function getVariantTableData(
  variants: NlVariants | undefined,
  namedDifference: NlNamedDifference,
  variantColors: colorMatch
) {
  if (!isDefined(variants) || !isDefined(variants.values)) {
    return EMPTY_VALUES;
  }

  function findDifference(name: string) {
    if (isPresent(namedDifference.variants__percentage)) {
      const difference = namedDifference.variants__percentage.find(
        (x) => x.variant_code === name
      );

      if (!difference) {
        return null;
      }

      return difference;
    }
  }

  const firstLastValue = first<NlVariantsVariant>(variants.values);

  if (!isDefined(firstLastValue)) {
    return EMPTY_VALUES;
  }
  const dates = {
    date_end_unix: firstLastValue.last_value.date_end_unix,
    date_start_unix: firstLastValue.last_value.date_start_unix,
    date_of_report_unix:
      firstLastValue.last_value.date_of_report_unix,
  };
  const sampleSize = firstLastValue.last_value.sample_size;


  const variantTable = variants.values
    /**
     * Since the schemas for international still has to change to
     * the new way of calculating this prevents the typescript error for now.
     */
    .map((variant) => ({
      has_historical_significance:
        'has_historical_significance' in variant.last_value
          ? variant.last_value.has_historical_significance
          : true,
      ...variant,
    }))
    .filter(
      (variant) =>
        variant.variant_code !== 'other_graph' ||
        !variant.has_historical_significance
    )
    .sort((a, b) => b.last_value.order - a.last_value.order)
    .map<VariantRow>((variant) => {
      const color =
        variantColors.find(
          (variantColors) => variantColors.variant === variant.variant_code
        )?.color || colors.data.variants.fallbackColor;

      return {
        variant: variant.variant_code,
        percentage: variant.last_value.percentage,
        difference: findDifference(variant.variant_code),
        color,
      };
    })
    .filter(
      (row) =>
        // Make sure the 'other' variant persists in the table.
        row.variant === 'other_table' || row.percentage
    )
    .sort()
    .reverse()
    .sort((rowA, rowB) => {
      // Make sure the 'other' variant is always sorted last.
      if (rowA.variant === 'other_table') {
        return 1;
      }
      if (rowB.variant === 'other_table') {
        return -1;
      }

      return 0;
    });

  return { variantTable, dates, sampleSize };
}
