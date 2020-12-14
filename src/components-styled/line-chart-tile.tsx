import { ParentSize } from '@visx/responsive';
import { CustomLineChart } from '~/components/custom-line-chart/index';
import { TimeframeOption } from '~/utils/timeframe';
import { ChartTileWithTimeframe } from './chart-tile';
import { MetadataProps } from './metadata';
import { LineChartProps, Value } from '~/components/lineChart';

interface LineChartTileProps<T> extends LineChartProps<T> {
  title: string;
  metadata: MetadataProps;
  description?: string;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
  footer?: React.ReactNode;
  showDataWarning?: boolean;
}

export function LineChartTile<T extends Value>({
  metadata,
  title,
  description,
  timeframeOptions = ['all', '5weeks', 'week'],
  timeframeInitialValue = '5weeks',
  footer,
  showDataWarning,
  showFill = false,
  ...chartProps
}: LineChartTileProps<T>) {
  return (
    <ChartTileWithTimeframe
      title={title}
      description={description}
      metadata={metadata}
      timeframeOptions={timeframeOptions}
      timeframeInitialValue={timeframeInitialValue}
      showDataWarning={showDataWarning}
    >
      {(timeframe) => (
        <>
          <ParentSize>
            {(parent) => (
              <CustomLineChart
                showFill={showFill}
                width={parent.width}
                timeframe={timeframe}
                {...chartProps}
              />
            )}
          </ParentSize>
          {footer}
        </>
      )}
    </ChartTileWithTimeframe>
  );
}
