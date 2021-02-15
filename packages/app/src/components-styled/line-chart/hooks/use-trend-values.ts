import { TimestampedValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import {
  getTrendData,
  TimestampedTrendValue,
} from '~/components-styled/line-chart/logic';
import { TimeframeOption } from '~/utils/timeframe';

export function useTrendValues<T extends TimestampedValue>(
  values: T[],
  configs: { metricProperty: keyof T }[],
  timeframe: TimeframeOption
): (T & TimestampedTrendValue)[][] {
  const metricProperties = useMemo(() => configs.map((x) => x.metricProperty), [
    configs,
  ]);

  const trendsList = useMemo(
    () => getTrendData(values, metricProperties, timeframe),
    [values, metricProperties, timeframe]
  );

  return trendsList;
}
