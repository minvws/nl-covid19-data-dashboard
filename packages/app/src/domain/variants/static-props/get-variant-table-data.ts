import {
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

  const findDifference = (name: string) => {
    if (isPresent(namedDifference.variants__percentage)) {
      const difference = namedDifference.variants__percentage.find(
        (x) => x.name === name
      );

      if (!difference) {
        return null;
      }

      return difference;
    }
  };

  const findPercentage = (name: string): number | null => {
    return (
      variants?.values
        ?.map((variant) => ({
          name: variant.name,
          percentage: variant.last_value.percentage,
        }))
        .find((variant) => variant.name === name)?.percentage ?? null
    );
  };

  const firstLastValue = first<NlVariantsVariant | InVariantsVariant>(
    variants?.values
  );

  const dates = {
    date_end_unix: firstLastValue?.last_value.date_end_unix ?? 0,
    date_start_unix: firstLastValue?.last_value.date_start_unix ?? 0,
    date_of_insertion_unix:
      firstLastValue?.last_value.date_of_insertion_unix ?? 0,
  };
  const sampleSize = firstLastValue?.last_value.sample_size ?? 0;

  const inVariants = variants?.values
    ?.map((x) => x.last_value)
    .filter(isInVariant);

  /**
   * Only international data has the is_reliable key,
   * so for national data we assume it is reliable by default.
   */
  const isReliable = inVariants?.length
    ? inVariants.some((x) => x.is_reliable)
    : true;

  /**
   * Filter and sort variants based on their first occurence,
   * to get a chronological overview.
   */
  const variantsByFirstOccurence: NlVariantsVariant[] | InVariantsVariant[] =
    variants?.values
      ?.filter(
        (variant: NlVariantsVariant | InVariantsVariant) =>
          !variant.name.includes('other_')
      )
      .reduce(
        (
          accumulator: NlVariantsVariant[] | InVariantsVariant[],
          currentVariant: NlVariantsVariant | InVariantsVariant
        ) => {
          const firstOccurence = currentVariant?.values?.find(
            (variant: NlVariantsVariantValue | InVariantsVariantValue) =>
              variant.percentage
          );

          if (firstOccurence) {
            firstOccurence.name = currentVariant.name;
            accumulator.push(firstOccurence);
          }

          return accumulator;
        },
        []
      )
      .sort(
        (
          variantA: NlVariantsVariantValue | InVariantsVariantValue,
          variantB: NlVariantsVariantValue | InVariantsVariantValue
        ) => variantA?.date_start_unix - variantB?.date_start_unix
      );

  const variantColors = colors.data.variants;
  const variantTable = variantsByFirstOccurence
    .map<VariantRow>((variant, index: number) => ({
      variant: variant.name,
      percentage: findPercentage(variant.name),
      difference: findDifference(variant.name),
      color: variantColors.colorList[index],
    }))
    .filter((row: VariantRow) => 'percentage' in row && row.percentage);

  // Find the 'other_table' variant.
  const otherVariant: NlVariantsVariant | InVariantsVariant | undefined =
    variants?.values
      ?.map((variant) => variant)
      .find(
        (variant: NlVariantsVariant | InVariantsVariant) =>
          variant.name === 'other_table'
      );

  // Push the 'other' variant so that it is always sorted last.
  if (otherVariant) {
    variantTable.push({
      variant: otherVariant.name,
      percentage: otherVariant.last_value.percentage,
      difference: findDifference(otherVariant.name),
      color: variantColors.other_table,
    });
  }

  return { variantTable, dates, sampleSize, isReliable };
}

function isInVariant(
  value: NlVariantsVariantValue | InVariantsVariantValue
): value is InVariantsVariantValue {
  return 'is_reliable' in value;
}
