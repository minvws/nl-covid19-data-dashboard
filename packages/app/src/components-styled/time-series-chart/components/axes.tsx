/**
 * This version of Axes is designed to be used in the root component
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
import { Bounds } from '../logic';

const NUM_TICKS = 20;

type AxesProps = {
  bounds: Bounds;
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

export const Axes = memo(function Axes({
  bounds,
  isPercentage,
  yTickValues,
  xScale,
  yScale,
}: AxesProps) {
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
          fill: colors.data.axisLabels,
          fontSize: 12,
          /**
           * Using anchor middle the line marker label will fall nicely on top
           * of the axis label
           */
          textAnchor: 'middle',
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
          textAnchor: 'end',
          verticalAnchor: 'middle',
        })}
      />
    </>
  );
});
