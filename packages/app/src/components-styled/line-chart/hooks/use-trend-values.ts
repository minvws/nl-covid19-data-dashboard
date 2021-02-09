import { useMemo } from 'react';
import {
  getTrendData,
  TrendValueWithDates,
} from '~/components-styled/line-chart/logic';
import { Value } from '~/components-styled/stacked-chart/logic';
import { TimeframeOption } from '~/utils/timeframe';

export function useTrendValues<T extends Value>(
  values: T[],
  configs: { metricProperty: keyof T }[],
  timeframe: TimeframeOption
): (T & TrendValueWithDates)[][] {
  const metricProperties = useMemo(() => configs.map((x) => x.metricProperty), [
    configs,
  ]);

  const trendsList = useMemo(
    () => getTrendData(values, metricProperties, timeframe),
    [values, metricProperties, timeframe]
  );

  return trendsList;
}
