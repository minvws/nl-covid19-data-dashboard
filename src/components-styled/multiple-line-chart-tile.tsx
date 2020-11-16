import {
  MultipleLineChart,
  MultipleLineChartProps,
} from '~/components/lineChart/multipleLineChart.tsx';
import { TimeframeOption } from '~/utils/timeframe';
import { ChartTileWithTimeframe } from './chart-tile';
import { MetadataProps } from './metadata';

interface MultipleLineChartTileProps extends MultipleLineChartProps {
  title: string;
  metadata: MetadataProps;
  description?: string;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
}

export function MultipleLineChartTile({
  metadata,
  title,
  description,
  timeframeInitialValue = '5weeks',
  timeframeOptions,
  ...chartProps
}: MultipleLineChartTileProps) {
  return (
    <ChartTileWithTimeframe
      title={title}
      description={description}
      metadata={metadata}
      timeframeOptions={timeframeOptions}
      timeframeInitialValue={timeframeInitialValue}
    >
      {(timeframe) => (
        <MultipleLineChart {...chartProps} timeframe={timeframe} />
      )}
    </ChartTileWithTimeframe>
  );
}
