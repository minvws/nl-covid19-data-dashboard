import { useCallback, useMemo } from 'react';
import { useTooltip } from '@visx/tooltip';
import { extent } from 'd3-array';

import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';

import { Box } from '~/components-styled/base';
import Chart, { defaultMargin } from './chart';
import Tooltip from './chart/tooltip';
import { calculateYMax } from '~/components/lineChart';

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
};

function CustomLineChart({
  values,
  width,
  height,
  timeframe = '5weeks',
  signaalwaarde,
  formatTooltip,
  formatYAxis,
}: //   valueAnnotation,
//   showFill = true,
ThresholdProps) {
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
      <Chart
        trend={graphData}
        height={height}
        width={width}
        handleHover={handleTooltip}
        xDomain={xDomain}
        yDomain={yDomain}
        formatYAxis={formatYAxis}
        formatXAxis={formatXAxis}
        isHovered={!!tooltipData}
        benchmark={benchmark}
      />

      {tooltipData && (
        <Tooltip
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
