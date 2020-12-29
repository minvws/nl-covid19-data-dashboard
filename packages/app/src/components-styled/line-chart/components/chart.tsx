import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { localPoint } from '@visx/event';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { Point } from '@visx/point';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Bar, Line } from '@visx/shape';
import { Text } from '@visx/text';
import { bisectLeft } from 'd3-array';
import { memo, useCallback } from 'react';
import { isDefined } from 'ts-is-present';
import { colors } from '~/style/theme';
import { DailyValue, TrendValue, WeeklyValue } from '../helpers';
import { Trend, TrendType } from './trend';

const NUM_TICKS = 3;

export type ChartPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const defaultPadding: ChartPadding = {
  top: 10,
  right: 20,
  bottom: 30,
  left: 30,
};

const defaultColors = {
  main: colors.data.primary,
  axis: '#C4C4C4',
  axisLabels: '#666666',
  benchmark: '#4f5458',
};

type Benchmark = {
  value: number;
  label: string;
};

export type ChartValue = (TrendValue & DailyValue) | (TrendValue & WeeklyValue);

export type HoverPoint = { data: ChartValue; x: number; y: number };

type ChartProps = {
  benchmark?: Benchmark;
  isHovered: boolean;
  trend: ChartValue[] | ChartValue[][];
  type: TrendType;
  onHover: (
    event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>,
    hoverPoints?: HoverPoint[]
  ) => void;
  xDomain: [Date, Date];
  yDomain: number[];
  width: number;
  height: number;
  padding?: ChartPadding;
  formatXAxis: TickFormatter<Date>;
  formatYAxis: TickFormatter<number>;
};

type AnyTickFormatter = (value: any) => string;

export const Chart = memo(function Chart({
  trend,
  type,
  width,
  height,
  padding = defaultPadding,
  xDomain,
  yDomain,
  onHover,
  isHovered,
  benchmark,
  formatXAxis,
  formatYAxis,
}: ChartProps) {
  const trends = Array.isArray(trend[0])
    ? (trend as ChartValue[][])
    : ([trend] as ChartValue[][]);

  const bounded = {
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };

  const xScale = scaleTime({
    domain: xDomain,
    range: [0, bounded.width],
  });

  const yScale = scaleLinear({
    domain: yDomain,
    range: [bounded.height, 0],
    nice: NUM_TICKS,
  });

  const bisect = useCallback(
    (trend: ChartValue[], xPosition: number) => {
      if (!trend.length) return;
      if (trend.length === 1) return trend[0];

      const date = xScale.invert(xPosition - padding.left);

      const index = bisectLeft(
        trend.map((x) => x.__date),
        date,
        1
      );

      const d0 = trend[index - 1];
      const d1 = trend[index];

      return +date - +d0.__date > +d1.__date - +date ? d1 : d0;
    },
    [padding, xScale]
  );

  const distance = (point1: HoverPoint, point2: Point) => {
    const x = point2.x - point1.x;
    const y = point2.y - point1.y;
    return Math.sqrt(x * x + y * y);
  };

  const handlePointerMove = useCallback(
    (event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>) => {
      console.log('hit!');
      if (!trends.length) {
        return;
      }

      const point = localPoint(event) || ({ x: 0, y: 0 } as Point);

      const sortByDistance = (left: HoverPoint, right: HoverPoint) =>
        distance(left, point) - distance(right, point);

      const hoverPoints = trends
        .map((trend) => bisect(trend, point.x))
        .filter(isDefined)
        .map((data) => {
          return {
            data,
            x: xScale(data.__date),
            y: yScale(data.__value),
          };
        })
        .sort(sortByDistance);

      onHover(event, hoverPoints);
    },
    [onHover, yScale, xScale, trends, bisect]
  );

  return (
    <svg width={width} height={height} role="img">
      <Group left={padding.left} top={padding.top}>
        <GridRows
          scale={yScale}
          width={bounded.width}
          numTicks={NUM_TICKS}
          stroke={defaultColors.axis}
        />
        <AxisBottom
          scale={xScale}
          tickValues={xScale.domain()}
          tickFormat={formatXAxis as AnyTickFormatter}
          top={bounded.height}
          stroke={defaultColors.axis}
          tickLabelProps={() => ({
            dx: -25,
            fill: defaultColors.axisLabels,
            fontSize: 12,
          })}
          hideTicks
        />
        <AxisLeft
          scale={yScale}
          numTicks={4}
          hideTicks
          hideAxisLine
          stroke={defaultColors.axis}
          tickFormat={formatYAxis as AnyTickFormatter}
          tickLabelProps={() => ({
            fill: defaultColors.axisLabels,
            fontSize: 12,
            dx: -5,
            textAnchor: 'end',
            verticalAnchor: 'middle',
          })}
        />

        {benchmark && (
          <Group top={yScale(benchmark.value)}>
            <Text fontSize="14px" dy={-8} fill={defaultColors.benchmark}>
              {benchmark.value}
            </Text>
            <Text
              fontSize="14px"
              dy={-8}
              dx={bounded.width}
              textAnchor="end"
              fill={defaultColors.benchmark}
            >
              {benchmark.label}
            </Text>
            <Line
              stroke={defaultColors.benchmark}
              strokeDasharray="4,3"
              from={{ x: 0, y: 0 }}
              to={{ x: bounded.width, y: 0 }}
            />
          </Group>
        )}

        {trends.map((trend) => (
          <Trend
            trend={trend}
            type={type}
            xScale={xScale}
            yScale={yScale}
            color={defaultColors.main}
            isHovered={isHovered}
          />
        ))}
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          rx={14}
          onTouchStart={handlePointerMove}
          onTouchMove={handlePointerMove}
          onMouseMove={handlePointerMove}
          onMouseLeave={(event) => onHover(event)}
        />
      </Group>
    </svg>
  );
});
