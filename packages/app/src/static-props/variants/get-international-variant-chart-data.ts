import { In, InVariants } from '@corona-dashboard/common';
import { first, last } from 'lodash';
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

  // The historic data has variable lengths, so here we grab the longest
  // value list and use that to generate the chart values from.
  const listLengths = variants.values.map((x) => x.values.length);
  const longestListLength = Math.max(...listLengths);
  const longestList = first(
    variants.values.filter((x) => x.values.length === longestListLength)
  );

  const variantsOfConcern = variants.values.filter(
    (x) => last(x.values)?.is_variant_of_concern
  );

  if (!isDefined(longestList)) {
    return EMPTY_VALUES;
  }

  const values = longestList.values.map<VariantChartValue>((value) => {
    const item: VariantChartValue = {
      date_start_unix: value.date_start_unix,
      date_end_unix: value.date_end_unix,
      sample_size: value.sample_size,
    };

    const totalPercentage = variantsOfConcern.reduce(
      (total, variantOfConcern) => {
        const otherItem = variantOfConcern.values.find(
          (x) => x.date_end_unix === value.date_end_unix
        );
        if (otherItem) {
          total += otherItem.percentage;
          item[`${variantOfConcern.name}_percentage`] = otherItem.percentage;
        }
        return total;
      },
      0
    );

    item.other_percentage = Math.round((100 - totalPercentage) * 100) / 100; //Round to maximum of 2 decimals

    return item;
  });

  const lastValue = last(first(variantsOfConcern)?.values);

  return {
    variantChart: values,
    dates: {
      date_of_insertion_unix: lastValue?.date_of_insertion_unix ?? 0,
      date_start_unix: lastValue?.date_start_unix ?? 0,
      date_end_unix: lastValue?.date_end_unix ?? 0,
    },
  } as const;
}
