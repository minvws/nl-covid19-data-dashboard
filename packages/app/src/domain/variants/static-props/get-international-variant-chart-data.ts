import { In, InVariants, InVariantsVariant } from '@corona-dashboard/common';
import { last } from 'lodash';
import { isDefined, isPresent } from 'ts-is-present';
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

function getVariantChartData(variants: InVariants | undefined) {
  if (!isDefined(variants) || !isDefined(variants.values)) {
    return EMPTY_VALUES;
  }

  const completeDateRange = getBaseObjectsCompleteDateRange(variants.values);

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
   * If one of the percentage values is marked as unreliable, the entire VariantChartValue is marked as such.
   *
   */
  const values = completeDateRange.map((partialChartValue) => {
    partialChartValue.is_reliable = true;
    const { item, total } = variantsOfConcern.reduce(
      ({ item, total }, variantOfConcern) => {
        const variantItem = variantOfConcern.values.find(
          (x) =>
            x.date_end_unix === partialChartValue.date_end_unix &&
            x.date_start_unix === partialChartValue.date_start_unix
        );

        if (isDefined(variantItem) && isPresent(variantItem.percentage)) {
          total += variantItem.percentage;
          (item as unknown as Record<string, number>)[
            `${variantOfConcern.name}_percentage`
          ] = variantItem.percentage;
          if (!variantItem.is_reliable) {
            partialChartValue.is_reliable = false;
          }
        }

        return { item, total };
      },
      { item: partialChartValue, total: 0 }
    );

    (item as unknown as Record<string, number>)['other_percentage'] =
      parseFloat((100 - total).toFixed(2));

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
 * First it creates a flatmap of all the start and end dates (plus the sample_size),
 * which is then de-duped and finally re-sorted by end date.
 *
 */
function getBaseObjectsCompleteDateRange(lists: InVariantsVariant[]) {
  return lists
    .flatMap((x) => x.values)
    .map<VariantChartValue>((x) => ({
      date_start_unix: x.date_start_unix,
      date_end_unix: x.date_end_unix,
      sample_size: x.sample_size,
      is_reliable: true,
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
