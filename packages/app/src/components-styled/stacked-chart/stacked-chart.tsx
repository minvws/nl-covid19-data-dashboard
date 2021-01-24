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
import { isEmpty, set } from 'lodash';
import { MouseEvent, TouchEvent, useCallback, useMemo, useState } from 'react';
import { Box } from '~/components-styled/base';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { Legenda, LegendItem } from '../legenda';
import { TooltipContainer } from './components/tooltip';
import ResizeObserver from 'resize-observer-polyfill';

import {
  useTooltip,
  useTooltipInPortal,
  defaultStyles,
  Portal,
  Tooltip,
} from '@visx/tooltip';

const tooltipStyles = {
  ...defaultStyles,
  padding: 0,
  margin: 10,
  zIndex: 100,
};

import {
  calculateSeriesMaximum,
  getSeriesData,
  getValuesInTimeframe,
  SeriesValue,
  // useTooltip,
  Value,
} from './logic';

const NUM_TICKS = 3;
const NO_HOVER_INDEX = -1;

type AnyTickFormatter = (value: any) => string;
const tickFormatNumber: AnyTickFormatter = (v: number) => formatNumber(v);
const tickFormatPercentage: AnyTickFormatter = (v: number) =>
  `${formatPercentage(v)}%`;

/**
 * A timeout prevents the tooltip from closing directly when you move out of the
 * bar. This is needed because there is padding between the bars and the hover
 * state becomes very jittery without it.
 */
let tooltipTimeout: number;
let hoverTimeout: number;

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
  fadedColor: string;
  legendLabel: string;
};

export type StackedChartProps<T extends Value> = {
  values: T[];
  config: Config<T>[];
  valueAnnotation?: string;
  width?: number;
  height?: number;
  formatDate?: typeof defaultFormatDate;
  /**
   * @TODO type any
   */
  formatTooltip?: (data: any) => JSX.Element;
  isPercentage?: boolean;
};

export function StackedChart<T extends Value>({
  values,
  config,
  width = 500,
  height = 250,
  valueAnnotation,
  formatTooltip,
  formatDate,
  isPercentage,
}: StackedChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
    tooltipOpen,
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

  const [hoveredIndex, setHoveredIndex] = useState(NO_HOVER_INDEX);

  const colorScale = useMemo(() => {
    return scaleOrdinal<string, string>({
      domain: metricProperties as string[],
      range: config.map((x) => x.color),
    });
  }, [config, metricProperties]);

  /**
   * Create a color scale for each possible hover state of the elements. This
   * maps over config twice, because for every item/color a new scale is
   * generate which contains the full range of colors but with adjustments.
   */
  const hoverColorScales = useMemo(
    () =>
      config.map((_, targetIndex) => {
        const scaleColors = config.map((x, index) =>
          index === targetIndex ? x.color : x.fadedColor
        );

        return scaleOrdinal<string, string>({
          domain: metricProperties as string[],
          range: scaleColors,
        });
      }),
    [config, metricProperties]
  );

  const legendaItems = useMemo(
    () =>
      config.map(
        (x, index) =>
          ({
            color:
              hoveredIndex === NO_HOVER_INDEX
                ? x.color
                : hoveredIndex === index
                ? x.color
                : x.fadedColor,
            label: x.legendLabel,
            shape: 'square',
          } as LegendItem)
      ),
    [config, hoveredIndex]
  );

  const labelByKey = useMemo(
    () =>
      config.reduce(
        (acc, x) => set(acc, x.metricProperty, x.legendLabel),
        {} as Record<string, string>
      ),
    [config]
  );

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // TooltipInPortal is rendered in a separate child of <body /> and positioned
    // with page coordinates which should be updated on scroll. consider using
    // Tooltip or TooltipWithBounds if you don't need to render inside a Portal
    scroll: true,
    polyfill: ResizeObserver,
  });

  const defaultFormatTooltip = useCallback(
    (data: TooltipData) => {
      const seriesValue = data.bar.data;
      const dateString = defaultFormatDate(seriesValue);

      return (
        <div>
          <div>
            <strong>{labelByKey[data.key]}</strong>
            {`: ${data.bar.data[data.key]}`}
          </div>

          <div>
            <strong>{dateString}</strong>
            {/* @TODO move mln to lokalize */}
            {`: ${data.bar.data[data.key]} mln`}
          </div>
        </div>
      );
    },
    [labelByKey]
  );

  /**
   * ========== hooks end ==========
   */

  /**
   * The hover function gets passed the full bar data as tooltipData. It
   * contains the bar position properties as well as the original data used to
   * render that bar.
   */
  function handleHover(
    event: HoverEvent,
    tooltipData: TooltipData,
    hoverIndex: number
  ) {
    const isLeave = event.type === 'mouseleave';

    // console.log(tooltipData.index);

    if (isLeave) {
      tooltipTimeout = window.setTimeout(() => {
        hideTooltip();
      }, 300);

      hoverTimeout = window.setTimeout(() => {
        setHoveredIndex(NO_HOVER_INDEX);
      }, 300);
      return;
    }

    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    if (hoverTimeout) clearTimeout(hoverTimeout);

    setHoveredIndex(hoverIndex);

    /**
     * TooltipInPortal expects coordinates to be relative to containerRef
     * localPoint returns coordinates relative to the nearest SVG, which is what
     * containerRef is set to in this example.
     */

    /**
     * Every instantiated bar gets its own mouse handler, which is tied to the
     * bar variable via closure. Bar also contains a "bar" property that
     * contains the original ChartValue data, so the name is confusing.
     */
    const coords = localPoint(event);
    const left = tooltipData.x + tooltipData.width / 2;
    showTooltip({
      tooltipData: tooltipData,
      tooltipTop: coords?.y || 0,
      tooltipLeft: Math.max(coords?.x - 20 || 0, left),
    });
  }

  if (isEmpty(series)) {
    return null;
  }

  const padding = defaultPadding;

  if (width < 10) return null;
  // bounds
  const xMax = width - padding.left - padding.right;
  const yMax = height - padding.top - padding.bottom;

  const bounds = {
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };

  const xScale = scaleBand<string>({
    domain: series.map(formatDate || defaultFormatDate),
    padding: 0.2,
  }).rangeRound([0, xMax]);

  const yScale = scaleLinear<number>({
    domain: [0, seriesMax],
    nice: true,
  }).range([yMax, 0]);

  return (
    <Box>
      {valueAnnotation && (
        <ValueAnnotation mb={2}>{valueAnnotation}</ValueAnnotation>
      )}

      <Box position="relative">
        <Portal>
          <Tooltip style={tooltipStyles}>WUT</Tooltip>
        </Portal>
        <svg ref={containerRef} width={width} height={height} role="img">
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
              x={formatDate || defaultFormatDate}
              xScale={xScale}
              yScale={yScale}
              color={
                hoveredIndex == NO_HOVER_INDEX
                  ? colorScale
                  : hoverColorScales[hoveredIndex]
              }
            >
              {(barStacks) =>
                barStacks.map((barStack) =>
                  barStack.bars.map((bar) => {
                    /**
                     * Capture the bar data for the hover handler using a
                     * closure for each bar.
                     */
                    const handleHoverWithBar = (event: HoverEvent) =>
                      handleHover(event, bar, barStack.index);

                    return (
                      <rect
                        id={`bar-stack-${barStack.index}-${bar.index}`}
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

        {tooltipOpen && tooltipData && (
          <TooltipInPortal
            top={tooltipTop}
            left={tooltipLeft}
            style={tooltipStyles}
          >
            <TooltipContainer borderColor="#01689B">
              {formatTooltip
                ? formatTooltip(tooltipData)
                : defaultFormatTooltip(tooltipData)}
            </TooltipContainer>
          </TooltipInPortal>
        )}

        <Box pl={`${padding.left}px`}>
          <Legenda items={legendaItems} />
        </Box>
      </Box>
    </Box>
  );
}

function defaultFormatDate(x: SeriesValue) {
  const year = x.__date.getFullYear();
  const month = x.__date.getMonth();
  const quarter = Math.floor(month / 4) + 1;

  return `Q${quarter} ${year}`;
}
