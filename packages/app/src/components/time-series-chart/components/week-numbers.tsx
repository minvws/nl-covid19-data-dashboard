import css from '@styled-system/css';
import { AxisBottom, AxisTop } from '@visx/axis';
import { RectClipPath } from '@visx/clip-path';
import { GridColumns } from '@visx/grid';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { useCallback, useMemo } from 'react';
import { AnyTickFormatter } from '~/components/line-chart/components';
import { getWeekInfo } from '~/components/stacked-chart/logic';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useUniqueId } from '~/utils/use-unique-id';
import { Bounds } from '../logic';

/* Only show this amount of weeks */
const maximumWeekCount = 6;

const dayInSeconds = 24 * 60 * 60;
const weekInSeconds = 7 * dayInSeconds;

interface WeekNumberProps {
  startUnix: number;
  endUnix: number;
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
  bounds: Bounds;
  formatXAxis: (date_unix: number) => string;
}

export function WeekNumbers({
  startUnix,
  endUnix,
  xScale,
  bounds,
  formatXAxis,
}: WeekNumberProps) {
  /* Used for the clip path,
   which prevents grid lines and axis from bleeding out of the graph */
  const id = useUniqueId();
  const { siteText } = useIntl();

  const { weekGridLines, weekDateLabels, weekNumbersLabels } = useMemo(
    () => calculateWeekNumberAxis(startUnix, endUnix),
    [startUnix, endUnix]
  );
  const weekRenderWidth = getWeekRenderWidth(
    xScale(weekGridLines[2]),
    xScale(weekGridLines[1])
  );

  const formatWeekNumberAxis = useCallback(
    (dateUnix: number) => {
      const date = new Date(dateUnix * 1000);
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
          stroke={colors.lightGray}
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
            transform: `translate(${weekRenderWidth / 2} 0)`,
          })}
        />
      </g>
    </>
  );
}

function calculateWeekNumberAxis(startUnix: number, endUnix: number) {
  const weekCount = Math.floor((endUnix - startUnix) / weekInSeconds);
  const firstWeek = getWeekInfo(new Date(startUnix * 1000));
  const firstWeekUnix = firstWeek.weekStartDate.getTime() / 1000;

  /* Make sure to only show maximum `numberOfWeeks` */
  const alternateBy =
    weekCount > maximumWeekCount ? Math.ceil(weekCount / maximumWeekCount) : 1;

  /* Axis label visibility need some padding depending on the amount of weeks shown */
  const dayPadding = dayInSeconds * alternateBy;

  /* Generate all week lines, then filter axis labels that need to be shown */
  const weekGridLines = getWeekGridLines(firstWeekUnix, weekCount);
  const weekDateLabels = filterWeeks(
    weekGridLines,
    alternateBy,
    startUnix + 2 * dayPadding,
    endUnix - 2 * dayPadding
  );
  const weekNumbersLabels = filterWeeks(
    weekGridLines,
    alternateBy,
    startUnix - 1 * dayPadding,
    endUnix - 2 * dayPadding
  );

  return { weekGridLines, weekDateLabels, weekNumbersLabels };
}

function getWeekGridLines(firstWeekUnix: number, weekCount: number) {
  return [...new Array(weekCount)].map(
    (_, i) => firstWeekUnix + i * weekInSeconds
  );
}

function filterWeeks(
  weekGridLines: number[],
  alternateBy: number,
  startThresholdUnix: number,
  endThresholdUnix: number
) {
  return weekGridLines.filter((weekStartUnix, index) => {
    return (
      (index + 0) % alternateBy === 0 &&
      weekStartUnix >= startThresholdUnix &&
      weekStartUnix < endThresholdUnix
    );
  });
}

function getWeekRenderWidth(
  coordinateA: number | undefined,
  coordinateB: number | undefined
): number {
  if (coordinateA === undefined || coordinateB === undefined) {
    return 0;
  }
  return coordinateB - coordinateA;
}
