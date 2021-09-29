import { TimeframeOption, TimestampedValue } from '@corona-dashboard/common';
import { SeriesConfig, TimeSeriesChart } from '~/components/time-series-chart';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { useBreakpoints } from '~/utils/use-breakpoints';

type MiniTrendChartProps<T extends TimestampedValue = TimestampedValue> = {
  accessibility: AccessibilityDefinition;
  timeframe?: TimeframeOption;
  title: string;
  seriesConfig: SeriesConfig<T>;
  values: T[];
};

export function MiniTrendChart<T extends TimestampedValue = TimestampedValue>({
  accessibility,
  seriesConfig,
  timeframe = '5weeks',
  values,
}: MiniTrendChartProps<T>) {
  const { sm } = useBreakpoints(true);

  return (
    <TimeSeriesChart
      accessibility={accessibility}
      initialWidth={400}
      minHeight={sm ? 180 : 140}
      timeframe={timeframe}
      xTickNumber={2}
      values={values}
      numGridLines={3}
      seriesConfig={seriesConfig}
    />
  );
}
