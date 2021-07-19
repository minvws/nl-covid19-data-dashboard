import { In, InVariants, InVariantsVariant } from '@corona-dashboard/common';
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

  // The different historical value lists are of different lengths,
  // so here we create a start to end range based on all of them:
  const completeDateRange = createCompleteDateRange(variants.values);

  const variantsOfConcern = variants.values.filter(
    (x) => last(x.values)?.is_variant_of_concern
  );

  if (!isDefined(completeDateRange)) {
    return EMPTY_VALUES;
  }

  const values = completeDateRange.map<VariantChartValue>((value) => {
    const partialItem: VariantChartValue = {
      date_start_unix: value.date_start_unix,
      date_end_unix: value.date_end_unix,
      sample_size: value.sample_size,
    };

    const { item, total } = variantsOfConcern.reduce(
      ({ item, total }, variantOfConcern) => {
        const otherItem = variantOfConcern.values.find(
          (x) => x.date_end_unix === value.date_end_unix
        );
        if (otherItem) {
          total += otherItem.percentage;
          item[`${variantOfConcern.name}_percentage`] = otherItem.percentage;
        }
        return { item, total };
      },
      { item: partialItem, total: 0 }
    );

    item.other_percentage = Math.round((100 - total) * 100) / 100; //Round to maximum of 2 decimals

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

function createCompleteDateRange(lists: InVariantsVariant[]) {
  return lists
    .map((x) => x.values)
    .flat()
    .map((x) => ({
      date_start_unix: x.date_start_unix,
      date_end_unix: x.date_end_unix,
      sample_size: x.sample_size,
    }))
    .filter(
      (x, i, arr) =>
        arr.findIndex((y) => y.date_end_unix === x.date_end_unix) === i
    )
    .sort((a, b) => a.date_end_unix - b.date_end_unix);
}
