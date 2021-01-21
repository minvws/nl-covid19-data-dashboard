/**
 * Code loosely based on LineChart + inspired by
 * https://codesandbox.io/s/github/airbnb/visx/tree/master/packages/visx-demo/src/sandboxes/visx-barstack
 */
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { BarStack } from '@visx/shape';
import { isEmpty } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { colors } from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { Legenda } from '../legenda';
import {
  // Marker,
  Tooltip,
} from './components';
import {
  calculateYMaxStacked,
  DateSpanValue,
  DateValue,
  getTrendData,
  getValuesInTimeframe,
  isDateSpanValue,
  isDateValue,
  TrendValue,
  Value,
} from './logic';

const dateToValue = (d: Date) => d.valueOf() / 1000;
const formatXAxis = (date: Date) =>
  formatDateFromSeconds(dateToValue(date), 'axis');
const formatYAxisFn = (y: number) => formatNumber(y);
const formatYAxisPercentageFn = (y: number) => `${formatPercentage(y)}%`;

const NUM_TICKS = 3;

type AnyTickFormatter = (value: any) => string;

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
  // formatXAxis?: TickFormatter<Date>;
  // formatYAxis?: TickFormatter<number>;
  isPercentage?: boolean;
};

export function StackedChart<T extends Value>({
  values,
  config,
  width = 500,
  height = 250,
  valueAnnotation,
  formatTooltip,
  // formatYAxis,
  isPercentage,
}: StackedChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip<T & TrendValue>();

  const metricProperties = useMemo(() => config.map((x) => x.metricProperty), [
    config,
  ]);

  const timeframe = 'all';

  const valuesInTimeframe = useMemo(
    () => getValuesInTimeframe(values, timeframe),
    [values, timeframe]
  );

  const trendData = useMemo(
    () => getTrendData(valuesInTimeframe, metricProperties),
    [valuesInTimeframe, metricProperties]
  );

  console.log('trendData', trendData);

  const yMax = useMemo(() => calculateYMaxStacked(trendData), [trendData]);

  console.log('yMax', yMax);

  const keys = config.map((x) => x.legendLabel);
  const barColors = config.map((x) => x.color);

  /**
   * @TODO return date as Q1 Q2 etc
   */
  function getDate(x: DateValue | DateSpanValue) {
    return isDateValue(x)
      ? String(x.date_unix)
      : isDateSpanValue(x)
      ? String(x.date_start_unix)
      : '';
  }

  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: barColors,
  });

  const xScale = scaleBand<string>({
    domain: valuesInTimeframe.map(getDate),
    padding: 0.2,
  });

  const yScale = scaleLinear<number>({
    domain: [0, yMax],
    nice: true,
  });
  const padding = defaultPadding;

  const bounds = {
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };

  const formatYAxis = isPercentage ? formatYAxisPercentageFn : formatYAxisFn;

  // const bisect = useCallback(
  //   (
  //     trend: (TrendValue & Value)[],
  //     xPosition: number,
  //     xScale: ScaleTime<number, number>
  //   ) => {
  //     if (!trend.length) return;
  //     if (trend.length === 1) return trend[0];

  //     const date = xScale.invert(xPosition - padding.left);

  //     const index = bisectLeft(trend.map((x) => x.__date), date, 1
  //     );

  //     const d0 = trend[index - 1]; const d1 = trend[index];

  //     if (!d1) return d0;

  //     return +date - +d0.__date > +d1.__date - +date ? d1 : d0;
  //   },
  //   [padding]
  // );

  // const toggleHoverElements = useCallback(
  //   (
  //     hide: boolean,
  //     hoverPoints?: HoverPoint<T>[],
  //     nearestPoint?: HoverPoint<T>
  //   ) => {
  //     if (hide) {
  //       hideTooltip();
  //       // setMarkerProps(undefined);
  //     } else if (hoverPoints?.length && nearestPoint) {
  //       showTooltip({
  //         tooltipData: hoverPoints.map((x) => x.data),
  //         tooltipLeft: nearestPoint.x,
  //         tooltipTop: nearestPoint.y,
  //       });
  //       // setMarkerProps({
  //       //   data: hoverPoints,
  //       //   height,
  //       //   padding: padding,
  //       // });
  //     }
  //   },
  //   [showTooltip, hideTooltip /* height, padding */]
  // );

  // const handleHover = useCallback(
  //   (
  //     event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>,
  //     scales: ChartScales
  //   ) => {
  //     if (!trendsList.length || event.type === 'mouseleave') {
  //       toggleHoverElements(true);
  //       return;
  //     }

  //     const { xScale, yScale } = scales;

  //     const point = localPoint(event);

  //     if (!point) {return;
  //     }

  //     const sortByNearest = (left: HoverPoint<T>, right: HoverPoint<T>) =>
  //       distance(left, point) - distance(right, point);

  //     const hoverPoints = trendsList .map((trends, index) => {const
  //       trendValue = bisect(trends, point.x, xScale); return trendValue
  //           ? {
  //               data: trendValue,
  //               color: config[index].color,
  //             }
  //           : undefined;
  //       })
  //       .filter(isDefined) .map<HoverPoint<T>>(({ data, color }: { data: any;
  //       color?: string }) => {return {data, color, x: xScale(data.__date) ??
  //       0, y: yScale(data.__value) ?? 0,
  //           };
  //         }
  //       );
  //     const nearest = hoverPoints.slice().sort(sortByNearest);

  //     toggleHoverElements(false, hoverPoints, nearest[0]);
  //   },
  //   [bisect, trendsList, config, toggleHoverElements]
  // );

  if (isEmpty(valuesInTimeframe)) {
    return null;
  }

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
              tickFormat={formatXAxis as AnyTickFormatter}
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
              tickFormat={formatYAxis as AnyTickFormatter}
              tickLabelProps={() => ({
                fill: defaultColors.axisLabels,
                fontSize: 12,
                dx: 0,
                textAnchor: 'end',
                verticalAnchor: 'middle',
              })}
            />
            <BarStack<T, string>
              data={values}
              keys={keys}
              x={getDate}
              xScale={xScale}
              yScale={yScale}
              color={colorScale}
            >
              {(barStacks) =>
                barStacks.map((barStack) =>
                  barStack.bars.map((bar) => (
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
                      onMouseLeave={() => {
                        // tooltipTimeout = window.setTimeout(() => {
                        hideTooltip();
                        // }, 300);
                      }}
                      onMouseMove={(event) => {
                        // if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        // TooltipInPortal expects coordinates to be relative to
                        // containerRef localPoint returns coordinates relative
                        // to the nearest SVG, which is what containerRef is set
                        // to in this example.

                        console.log('bar', bar);
                        // const eventSvgCoords = localPoint(event);
                        // const left = bar.x + bar.width / 2;
                        // showTooltip({
                        //   tooltipData: bar,
                        //   tooltipTop: eventSvgCoords?.y,
                        //   tooltipLeft: left,
                        // });
                      }}
                    />
                  ))
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

type TooltipData<T> = {
  trendValue: TrendValue;
  dataValue: T;
  metricProperty: keyof T;
};

function useTooltip<T extends Value>() {
  const [tooltipData, setTooltipData] = useState<TooltipData<T>>();
  const [tooltipLeft, setTooltipLeft] = useState<number>();
  const [tooltipTop, setTooltipTop] = useState<number>();

  const showTooltip = useCallback(
    (x: {
      tooltipData: TooltipData<T>;
      tooltipLeft: number;
      tooltipTop: number;
    }) => {
      setTooltipData(x.tooltipData);
      setTooltipLeft(x.tooltipLeft);
      setTooltipTop(x.tooltipTop);
    },
    []
  );

  const hideTooltip = useCallback(() => {
    setTooltipData(undefined);
    setTooltipLeft(undefined);
    setTooltipTop(undefined);
  }, []);

  return {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    showTooltip,
    hideTooltip,
  };
}

// function distance(point1: HoverPoint<Value>, point2: Point) {const x =
//   point2.x - point1.x; const y = point2.y - point1.y; return Math.sqrt(x * x
//   + y * y);
//     }

/**
 * By passing in the original value plus the metric property that the tooltip is
 * showing for, we should have all data to render any type of tooltip.
 */
function formatDefaultTooltip<T extends Value>(
  context: TooltipData<T>,
  _isPercentage?: boolean
) {
  return <div> {context.trendValue.__value} </div>;
}
