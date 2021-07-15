import { TimestampedValue } from '@corona-dashboard/common';
import { isNumber } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useIntl } from '~/intl';
import { getMaxNumOfDecimals } from '~/utils/get-consistent-number-formatter';
import { SeriesConfig } from './series';

export function useMetricPropertyFormatters<T extends TimestampedValue>(
  seriesConfig: SeriesConfig<T>,
  values: T[]
) {
  const intl = useIntl();

  const createFormatter = useCallback(
    (values: number[]) => {
      const numOfDecimals = getMaxNumOfDecimals(values);
      return (value: number) =>
        intl.formatPercentage(value, {
          minimumFractionDigits: numOfDecimals,
          maximumFractionDigits: numOfDecimals,
        });
    },
    [intl]
  );

  return useMemo(() => {
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
    }, {} as Record<keyof T, (value: number) => string>);
  }, [createFormatter, seriesConfig, values]);
}
