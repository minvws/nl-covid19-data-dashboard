import { ParentSize } from '@visx/responsive';
import { LineChart, LineChartProps } from '~/components-styled/line-chart';
import { Value } from '~/components-styled/line-chart/helpers';
import { TimeframeOption } from '~/utils/timeframe';
import { ChartTileWithTimeframe } from './chart-tile';
import { MetadataProps } from './metadata';
import useUniqueId from '~/utils/useUniqueId';
import { assert } from '~/utils/assert';
interface LineChartTileProps<T extends Value> extends LineChartProps<T> {
  title: string;
  metadata: MetadataProps;
  description?: string;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
  footer?: React.ReactNode;
  ariaDescription?: string;
}

export function LineChartTile<T extends Value>({
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
  const uniqueId = useUniqueId();

  return (
    <ChartTileWithTimeframe
      title={title}
      description={description}
      metadata={metadata}
      timeframeOptions={timeframeOptions}
      timeframeInitialValue={timeframeInitialValue}
      uniqueId={uniqueId}
      ariaDescription={ariaDescription}
    >
      {(timeframe) => (
        <>
          <ParentSize>
            {(parent) => (
              <LineChart
                {...chartProps}
                width={parent.width}
                timeframe={timeframe}
                uniqueId={uniqueId}
              />
            )}
          </ParentSize>
          {footer}
        </>
      )}
    </ChartTileWithTimeframe>
  );
}
