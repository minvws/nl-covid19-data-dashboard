/**
 * This chart is an adaptation from LineChart. It could already render multiple
 * lines, but the tooltip logic for vaccine support was different enough that I
 * wanted to implement this as a fork using the Visx tooltip. Namely because
 * here the tooltip needs to be rendered on one side of the marker (instead of
 * centered) and flip to the other side once bounds are reached. The LineChart
 * tooltip didn't have logic for this and Visx does this out of the box.
 *
 * I have also refactored the way data is passed to the tooltip renderer,
 * passing the original value + active key and lines configuration object to
 * render any type of layout, and without exposing internal __date and __value
 * properties.
 */
import { TickFormatter } from '@visx/axis';
import { localPoint } from '@visx/event';
import { Point } from '@visx/point';
import { scaleBand } from '@visx/scale';
import { bisectLeft, extent } from 'd3-array';
import { ScaleTime } from 'd3-scale';
import { useCallback, useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { Legenda, LegendItem, LegendShape } from '~/components-styled/legenda';
import {
  ChartPadding,
  ChartScales,
  ComponentCallbackFunction,
  defaultPadding,
} from '~/components-styled/line-chart/components';
import { ChartAxes } from './components/chart-axes';
import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import { Text } from '~/components-styled/typography';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import text from '~/locale/index';
import { colors } from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { TimeframeOption } from '~/utils/timeframe';

/**
 * Importing unchanged logic and components from line-chart since this is
 * considered a fork.
 */
import {
  HoverPoint,
  Marker,
  Trend,
} from '~/components-styled/line-chart/components';
import {
  calculateYMax,
  getTrendData,
  TrendValue,
} from '~/components-styled/line-chart/logic';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import styled from 'styled-components';
import css from '@styled-system/css';
import { useBreakpoints } from '~/utils/useBreakpoints';

const tooltipStyles = {
  ...defaultStyles,
  padding: 0,
  zIndex: 100,
};

type TooltipData<T extends TimestampedValue> = {
  value: T;
  key: keyof T;
  linesConfig: LineConfig<T>[];
};

const dateToValue = (d: Date) => d.valueOf() / 1000;
const formatXAxis = (date: Date) =>
  formatDateFromSeconds(dateToValue(date), 'axis');
const formatYAxisFn = (y: number) => formatNumber(y);
const formatYAxisPercentageFn = (y: number) => `${formatPercentage(y)}%`;

export type LineConfig<T extends TimestampedValue> = {
  /**
   * For consistency and transparency it is probably a good idea to enforce
   * property, label and color to be defined for all lines. Then this data can
   * be easily passed to the tooltip function. The fallback to
   * colors.data.primary can be made explicit at the consumer.
   *
   * Since the originally named "legendLabel" is likely to appear in both the
   * tooltip and the legenda, it is now named "label".
   */
  metricProperty: keyof T;
  label: string;
  color: string;
  style?: 'solid' | 'dashed';
  areaFillOpacity?: number;
  strokeWidth?: number;
  legendShape?: LegendShape;
};

export type MultiLineChartProps<T extends TimestampedValue> = {
  values: T[];
  linesConfig: LineConfig<T>[];
  width: number;
  height?: number;
  timeframe?: TimeframeOption;
  signaalwaarde?: number;
  formatTooltip?: (
    value: T,
    key: keyof T,
    linesConfig: LineConfig<T>[]
  ) => React.ReactNode;
  formatXAxis?: TickFormatter<Date>;
  formatYAxis?: TickFormatter<number>;
  hideFill?: boolean;
  valueAnnotation?: string;
  isPercentage?: boolean;
  showMarkerLine?: boolean;
  formatMarkerLabel?: (value: T) => string;
  padding?: Partial<ChartPadding>;
  showLegend?: boolean;
  legendItems?: LegendItem[];
  componentCallback?: ComponentCallbackFunction;
  ariaLabelledBy?: string;
  seriesMax?: number;
  yTickValues?: number[];
};

export function MultiLineChart<T extends TimestampedValue>({
  values,
  linesConfig,
  width,
  height = 250,
  timeframe = 'all',
  signaalwaarde,
  formatTooltip,
  formatYAxis,
  hideFill = false,
  valueAnnotation,
  isPercentage,
  showMarkerLine = false,
  formatMarkerLabel,
  padding: overridePadding,
  showLegend = false,
  legendItems = showLegend
    ? linesConfig.map((x) => ({
        color: x.color ?? colors.data.primary,
        label: x.label,
        shape: x.legendShape ?? 'line',
      }))
    : undefined,
  ariaLabelledBy,
  seriesMax: overrideSeriesMax,
  yTickValues,
}: MultiLineChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
    tooltipOpen,
  } = useTooltip<TooltipData<T>>();

  const breakpoints = useBreakpoints();
  const isTinyScreen = !breakpoints.xs;

  const metricProperties = useMemo(
    () => linesConfig.map((x) => x.metricProperty),
    [linesConfig]
  );

  const benchmark = useMemo(
    () =>
      signaalwaarde
        ? { value: signaalwaarde, label: text.common.barScale.signaalwaarde }
        : undefined,
    [signaalwaarde]
  );

  const trendsList = useMemo(
    () => getTrendData(values, metricProperties as string[], timeframe),
    [values, metricProperties, timeframe]
  );

  const calculatedSeriesMax = useMemo(
    () => calculateYMax(trendsList, signaalwaarde),
    [trendsList, signaalwaarde]
  );

  const seriesMax = isDefined(overrideSeriesMax)
    ? overrideSeriesMax
    : calculatedSeriesMax;

  const xDomain = useMemo(() => {
    const domain = extent(trendsList.flat().map(getDate));

    return isDefined(domain[0]) && isDefined(domain[1])
      ? (domain as [Date, Date])
      : undefined;
  }, [trendsList]);

  const yDomain = useMemo(() => [0, seriesMax], [seriesMax]);

  const padding: ChartPadding = useMemo(
    () => ({
      ...defaultPadding,
      // Increase space for larger numbers
      left: Math.max(seriesMax.toFixed(0).length * 10, defaultPadding.left),
      ...overridePadding,
    }),
    [overridePadding, seriesMax]
  );

  const timespanMarkerData = trendsList[0];

  const xMax = width - padding.left - padding.right;
  const yMax = height - padding.top - padding.bottom;

  const dateSpanScale = useMemo(
    () =>
      scaleBand<Date>({
        range: [0, xMax],
        domain: timespanMarkerData.map(getDate),
      }),
    [xMax, timespanMarkerData]
  );

  const [markerProps, setMarkerProps] = useState<{
    data: HoverPoint<T>[];
  }>();

  const bisect = useCallback(
    (
      trend: (TrendValue & TimestampedValue)[],
      xPosition: number,
      xScale: ScaleTime<number, number>
    ) => {
      if (!trend.length) return;
      if (trend.length === 1) return trend[0];

      const date = xScale.invert(xPosition - padding.left);

      const index = bisectLeft(
        trend.map((x) => x.__date),
        date,
        1
      );

      const d0 = trend[index - 1];
      const d1 = trend[index];

      if (!d1) return d0;

      return +date - +d0.__date > +d1.__date - +date ? d1 : d0;
    },
    [padding]
  );

  const distance = (point1: HoverPoint<TimestampedValue>, point2: Point) => {
    const x = point2.x - point1.x;
    const y = point2.y - point1.y;
    return Math.sqrt(x * x + y * y);
  };

  const toggleHoverElements = useCallback(
    (
      hide: boolean,
      hoverPoints?: HoverPoint<T>[],
      nearestPoint?: HoverPoint<T>
    ) => {
      if (hide) {
        hideTooltip();
        setMarkerProps(undefined);
      } else if (hoverPoints?.length && nearestPoint) {
        showTooltip({
          tooltipData: {
            /**
             * Ideally I think we would pass the original value + the key that
             * this hover point belongs to. Similar to how the stacked-chart
             * hover works. But in order to do so I think we need to use
             * different hover logic, and possibly use mouse callbacks on the
             * trends individually.
             */
            value: hoverPoints[0].data,
            key: '__todo_figure_out_what_key_this_point_belongs_to' as keyof T,
            /**
             * I'm passing the full config here because the tooltip needs colors
             * and labels. In the future this could be distilled maybe.
             */
            linesConfig: linesConfig,
          },
          tooltipLeft: nearestPoint.x,
          tooltipTop: nearestPoint.y,
        });
        setMarkerProps({
          data: hoverPoints,
        });
      }
    },
    [showTooltip, hideTooltip, linesConfig]
  );

  const handleHover = useCallback(
    (
      event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>,
      scales: ChartScales,
      __index: number
    ) => {
      if (!trendsList.length || event.type === 'mouseleave') {
        toggleHoverElements(true);
        return;
      }

      const { xScale, yScale } = scales;

      const point = localPoint(event);

      if (!point) {
        return;
      }

      const sortByNearest = (left: HoverPoint<T>, right: HoverPoint<T>) =>
        distance(left, point) - distance(right, point);

      const hoverPoints = trendsList
        .map((trends, index) => {
          const trendValue = bisect(trends, point.x, xScale);
          return trendValue
            ? {
                data: trendValue,
                color: linesConfig[index].color,
              }
            : undefined;
        })
        .filter(isDefined)
        .map<HoverPoint<T>>(
          ({ data, color }: { data: any; color?: string }) => {
            return {
              data,
              color,
              x: xScale(data.__date) ?? 0,
              y: yScale(data.__value) ?? 0,
            };
          }
        );
      const nearest = hoverPoints.slice().sort(sortByNearest);

      toggleHoverElements(false, hoverPoints, nearest[0]);
    },
    [bisect, trendsList, linesConfig, toggleHoverElements]
  );

  const renderTrendLines = useCallback(
    (x: ChartScales) => (
      <>
        {trendsList.map((trend, index) => (
          <Trend
            key={index}
            trend={trend}
            type={hideFill ? 'line' : 'area'}
            areaFillOpacity={linesConfig[index].areaFillOpacity}
            strokeWidth={linesConfig[index].strokeWidth}
            style={linesConfig[index].style}
            xScale={x.xScale}
            yScale={x.yScale}
            color={linesConfig[index].color}
            /**
             * Here we pass the index to handle hover. Not sure if that is
             * enough to avoid having to search for the point
             */
            onHover={(event, scales) => handleHover(event, scales, index)}
          />
        ))}
      </>
    ),
    [handleHover, linesConfig, hideFill, trendsList]
  );

  if (!xDomain) {
    return null;
  }

  return (
    <Box>
      {valueAnnotation && (
        <ValueAnnotation mb={2}>{valueAnnotation}</ValueAnnotation>
      )}

      <Box position="relative">
        <ChartAxes
          padding={padding}
          height={height}
          width={width}
          xDomain={xDomain}
          yDomain={yDomain}
          formatYAxis={
            formatYAxis
              ? formatYAxis
              : isPercentage
              ? formatYAxisPercentageFn
              : formatYAxisFn
          }
          formatXAxis={formatXAxis}
          onHover={(event, scales) => handleHover(event, scales, -1)}
          benchmark={benchmark}
          ariaLabelledBy={ariaLabelledBy}
          dateSpanWidth={dateSpanScale.bandwidth()}
          yTickValues={yTickValues}
        >
          {renderTrendLines}
        </ChartAxes>

        {tooltipOpen && tooltipData && (
          <TooltipWithBounds
            left={tooltipLeft}
            top={tooltipTop}
            style={tooltipStyles}
            offsetLeft={isTinyScreen ? 0 : 50}
          >
            <TooltipContainer>
              {typeof formatTooltip === 'function'
                ? formatTooltip(
                    tooltipData.value,
                    tooltipData.key,
                    tooltipData.linesConfig
                  )
                : formatDefaultTooltip(
                    tooltipData.value,
                    tooltipData.key,
                    tooltipData.linesConfig
                  )}
            </TooltipContainer>
          </TooltipWithBounds>
        )}

        <Box
          height={yMax}
          width={xMax}
          position="absolute"
          top={padding.top}
          left={padding.left}
          style={{
            pointerEvents: 'none',
          }}
        >
          {markerProps && (
            <Marker
              {...markerProps}
              showLine={showMarkerLine}
              formatLabel={formatMarkerLabel}
              dateSpanWidth={dateSpanScale.bandwidth()}
              height={height}
              padding={padding}
              primaryColor={`#5B5B5B`}
            />
          )}
        </Box>

        {showLegend && legendItems && (
          <Box pl={`${padding.left}px`}>
            <Legenda items={legendItems} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

function getDate(x: TrendValue) {
  return x.__date;
}

function formatDefaultTooltip<T extends TimestampedValue>(
  value: T,
  key: keyof T,
  _linesConfig: LineConfig<T>[],
  isPercentage?: boolean
) {
  // default tooltip assumes one line is rendered:

  const numberValue = (value[key] as unknown) as number;

  if (isDateValue(value)) {
    return (
      <>
        <Text as="span" fontWeight="bold">
          {`${formatDateFromSeconds(value.date_unix)}: `}
        </Text>
        {isPercentage
          ? `${formatPercentage(numberValue)}%`
          : formatNumber(numberValue)}
      </>
    );
  } else if (isDateSpanValue(value)) {
    const dateStartString = formatDateFromSeconds(
      value.date_start_unix,
      'day-month'
    );
    const dateEndString = formatDateFromSeconds(
      value.date_end_unix,
      'day-month'
    );

    return (
      <>
        <Text as="span" fontWeight="bold">
          {`${dateStartString} - ${dateEndString}: `}
        </Text>
        {isPercentage
          ? `${formatPercentage(numberValue)}%`
          : formatNumber(numberValue)}
      </>
    );
  }

  throw new Error(
    `Invalid value passed to format tooltip function: ${JSON.stringify(value)}`
  );
}

export const TooltipContainer = styled.div(
  css({
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    minWidth: 72,
    color: 'body',
    backgroundColor: 'white',
    lineHeight: 2,
    borderColor: 'border',
    borderWidth: '1px',
    borderStyle: 'solid',
    px: 2,
    py: 1,
    fontSize: 1,
  })
);
