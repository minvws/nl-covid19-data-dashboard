import { TimestampedValue } from '@corona-dashboard/common';
import { LineChart, LineChartProps } from '~/components/line-chart/line-chart';
import { assert } from '~/utils/assert';
import { TimeframeOption } from '~/utils/timeframe';
import { AccessibilityOptions } from './accessibility-description';
import { ChartTile } from './chart-tile';
import { MetadataProps } from './metadata';

interface LineChartTileProps<T extends TimestampedValue>
  extends LineChartProps<T> {
  title: string;
  metadata: MetadataProps;
  accessibility: AccessibilityOptions;
  description?: string;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
  footer?: React.ReactNode;
}

export function LineChartTile<T extends TimestampedValue>({
  metadata,
  title,
  description,
  accessibility,
  timeframeOptions = ['all', '5weeks'],
  timeframeInitialValue = 'all',
  footer,
  ...chartProps
}: LineChartTileProps<T>) {
  assert(
    description,
    `This graph doesn't include a valid description, please add one of them.`
  );

  return (
    <ChartTile
      title={title}
      description={description}
      accessibility={accessibility}
      metadata={metadata}
      timeframeOptions={timeframeOptions}
      timeframeInitialValue={timeframeInitialValue}
    >
      {(timeframe) => (
        <>
          <LineChart {...chartProps} timeframe={timeframe} />
          {footer}
        </>
      )}
    </ChartTile>
  );
}
