import { useMemo } from 'react';
import {
  getTrendData,
  NumberProperty,
  Value,
} from '~/components-styled/line-chart/helpers';
import { TimeframeOption } from '~/utils/timeframe';

export function useTrendValues<T extends Value>(
  values: T[],
  configs: { metricProperty: NumberProperty<T> }[],
  timeframe: TimeframeOption
) {
  const metricProperties = useMemo(() => configs.map((x) => x.metricProperty), [
    configs,
  ]);

  const trendsList = useMemo(
    () => getTrendData(values, metricProperties, timeframe),
    [values, metricProperties, timeframe]
  );

  return trendsList;
}
