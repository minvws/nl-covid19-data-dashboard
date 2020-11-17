import LineChart, { LineChartProps, Value } from '~/components/lineChart';
import { TimeframeOption } from '~/utils/timeframe';
import { ChartTileWithTimeframe } from './chart-tile';
import { MetadataProps } from './metadata';

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
          <LineChart {...chartProps} timeframe={timeframe} />
          {footer}
        </>
      )}
    </ChartTileWithTimeframe>
  );
}
