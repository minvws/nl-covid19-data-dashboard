import { TimestampedValue } from '@corona-dashboard/common';
import slugify from 'slugify';
import { LineChart, LineChartProps } from '~/components/line-chart/line-chart';
import { assert } from '~/utils/assert';
import { TimeframeOption } from '~/utils/timeframe';
import { ChartTile } from './chart-tile';
import { MetadataProps } from './metadata';
interface LineChartTileProps<T extends TimestampedValue>
  extends LineChartProps<T> {
  title: string;
  metadata: MetadataProps;
  description?: string;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
  footer?: React.ReactNode;
  ariaDescription?: string;
}

export function LineChartTile<T extends TimestampedValue>({
  metadata,
  title,
  description,
  timeframeOptions = ['all', '5weeks', 'week'],
  timeframeInitialValue = 'all',
  footer,
  ariaDescription,
  ...chartProps
}: LineChartTileProps<T>) {
  assert(
    description || ariaDescription,
    `This graph doesn't include a valid description nor an ariaDescription, please add one of them.`
  );
  const ariaLabelledBy = slugify(title);

  return (
    <ChartTile
      title={title}
      description={description}
      metadata={metadata}
      timeframeOptions={timeframeOptions}
      timeframeInitialValue={timeframeInitialValue}
    >
      {(timeframe) => (
        <>
          <LineChart
            {...chartProps}
            timeframe={timeframe}
            ariaLabelledBy={ariaLabelledBy}
          />
          {footer}
        </>
      )}
    </ChartTile>
  );
}
