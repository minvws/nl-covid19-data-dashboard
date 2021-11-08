import {
  colors,
  DAY_IN_SECONDS,
  WEEK_IN_SECONDS,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { AxisTop } from '@visx/axis';
import { RectClipPath } from '@visx/clip-path';
import { GridColumns } from '@visx/grid';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { useCallback, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { useIntl } from '~/intl';
import { createDate } from '~/utils/create-date';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useUniqueId } from '~/utils/use-unique-id';
import { Bounds, getWeekInfo } from '../logic';
import { AnyTickFormatter } from './axes';

/**
 * Only show this amount of week numbers
 */
const MAXIMUM_WEEK_COUNT = 6;

/**
 * Space to render above and below the graph
 */
const DRAWING_BUFFER = 100;

interface WeekNumberProps {
  startUnix: number;
  endUnix: number;
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
  bounds: Bounds;
}

export function WeekNumbers({
  startUnix,
  endUnix,
  xScale,
  bounds,
}: WeekNumberProps) {
  /**
   * Used for the clip path,
   * which prevents grid lines and axis from bleeding out of the graph
   */
  const id = useUniqueId();
  const { siteText } = useIntl();

  const { weekGridLines, weekNumberLabels } = useMemo(
    () => calculateWeekNumberAxis(startUnix, endUnix),
    [startUnix, endUnix]
  );

  /**
   * Measure the width of a displayed week, used to offset the week number label.
   * Needs to be index 1 and 2 at least,
   * since between index 0 and 1 a partial week could occur.
   * The default offset is 0 in case there are no 3 data points.
   */
  const weekRenderWidth = getWeekRenderWidth(
    xScale(weekGridLines[2]),
    xScale(weekGridLines[1])
  );

  const formatWeekNumberAxis = useCallback(
    (dateUnix: number) => {
      const date = createDate(dateUnix);
      const weekInfo = getWeekInfo(date);
      return replaceVariablesInText(siteText.common.week_number_label, {
        weekNumber: weekInfo.weekNumber,
      });
    },
    [siteText.common]
  );

  return (
    <>
      <RectClipPath
        id={id}
        width={bounds.width}
        height={bounds.height + DRAWING_BUFFER * 2}
        x={0}
        y={-DRAWING_BUFFER}
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
          stroke={colors.lightGray}
          width={bounds.width}
          strokeDasharray="4 2"
        />

        <AxisTop
          scale={xScale}
          tickValues={weekNumberLabels}
          tickFormat={formatWeekNumberAxis as AnyTickFormatter}
          stroke={colors.silver}
          hideTicks
          tickLabelProps={() => ({
            fill: colors.data.axisLabels,
            fontSize: 12,
            textAnchor: 'middle',
            transform: `translate(${weekRenderWidth / 2} 0)`,
          })}
        />
      </g>
    </>
  );
}

function calculateWeekNumberAxis(startUnix: number, endUnix: number) {
  const weekCount = Math.floor((endUnix - startUnix) / WEEK_IN_SECONDS);
  const firstWeek = getWeekInfo(createDate(startUnix));
  const firstWeekUnix = firstWeek.weekStartDate.getTime() / 1000;

  /**
   * Make sure to only show maximum `numberOfWeeks`
   */
  const alternateBy =
    weekCount > MAXIMUM_WEEK_COUNT
      ? Math.ceil(weekCount / MAXIMUM_WEEK_COUNT)
      : 1;

  /**
   * Axis label visibility need some padding depending on the amount of weeks shown
   */
  const dayPadding = DAY_IN_SECONDS * alternateBy;

  /**
   * Generate all week lines, then filter axis labels that need to be shown.
   * Filtering is done to prevent cut off dates or week numbers at the start and end of the graph.
   */
  const weekGridLines = getWeekGridLines(firstWeekUnix, weekCount);
  const weekNumberLabels = filterWeeks(
    weekGridLines,
    alternateBy,
    startUnix + 3 * DAY_IN_SECONDS + dayPadding,
    endUnix + 5 * DAY_IN_SECONDS - 1.5 * dayPadding
  );

  return { weekGridLines, weekNumberLabels };
}

function getWeekGridLines(firstWeekUnix: number, weekCount: number) {
  return new Array(weekCount + 2)
    .fill(0)
    .map((_, i) => firstWeekUnix + i * WEEK_IN_SECONDS);
}

function filterWeeks(
  weekGridLines: number[],
  alternateBy: number,
  startThresholdUnix: number,
  endThresholdUnix: number
) {
  return weekGridLines.filter((weekStartUnix, index) => {
    return (
      index % alternateBy === 0 &&
      weekStartUnix >= startThresholdUnix &&
      weekStartUnix < endThresholdUnix
    );
  });
}

function getWeekRenderWidth(
  coordinateA?: number,
  coordinateB?: number
): number {
  if (isDefined(coordinateA) && isDefined(coordinateB)) {
    return coordinateB - coordinateA;
  }
  return 0;
}
