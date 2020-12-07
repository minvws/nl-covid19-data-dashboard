import { useCallback, useMemo } from 'react';
import { useTooltip, Tooltip, defaultStyles } from '@visx/tooltip';
import { extent } from 'd3-array';
import { Box } from '~/components-styled/base';
import Chart from './chart';

// Colors
export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';

// Accessors
const getValue = (d: any) => d.value;
const getDate = (d: any) => d.date;

export type ThresholdProps = {
  values: any[];
  width: number;
  height?: number;
};

function CustomLineChart({
  values,
  width,
  height = 200,
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

  const xDomain = useMemo(() => extent(values.map((d) => d.date)), [values]);
  const yDomain = useMemo(() => extent(values.map(getValue)), [values]);

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
        trend={values}
        getValue={getValue}
        height={height}
        width={width}
        handleHover={handleTooltip}
        xDomain={xDomain}
        yDomain={yDomain}
      />
      {tooltipData && (
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
      )}
    </Box>
  );
}

export default CustomLineChart;
