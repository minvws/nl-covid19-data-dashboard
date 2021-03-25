/**
 * This version of Axes is designed to be used in the root component
 * composition. Some charts might need very specific axes formatting and then we
 * can easily swap this out without having to make everything configurable via
 * props. It might be easier to just create 2 or 3 different types of axes
 * layouts by forking this component.
 */
import css from '@styled-system/css';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { ScaleLinear, ScaleBand } from 'd3-scale';
import { memo, Ref, useCallback } from 'react';
import { colors } from '~/style/theme';
import { createDate } from '~/utils/createDate';
import { Bounds } from '~/components-styled/time-series-chart/logic';
import { useIntl } from '~/intl';

type AxesProps = {
  bounds: Bounds;
  xScale: ScaleBand<number>;
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
  /**
   * This ref is used for measuring the width of the Y-axis to automagically
   * calculate a left-padding.
   */
  yAxisRef: Ref<SVGGElement>;
  yTickValues?: number[];
  xTickValues: [number, number];
};

type AnyTickFormatter = (value: any) => string;

export const Axes = memo(function Axes({
  numGridLines,
  bounds,
  isPercentage,
  xScale,
  yScale,
  yTickValues,
  xTickValues,
  yAxisRef,
}: AxesProps) {
  const { formatDateFromSeconds, formatNumber, formatPercentage } = useIntl();

  const formatYAxis = useCallback(
    (y: number) => {
      return formatNumber(y);
    },
    [formatNumber]
  );

  const formatYAxisPercentage = useCallback(
    (y: number) => {
      return `${formatPercentage(y)}%`;
    },
    [formatPercentage]
  );

  const formatXAxis = useCallback(
    (date_unix: number) => {
      return formatDateFromSeconds(date_unix, 'axis');
    },
    [formatDateFromSeconds]
  );

  return (
    <g css={css({ pointerEvents: 'none' })}>
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
        tickValues={xTickValues}
        tickFormat={formatXAxis as AnyTickFormatter}
        top={bounds.height}
        stroke={colors.silver}
        tickLabelProps={(x) => ({
          fill: colors.data.axisLabels,
          fontSize: 12,
          textAnchor: 'middle',
        })}
        hideTicks
      />

      <g ref={yAxisRef}>
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
      </g>
    </g>
  );
});
