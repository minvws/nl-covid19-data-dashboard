import { useMemo } from 'react';
import {
  getSingleTrendData,
  TrendValueWithDates,
} from '~/components-styled/line-chart/logic';
import {
  getValuesInTimeframe,
  Value,
} from '~/components-styled/stacked-chart/logic';
import { TimeframeOption } from '~/utils/timeframe';
import { TrendDescriptor } from '../area-chart';
import { TrendConfig } from '../area-chart-graph';

export function useTrendValues<T extends Value>(
  trendDescriptors: TrendDescriptor<T>[],
  timeframe: TimeframeOption
): TrendConfig<T & TrendValueWithDates>[] {
  const trendConfigs = useMemo(
    () =>
      trendDescriptors
        .map((descriptor) => {
          const series = getValuesInTimeframe(descriptor.values, timeframe);
          return descriptor.displays.map<TrendConfig<T & TrendValueWithDates>>(
            (displayConfig) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { metricProperty, ...displayProps } = displayConfig;
              return {
                values: getSingleTrendData(
                  series,
                  displayConfig.metricProperty
                ),
                ...displayProps,
              };
            }
          );
        })
        .flat(),
    [trendDescriptors, timeframe]
  );

  return trendConfigs;
}
