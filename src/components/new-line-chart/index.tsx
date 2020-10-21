import { useCallback } from 'react';
import { Group } from '@visx/group';
import { curveBasis } from '@visx/curve';
import { LinePath, Line, Bar } from '@visx/shape';
import { scaleUtc, scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { localPoint } from '@visx/event';
import { withTooltip, Tooltip, defaultStyles } from '@visx/tooltip';
import { max, extent, bisector } from 'd3-array';

// accessors
const getDate = (d) => new Date(d.date * 1000);
const getValue = (d) => new Date(d.value);

// scales

const defaultMargin = { top: 40, right: 30, bottom: 30, left: 30 };

export type ThresholdProps = {
  parentWidth: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';

const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

const bisectDate = bisector((d) => {
  return new Date(d.date);
}).left;

const getStockValue = (d) => d.close;

function NewLineChart({
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipTop = 0,
  tooltipLeft = 0,
  parentWidth,
  values,
  height = 200,
  margin = defaultMargin,
}: ThresholdProps) {
  // bounds
  const xMax = parentWidth - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const timeScale = scaleUtc<number>({
    domain: [
      Math.min(...values.map(getDate)),
      Math.max(...values.map(getDate)),
    ],
  });
  const temperatureScale = scaleLinear<number>({
    domain: [
      Math.min(...values.map((d) => Math.min(getValue(d)))),
      Math.max(...values.map((d) => Math.max(getValue(d)))),
    ],
    nice: true,
  });

  timeScale.range([0, xMax]);
  temperatureScale.range([yMax, 0]);

  // tooltip handler
  const handleTooltip = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = timeScale.invert(x);
      const index = bisectDate(values, x0, 1);
      const d0 = values[index - 1];
      const d1 = values[index];

      console.log({ x, x0, index, d0, d1 });

      let d = d0;
      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() >
          getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }
      ``;
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: temperatureScale(getStockValue(d)),
      });
    },
    [showTooltip, temperatureScale, timeScale, values]
  );
  if (parentWidth < 10) return null;

  return (
    <>
      <svg width={parentWidth} height={height}>
        <rect x={0} y={0} width={parentWidth} height={height} fill={'#eee'} />
        <Group left={margin.left} top={margin.top}>
          <AxisBottom
            top={yMax}
            scale={timeScale}
            numTicks={parentWidth > 520 ? 10 : 5}
          />
          <AxisLeft scale={temperatureScale} />

          <LinePath
            data={values}
            curve={curveBasis}
            x={(d) => timeScale(getDate(d))}
            y={(d) => temperatureScale(getValue(d))}
            stroke="#222"
            strokeWidth={1.5}
          />
          <Bar
            x={0}
            y={0}
            width={parentWidth}
            height={height}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />

          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: 0 }}
                to={{ x: tooltipLeft, y: yMax }}
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
      {tooltipData && (
        <div>
          <Tooltip
            top={tooltipTop - 12}
            left={tooltipLeft + 12}
            style={tooltipStyles}
          >
            {`$${getDate(tooltipData)}`}
          </Tooltip>
          <Tooltip
            top={yMax - 14}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              minWidth: 72,
              textAlign: 'center',
              transform: 'translateX(-50%)',
            }}
          >
            {/* {getDate(tooltipData)} */}
          </Tooltip>
        </div>
      )}
    </>
  );
}

export default withTooltip(NewLineChart);
