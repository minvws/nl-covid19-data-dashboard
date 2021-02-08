import { formatNumber, formatPercentage } from '@corona-dashboard/common';
import { scaleLinear, scaleTime } from '@visx/scale';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { LineConfig } from '~/components-styled/line-chart';
import {
  ChartBounds,
  ChartPadding,
} from '~/components-styled/line-chart/components';
import { useChartPadding } from '~/components-styled/line-chart/hooks/use-chart-padding';
import { useDomains } from '~/components-styled/line-chart/hooks/use-domains';
import { Value } from '~/components-styled/stacked-chart/logic';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { TimeframeOption } from '~/utils/timeframe';
import { isArrayOfArrays } from '~/utils/typeguards/is-array-of-arrays';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { AreaChartGraph, AreaConfig } from './area-chart-graph';
import { useAreaValues } from './hooks/use-area-values';
import { useTrendValues } from './hooks/use-trend-values';

const NUM_TICKS = 3;

const defaultPadding: ChartPadding = {
  top: 10,
  right: 20,
  bottom: 30,
  left: 30,
};

type AreaChartProps<T extends Value, K extends Value> = {
  width: number;
  trendValues?: T[] | T[][];
  areaValues: K[] | K[][];
  areaConfigs: AreaConfig<K>[] | AreaConfig<K>[][];
  trendConfigs?: LineConfig<T>[] | LineConfig<T>[][];
  valueAnnotation?: string;
  timeframe?: TimeframeOption;
  padding?: Partial<ChartPadding>;
  signaalwaarde?: number;
  isPercentage?: boolean;
};

const dateToValue = (d: { valueOf(): number }) => d.valueOf() / 1000;
const formatXAxis = (date: Date | { valueOf(): number }) =>
  formatDateFromSeconds(dateToValue(date), 'axis');
const formatYAxisFn = (y: number) => formatNumber(y);
const formatYAxisPercentageFn = (y: number) => `${formatPercentage(y)}%`;

export function AreaChart<T extends Value, K extends Value>(
  props: AreaChartProps<T, K>
) {
  const {
    width,
    valueAnnotation,
    trendValues = [],
    areaValues,
    trendConfigs = [],
    areaConfigs,
    timeframe = 'all',
    padding: overridePadding,
    signaalwaarde,
    isPercentage = false,
  } = props;
  const breakpoints = useBreakpoints();
  const filteredTrendValues = useTrendValues(
    trendValues,
    trendConfigs,
    timeframe
  );
  const filteredAreaValues = useAreaValues(areaValues, areaConfigs, timeframe);

  const isExtraSmallScreen = !breakpoints.sm;
  const height = isExtraSmallScreen ? 200 : 400;

  const listOfAreaConfigs = isArrayOfArrays(areaConfigs)
    ? areaConfigs
    : [areaConfigs];
  const areaConfig = listOfAreaConfigs.map((x) =>
    x.reduce<Record<string, AreaConfig<T>>>((aggr, item) => {
      (aggr as any)[item.metricProperty] = item;
      return aggr;
    }, {})
  );

  const allValues = [...filteredTrendValues.flat(), ...filteredAreaValues];

  const [xDomain, yDomain, seriesMax] = useDomains(allValues, signaalwaarde);

  const padding = useChartPadding(
    seriesMax.toFixed(0).length * 10,
    defaultPadding,
    overridePadding
  );

  const bounds: ChartBounds = {
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };

  const xScale = scaleTime({
    domain: xDomain,
    range: [0, bounds.width],
  });

  const yScale = scaleLinear({
    domain: yDomain,
    range: [bounds.height, 0],
    nice: NUM_TICKS,
  });

  const scales = { xScale, yScale };

  return (
    <Box position="relative">
      {isDefined(valueAnnotation) && (
        <ValueAnnotation>{valueAnnotation}</ValueAnnotation>
      )}

      <AreaChartGraph
        trendValues={filteredTrendValues}
        lineConfigs={trendConfigs}
        areaValues={filteredAreaValues}
        areaConfig={areaConfig}
        bounds={bounds}
        padding={padding}
        scales={scales}
        formatXAxis={formatXAxis}
        formatYAxis={isPercentage ? formatYAxisPercentageFn : formatYAxisFn}
        numTicks={3}
      />
    </Box>
  );
}
