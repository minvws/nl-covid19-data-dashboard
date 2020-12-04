import { useCallback } from 'react';
import { Group } from '@visx/group';
// import { curveBasis } from '@visx/curve';
import { LinePath, Line, Bar } from '@visx/shape';
import { scaleUtc, scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { localPoint } from '@visx/event';
import { useTooltip, Tooltip, defaultStyles } from '@visx/tooltip';
import { bisect, extent } from 'd3-array';

// Colors
export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';

// Accessors
const getDate = (d: any) => new Date(d?.date * 1000);
const getValue = (d: any) => d.value;

const defaultMargin = { top: 40, right: 30, bottom: 30, left: 30 };

export type ThresholdProps = {
  values: any[];
  width: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

function CustomLineChart({
  values,
  width,
  height = 200,
  margin = defaultMargin,
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

  // Bounds
  const bounded = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  // Scales
  // TODO: replace with passed in scales
  const timeScale = scaleUtc<number>({
    domain: extent(values.map(getDate)),
    range: [0, bounded.width],
  });
  const valueScale = scaleLinear<number>({
    domain: extent(values.map(getValue)),
    range: [bounded.height, 0],
    nice: true,
  });

  // Tooltip
  const handleTooltip = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      const { x } = localPoint(event) || { x: 0 };

      const x0 = timeScale.invert(x);

      const index = bisect(values.map(getDate), x0);

      const d0 = values[index - 1];
      const d1 = values[index];
      const dataPoint =
        x0.valueOf() - getDate(d0).valueOf() >
        getDate(d1).valueOf() - x0.valueOf()
          ? d1
          : d0;

      showTooltip({
        tooltipData: dataPoint,
        tooltipLeft: x - margin.left,
        tooltipTop: valueScale(getValue(dataPoint)),
      });
    },
    [showTooltip, valueScale, timeScale, values, margin]
  );

  return (
    <>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <AxisBottom
            top={bounded.height}
            scale={timeScale}
            numTicks={width > 520 ? 10 : 5} // improve?
          />
          <AxisLeft scale={valueScale} />

          <LinePath
            data={values}
            x={(d) => timeScale(getDate(d))}
            y={(d) => valueScale(getValue(d))}
            stroke="black"
            strokeWidth={1.5}
          />
          <Bar
            x={0}
            y={0}
            width={bounded.width}
            height={bounded.height}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={hideTooltip}
          />

          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: 0 }}
                to={{ x: tooltipLeft, y: bounded.height }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </Group>
      </svg>
      {tooltipData && tooltipTop && tooltipLeft && (
        <Tooltip
          top={tooltipTop + margin.top}
          left={tooltipLeft + margin.left}
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
    </>
  );
}

export default CustomLineChart;
