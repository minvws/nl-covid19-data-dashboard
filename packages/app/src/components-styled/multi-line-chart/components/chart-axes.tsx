/**
 * This is fork from line-chart/components/chart-axes, because for the vaccine
 * support chart we need very specific tick / line formatting
 *
 * @TODO consolidate with line chart. But this ChartAxis abstraction is probably
 * going to be refactored out anyway.
 *
 * I have simplified things by taking out the component callback functions
 */

import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Bar } from '@visx/shape';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { memo, MouseEvent, ReactNode, TouchEvent } from 'react';
import { colors } from '~/style/theme';

const NUM_TICKS = 20;

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
  axis: colors.silver,
  gridMain: colors.silver,
  gridSub: '#E4E4E4',
  axisLabels: colors.data.axisLabels,
  benchmark: colors.data.benchmark,
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
  padding: ChartPadding;
  formatXAxis: TickFormatter<Date>;
  formatYAxis: TickFormatter<number>;
  children: (props: ChartScales) => ReactNode;
  ariaLabelledBy?: string;
  dateSpanWidth: number;
  yTickValues?: number[];
};

type AnyTickFormatter = (value: any) => string;

export type ChartBounds = { width: number; height: number };

export const ChartAxes = memo(function ChartAxes({
  width,
  height,
  padding,
  xDomain,
  yDomain,
  onHover,
  formatXAxis,
  formatYAxis,
  children,
  ariaLabelledBy,
  dateSpanWidth,
  yTickValues,
}: ChartAxesProps) {
  const bounds: ChartBounds = {
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };

  const markerPadding = dateSpanWidth / 2;

  const xScale = scaleTime({
    domain: xDomain,
    range: [markerPadding, bounds.width - markerPadding],
  });

  const yScale = scaleLinear({
    domain: yDomain,
    range: [bounds.height, 0],
    nice: yTickValues?.length || NUM_TICKS,
  });

  const scales = { xScale, yScale };

  const handleHover = (
    event: TouchEvent<SVGElement> | MouseEvent<SVGElement>
  ) => onHover(event, scales);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-labelledby={ariaLabelledBy}
    >
      <Group left={padding.left} top={padding.top}>
        <GridRows
          scale={yScale}
          width={bounds.width}
          numTicks={NUM_TICKS}
          stroke={defaultColors.gridSub}
        />
        <GridRows
          scale={yScale}
          width={bounds.width}
          numTicks={5}
          tickValues={yTickValues}
          stroke={defaultColors.gridMain}
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
          tickValues={yTickValues}
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

        {children(scales)}

        {/**
         * Render the bar on top of the trends because it captures mouse hover when you are above the trend line
         */}
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          onTouchStart={handleHover}
          onTouchMove={handleHover}
          onMouseMove={handleHover}
          onMouseLeave={handleHover}
        />
      </Group>
    </svg>
  );
});
