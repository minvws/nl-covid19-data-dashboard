import {
  assert,
  colors,
  InNamedDifference,
  InVariants,
  InVariantsVariant,
  InVariantsVariantValue,
  NlNamedDifference,
  NlVariants,
  NlVariantsVariant,
  NlVariantsVariantValue,
  OptionalNamedDifferenceDecimal,
} from '@corona-dashboard/common';
import { first } from 'lodash';
import { isDefined, isPresent } from 'ts-is-present';

export type VariantRow = {
  variant: string;
  percentage: number | null;
  difference?: OptionalNamedDifferenceDecimal | null;
  color: string;
};

export type VariantTableData = ReturnType<typeof getVariantTableData>;

export const VARIANT_TABLE_MAP = [
  'alpha',
  'beta',
  'gamma',
  'delta',
  'eta',
  'epsilon',
  'theta',
  'kappa',
  'lambda',
  'iota',
  'zeta',
  'mu',
  'nu',
  'xi',
  'omicron',
  'pi',
  'rho',
  'sigma',
  'tau',
  'upsilon',
  'phi',
  'chi',
  'psi',
  'omega',
];

export function getVariantTableData(
  variants: NlVariants | InVariants | undefined,
  namedDifference: NlNamedDifference | InNamedDifference
) {
  if (!isDefined(variants) || !isDefined(variants.values)) {
    return {
      variantTable: null,
      dates: null,
      sampleSize: 0,
    } as const;
  }

  function findDifference(name: string) {
    if (isPresent(namedDifference.variants__percentage)) {
      const difference = namedDifference.variants__percentage.find(
        (x) => x.name === name
      );

      if (!difference) {
        return null;
      }

      return difference;
    }
  }

  const firstLastValue = first<NlVariantsVariant | InVariantsVariant>(
    variants.values
  );

  const dates = {
    date_end_unix: firstLastValue?.last_value.date_end_unix ?? 0,
    date_start_unix: firstLastValue?.last_value.date_start_unix ?? 0,
    date_of_insertion_unix:
      firstLastValue?.last_value.date_of_insertion_unix ?? 0,
  };
  const sampleSize = firstLastValue?.last_value.sample_size ?? 0;

  const inVariants = variants.values
    .map((x) => x.last_value)
    .filter(isInVariant);
  /**
   * Only international data has the is_reliable key,
   * so for national data we assume it is reliable by default.
   */
  const isReliable = inVariants.length
    ? inVariants.some((x) => x.is_reliable)
    : true;

  const variantColors = colors.data.variants;
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
        variant.name !== 'other_graph' || !variant.has_historical_significance
    )
    .sort((variantA, variantB) => {
      if (variantA.name === 'other_table') {
        return 1;
      }
      if (variantB.name === 'other_table') {
        return -1;
      }

      const relativeSortingValue: number =
        VARIANT_TABLE_MAP.findIndex((variant) =>
          variantA.name.includes(variant)
        ) -
        VARIANT_TABLE_MAP.findIndex((variant) =>
          variantB.name.includes(variant)
        );

      if (relativeSortingValue !== 0) {
        return relativeSortingValue;
      }

      return variantA.name.localeCompare(variantB.name);
    })
    .map<VariantRow>((variant, index) => ({
      variant: variant.name,
      percentage: variant.last_value.percentage,
      difference: findDifference(variant.name),
      color:
        variant.name === 'other_table'
          ? variantColors.other_table
          : variantColors.colorList[index],
    }))
    .filter(
      (row) =>
        // Make sure the 'other' variant persists in the table.
        row.variant === 'other_table' || row.percentage
    )
    .sort((rowA, rowB) => {
      // Make sure the 'other' variant is always sorted last.
      if (rowA.variant === 'other_table') {
        return 1;
      }
      if (rowB.variant === 'other_table') {
        return -1;
      }
      return (rowB.percentage ?? -1) - (rowA.percentage ?? -1);
    });

  return { variantTable, dates, sampleSize, isReliable };
}

function isInVariant(
  value: NlVariantsVariantValue | InVariantsVariantValue
): value is InVariantsVariantValue {
  return 'is_reliable' in value;
}
