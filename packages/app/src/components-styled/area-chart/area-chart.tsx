import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { LegendShape } from '~/components-styled/legenda';
import { NumberProperty, Value } from '~/components-styled/line-chart/helpers';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { TimeframeOption } from '~/utils/timeframe';
import { useElementSize } from '~/utils/use-element-size';
import { LineConfig } from '../line-chart';
import { useTrendValues } from '../line-chart/hooks/use-trend-values';
import { AreaChartGraph } from './area-chart-graph';

export type AreaConfig<T> = {
  metricProperty: NumberProperty<T>;
  color?: string;
  strokeWidth?: number;
  legendLabel?: string;
  legendShape?: LegendShape;
};

type AreaChartProps<T extends Value> = {
  values: T[];
  areaConfigs: AreaConfig<T>[];
  lineConfigs: LineConfig<T>[];
  valueAnnotation?: string;
  timeframe: TimeframeOption;
};

export function AreaChart<T extends Value>(props: AreaChartProps<T>) {
  const {
    valueAnnotation,
    values,
    lineConfigs,
    areaConfigs,
    timeframe,
  } = props;

  const [sizeRef] = useElementSize<HTMLDivElement>(400);

  const trendValues = useTrendValues(values, lineConfigs, timeframe);
  const areaValues = useTrendValues(values, areaConfigs, timeframe);

  return (
    <Box position="relative">
      {isDefined(valueAnnotation) && (
        <ValueAnnotation>{valueAnnotation}</ValueAnnotation>
      )}

      <div ref={sizeRef}>
        <AreaChartGraph trendValues={trendValues} areaValues={areaValues} />
      </div>
    </Box>
  );
}
