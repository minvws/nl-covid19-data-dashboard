import { TimestampedValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import {
  getSingleTrendData,
  TrendValueWithTimestamp,
} from '~/components-styled/line-chart/logic';
import { getValuesInTimeframe } from '~/components-styled/stacked-chart/logic';
import { TimeframeOption } from '~/utils/timeframe';
import { TrendDescriptor } from '../area-chart';
import { TrendConfig } from '../area-chart-graph';

export function useTrendConfigs<T extends TimestampedValue>(
  trendDescriptors: TrendDescriptor<T>[],
  timeframe: TimeframeOption
): TrendConfig<T & TrendValueWithTimestamp>[] {
  const trendConfigs = useMemo(
    () =>
      trendDescriptors
        .map((descriptor) => {
          const series = getValuesInTimeframe(descriptor.values, timeframe);
          return descriptor.displays.map<
            TrendConfig<T & TrendValueWithTimestamp>
          >((displayConfig) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { metricProperty, ...displayProps } = displayConfig;
            return {
              values: getSingleTrendData(
                series,
                displayConfig.metricProperty as string
              ),
              ...displayProps,
            };
          });
        })
        .flat(),
    [trendDescriptors, timeframe]
  );

  return trendConfigs;
}
