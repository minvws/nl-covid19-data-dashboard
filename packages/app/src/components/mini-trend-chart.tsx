import {
  KeysOfType,
  TimeframeOption,
  TimestampedValue,
} from '@corona-dashboard/common';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { colors } from '~/style/theme';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { useBreakpoints } from '~/utils/use-breakpoints';

type MiniTrendChartProps<T> = {
  accessibility: AccessibilityDefinition;
  metricProperty: KeysOfType<T, number | null, true>;
  timeframe?: TimeframeOption;
  title: string;
  values: T[];
};

export function MiniTrendChart<T extends TimestampedValue = TimestampedValue>({
  accessibility,
  metricProperty,
  timeframe = '5weeks',
  title,
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
      displayTooltipValueOnly
      numGridLines={3}
      seriesConfig={[
        {
          metricProperty,
          type: 'area',
          label: title,
          color: colors.data.primary,
        },
      ]}
    />
  );
}
