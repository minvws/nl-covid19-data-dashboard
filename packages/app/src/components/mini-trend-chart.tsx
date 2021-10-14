import { TimeframeOption, TimestampedValue } from '@corona-dashboard/common';
import { SeriesConfig, TimeSeriesChart } from '~/components/time-series-chart';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { DataOptions } from './time-series-chart/logic';

type MiniTrendChartProps<T extends TimestampedValue = TimestampedValue> = {
  accessibility: AccessibilityDefinition;
  timeframe?: TimeframeOption;
  title: string;
  seriesConfig: SeriesConfig<T>;
  dataOptions?: DataOptions;
  values: T[];
  displayTooltipValueOnly?: boolean;
};

export function MiniTrendChart<T extends TimestampedValue = TimestampedValue>({
  accessibility,
  seriesConfig,
  dataOptions,
  timeframe = '5weeks',
  values,
  displayTooltipValueOnly,
}: MiniTrendChartProps<T>) {
  const { sm } = useBreakpoints(true);

  return (
    <TimeSeriesChart
      accessibility={accessibility}
      initialWidth={400}
      minHeight={sm ? 180 : 140}
      timeframe={timeframe}
      displayTooltipValueOnly={displayTooltipValueOnly}
      xTickNumber={2}
      values={values}
      numGridLines={3}
      seriesConfig={seriesConfig}
      dataOptions={dataOptions}
    />
  );
}
