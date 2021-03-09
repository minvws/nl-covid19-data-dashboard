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
import { ScaleLinear } from 'd3-scale';
import { memo } from 'react';
import { colors } from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { Bounds } from '../logic';

type AxesProps = {
  bounds: Bounds;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  isPercentage?: boolean;
  /**
   * The number of grid lines are by default linked to the number of y-axis
   * ticks. By setting tick values, you overrule that number for the ticks, so
   * you can have less labelled ticks than the number of total grid lines. For
   * example the vaccine_support chart uses 20 grid lines but 5 of those get a
   * label.
   */
  numGridLines: number;
  yTickValues?: number[];
};

const formatXAxis = (date_unix: number) =>
  formatDateFromSeconds(date_unix, 'axis');
const formatYAxis = (y: number) => formatNumber(y);
const formatYAxisPercentage = (y: number) => `${formatPercentage(y)}%`;

type AnyTickFormatter = (value: any) => string;

export const Axes = memo(function Axes({
  numGridLines,
  bounds,
  isPercentage,
  yTickValues,
  xScale,
  yScale,
}: AxesProps) {
  return (
    <>
      <GridRows
        /**
         * Lighter gray grid lines are used for the lines that have no label on
         * the y-axis
         */
        scale={yScale}
        width={bounds.width}
        numTicks={numGridLines}
        stroke="#E4E4E4"
      />
      <GridRows
        /**
         * Darker gray grid lines are used for the lines that also have a label
         * on the y-axis.
         */
        scale={yScale}
        width={bounds.width}
        numTicks={yTickValues?.length || numGridLines}
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
        numTicks={yTickValues?.length || numGridLines}
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
