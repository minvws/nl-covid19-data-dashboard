/**
 * This version of Axes is designed to be used in the root component
 * composition. Some charts might need very specific axes formatting and then we
 * can easily swap this out without having to make everything configurable via
 * props. It might be easier to just create 2 or 3 different types of axes
 * layouts by forking this component.
 */
import css from '@styled-system/css';
import { AxisBottom, AxisLeft, AxisTop } from '@visx/axis';
import { GridColumns, GridRows } from '@visx/grid';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { differenceInDays } from 'date-fns';
import { memo, Ref, useCallback, useMemo } from 'react';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { createDate } from '~/utils/create-date';
import { useIsMounted } from '~/utils/use-is-mounted';
import { Bounds } from '../logic';
import { getWeekInfo } from '~/components/stacked-chart/logic';
import { RectClipPath } from '@visx/clip-path';
import { useUniqueId } from '~/utils/use-unique-id';

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
  showWeekGridLines?: boolean;
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
};

type AnyTickFormatter = (value: any) => string;

export const Axes = memo(function Axes({
  numGridLines,
  showWeekGridLines,
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

  const formatWeekNumberAxis = useCallback((date_unix) => {
    const date = new Date(date_unix * 1000);
    const weekInfo = getWeekInfo(date);
    return `Week ${weekInfo.weekNumber}`;
  }, []);

  const {
    weekGridLines,
    weekWidth,
    weekNumbersLabels,
    weekDateLabels,
  } = useMemo(() => {
    /* Config */
    const numberOfWeeks = 6;
    const weekNumbersLabelPadding = 3; // show week numbers when they are at least X days inside startUnix/endUnix
    const dateLabelPadding = 6; // show dates when they are at least X days inside startUnix/endUnix

    const weekGridLines = [];
    const weekNumbersLabels = [];
    const weekDateLabels = [];

    let weekWidth = 0;

    if (showWeekGridLines) {
      const dayInSeconds = 24 * 60 * 60;
      const weekInSeconds = 7 * dayInSeconds;

      const dateLabelPaddingStartUnix =
        startUnix + dateLabelPadding * dayInSeconds;
      const dateLabelPaddingEndUnix = endUnix - dateLabelPadding * dayInSeconds;

      const weekNumbersLabelPaddingStartUnix =
        startUnix - weekNumbersLabelPadding * dayInSeconds;
      const weekNumbersLabelPaddingEndUnix = endUnix + 0 * dayInSeconds;

      const weeks = Math.floor((endUnix - startUnix) / weekInSeconds);
      const firstMonday = getWeekInfo(new Date(startUnix * 1000));
      const firstMondayUnix = firstMonday.weekStartDate.getTime() / 1000;
      const alternateBy =
        weeks > numberOfWeeks ? Math.ceil(weeks / numberOfWeeks) : 1;

      const alternateWeekOffset =
        alternateBy % 2 === 0 && firstMonday.weekNumber % 2 === 1 ? 1 : 0;

      for (let i = 0; i <= weeks + 1; ++i) {
        const weekStartUnix = firstMondayUnix + i * weekInSeconds;

        weekGridLines.push(weekStartUnix);

        if ((i + alternateWeekOffset) % alternateBy === 0) {
          if (
            weekStartUnix >= dateLabelPaddingStartUnix &&
            weekStartUnix < dateLabelPaddingEndUnix
          ) {
            weekDateLabels.push(weekStartUnix);
          }

          if (
            weekStartUnix >= weekNumbersLabelPaddingStartUnix &&
            weekStartUnix < weekNumbersLabelPaddingEndUnix
          ) {
            weekNumbersLabels.push(weekStartUnix);
          }
        }
      }

      weekWidth = xScale(weekGridLines[2]) - xScale(weekGridLines[1]);
    }

    return { weekGridLines, weekWidth, weekNumbersLabels, weekDateLabels };
  }, [startUnix, endUnix, xScale, showWeekGridLines]);

  /**
   * Long labels (like the ones including a year, are too long to be positioned
   * centered on the x-axis tick. Usually a short date has a 2 digit number plus
   * a space plus a three character month, which makes 6.
   */
  const isLongStartLabel = formatXAxis(startUnix).length > 6;
  const isLongEndLabel = formatXAxis(endUnix).length > 6;

  const id = useUniqueId();

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

      {showWeekGridLines && (
        <>
          <RectClipPath
            id={id}
            width={bounds.width}
            height={bounds.height + 200}
            x={0}
            y={-100}
          />
          <g
            css={css({
              clipPath: `url(#${id})`,
            })}
          >
            <GridColumns
              height={bounds.height}
              scale={xScale}
              numTicks={weekGridLines.length}
              tickValues={weekGridLines}
              stroke={'#DDD'}
              width={bounds.width}
              strokeDasharray="4 2"
            />

            <AxisBottom
              scale={xScale}
              tickValues={weekDateLabels}
              tickFormat={formatXAxis as AnyTickFormatter}
              top={bounds.height}
              stroke={colors.silver}
              tickLabelProps={() => ({
                fill: colors.data.axisLabels,
                fontSize: 12,
                textAnchor: 'middle',
              })}
              hideTicks
            />

            <AxisTop
              scale={xScale}
              tickValues={weekNumbersLabels}
              tickFormat={formatWeekNumberAxis as AnyTickFormatter}
              stroke={colors.silver}
              hideTicks
              tickLabelProps={() => ({
                fill: colors.data.axisLabels,
                fontSize: 12,
                textAnchor: 'middle',
                transform: `translate(${weekWidth / 2} 0)`,
              })}
            />
          </g>
        </>
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
            tickValues={[yScale.domain()[1]]}
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
