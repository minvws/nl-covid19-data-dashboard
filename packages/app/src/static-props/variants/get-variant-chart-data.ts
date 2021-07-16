import { assert, Dictionary, NlVariants } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { LineSeriesDefinition } from '~/components/time-series-chart/logic';

export type VariantChartValue = Record<string, number> & {
  sample_size: number;
  date_start_unix: number;
  date_end_unix: number;
};

const EMPTY_VALUES = {
  variantChart: null,
  dates: {
    date_of_insertion_unix: 0,
    date_start_unix: 0,
    date_end_unix: 0,
  },
} as const;

export function getVariantChartData(variants: NlVariants | undefined) {
  if (!isDefined(variants) || !isDefined(variants.values)) {
    return EMPTY_VALUES;
  }

  const variantsOfConcern = variants.values.filter(
    (x) => x.last_value.is_variant_of_concern
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
      item[`${variant.name}_percentage`] = variant.values[index].percentage;
      item[`${variant.name}_occurrence`] = variant.values[index].occurrence;
    });
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

export function getSeriesConfig(
  value: Record<string, string | number> | undefined,
  variantTranslations: Dictionary<string>,
  colors: Dictionary<string>
) {
  if (!isDefined(value)) {
    return { seriesConfig: null } as const;
  }

  const variantNames = Object.keys(value)
    .filter((x) => x.endsWith('_percentage'))
    .map((x) => x.slice(0, x.indexOf('_')));

  const seriesConfig = variantNames.map<
    LineSeriesDefinition<VariantChartValue>
  >((x) => {
    const color = colors[x];
    const label = variantTranslations[x];
    assert(color, `No color specified for variant called "${x}"`);
    assert(label, `No label specified for variant called "${x}"`);

    return {
      metricProperty: `${x}_percentage`,
      type: 'line',
      shape: 'line',
      color,
      label,
    };
  });

  return { seriesConfig };
}
