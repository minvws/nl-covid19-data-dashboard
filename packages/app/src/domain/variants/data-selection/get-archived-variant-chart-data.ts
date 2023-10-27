import { ArchivedNlVariants } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { VariantChartValue } from '~/domain/variants/data-selection/types';

const EMPTY_VALUES = {
  archivedVariantChart: null,
  archivedDates: {
    date_of_report_unix: 0,
    date_start_unix: 0,
    date_end_unix: 0,
  },
} as const;

/**
 * Returns values for variant timeseries chart
 * @param variants
 */
export function getArchivedVariantChartData(variants: ArchivedNlVariants | undefined) {
  if (!isDefined(variants) || !isDefined(variants.values)) {
    return EMPTY_VALUES;
  }

  const sortedVariants = variants.values.sort((a, b) => b.last_value.order - a.last_value.order);

  const firstVariantInList = sortedVariants.shift();

  if (!isDefined(firstVariantInList)) {
    return EMPTY_VALUES;
  }

  const values = firstVariantInList.values.map<VariantChartValue>((value, index) => {
    const item = {
      is_reliable: true,
      date_start_unix: value.date_start_unix,
      date_end_unix: value.date_end_unix,
      [`${firstVariantInList.variant_code}_percentage`]: value.percentage,
    } as VariantChartValue;

    sortedVariants.forEach((variant) => {
      (item as unknown as Record<string, number>)[`${variant.variant_code}_percentage`] = variant.values[index].percentage;
    });

    return item;
  });

  return {
    archivedVariantChart: values,
    archivedDates: {
      date_of_report_unix: firstVariantInList.last_value.date_of_report_unix,
      date_start_unix: firstVariantInList.last_value.date_start_unix,
      date_end_unix: firstVariantInList.last_value.date_end_unix,
    },
  } as const;
}
