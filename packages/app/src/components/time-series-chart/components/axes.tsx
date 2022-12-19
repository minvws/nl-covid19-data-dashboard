/**
 * This version of Axes is designed to be used in the root component
 * composition. Some charts might need very specific axes formatting and then we
 * can easily swap this out without having to make everything configurable via
 * props. It might be easier to just create 2 or 3 different types of axes
 * layouts by forking this component.
 */
import { colors, middleOfDayInSeconds, TimeframeOption, TimestampedValue, DateSpanValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import { NumberValue, ScaleBand, ScaleLinear } from 'd3-scale';
import { memo, Ref, useCallback, useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useIntl } from '~/intl';
import { fontSizes } from '~/style/theme';
import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { Bounds } from '../logic';
import { WeekNumbers } from './week-numbers';

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

function createTimeTicks(startTick: number, endTick: number, count: number, valuesCount: number | undefined) {
  const start = middleOfDayInSeconds(startTick);
  const end = middleOfDayInSeconds(endTick);

  if (count <= 2) {
    return [start, end];
  }

  const ticks: number[] = [];
  const stepCount = (valuesCount && valuesCount <= count ? valuesCount : count) - 1;
  const step = Math.floor((end - start) / stepCount);

  for (let i = 0; i < stepCount; i++) {
    const tick = start + i * step;
    ticks.push(middleOfDayInSeconds(tick));
  }
  ticks.push(end);

  return ticks;
}

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

  if (!isPresent(xTickNumber)) {
    const preferredDateTicks: number = breakpoints.sm ? (timeframe === 'all' ? (hasDatesAsRange ? 4 : 6) : hasDatesAsRange ? 3 : 5) : hasDatesAsRange ? 2 : 3;
    const fullDaysInDomain = Math.floor((endUnix - startUnix) / 86400);
    xTickNumber = Math.max(Math.min(fullDaysInDomain, preferredDateTicks), 2);
  }

  const getSmallestDiff = (start: number, end: number, current: number) => Math.min(Math.abs(start - current), Math.abs(end - current));

  const getXTickStyle = (isFirstOrLast: boolean, startYear: number, endYear: number, previousYear: number, currentYear: number) =>
    (isFirstOrLast && startYear !== endYear) || previousYear !== currentYear ? 'axis-with-year' : 'axis';

  const tickValues = createTimeTicks(startUnix, endUnix, xTickNumber, values?.length);

  const DateSpanTick = useCallback(
    (dateUnix: number, values: DateSpanValue[], index: number) => {
      if (values.length === 0) {
        return '';
      }

      const previousYear = createDateFromUnixTimestamp(tickValues[index - 1]).getFullYear();

      const currentYear = createDateFromUnixTimestamp(dateUnix).getFullYear();
      const tickValue = values.reduce((acc, value) => {
        const smallestDifferenceAcc = getSmallestDiff(acc.date_start_unix, acc.date_end_unix, dateUnix);
        const smallestDifferenceVal = getSmallestDiff(value.date_start_unix, value.date_end_unix, dateUnix);

        return (value.date_start_unix <= dateUnix && value.date_end_unix >= dateUnix) || smallestDifferenceVal < smallestDifferenceAcc ? value : acc;
      });

      const isFirstOrLast = startUnix === tickValue.date_start_unix || endUnix === tickValue.date_end_unix;
      const style = getXTickStyle(isFirstOrLast, startYear, endYear, previousYear, currentYear);

      return `${formatDateFromSeconds(tickValue.date_start_unix, 'axis')} - ${formatDateFromSeconds(tickValue.date_end_unix, style)}`;
    },
    [endUnix, endYear, formatDateFromSeconds, startUnix, startYear, tickValues]
  );

  const TimeStampTick = useCallback(
    (tickValue: number, index: number) => {
      const previousYear = createDateFromUnixTimestamp(tickValues[index - 1]).getFullYear();
      const currentYear = createDateFromUnixTimestamp(tickValue).getFullYear();

      const isFirstOrLast = [startUnix, endUnix].includes(tickValue);
      const style = getXTickStyle(isFirstOrLast, startYear, endYear, previousYear, currentYear);

      return formatDateFromSeconds(tickValue, style);
    },
    [endUnix, endYear, formatDateFromSeconds, startUnix, startYear, tickValues]
  );

  const xTicks = useMemo(
    () => tickValues.map((tickValue, index) => (isDateSpanValues(values) ? DateSpanTick(tickValue, values, index) : TimeStampTick(tickValue, index))),
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
    const isFirstTick = x === tickValues[0];
    const isLastTick = x === tickValues[tickValues.length - 1];

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
        tickValues={tickValues}
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
