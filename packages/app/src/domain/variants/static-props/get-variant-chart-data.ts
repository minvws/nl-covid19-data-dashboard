import { NlVariants } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';

export type VariantCode = string;

export type VariantChartValue = {
  date_start_unix: number;
  date_end_unix: number;
  is_reliable: boolean;
} & Record<string, number>;

const EMPTY_VALUES = {
  variantChart: null,
  dates: {
    date_of_report_unix: 0,
    date_start_unix: 0,
    date_end_unix: 0,
  },
} as const;

export function getVariantChartData(variants: NlVariants | undefined) {
  if (!isDefined(variants) || !isDefined(variants.values)) {
    return EMPTY_VALUES;
  }

  const sortedVariants = variants.values.sort((a, b) => b.last_value.order - a.last_value.order);

  const firstVariant = sortedVariants.shift();

  if (!isDefined(firstVariant)) {
    return EMPTY_VALUES;
  }

  const values = firstVariant.values.map<VariantChartValue>((value, index) => {
    const variantItem = {
      is_reliable: true,
      date_start_unix: value.date_start_unix,
      date_end_unix: value.date_end_unix,
      [`${firstVariant.variant_code}_percentage`]: value.percentage,
    } as VariantChartValue;

    sortedVariants.forEach((variant) => {
      (variantItem as unknown as Record<string, number>)[`${variant.variant_code}_percentage`] = variant.values[index].percentage;
    });

    return variantItem;
  });

  return {
    variantChart: values,
    dates: {
      date_of_report_unix: firstVariant.last_value.date_of_report_unix,
      date_start_unix: firstVariant.last_value.date_start_unix,
      date_end_unix: firstVariant.last_value.date_end_unix,
    },
  } as const;
}
