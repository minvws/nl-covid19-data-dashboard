import { TimestampedValue } from '@corona-dashboard/common';
import { isNumber } from 'lodash';
import { useMemo } from 'react';
import { useIntl } from '~/intl';
import { getMaximumNumberOfDecimals } from '~/utils/get-maximum-number-of-decimals';
import { SeriesConfig } from './series';

export type MetricPropertyFormatters<T extends TimestampedValue> = Record<
  keyof T,
  (value: number) => string
>;

export function useMetricPropertyFormatters<T extends TimestampedValue>(
  seriesConfig: SeriesConfig<T>,
  values: T[]
) {
  const intl = useIntl();

  return useMemo(() => {
    function createFormatter(values: number[]) {
      const numberOfDecimals = getMaximumNumberOfDecimals(values);
      return (value: number) =>
        intl.formatPercentage(value, {
          minimumFractionDigits: numberOfDecimals,
          maximumFractionDigits: numberOfDecimals,
        });
    }

    return seriesConfig.reduce((result, config) => {
      if (config.type === 'range') {
        result[config.metricPropertyLow] = createFormatter(
          values
            .map((x) => x[config.metricPropertyLow] as unknown)
            .filter(isNumber)
        );
        result[config.metricPropertyHigh] = createFormatter(
          values
            .map((x) => x[config.metricPropertyHigh] as unknown)
            .filter(isNumber)
        );
      } else {
        result[config.metricProperty] = createFormatter(
          values
            .map((x) => x[config.metricProperty] as unknown)
            .filter(isNumber)
        );
      }
      return result;
    }, {} as MetricPropertyFormatters<T>);
  }, [intl, seriesConfig, values]);
}
