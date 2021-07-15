import { In, InVariants } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { VariantChartValue } from './get-variant-chart-data';

export function getInternationalVariantChartData(data: Record<string, In>) {
  const variantChartData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      getVariantChartData(value.variants),
    ])
  );

  return { variantChartData } as const;
}

const EMPTY_VALUES = {
  variantChart: null,
  dates: null,
} as const;

export type VariantChartData = ReturnType<typeof getVariantChartData>;

export function getVariantChartData(variants: InVariants | undefined) {
  if (!isDefined(variants) || !isDefined(variants.values)) {
    return EMPTY_VALUES;
  }

  const variantsOfConcern = variants.values.filter(
    (x) => x.last_value.is_variant_of_concern
  );
  const variantsOfInterest = variants.values.filter(
    (x) => !x.last_value.is_variant_of_concern
  );

  const firstVariant = variantsOfConcern.shift();

  if (!isDefined(firstVariant)) {
    return EMPTY_VALUES;
  }

  const values = firstVariant.values.map<VariantChartValue>((value, index) => {
    const item = {
      [`${firstVariant.name}_percentage`]: value.percentage,
      [`${firstVariant.name}_occurrence`]: value.percentage,
      date_start_unix: value.date_start_unix,
      date_end_unix: value.date_end_unix,
      sample_size: value.sample_size,
    };

    variantsOfConcern.forEach((variant) => {
      item[`${variant.name}_percentage`] =
        variant.values[index]?.percentage ?? 0;
      item[`${variant.name}_occurrence`] =
        variant.values[index]?.occurrence ?? 0;
    });

    const otherPercentage = variantsOfInterest.reduce(
      (aggr, variant) => (aggr += variant.values[index]?.percentage ?? 0),
      0
    );

    const otherOccurrence = variantsOfInterest.reduce(
      (aggr, variant) => (aggr += variant.values[index]?.occurrence ?? 0),
      0
    );

    item.other_percentage = otherPercentage;
    item.other_occurrence = otherOccurrence;

    return item;
  });

  return {
    variantChart: values,
    dates: {
      date_of_insertion_unix: firstVariant.last_value.date_of_insertion_unix,
      date_start_unix: firstVariant.last_value.date_start_unix,
      date_end_unix: firstVariant.last_value.date_end_unix,
    },
  } as const;
}
