/**
 * Code loosely based on
 * https://codesandbox.io/s/github/airbnb/visx/tree/master/packages/visx-demo/src/sandboxes/visx-barstack
 */
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { BarStack } from '@visx/shape';
import { SeriesPoint } from '@visx/shape/lib/types';
import { isEmpty } from 'lodash';
import { useMemo, useState, MouseEvent, TouchEvent } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { colors } from '~/style/theme';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { Legenda } from '../legenda';
import { Tooltip } from './components';
import {
  calculateSeriesMaximum,
  SeriesValue,
  getSeriesData,
  getValuesInTimeframe,
  Value,
  useTooltip,
} from './logic';
import { desaturate } from 'polished';

const NUM_TICKS = 3;
type AnyTickFormatter = (value: any) => string;
const tickFormatNumber: AnyTickFormatter = (v: number) => formatNumber(v);
const tickFormatPercentage: AnyTickFormatter = (v: number) =>
  `${formatPercentage(v)}%`;

type TooltipData = {
  bar: SeriesPoint<SeriesValue>;
  key: string;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

type HoverEvent = TouchEvent<SVGElement> | MouseEvent<SVGElement>;

/**
 * @TODO move to common chart config
 */
export const defaultPadding = {
  top: 10,
  right: 20,
  bottom: 30,
  left: 30,
} as const;

/**
 * @TODO move to theme
 */
const defaultColors = {
  axis: '#C4C4C4',
  axisLabels: '#666666',
  benchmark: '#4f5458',
} as const;

export type Config<T extends Value> = {
  metricProperty: keyof T;
  color: string;
  legendLabel: string;
};

export type StackedChartProps<T extends Value> = {
  values: T[];
  config: Config<T>[];
  valueAnnotation?: string;
  width?: number;
  height?: number;
  formatTooltip?: typeof formatDefaultTooltip;
  isPercentage?: boolean;
};

export function StackedChart<T extends Value>({
  values,
  config,
  width = 500,
  height = 250,
  valueAnnotation,
  formatTooltip,
  isPercentage,
}: StackedChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip<TooltipData>();

  const metricProperties = useMemo(() => config.map((x) => x.metricProperty), [
    config,
  ]);

  const timeframe = 'all';

  const valuesInTimeframe = useMemo(
    () => getValuesInTimeframe(values, timeframe),
    [values, timeframe]
  );

  const series = useMemo(
    () => getSeriesData(valuesInTimeframe, metricProperties),
    [valuesInTimeframe, metricProperties]
  );

  const seriesMax = useMemo(() => calculateSeriesMaximum(series), [series]);

  const [isHovered, setIsHovered] = useState(false);

  /**
   * ========== hooks end ==========
   */

  /**
   * The hover function gets passed the full bar data as tooltipData. It
   * contains the bar position properties as well as the original data used to
   * render that bar.
   */
  function handleHover(event: HoverEvent, tooltipData: TooltipData) {
    const isLeave = event.type === 'mouseleave';
    setIsHovered(!isLeave);

    if (isLeave) {
      hideTooltip();
      return;
    }

    /**
     * TooltipInPortal expects coordinates to be relative to containerRef
     * localPoint returns coordinates relative to the nearest SVG, which is what
     * containerRef is set to in this example.
     */

    /**
     * Every instantiated bar gets its own mouse handler, which is tied to the
     * bar variable via closure. Bar also contains a "bar" property that contains
     * the original ChartValue data, so the name is confusing.
     */
    const eventSvgCoords = localPoint(event);
    const left = tooltipData.x + tooltipData.width / 2;
    showTooltip({
      tooltipData: tooltipData,
      tooltipTop: eventSvgCoords?.y || 0,
      tooltipLeft: left,
    });
  }

  const barColors = config.map((x) => x.color);

  if (isEmpty(series)) {
    return null;
  }

  function getDateString(x: SeriesValue) {
    /**
     * @TODO return date as Q1 Q2 etc
     */
    return x.__date.toLocaleDateString();
  }

  const colorScale = scaleOrdinal<string, string>({
    domain: metricProperties as string[],
    range: barColors,
  });

  // const colorScaleReversed = scaleOrdinal<string, string>({
  //   domain: metricProperties as string[],
  //   range: [barColors.map(',
  // });

  const curriedDesaturate = desaturate(0.5);

  const hoverColorScales = barColors.map((_, targetIndex) => {
    const scaleColors = barColors.map((color, index) =>
      index === targetIndex ? color : curriedDesaturate(color)
    );

    return scaleOrdinal<string, string>({
      domain: metricProperties as string[],
      range: scaleColors,
    });
  });

  const padding = defaultPadding;

  const bounds = {
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };

  const xScale = scaleBand<string>({
    domain: series.map(getDateString),
    padding: 0.2,
  }).rangeRound([0, bounds.width]);

  const yScale = scaleLinear<number>({
    domain: [0, seriesMax],
    nice: true,
  }).range([bounds.height, 0]);

  return (
    <Box>
      {valueAnnotation && (
        <ValueAnnotation mb={2}>{valueAnnotation}</ValueAnnotation>
      )}

      <Box position="relative">
        <svg width={width} height={height} role="img">
          <Group left={padding.left} top={padding.top}>
            <GridRows
              scale={yScale}
              width={bounds.width}
              numTicks={NUM_TICKS}
              stroke={defaultColors.axis}
            />
            <AxisBottom
              scale={xScale}
              tickValues={xScale.domain()}
              // tickFormat={formatXAxis as AnyTickFormatter}
              top={bounds.height}
              stroke={defaultColors.axis}
              tickLabelProps={() => ({
                dx: -25,
                fill: defaultColors.axisLabels,
                fontSize: 12,
              })}
              hideTicks
            />
            <AxisLeft
              scale={yScale}
              numTicks={4}
              hideTicks
              hideAxisLine
              stroke={defaultColors.axis}
              tickFormat={
                isPercentage ? tickFormatPercentage : tickFormatNumber
              }
              tickLabelProps={() => ({
                fill: defaultColors.axisLabels,
                fontSize: 12,
                dx: 0,
                textAnchor: 'end',
                verticalAnchor: 'middle',
              })}
            />
            <BarStack<SeriesValue, string>
              data={series}
              keys={metricProperties as string[]}
              x={getDateString}
              xScale={xScale}
              yScale={yScale}
              color={isHovered ? hoverColorScales[0] : colorScale}
            >
              {(barStacks) =>
                barStacks.map((barStack) =>
                  barStack.bars.map((bar, index) => {
                    /**
                     * Capture the bar data for the hover
                     * handler using a closure for each bar.
                     */
                    const handleHoverWithBar = (event: HoverEvent) =>
                      handleHover(event, bar);

                    return (
                      <rect
                        key={`bar-stack-${barStack.index}-${bar.index}`}
                        x={bar.x}
                        y={bar.y}
                        height={bar.height}
                        width={bar.width}
                        fill={bar.color}
                        onClick={(event) => {
                          if (event) alert(`clicked: ${JSON.stringify(bar)}`);
                        }}
                        onMouseLeave={handleHoverWithBar}
                        onMouseMove={handleHoverWithBar}
                        onTouchStart={handleHoverWithBar}
                      />
                    );
                  })
                )
              }
            </BarStack>
          </Group>
        </svg>

        {isDefined(tooltipData) && (
          <Tooltip
            bounds={{ right: width, left: 0, top: 0, bottom: height }}
            x={tooltipLeft + padding.left}
            y={tooltipTop + padding.top}
          >
            {formatTooltip
              ? formatTooltip(tooltipData, isPercentage)
              : formatDefaultTooltip(tooltipData, isPercentage)}
          </Tooltip>
        )}

        <Box pl={`${padding.left}px`}>
          <Legenda
            items={config.map((x) => ({
              color: x.color ?? colors.data.primary,
              label: x.legendLabel ?? '',
              shape: 'line',
            }))}
          />
        </Box>
      </Box>
    </Box>
  );
}

function formatDefaultTooltip(data: TooltipData, _isPercentage?: boolean) {
  // console.log('tooltip data', data);

  return <div>{`${data.key}: ${data.bar.data[data.key]}`} </div>;
}
