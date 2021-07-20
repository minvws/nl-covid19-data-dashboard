import { In, InVariants, InVariantsVariant } from '@corona-dashboard/common';
import { last } from 'lodash';
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
} as const;

export type VariantChartData = ReturnType<typeof getVariantChartData>;

export function getVariantChartData(variants: InVariants | undefined) {
  if (!isDefined(variants) || !isDefined(variants.values)) {
    return EMPTY_VALUES;
  }

  const completeDateRange = getCompleteDateRange(variants.values);

  if (!completeDateRange.length) {
    return EMPTY_VALUES;
  }

  const variantsOfConcern = variants.values.filter(
    (x) => last(x.values)?.is_variant_of_concern
  );

  if (!variantsOfConcern.length) {
    return EMPTY_VALUES;
  }

  /**
   * Here it loops through the entire date range list (a VariantChartValue array) and per start/end date
   * it looks up a variant of concern item that matches the given dates.
   *
   * If it exists, it adds a property called `<variant-name>_percentage` to
   * the given VariantChartValue.
   *
   * While doing this it accumulates the total percentage so that after finding the variants of concern
   * numbers it can add an `other_percentage` property that represents all of the other variants.
   *
   */
  const values = completeDateRange.map((partialChartValue) => {
    const { item, total } = variantsOfConcern.reduce(
      ({ item, total }, variantOfConcern) => {
        const otherItem = variantOfConcern.values.find(
          (x) =>
            x.date_end_unix === partialChartValue.date_end_unix &&
            x.date_start_unix === partialChartValue.date_start_unix
        );

        if (otherItem) {
          total += otherItem.percentage;
          item[`${variantOfConcern.name}_percentage`] = otherItem.percentage;
        }

        return { item, total };
      },
      { item: partialChartValue, total: 0 }
    );

    item.other_percentage = Math.round((100 - total) * 100) / 100; //Round to maximum of 2 decimals

    return item;
  });

  return {
    variantChart: values,
  } as const;
}

/**
 * The different historical value lists are of different lengths,
 * so here we create a start to end range based on all of them.
 *
 * First it creates a flatmap of all the start and end dates,
 * which is then de-duped and finally re-sorted by end date.
 *
 */
function getCompleteDateRange(lists: InVariantsVariant[]) {
  return lists
    .flatMap((x) => x.values)
    .map<VariantChartValue>((x) => ({
      date_start_unix: x.date_start_unix,
      date_end_unix: x.date_end_unix,
    }))
    .filter(
      ({ date_start_unix, date_end_unix }, index, array) =>
        array.findIndex(
          (y) =>
            y.date_end_unix === date_end_unix &&
            y.date_start_unix === date_start_unix
        ) === index
    )
    .sort((a, b) => a.date_end_unix - b.date_end_unix);
}
