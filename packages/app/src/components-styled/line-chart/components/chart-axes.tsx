import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Bar, Line } from '@visx/shape';
import { Text } from '@visx/text';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { memo, MouseEvent, ReactNode, TouchEvent } from 'react';
import { MARKER_MIN_WIDTH } from './marker';

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
  axis: '#C4C4C4',
  axisLabels: '#666666',
  benchmark: '#4f5458',
};

type Benchmark = {
  value: number;
  label: string;
};

export type ChartScales = {
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
};

type ChartAxesProps = {
  benchmark?: Benchmark;
  onHover: (
    event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>,
    scales: ChartScales
  ) => void;
  xDomain: [Date, Date];
  yDomain: number[];
  width: number;
  height: number;
  padding?: ChartPadding;
  formatXAxis: TickFormatter<Date>;
  formatYAxis: TickFormatter<number>;
  children: (props: ChartScales) => ReactNode;
  uniqueId?: string;
};

type AnyTickFormatter = (value: any) => string;

export const ChartAxes = memo(function ChartAxes({
  width,
  height,
  padding = defaultPadding,
  xDomain,
  yDomain,
  onHover,
  benchmark,
  formatXAxis,
  formatYAxis,
  children,
  uniqueId,
}: ChartAxesProps) {
  const bounds = {
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };

  const markerPadding = MARKER_MIN_WIDTH / 2;
  const xScale = scaleTime({
    domain: xDomain,
    range: [markerPadding, bounds.width - markerPadding],
  });

  const yScale = scaleLinear({
    domain: yDomain,
    range: [bounds.height, 0],
    nice: NUM_TICKS,
  });

  const scales = { xScale, yScale };

  const handleMouse = (
    event: TouchEvent<SVGElement> | MouseEvent<SVGElement>
  ) => onHover(event, scales);

  return (
    <svg width={width} height={height} role="img" aria-labelledby={uniqueId}>
      <Group left={padding.left} top={padding.top}>
        <GridRows
          scale={yScale}
          width={bounds.width}
          numTicks={NUM_TICKS}
          stroke={defaultColors.axis}
        />
        <AxisBottom
          scale={xScale}
          tickValues={xScale.domain()}
          tickFormat={formatXAxis as AnyTickFormatter}
          top={bounds.height}
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
            dx: 0,
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
              dx={bounds.width}
              textAnchor="end"
              fill={defaultColors.benchmark}
            >
              {benchmark.label}
            </Text>
            <Line
              stroke={defaultColors.benchmark}
              strokeDasharray="4,3"
              from={{ x: 0, y: 0 }}
              to={{ x: bounds.width, y: 0 }}
            />
          </Group>
        )}

        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          onTouchStart={handleMouse}
          onTouchMove={handleMouse}
          onMouseMove={handleMouse}
          onMouseLeave={handleMouse}
        />

        {children(scales)}
      </Group>
    </svg>
  );
});
