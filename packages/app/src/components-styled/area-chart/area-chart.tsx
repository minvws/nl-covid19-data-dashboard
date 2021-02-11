import {
  formatNumber,
  formatPercentage,
  TimestampedValue,
} from '@corona-dashboard/common';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Line } from '@visx/shape';
import { Text } from '@visx/text';
import { ScaleTime } from 'd3-scale';
import { MouseEvent, TouchEvent } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import {
  ChartBounds,
  ChartPadding,
} from '~/components-styled/line-chart/components';
import { useChartPadding } from '~/components-styled/line-chart/hooks/use-chart-padding';
import { useDomains } from '~/components-styled/line-chart/hooks/use-domains';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import theme from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { TimeframeOption } from '~/utils/timeframe';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { LegendShape } from '../legenda';
import { TrendValueWithTimestamp } from '../line-chart/logic';
import { AreaChartGraph, AreaConfig, AreaDisplay } from './area-chart-graph';
import { useAreaConfigs } from './hooks/use-area-configs';
import { useTrendConfigs } from './hooks/use-trend-configs';

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

export type DividerConfig = {
  color: string;
  leftLabel: string;
  rightLabel: string;
};

type AreaChartProps<T extends TimestampedValue, K extends T> = {
  width: number;
  trends: TrendDescriptor<T>[];
  areas: AreaDescriptor<K>[];
  valueAnnotation?: string;
  timeframe?: TimeframeOption;
  padding?: Partial<ChartPadding>;
  signaalwaarde?: number;
  isPercentage?: boolean;
  divider?: DividerConfig;
};

const dateToValue = (d: { valueOf(): number }) => d.valueOf() / 1000;
const formatXAxis = (date: Date | { valueOf(): number }) =>
  formatDateFromSeconds(dateToValue(date), 'axis');
const formatYAxisFn = (y: number) => formatNumber(y);
const formatYAxisPercentageFn = (y: number) => `${formatPercentage(y)}%`;

export function AreaChart<T extends TimestampedValue, K extends T>(
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
    divider,
  } = props;
  const breakpoints = useBreakpoints();
  const trendConfigs = useTrendConfigs(trends, timeframe);
  const areaConfigs = useAreaConfigs(areas, timeframe);

  const isExtraSmallScreen = !breakpoints.sm;
  const height = isExtraSmallScreen ? 200 : 400;

  const allValues = [
    ...trendConfigs.map((x) => x.values).flat(),
    ...areaConfigs.map((x) => x.values).flat(),
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

  const handleHover = (
    event: TouchEvent<SVGElement> | MouseEvent<SVGElement>
  ) => console.dir(event);

  return (
    <Box position="relative">
      {isDefined(valueAnnotation) && (
        <ValueAnnotation>{valueAnnotation}</ValueAnnotation>
      )}

      <AreaChartGraph
        trends={trendConfigs}
        areas={areaConfigs}
        bounds={bounds}
        width={width}
        height={height}
        padding={padding}
        scales={scales}
        formatXAxis={formatXAxis}
        formatYAxis={isPercentage ? formatYAxisPercentageFn : formatYAxisFn}
        numTicks={6}
        onHover={handleHover}
      >
        {divider &&
          renderDivider(areaConfigs as any, divider, height, padding, xScale)}
      </AreaChartGraph>
    </Box>
  );
}

function renderDivider(
  areas: AreaConfig<TrendValueWithTimestamp>[],
  divider: DividerConfig,
  height: number,
  padding: ChartPadding,
  xScale: ScaleTime<number, number>
) {
  const dates = areas.map((area) => area.values[0].__date);
  dates.shift();

  return dates.map((date) => {
    const x = xScale(date);
    return x !== undefined ? (
      <Group>
        <Text
          fontSize={theme.fontSizes[1]}
          x={x - 15}
          y={padding.top * 2}
          textAnchor="end"
          fill={divider.color}
        >
          {divider.leftLabel}
        </Text>
        <Text
          fontSize={theme.fontSizes[1]}
          x={x + 15}
          y={padding.top * 2}
          textAnchor="start"
          fill={divider.color}
        >
          {divider.rightLabel}
        </Text>
        <Line
          x1={x}
          y1={0}
          x2={x}
          y2={height - padding.bottom}
          style={{ stroke: divider.color, strokeWidth: 1 }}
        />
      </Group>
    ) : null;
  });
}
