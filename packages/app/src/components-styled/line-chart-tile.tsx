import { ParentSize } from '@visx/responsive';
import { LineChart, LineChartProps } from '~/components-styled/line-chart';
import { Value } from '~/components-styled/line-chart/helpers';
import { TimeframeOption } from '~/utils/timeframe';
import { ChartTileWithTimeframe } from './chart-tile';
import { MetadataProps } from './metadata';

interface LineChartTileProps<T extends Value> extends LineChartProps<T> {
  title: string;
  metadata: MetadataProps;
  description?: string | null;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
  footer?: React.ReactNode;
  ariaDescription?: string;
}

export function LineChartTile<T extends Value>({
  metadata,
  title,
  description = null,
  timeframeOptions = ['all', '5weeks', 'week'],
  timeframeInitialValue = '5weeks',
  footer,
  ariaDescription,
  ...chartProps
}: LineChartTileProps<T>) {
  if (!description && !ariaDescription)
    throw new Error(
      `This graph doesn't include a description, please add a ariaDescription property`
    );

  const uniqueAriaId = title.replace(/\W+/g, '-').toLowerCase() as string;

  return (
    <ChartTileWithTimeframe
      title={title}
      description={description}
      metadata={metadata}
      timeframeOptions={timeframeOptions}
      timeframeInitialValue={timeframeInitialValue}
      uniqueAriaId={uniqueAriaId}
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
                uniqueAriaId={uniqueAriaId}
              />
            )}
          </ParentSize>
          {footer}
        </>
      )}
    </ChartTileWithTimeframe>
  );
}
