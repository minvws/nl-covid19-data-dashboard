import { NlVariants } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { SiteText } from '~/locale';

type VariantName = keyof SiteText['common']['variants'];

export type VariantChartValue = {
  date_start_unix: number;
  date_end_unix: number;
  is_reliable: boolean;
} & Partial<{
  [key in `${VariantName}_percentage`]: number;
}>;

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

  const variantsOfConcern = variants.values
    .filter(
      (x) =>
        x.last_value.is_variant_of_concern ||
        x.last_value.has_historical_significance
    )
    .sort((a, b) => b.last_value.order - a.last_value.order);

  const firstVariant = variantsOfConcern.shift();

  if (!isDefined(firstVariant)) {
    return EMPTY_VALUES;
  }

  const values = firstVariant.values.map<VariantChartValue>((value, index) => {
    const item = {
      is_reliable: true,
      date_start_unix: value.date_start_unix,
      date_end_unix: value.date_end_unix,
      [`${firstVariant.variant_code}_percentage`]: value.percentage,
    };

    variantsOfConcern.forEach((variant) => {
      (item as unknown as Record<string, number>)[
        `${variant.variant_code}_percentage`
      ] = variant.values[index].percentage;
    });

    return item;
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
