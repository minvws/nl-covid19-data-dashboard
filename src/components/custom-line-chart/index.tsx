import { useCallback, useMemo } from 'react';
import { useTooltip } from '@visx/tooltip';
import { extent } from 'd3-array';

import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';

import { Box } from '~/components-styled/base';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { calculateYMax } from '~/components/lineChart';
import Chart, { defaultMargin } from './chart';
import { trendTypes } from './chart/trends';
import Tooltip from './chart/tooltip';

const valueToDate = (d: number) => new Date(d * 1000);
const dateToValue = (d: any) => d.valueOf() / 1000;
const formatXAxis = (date: any) =>
  formatDateFromSeconds(dateToValue(date), 'axis');

export type ThresholdProps = {
  values: any[];
  width: number;
  height?: number;
  timeframe?: TimeframeOption;
  signaalwaarde?: number;
  formatTooltip: any;
  formatYAxis: any;
  showFill: boolean;
  valueAnnotation?: string;
};

function CustomLineChart({
  values,
  width,
  height,
  timeframe = '5weeks',
  signaalwaarde,
  formatTooltip,
  formatYAxis,
  showFill = true,
  valueAnnotation,
}: ThresholdProps) {
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const benchmark = useMemo(() => {
    return signaalwaarde
      ? { value: signaalwaarde, label: 'Signaalwaarde' }
      : null;
  }, [signaalwaarde]);

  const graphData = useMemo(() => {
    const filteredData = getFilteredValues<T>(
      values,
      timeframe,
      (value: T) => value.date * 1000
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
    <Box position="relative">
      {valueAnnotation && (
        <ValueAnnotation mb={2}>{valueAnnotation}</ValueAnnotation>
      )}

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

      {tooltipData && (
        <Tooltip
          bounds={{ width, height }}
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
  );
}

export default CustomLineChart;
