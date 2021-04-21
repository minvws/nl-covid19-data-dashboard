import { AxisBottom, AxisTop } from '@visx/axis';
import { GridColumns } from '@visx/grid';
import { RectClipPath } from '@visx/clip-path';
import { useUniqueId } from '~/utils/use-unique-id';
import { getWeekInfo } from '~/components/stacked-chart/logic';
import css from '@styled-system/css';
import { useCallback } from 'react';
import { colors } from '~/style/theme';
import { AnyTickFormatter } from '~/components/line-chart/components';

interface WeekNumberProps {
  startUnix: number;
  endUnix: number;
  xScale: any;
  bounds: any;
  formatXAxis: any;
}

export function WeekNumbers({
  startUnix,
  endUnix,
  xScale,
  bounds,
  formatXAxis,
}: WeekNumberProps) {
  /* Show maximum this amount of weeks */
  const numberOfWeeks = 6;

  const weekGridLines = [];
  const weekNumbersLabels = [];
  const weekDateLabels = [];

  let weekWidth = 0;

  const dayInSeconds = 24 * 60 * 60;
  const weekInSeconds = 7 * dayInSeconds;

  const weeks = Math.floor((endUnix - startUnix) / weekInSeconds);
  const firstMonday = getWeekInfo(new Date(startUnix * 1000));
  const firstMondayUnix = firstMonday.weekStartDate.getTime() / 1000;

  // Make sure to only show maximum `numberOfWeeks`
  const alternateBy =
    weeks > numberOfWeeks ? Math.ceil(weeks / numberOfWeeks) : 1;

  // Filter weeknumbers and and date labels to show or hide them
  const dateLabelPadding = 2 * alternateBy;
  const dateLabelPaddingStartUnix = startUnix + dateLabelPadding * dayInSeconds;
  const dateLabelPaddingEndUnix = endUnix - dateLabelPadding * dayInSeconds;

  const weekNumbersLabelPaddingStartUnix = startUnix - 3 * dayInSeconds;
  const weekNumbersLabelPaddingEndUnix =
    endUnix - (5 + alternateBy) * dayInSeconds;

  // Shift weeks to only show odd or even numbers
  const alternateWeekOffset =
    alternateBy % 2 === 0 && firstMonday.weekNumber % 2 === 1 ? 1 : 0;

  // Create 3 arrays: for week lines, week numbers, and week start dates
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

  const id = useUniqueId();

  weekWidth = xScale(weekGridLines[2]) - xScale(weekGridLines[1]);

  const formatWeekNumberAxis = useCallback((date_unix) => {
    const date = new Date(date_unix * 1000);
    const weekInfo = getWeekInfo(date);
    return `Week ${weekInfo.weekNumber}`;
  }, []);

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
  );
}
