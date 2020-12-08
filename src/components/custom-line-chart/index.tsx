import { useCallback, useMemo } from 'react';
import { useTooltip } from '@visx/tooltip';
import { extent } from 'd3-array';

import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';
// import { formatDateFromSeconds } from '~/utils/formatDate';
// import { formatNumber } from '~/utils/formatNumber';

import { Box } from '~/components-styled/base';
import Chart, { defaultMargin } from './chart';
import Tooltip from './chart/tooltip';
import { calculateYMax } from '~/components/lineChart';

const valueToDate = (d: number) => new Date(d * 1000);
// const dateToValue = (d: any) => d.valueOf() / 1000;

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
}: // formatTooltip,
//   formatYAxis,
//   valueAnnotation,
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

  // Tooltip
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
        trend={graphData} // TODO: update to accept series with array of configurable trends
        height={height}
        width={width}
        handleHover={handleTooltip}
        xDomain={xDomain}
        yDomain={yDomain}
        isHovered={!!tooltipData}
        benchmark={benchmark}
      />
      {tooltipData && (
        <Tooltip
          x={tooltipLeft + defaultMargin.left}
          y={tooltipTop + defaultMargin.top}
        >
          {tooltipData.date.toDateString()}
        </Tooltip>
      )}
    </Box>
  );
}
{
  /* <Tooltip
  top={tooltipTop + margin.top}
  left={tooltipLeft}
  offsetLeft={0}
  style={{
    ...defaultStyles,
    borderRadius: 0,
    minWidth: 72,
    textAlign: 'center',
    transform: 'translateX(-50%)',
  }}
>
  {formatTooltip
    ? formatTooltip(tooltipData.date)
    : `${formatDateFromSeconds(
        dateToValue(tooltipData.date)
      )}: ${formatNumber(tooltipData.value)}`}
  <Box
    bg="red"
    width="5px"
    height="5px"
    position="absolute"
    left="50%"
    transform="translateX(-50%)"
  />
</Tooltip> */
}

export default CustomLineChart;
