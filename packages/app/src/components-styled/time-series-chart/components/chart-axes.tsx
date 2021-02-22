/**
 * This version of ChartAxes is designed to be used in the root component
 * composition. Some charts might need very specific axes formatting and then we
 * can easily swap this out without having to make everything configurable via
 * props. It might be easier to just create 2 or 3 different types of axes
 * layouts by forking this component.
 */

import { formatNumber, formatPercentage } from '@corona-dashboard/common';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { memo } from 'react';
import { colors } from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';

const NUM_TICKS = 20;

export type ChartPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type ChartAxesProps = {
  bounds: ChartBounds;
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  isPercentage?: boolean;
  yTickValues?: number[];
};

const dateToValue = (d: Date) => d.valueOf() / 1000;

const formatXAxis = (date: Date) =>
  formatDateFromSeconds(dateToValue(date), 'axis');
const formatYAxis = (y: number) => formatNumber(y);
const formatYAxisPercentage = (y: number) => `${formatPercentage(y)}%`;

type AnyTickFormatter = (value: any) => string;

export type ChartBounds = { width: number; height: number };

export const ChartAxes = memo(function ChartAxes({
  bounds,
  isPercentage,
  yTickValues,
  xScale,
  yScale,
}: ChartAxesProps) {
  return (
    <>
      <GridRows
        scale={yScale}
        width={bounds.width}
        numTicks={NUM_TICKS}
        stroke="#E4E4E4"
      />
      <GridRows
        scale={yScale}
        width={bounds.width}
        numTicks={5}
        tickValues={yTickValues}
        stroke={colors.silver}
      />
      <AxisBottom
        scale={xScale}
        tickValues={xScale.domain()}
        tickFormat={formatXAxis as AnyTickFormatter}
        top={bounds.height}
        stroke={colors.silver}
        tickLabelProps={() => ({
          dx: -25,
          fill: colors.data.axisLabels,
          fontSize: 12,
        })}
        hideTicks
      />
      <AxisLeft
        scale={yScale}
        tickValues={yTickValues}
        hideTicks
        hideAxisLine
        stroke={colors.silver}
        tickFormat={
          isPercentage
            ? (formatYAxisPercentage as AnyTickFormatter)
            : (formatYAxis as AnyTickFormatter)
        }
        tickLabelProps={() => ({
          fill: colors.data.axisLabels,
          fontSize: 12,
          dx: 0,
          textAnchor: 'end',
          verticalAnchor: 'middle',
        })}
      />
    </>
  );
});
