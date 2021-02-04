import { formatNumber, formatPercentage } from '@corona-dashboard/common';
import { scaleLinear, scaleTime } from '@visx/scale';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { TimeframeOption } from '~/utils/timeframe';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { LineConfig } from '../line-chart';
import { ChartBounds, ChartPadding } from '../line-chart/components';
import { useChartPadding } from '../line-chart/hooks/use-chart-padding';
import { useDomains } from '../line-chart/hooks/use-domains';
import { useTrendValues } from '../line-chart/hooks/use-trend-values';
import { Value } from '../stacked-chart/logic';
import { AreaChartGraph, AreaConfig } from './area-chart-graph';
import { useAreaValues } from './hooks/use-area-values';

const NUM_TICKS = 3;

const defaultPadding: ChartPadding = {
  top: 10,
  right: 20,
  bottom: 30,
  left: 30,
};

type AreaChartProps<T extends Value, K extends Value> = {
  width: number;
  lineValues?: T[];
  areaValues: K[];
  areaConfigs: AreaConfig[];
  lineConfigs?: LineConfig[];
  valueAnnotation?: string;
  timeframe: TimeframeOption;
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
    lineValues = [],
    areaValues,
    lineConfigs = [],
    areaConfigs,
    timeframe,
    padding: overridePadding,
    signaalwaarde,
    isPercentage = false,
  } = props;
  const breakpoints = useBreakpoints();
  const trendValues = useTrendValues(lineValues, lineConfigs, timeframe);
  const filteredAreaValues = useAreaValues(areaValues, areaConfigs, timeframe);

  const isExtraSmallScreen = !breakpoints.sm;
  const height = isExtraSmallScreen ? 200 : 400;

  const areaConfig = areaConfigs.reduce<Record<string, AreaConfig>>(
    (aggr, item) => {
      aggr[item.metricProperty] = item;
      return aggr;
    },
    {}
  );

  const allValues = [...trendValues, filteredAreaValues];

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
        trendValues={trendValues}
        lineConfigs={lineConfigs}
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
