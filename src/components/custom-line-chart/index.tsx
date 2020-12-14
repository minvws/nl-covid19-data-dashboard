import { useCallback, useMemo, ReactNode } from 'react';
import { useTooltip } from '@visx/tooltip';
import { extent } from 'd3-array';
import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { Box } from '~/components-styled/base';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import Chart, { defaultMargin } from './chart';
import { trendTypes } from './chart/trends';
import { Tooltip } from './chart/tooltip';
import { calculateYMax, Value } from '../lineChart';
import { isDefined } from 'ts-is-present';

const valueToDate = (d: number) => new Date(d * 1000);
const dateToValue = (d: Date) => d.valueOf() / 1000;
const formatXAxis = (date: Date) =>
  formatDateFromSeconds(dateToValue(date), 'axis');

/**
 * @TODO In order to support rendering multiple trends we will have to make the
 * type of `Value` more flexible/generic, for example by allowing it to hold an
 * array of numbers instead of a single number.
 *
 * To do this (improve on the original chart interface) we'll first need to move
 * away from having this new line chart be a drop-in replacement for the old
 * one.
 */
export type CustomLineChartProps<T> = {
  values: T[];
  width: number;
  height?: number;
  timeframe?: TimeframeOption;
  signaalwaarde?: number;
  formatTooltip?: (value: T) => React.ReactNode;
  formatYAxis?: (y: number) => string;
  showFill?: boolean;
  valueAnnotation?: string;
};

export function CustomLineChart<T extends Value>({
  values,
  width = 500,
  height = 250,
  timeframe = '5weeks',
  signaalwaarde,
  formatTooltip,
  formatYAxis,
  showFill = true,
  valueAnnotation,
}: CustomLineChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip<T>();

  const benchmark = signaalwaarde
    ? { value: signaalwaarde, label: 'Signaalwaarde' }
    : undefined;

  const graphData = useMemo(() => {
    const filteredData = getFilteredValues(
      values,
      timeframe,
      (value) => value.date * 1000
    );
    return filteredData.map((point) => ({
      ...point,
      date: valueToDate(point.date),
    }));
  }, [values, timeframe]);

  const xDomain = useMemo(() => extent(graphData.map((d) => d.date)), [
    graphData,
  ]);
  const yDomain = useMemo(() => [0, calculateYMax(graphData, signaalwaarde)], [
    graphData,
    signaalwaarde,
  ]);

  const handleTooltip = useCallback(
    (
      event:
        | React.TouchEvent<SVGRectElement>
        | React.MouseEvent<SVGRectElement>,
      data,
      xPosition,
      yPosition
    ) => {
      if (event.type === 'mouseleave') {
        hideTooltip();
      } else {
        showTooltip({
          tooltipData: data,
          tooltipLeft: xPosition,
          tooltipTop: yPosition,
        });
      }
    },
    [showTooltip, hideTooltip]
  );

  return (
    <Box>
      {valueAnnotation && (
        <ValueAnnotation mb={2}>{valueAnnotation}</ValueAnnotation>
      )}

      <Box position="relative">
        <Chart
          trend={graphData}
          type={showFill ? trendTypes.area : trendTypes.line}
          height={height}
          width={width}
          xDomain={xDomain}
          yDomain={yDomain}
          formatYAxis={formatYAxis}
          formatXAxis={formatXAxis}
          handleHover={handleTooltip}
          isHovered={!!tooltipData}
          benchmark={benchmark}
        />

        {isDefined(tooltipData) && (
          <Tooltip
            bounds={{ right: width, left: 0, top: 0, bottom: height }}
            x={tooltipLeft + defaultMargin.left}
            y={tooltipTop + defaultMargin.top}
          >
            {formatTooltip
              ? formatTooltip(tooltipData)
              : `${formatDateFromSeconds(tooltipData.date)}: ${
                  tooltipData.value
                }`}
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
