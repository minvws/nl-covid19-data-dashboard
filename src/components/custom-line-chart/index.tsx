import { useCallback, useMemo } from 'react';
import { useTooltip, Tooltip, defaultStyles } from '@visx/tooltip';
import { extent } from 'd3-array';
import { Box } from '~/components-styled/base';
import Chart from './chart';
import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';

// Accessors
const getValue = (d: any) => d.value; // NOTE: should be part of series data
const getDate = (d: any) => d.date;

export type ThresholdProps = {
  values: any[];
  width: number;
  height?: number;
  timeframe?: TimeframeOption;
};

function CustomLineChart({
  values,
  width,
  height,
  timeframe,
}: //   signaalwaarde,
//   timeframe = '5weeks',
//   formatTooltip,
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

  const graphData = useMemo(() => {
    const filteredData = getFilteredValues<T>(
      values,
      timeframe,
      (value: T) => value.date * 1000
    );
    return filteredData.map((point) => ({
      ...point,
      date: new Date(point.date * 1000),
    }));
  }, [values, timeframe]);

  const xDomain = useMemo(() => extent(graphData.map((d) => d.date)), [
    graphData,
  ]);
  const yDomain = useMemo(() => extent(graphData.map(getValue)), [graphData]);

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
        getValue={getValue} // NOTE: should be part of series data
        height={height}
        width={width}
        handleHover={handleTooltip}
        xDomain={xDomain}
        yDomain={yDomain}
        isHovered={!!tooltipData}
      />
      {tooltipData && (
        <>
          <Tooltip
            top={tooltipTop}
            left={tooltipLeft}
            offsetLeft={0}
            style={{
              ...defaultStyles,
              minWidth: 72,
              textAlign: 'center',
              transform: 'translateX(-50%)',
            }}
          >
            {getDate(tooltipData).toDateString()}
          </Tooltip>
        </>
      )}
    </Box>
  );
}

export default CustomLineChart;
