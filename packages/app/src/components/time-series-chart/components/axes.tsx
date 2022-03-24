/**
 * This version of Axes is designed to be used in the root component
 * composition. Some charts might need very specific axes formatting and then we
 * can easily swap this out without having to make everything configurable via
 * props. It might be easier to just create 2 or 3 different types of axes
 * layouts by forking this component.
 */
import {
  colors,
  middleOfDayInSeconds,
  TimeframeOption,
  TimestampedValue,
  DateSpanValue,
  assert,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import { NumberValue, ScaleBand, ScaleLinear } from 'd3-scale';
import { memo, Ref, useCallback, useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useIntl } from '~/intl';
import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { Bounds } from '../logic';
import { WeekNumbers } from './week-numbers';


export type AxesProps<
  T extends TimestampedValue
> = {
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
  timeframe: TimeframeOption;
  /**
   * This ref can be used for measuring the width of the Y-axis to automagically
   * calculate a left-padding.
   */
  yAxisRef?: Ref<SVGGElement>;
  yTickValues?: number[];
  timeDomain: [number, number];
  xTickNumber?: number;
  values?: T[];
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
  useDatesAsRange?: boolean;
};

function createTimeTicks(startTick: number, endTick: number, count: number) {
  const start = middleOfDayInSeconds(startTick);
  const end = middleOfDayInSeconds(endTick);

  if (count <= 2) {
    return [start, end];
  }

  const ticks: number[] = [];
  const stepCount = count - 1;
  const step = Math.floor((end - start) / stepCount);

  for (let i = 0; i < stepCount; i++) {
    const tick = start + i * step;
    ticks.push(middleOfDayInSeconds(tick));
  }
  ticks.push(end);

  return ticks;
}

export type AnyTickFormatter = (value: any) => string;

export const Axes = memo(function Axes<
  T extends TimestampedValue
>({
  numGridLines,
  showWeekNumbers,
  bounds,
  isPercentage,
  xScale,
  yScale,
  timeframe,
  yTickValues,
  timeDomain,
  xTickNumber,
  values,
  formatYTickValue,
  yAxisRef,
  isYAxisCollapsed,
  xRangePadding,
  hasAllZeroValues: allZeroValues,
  useDatesAsRange,
}: AxesProps<T>) {
  const [startUnix, endUnix] = timeDomain;
  const breakpoints = useBreakpoints();

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

  if (!isPresent(xTickNumber)) {
    const preferredDateTicks = breakpoints.sm
      ? timeframe === 'all'
        ? useDatesAsRange
          ? 6 : 4
        : useDatesAsRange
        ? 5 : 3
      : useDatesAsRange
      ? 3 : 2;
    const fullDaysInDomain = Math.floor((endUnix - startUnix) / 86400);
    xTickNumber = Math.max(Math.min(fullDaysInDomain, preferredDateTicks), 2);
  }

  const xTicks = createTimeTicks(startUnix, endUnix, xTickNumber);

  const formatXAxis = useCallback(
    (date_unix: number, index: number) => {
      const startYear = createDateFromUnixTimestamp(startUnix).getFullYear();
      const endYear = createDateFromUnixTimestamp(endUnix).getFullYear();

      const isMultipleYearSpan = startYear !== endYear;

      if ([startUnix, endUnix].includes(date_unix)) {
        return isMultipleYearSpan
          ? formatDateFromSeconds(date_unix, 'axis-with-year')
          : formatDateFromSeconds(date_unix, 'axis');
      } else {
        const previousDate = xTicks[index - 1];
        const previousYear =
          !!previousDate &&
          createDateFromUnixTimestamp(previousDate).getFullYear();
        const currentYear =
          createDateFromUnixTimestamp(date_unix).getFullYear();
        const isNewYear = previousYear !== currentYear;

        return isNewYear
          ? formatDateFromSeconds(date_unix, 'axis-with-year')
          : formatDateFromSeconds(date_unix, 'axis');
      }
    },
    [startUnix, endUnix, formatDateFromSeconds, xTicks]
  );

  const firstAndLastDate = useMemo(() => ({
    "first_date": startUnix,
    "last_date": endUnix,
  }), [startUnix, endUnix]);
  
  const formatXTickValue = useCallback(
    (date_unix: number, dateRange: DateSpanValue[]) => {
      const startYear = createDateFromUnixTimestamp(startUnix).getFullYear();
      const endYear = createDateFromUnixTimestamp(endUnix).getFullYear();

      const isMultipleYearSpan = startYear !== endYear;

      const reduced = dateRange.reduce((acc: DateSpanValue, value: DateSpanValue) => {
        assert(acc.date_start_unix && acc.date_end_unix && value.date_start_unix && value.date_end_unix,
          'This needs a date_start_unix & date_end_unix here');
        const smallestDifferenceAcc = Math.min(Math.abs(acc.date_start_unix - date_unix), Math.abs(acc.date_end_unix - date_unix));
        const smallestDifferenceVal = Math.min(Math.abs(value.date_start_unix - date_unix), Math.abs(value.date_end_unix - date_unix));
        if (value.date_start_unix <= date_unix && value.date_end_unix >= date_unix) {
          return value
        } else if (smallestDifferenceVal < smallestDifferenceAcc) {
          return value
        }
        return acc
      })

      const dateStartUnix = reduced.date_start_unix;
      const dateEndUnix = reduced.date_end_unix;

      const dateStartYear = createDateFromUnixTimestamp(dateStartUnix).getFullYear();
      const dateEndYear = createDateFromUnixTimestamp(dateEndUnix).getFullYear();

      /**
       * set first and last date of new timerange.
       * As and date we also want the smallest one,
       * because the endDate will never be larger then the new endDate because that's filtered out earlier this file.
       */
      firstAndLastDate.first_date = dateStartUnix < firstAndLastDate.first_date ? dateStartUnix : firstAndLastDate.first_date;
      firstAndLastDate.last_date = endUnix < firstAndLastDate.last_date && dateEndUnix > firstAndLastDate.last_date ? dateEndUnix : firstAndLastDate.last_date;

      if (startUnix === dateStartUnix || endUnix === dateEndUnix) {
        return isMultipleYearSpan
          ? `${formatDateFromSeconds(dateStartUnix, 'axis')} - ${formatDateFromSeconds(dateEndUnix, 'axis-with-year')}`
          : `${formatDateFromSeconds(dateStartUnix, 'axis')} - ${formatDateFromSeconds(dateEndUnix, 'axis')}`;
      } else {
        const isNewYear = dateStartYear !== dateEndYear;

        return isNewYear
        ? `${formatDateFromSeconds(dateStartUnix, 'axis')} - ${formatDateFromSeconds(dateEndUnix, 'axis-with-year')}`
        : `${formatDateFromSeconds(dateStartUnix, 'axis')} - ${formatDateFromSeconds(dateEndUnix, 'axis')}`;
      }
    },
    [startUnix, endUnix, formatDateFromSeconds, firstAndLastDate]
  );

  /**
   * Long labels (like the ones including a year, are too long to be positioned
   * centered on the x-axis tick. Usually a short date has a 2 digit number plus
   * a space plus a three character month, which makes 6.
   */
  const isLongStartLabel = formatXAxis(startUnix, 0).length > 6;
  const isLongEndLabel = formatXAxis(endUnix, xTickNumber - 1).length > 6;

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

  const getAnchor = (x: NumberValue) => {
    /**
     * Using anchor middle the line marker label will fall nicely on top
     * of the axis label.
     *
     * The only times at which we can not use middle is if we are
     * rendering a year in the label, because it becomes too long.
     */

    if (x === firstAndLastDate.first_date) {
      return isLongStartLabel || useDatesAsRange ? 'start' : 'middle';
    } else if (x === firstAndLastDate.last_date) {
      return isLongEndLabel || useDatesAsRange ? 'end' : 'middle';
    }
    return 'middle';
  };

  return (
    <g css={css({ pointerEvents: 'none' })} aria-hidden="true">
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
        tickValues={xTicks}
        tickFormat={useDatesAsRange && values 
          ? ((x: number) => formatXTickValue(x, values as DateSpanValue[])) as AnyTickFormatter
          : formatXAxis as AnyTickFormatter
        }
        top={bounds.height}
        stroke={colors.silver}
        rangePadding={xRangePadding}
        tickLabelProps={(x) => ({
            fill: colors.data.axisLabels,
            fontSize: 12,
            dy: '-0.5px',
            textAnchor: getAnchor(x)
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
