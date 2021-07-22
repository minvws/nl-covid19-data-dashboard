import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { TimespanAnnotationConfig } from '~/components/time-series-chart/logic';
import { VariantChartValue } from '~/static-props/variants/get-variant-chart-data';

export function useUnreliableDataAnnotations(
  values: VariantChartValue[],
  label: string
) {
  return useMemo(
    () =>
      values
        .filter((x) => isDefined(x.is_reliable) && x.is_reliable === false)
        .map<TimespanAnnotationConfig>((x) => ({
          start: x.date_start_unix,
          end: x.date_end_unix,
          label,
          fill: 'dotted',
        })),
    [values]
  );
}
