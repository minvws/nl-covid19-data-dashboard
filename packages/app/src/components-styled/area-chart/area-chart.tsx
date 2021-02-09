import { formatNumber, formatPercentage } from '@corona-dashboard/common';
import { scaleLinear, scaleTime } from '@visx/scale';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
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
import { useBreakpoints } from '~/utils/useBreakpoints';
import { LegendShape } from '../legenda';
import { AreaChartGraph, AreaDisplay } from './area-chart-graph';
import { useAreaValues } from './hooks/use-area-values';
import { useTrendValues } from './hooks/use-trend-values';

const NUM_TICKS = 3;

const defaultPadding: ChartPadding = {
  top: 10,
  right: 20,
  bottom: 30,
  left: 30,
};

export type TrendDisplay<T> = {
  metricProperty: keyof T;
  color?: string;
  style?: 'solid' | 'dashed';
  areaFill?: boolean;
  areaFillOpacity?: number;
  strokeWidth?: number;
  legendLabel?: string;
  legendShape?: LegendShape;
};

export type TrendDescriptor<T> = {
  values: T[];
  displays: TrendDisplay<T>[];
};

export type AreaDescriptor<T> = {
  values: T[];
  displays: AreaDisplay<T>[];
};

type AreaChartProps<T extends Value, K extends Value> = {
  width: number;
  trends: TrendDescriptor<T>[];
  areas: AreaDescriptor<K>[];
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
    trends,
    areas,
    width,
    valueAnnotation,
    timeframe = 'all',
    padding: overridePadding,
    signaalwaarde,
    isPercentage = false,
  } = props;
  const breakpoints = useBreakpoints();
  const filteredTrendValues = useTrendValues(trends, timeframe);
  const filteredAreaValues = useAreaValues(areas, timeframe);

  const isExtraSmallScreen = !breakpoints.sm;
  const height = isExtraSmallScreen ? 200 : 400;

  const allValues = [
    ...filteredTrendValues.map((x) => x.values).flat(),
    ...filteredAreaValues.map((x) => x.values).flat(),
  ];

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
        trends={filteredTrendValues}
        areas={filteredAreaValues}
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
