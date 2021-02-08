import { useMemo } from 'react';
import { getTrendData, TrendData } from '~/components-styled/line-chart/logic';
import { Value } from '~/components-styled/stacked-chart/logic';
import { TimeframeOption } from '~/utils/timeframe';
import { isArrayOfArrays } from '~/utils/typeguards/is-array-of-arrays';

export function useTrendValues<T extends Value>(
  values: T[] | T[][],
  configs: { metricProperty: keyof T }[] | { metricProperty: keyof T }[][],
  timeframe: TimeframeOption
): TrendData[] {
  const configList = isArrayOfArrays(configs) ? configs : [configs];
  const metricProperties = useMemo(
    () => configList.map((x) => x.map((x) => x.metricProperty)),
    [configs]
  );

  const valuesList = isArrayOfArrays(values) ? values : [values];

  const trendsLists = useMemo(
    () =>
      valuesList.map((x, i) => getTrendData(x, metricProperties[i], timeframe)),
    [values, metricProperties, timeframe]
  );

  return trendsLists;
}
