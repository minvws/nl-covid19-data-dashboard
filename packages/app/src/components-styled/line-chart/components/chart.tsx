import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Line } from '@visx/shape';
import { Text } from '@visx/text';
import { bisectLeft } from 'd3-array';
import { memo, useCallback } from 'react';
import { colors } from '~/style/theme';
import { TrendValue } from '../helpers';
import { Trend, TrendType } from './trend';

const NUM_TICKS = 3;

export const defaultMargin = { top: 10, right: 20, bottom: 30, left: 30 };

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

type ChartProps = {
  benchmark?: Benchmark;
  isHovered: boolean;
  trend: TrendValue[];
  type: TrendType;
  onHover: (
    event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>,
    data?: any,
    xPosition?: number,
    yPosition?: number
  ) => void;
  xDomain: [Date, Date];
  yDomain: number[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  formatXAxis: TickFormatter<Date>;
  formatYAxis: TickFormatter<number>;
};

type AnyTickFormatter = (value: any) => string;

export const Chart = memo(function Chart({
  trend,
  type,
  width,
  height,
  margin = defaultMargin,
  xDomain,
  yDomain,
  onHover,
  isHovered,
  benchmark,
  formatXAxis,
  formatYAxis,
}: ChartProps) {
  const bounded = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
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
    (trend: TrendValue[], xPosition: number) => {
      if (trend.length === 1) return trend[0];

      const date = xScale.invert(xPosition - margin.left);

      const index = bisectLeft(
        trend.map((x) => x.__date),
        date,
        1
      );

      const d0 = trend[index - 1];
      const d1 = trend[index];

      return +date - +d0.__date > +d1.__date - +date ? d1 : d0;
    },
    [margin, xScale]
  );

  return (
    <svg width={width} height={height} role="img">
      <Group left={margin.left} top={margin.top}>
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

        <Trend
          trend={trend}
          type={type}
          height={bounded.height}
          width={bounded.width}
          xScale={xScale}
          yScale={yScale}
          color={defaultColors.main}
          onHover={onHover}
          isHovered={isHovered}
          bisect={bisect}
        />
      </Group>
    </svg>
  );
});
