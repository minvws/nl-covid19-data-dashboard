import { useCallback, useMemo, ReactNode } from 'react';
import { useTooltip } from '@visx/tooltip';
import { UseTooltipParams } from '@visx/tooltip/lib/hooks/useTooltip';
import { extent } from 'd3-array';
import { isDefined } from 'ts-is-present';

import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';

import { Box } from '~/components-styled/base';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { Chart, defaultMargin } from './chart';
import { Tooltip } from './chart/tooltip';

const valueToDate = (d: number) => new Date(d * 1000);
const dateToValue = (d: Date) => d.valueOf() / 1000;
const formatXAxis = (date: Date) =>
  formatDateFromSeconds(dateToValue(date), 'axis');
const formatYAxisFunc = (y: number) => y.toString();

export type Value = {
  date: any;
  value?: number;
};

export interface LineChartProps<T> {
  values: T[];
  width?: number;
  height?: number;
  timeframe?: TimeframeOption;
  signaalwaarde?: number;
  formatTooltip?: (data: T) => ReactNode;
  formatYAxis?: (y: number) => string;
  showFill?: boolean;
  valueAnnotation?: string;
}

export function LineChart<T extends Value>({
  values,
  width = 500,
  height = 250,
  timeframe = '5weeks',
  signaalwaarde,
  formatTooltip,
  formatYAxis = formatYAxisFunc,
  showFill = true,
  valueAnnotation,
}: LineChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  }: UseTooltipParams<T> = useTooltip();

  const benchmark = useMemo(() => {
    return signaalwaarde
      ? { value: signaalwaarde, label: 'Signaalwaarde' }
      : undefined;
  }, [signaalwaarde]);

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

  const handleHover = useCallback(
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
          type={showFill ? 'area' : 'line'}
          height={height}
          width={width}
          xDomain={xDomain}
          yDomain={yDomain}
          formatYAxis={formatYAxis}
          formatXAxis={formatXAxis}
          onHover={handleHover}
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
              ? formatTooltip({
                  ...tooltipData,
                  date: dateToValue(tooltipData.date),
                })
              : `${formatDateFromSeconds(
                  dateToValue(tooltipData.date)
                )}: ${formatNumber(tooltipData.value)}`}
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

/**
 * From all the defined values, extract the highest number so we know how to
 * scale the y-axis
 */
function calculateYMax(values: Value[], signaalwaarde = -Infinity) {
  const maxValue = values
    .map((x) => x.value)
    .filter(isDefined)
    .reduce((acc, value) => (value > acc ? value : acc), -Infinity);

  /**
   * Value cannot be 0, hence the 1
   * If the value is below signaalwaarde, make sure the signaalwaarde floats in the middle
   */
  return Math.max(maxValue, signaalwaarde * 2, 1);
}
