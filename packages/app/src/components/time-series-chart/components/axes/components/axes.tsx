/**
 * This version of Axes is designed to be used in the root component
 * composition. Some charts might need very specific axes formatting and then we
 * can easily swap this out without having to make everything configurable via
 * props. It might be easier to just create 2 or 3 different types of axes
 * layouts by forking this component.
 */
import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { Bounds } from '../../../logic';
import { colors, TimeframeOption, TimestampedValue, DateSpanValue } from '@corona-dashboard/common';
import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';
import { fontSizes } from '~/style/theme';
import { GridRows } from '@visx/grid';
import { isPresent } from 'ts-is-present';
import { memo, Ref, useCallback, useMemo } from 'react';
import { NumberValue, ScaleBand, ScaleLinear } from 'd3-scale';
import { scaleLinear } from '@visx/scale';
import { TickInstance, createTimeTicks, createTimeTicksAllTimeFrame, createTimeTicksMonthlyTimeFrame } from '../logic/create-time-ticks';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useIntl } from '~/intl';
import { WeekNumbers } from '../../week-numbers';
import css from '@styled-system/css';

export type AxesProps<T extends TimestampedValue> = {
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
  formatYTickValue?: TickFormatter<NumberValue>;

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

export const Axes = memo(function Axes<T extends TimestampedValue>({
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
}: AxesProps<T>) {
  const [startUnix, endUnix] = timeDomain;
  const startYear = createDateFromUnixTimestamp(startUnix).getFullYear();
  const endYear = createDateFromUnixTimestamp(endUnix).getFullYear();
  const breakpoints = useBreakpoints();

  const isDateSpanValue = (value: any): value is DateSpanValue => value.date_start_unix !== undefined && value.date_end_unix !== undefined;
  const isDateSpanValues = useCallback((values: any): values is DateSpanValue[] => values.every((x: DateSpanValue) => isDateSpanValue(x)), []);
  const hasDatesAsRange = isDateSpanValues(values);

  const { formatDateFromSeconds, formatNumber, formatPercentage } = useIntl();

  const formatYAxis: TickFormatter<NumberValue> = useCallback((y: NumberValue) => formatNumber(y as number), [formatNumber]);

  const formatYAxisPercentage: TickFormatter<NumberValue> = useCallback((y: NumberValue) => `${formatPercentage(y as number)}%`, [formatPercentage]);

  const prefferedDateTicksAllTimeFrame = () => {
    /**
     * This method gets the difference in years between endUnix and startUnix.
     * The result is divided by 31557600 and rounded UP with .ceil
     * 31557600 is calculated based on 86400 (seconds in a day)
     * multiplied by 365.25 (number of days in a year and .25 to consider leap years)
     *
     * This logic is used to calculate the amount of January 1st dates the algorithm needs
     * for displaying "all" timeframe.
     */
    const yearsDifferenceInDomain = Math.ceil((endUnix - startUnix) / 31557600);

    return yearsDifferenceInDomain;
  };

  const bottomAxesTickNumber = useMemo(() => {
    let value = 2;
    if (!isPresent(xTickNumber)) {
      switch (timeframe) {
        case TimeframeOption.ALL:
          // Turned to an if statement for readability purposes
          if (hasDatesAsRange) {
            value = 4;
          } else {
            value = prefferedDateTicksAllTimeFrame();
          }
          break;
        case TimeframeOption.THIRTY_DAYS:
          value = breakpoints.sm ? (hasDatesAsRange ? 4 : 5) : 4;
          break;
        case TimeframeOption.THREE_MONTHS:
          value = 3;
          break;
        case TimeframeOption.SIX_MONTHS:
          value = breakpoints.sm ? (hasDatesAsRange ? 4 : 6) : 4;
          break;
        case TimeframeOption.LAST_YEAR:
          value = breakpoints.sm ? (hasDatesAsRange ? 3 : 5) : 4;
          break;
        default:
          value = 2;
      }
    }
    return value;
  }, [timeframe, breakpoints]);

  const getSmallestDiff = (start: number, end: number, current: number) => Math.min(Math.abs(start - current), Math.abs(end - current));

  const tickValues = (() => {
    if (hasDatesAsRange || (!breakpoints.md && timeframe == TimeframeOption.SIX_MONTHS)) {
      /**
       * This if statement will isolate the logic for graphs that use dates with ranges and
       * edge cases for six months timeframe. The reason for using the logic is because we have
       * too many labels for six months period that are overlapping on each other and we don't want
       * to change the behavior of date ranged graphs.
       */
      return createTimeTicks(startUnix, endUnix, bottomAxesTickNumber, values?.length, 'axis-with-day-month-year-short');
    }

    switch (timeframe) {
      case TimeframeOption.ALL:
        return createTimeTicksAllTimeFrame(startUnix, endUnix, bottomAxesTickNumber, breakpoints);
      case TimeframeOption.THREE_MONTHS:
      case TimeframeOption.SIX_MONTHS:
        return createTimeTicksMonthlyTimeFrame(startUnix, endUnix, bottomAxesTickNumber);
      case TimeframeOption.THIRTY_DAYS:
      case TimeframeOption.LAST_YEAR:
      default:
        return createTimeTicks(startUnix, endUnix, bottomAxesTickNumber, values?.length, 'axis-with-day-month-year-short');
    }
  })();

  const DateSpanTick = useCallback(
    (dateUnix: number, values: DateSpanValue[]) => {
      if (values.length === 0) {
        return '';
      }

      const tickValue = values.reduce((acc, value) => {
        const smallestDifferenceAcc = getSmallestDiff(acc.date_start_unix, acc.date_end_unix, dateUnix);
        const smallestDifferenceVal = getSmallestDiff(value.date_start_unix, value.date_end_unix, dateUnix);

        return (value.date_start_unix <= dateUnix && value.date_end_unix >= dateUnix) || smallestDifferenceVal < smallestDifferenceAcc ? value : acc;
      });

      // Convert timestamps to dates once
      const startDate = createDateFromUnixTimestamp(tickValue.date_start_unix);
      const endDate = createDateFromUnixTimestamp(tickValue.date_end_unix);

      // Get year and month values once
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      const startMonth = startDate.getMonth();
      const endMonth = endDate.getMonth();

      // Check the conditions and format the result accordingly
      if (startYear !== endYear) {
        return `${formatDateFromSeconds(tickValue.date_start_unix, 'axis-with-day-month-year-short')} - ${formatDateFromSeconds(
          tickValue.date_end_unix,
          'axis-with-day-month-year-short'
        )}`;
      } else if (startMonth !== endMonth) {
        return `${formatDateFromSeconds(tickValue.date_start_unix, 'axis')} - ${formatDateFromSeconds(tickValue.date_end_unix, 'axis-with-day-month-year-short')}`;
      } else {
        return `${formatDateFromSeconds(tickValue.date_start_unix, 'day-only')} - ${formatDateFromSeconds(tickValue.date_end_unix, 'axis-with-day-month-year-short')}`;
      }
    },
    [endUnix, endYear, formatDateFromSeconds, startUnix, startYear, tickValues]
  );

  const TimeStampTick = useCallback(
    (tickValue: TickInstance) => {
      return formatDateFromSeconds(tickValue.timestamp, tickValue.formatStyle);
    },
    [endUnix, endYear, formatDateFromSeconds, startUnix, startYear, tickValues]
  );

  const xTicks = useMemo(
    () => tickValues.map((tickValue) => (isDateSpanValues(values) ? DateSpanTick(tickValue.timestamp, values) : TimeStampTick(tickValue))),
    [values, DateSpanTick, TimeStampTick, isDateSpanValues, tickValues]
  );

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

  /**
   * Using anchor middle the line marker label will fall nicely on top
   * of the axis label. This will only happen for labels which are not the first or last label.
   */
  const getAnchor = (x: NumberValue) => {
    const isLongStartLabel = xTicks[0].length > 6;
    const isFirstTick = x === tickValues[0].timestamp;
    const isLastTick = x === tickValues[tickValues.length - 1].timestamp;

    if (isFirstTick && isLongStartLabel && tickValues.length !== 1) {
      return 'start';
    }

    if (isLastTick) {
      return 'end';
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
        stroke={colors.gray2}
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
        stroke={colors.gray3}
      />

      {showWeekNumbers && <WeekNumbers startUnix={startUnix} endUnix={endUnix} bounds={bounds} xScale={xScale} />}

      <AxisBottom
        scale={xScale}
        tickValues={tickValues.map(function (item) {
          return item.timestamp;
        })}
        tickFormat={(_x, i) => xTicks[i]}
        top={bounds.height}
        stroke={colors.gray3}
        rangePadding={xRangePadding}
        tickLabelProps={(x) => ({
          fill: colors.gray6,
          fontSize: fontSizes[0],
          /**
           * Applying a dx of -50%, when there's only a single tick value, prevents
           * the tick to go out of bounds and centers the tick value relative to the graph.
           */
          dx: tickValues.length === 1 ? '-50%' : undefined,
          dy: '-0.5px',
          textAnchor: getAnchor(x),
        })}
        tickStroke={colors.gray3}
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
              stroke={colors.gray3}
              tickFormat={formatYTickValue ? formatYTickValue : isPercentage ? formatYAxisPercentage : formatYAxis}
              tickLabelProps={() => ({
                fill: colors.gray6,
                fontSize: fontSizes[0],
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
            stroke={colors.gray3}
            tickFormat={formatYTickValue ? formatYTickValue : isPercentage ? formatYAxisPercentage : formatYAxis}
            tickLabelProps={() => ({
              fill: colors.gray6,
              fontSize: fontSizes[0],
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
