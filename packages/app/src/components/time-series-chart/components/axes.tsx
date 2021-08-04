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
import { scaleLinear } from '@visx/scale';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { differenceInDays } from 'date-fns';
import { memo, Ref, useCallback } from 'react';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { createDate } from '~/utils/create-date';
import { useIsMounted } from '~/utils/use-is-mounted';
import { Bounds } from '../logic';
import { WeekNumbers } from './week-numbers';

type AxesProps = {
  bounds: Bounds;
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
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
  showWeekNumbers?: boolean;
  /**
   * This ref can be used for measuring the width of the Y-axis to automagically
   * calculate a left-padding.
   */
  yAxisRef?: Ref<SVGGElement>;
  yTickValues?: number[];
  xTickValues: [number, number];
  formatYTickValue?: (value: number) => string;

  /**
   * On narrow screens we'll "collapse" the Y-axis. Only the low value will be
   * displayed.
   */
  isYAxisCollapsed?: boolean;

  /**
   * The xRangePadding can be used to add padding to the x-axis. Note that this
   * will only widen the x-axis line: it will not "push the trends together" nor
   * it will move the Y-axis to the left.
   */
  xRangePadding?: number;

  /**
   * Indicates if the chart contains a series that only has values of zero.
   * (In case this needs special rendering)
   */
  hasAllZeroValues?: boolean;
};

export type AnyTickFormatter = (value: any) => string;

export const Axes = memo(function Axes({
  numGridLines,
  showWeekNumbers,
  bounds,
  isPercentage,
  xScale,
  yScale,
  yTickValues,
  xTickValues,
  formatYTickValue,
  yAxisRef,
  isYAxisCollapsed,
  xRangePadding,
  hasAllZeroValues: allZeroValues,
}: AxesProps) {
  const [startUnix, endUnix] = xTickValues;
  const isMounted = useIsMounted();

  const {
    formatDateFromSeconds,
    formatNumber,
    formatPercentage,
    formatRelativeDate,
  } = useIntl();

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
      /**
       * Display relative dates when it's today or yesterday
       */
      if (isMounted && differenceInDays(Date.now(), date_unix * 1000) < 2) {
        const relativeDate = formatRelativeDate({ seconds: date_unix });
        if (relativeDate) {
          return relativeDate;
        }
      }

      const startYear = createDate(startUnix).getFullYear();
      const endYear = createDate(endUnix).getFullYear();

      const isMultipleYearSpan = startYear !== endYear;

      return isMultipleYearSpan && [startUnix, endUnix].includes(date_unix)
        ? formatDateFromSeconds(date_unix, 'axis-with-year')
        : formatDateFromSeconds(date_unix, 'axis');
    },
    [isMounted, formatRelativeDate, startUnix, endUnix, formatDateFromSeconds]
  );

  /**
   * Long labels (like the ones including a year, are too long to be positioned
   * centered on the x-axis tick. Usually a short date has a 2 digit number plus
   * a space plus a three character month, which makes 6.
   */
  const isLongStartLabel = formatXAxis(startUnix).length > 6;
  const isLongEndLabel = formatXAxis(endUnix).length > 6;

  /**
   * We make an exception for the situation where all the values in the chart are zero.
   * In that case the top range has been set to zero, but we want to draw exactly
   * two gridlines in this case (at the top and bottom of the chart). So therefore we
   * check for this case here and create a scale and gridline count accordingly.
   */
  const darkGridRowScale = allZeroValues
    ? scaleLinear({
        domain: [0, 1],
        range: yScale.range(),
      })
    : yScale;
  const numDarkGridLines = allZeroValues ? 1 : numGridLines;

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
        scale={darkGridRowScale}
        width={bounds.width}
        numTicks={yTickValues?.length || numDarkGridLines}
        tickValues={yTickValues}
        stroke={colors.silver}
      />

      {showWeekNumbers && (
        <WeekNumbers
          startUnix={startUnix}
          endUnix={endUnix}
          bounds={bounds}
          xScale={xScale}
        />
      )}

      <AxisBottom
        scale={xScale}
        tickValues={xTickValues}
        tickFormat={formatXAxis as AnyTickFormatter}
        top={bounds.height}
        stroke={colors.silver}
        rangePadding={xRangePadding}
        tickLabelProps={(x) => ({
          fill: colors.data.axisLabels,
          fontSize: 12,
          dy: '-0.5px',
          /**
           * Using anchor middle the line marker label will fall nicely on top
           * of the axis label.
           *
           * The only times at which we can not use middle is if we are
           * rendering a year in the label, because it becomes too long.
           */
          textAnchor:
            x === startUnix
              ? isLongStartLabel
                ? 'start'
                : 'middle'
              : x === endUnix
              ? isLongEndLabel
                ? 'end'
                : 'middle'
              : 'middle',
        })}
        hideTicks
      />

      <g>
        {/**
         * We have 2 different AxisLeft components. One of them is for wide screens,
         * the other one for narrow screens.
         * The former is wrapped inside a group with an yAxisRef. This ref is used
         * by the calling context to measure the y-axis width. When we are rendering
         * a collapsed y-axis this width should equal `0`, therefore we still
         * mount this group but without any content.
         */}
        <g ref={yAxisRef}>
          {!isYAxisCollapsed && (
            <AxisLeft
              scale={yScale}
              tickValues={yTickValues}
              numTicks={yTickValues?.length || numGridLines}
              hideTicks
              hideAxisLine
              stroke={colors.silver}
              tickFormat={
                formatYTickValue
                  ? (formatYTickValue as AnyTickFormatter)
                  : isPercentage
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
          )}
        </g>

        {/**
         * When the numGridLines is set to 0 we don't want to display the top
         * value. Otherwise the top value would kind of be floating around,
         * without the presence of a grid line.
         * This means we can skip rendering the axis component because
         * that's all it does as a "collapsed" axis.
         */}
        {isYAxisCollapsed && numGridLines !== 0 && (
          <AxisLeft
            scale={yScale}
            tickValues={yScale.domain()}
            numTicks={numGridLines}
            hideTicks
            hideAxisLine
            stroke={colors.silver}
            tickFormat={
              formatYTickValue
                ? (formatYTickValue as AnyTickFormatter)
                : isPercentage
                ? (formatYAxisPercentage as AnyTickFormatter)
                : (formatYAxis as AnyTickFormatter)
            }
            tickLabelProps={() => ({
              fill: colors.data.axisLabels,
              fontSize: 12,
              textAnchor: 'start',
              // position the label above the chart
              dx: 10,
              dy: -5,
            })}
          />
        )}
      </g>
    </g>
  );
});
