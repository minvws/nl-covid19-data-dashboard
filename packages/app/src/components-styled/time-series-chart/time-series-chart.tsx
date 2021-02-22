/**
 * This chart is an adaptation from MultiLineChart. It attempts to create a
 * generic abstraction that can replace LineChart and MultiLineChart and
 * AreaChart.
 *
 * The main focus in this iteration is to try to keep things as simple as
 * possible.
 *
 * It assumes that all data for the chart (regardless of sources) is passed in a
 * single type on the values prop. Then the config prop will declare the type
 * and visual properties for each of the series.
 *
 * A lot of customization functions have been stripped from the component props
 * API to reduce complexity, because I think we should strive for consistency in
 * design first and use component composition where possible.
 *
 * For this reason the legend was also excluded from this implementation, in
 * order to see how convenient it is to have it as part of the ChartTile
 * composition like some other charts.
 */
import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { localPoint } from '@visx/event';
import { Point } from '@visx/point';
import { scaleBand, scaleLinear, scaleTime } from '@visx/scale';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { bisectLeft, extent } from 'd3-array';
import { ScaleTime } from 'd3-scale';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import {
  calculateYMax,
  /**
   * @TODO take this from stacked chart
   */
  getTrendData,
  TrendValue,
} from '~/components-styled/line-chart/logic';
import { Text } from '~/components-styled/typography';
// import text from '~/locale/index';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { TimeframeOption } from '~/utils/timeframe';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { ValueAnnotation } from '../value-annotation';
import {
  ChartAxes,
  ChartContainer,
  Markers,
  Trend,
  HoveredPoint,
} from './components';

export type ChartPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const defaultPadding: ChartPadding = {
  top: 10,
  right: 20,
  bottom: 30,
  left: 30,
};

const tooltipStyles = {
  ...defaultStyles,
  padding: 0,
  zIndex: 100,
};

type TooltipData<T extends TimestampedValue> = {
  value: T;
  key: keyof T;
  seriesConfig: SeriesConfig<T>[];
};

export type ChartBounds = { width: number; height: number };

export type SeriesConfig<T extends TimestampedValue> = {
  metricProperty: keyof T;
  label: string;
  color: string;
  style?: 'solid' | 'dashed';
  areaFillOpacity?: number;
  strokeWidth?: number;
};

export type TimeSeriesChartProps<T extends TimestampedValue> = {
  values: T[];
  seriesConfig: SeriesConfig<T>[];
  width: number;
  height?: number;
  timeframe?: TimeframeOption;
  signaalwaarde?: number;
  formatTooltip?: (
    value: T,
    key: keyof T,
    seriesConfig: SeriesConfig<T>[]
  ) => React.ReactNode;
  dataOptions?: {
    annotation?: string;
    maximumValue?: number;
    isPercentage?: boolean;
  };
  numTicks?: number;
  tickValues?: number[];
  showMarkerLine?: boolean;
  // only pad the left, because I think that's how it's used in practice
  paddingLeft?: number;
  ariaLabelledBy: string;
  valueAnnotation?: string;
};

export function TimeSeriesChart<T extends TimestampedValue>({
  values,
  seriesConfig,
  width,
  height = 250,
  timeframe = 'all',
  signaalwaarde,
  formatTooltip,
  dataOptions,
  numTicks = 3,
  tickValues,
  showMarkerLine,
  paddingLeft,
  ariaLabelledBy,
  valueAnnotation,
}: TimeSeriesChartProps<T>) {
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
    () => seriesConfig.map((x) => x.metricProperty),
    [seriesConfig]
  );

  // const benchmark = useMemo(
  //   () =>
  //     signaalwaarde
  //       ? { value: signaalwaarde, label: text.common.barScale.signaalwaarde }
  //       : undefined,
  //   [signaalwaarde]
  // );

  const trendsList = useMemo(
    () => getTrendData(values, metricProperties as string[], timeframe),
    [values, metricProperties, timeframe]
  );

  const calculatedSeriesMax = useMemo(
    () => calculateYMax(trendsList, signaalwaarde),
    [trendsList, signaalwaarde]
  );

  const forcedMaximumValue = dataOptions?.maximumValue;

  const seriesMax = isDefined(forcedMaximumValue)
    ? forcedMaximumValue
    : calculatedSeriesMax;

  const xDomain = useMemo(() => {
    const domain = extent(trendsList.flat().map(getDate));

    return isDefined(domain[0]) && isDefined(domain[1])
      ? (domain as [Date, Date])
      : undefined;
  }, [trendsList]);

  const yDomain = useMemo(() => [0, seriesMax], [seriesMax]);

  const padding = useMemo(
    () =>
      ({
        ...defaultPadding,
        left: paddingLeft || defaultPadding.left,
      } as ChartPadding),
    [paddingLeft]
  );

  const timespanMarkerData = trendsList[0];

  const bounds: ChartBounds = {
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };

  /**
   * @TODO move calculation of datespan to hook only, maybe only pass in original
   * data and not trend
   */
  const dateSpanScale = useMemo(
    () =>
      scaleBand<Date>({
        range: [0, bounds.width],
        domain: timespanMarkerData.map(getDate),
      }),
    [bounds.width, timespanMarkerData]
  );

  const markerPadding = dateSpanScale.bandwidth() / 2;

  const xScale = scaleTime({
    domain: xDomain,
    range: [markerPadding, bounds.width - markerPadding],
  });

  const yScale = scaleLinear({
    domain: yDomain,
    range: [bounds.height, 0],
    nice: tickValues?.length || numTicks,
  });

  const [hoveredPoints, setHoveredPoints] = useState<HoveredPoint[]>();

  const bisect = useCallback(
    function (
      trend: TrendValue[],
      xPosition: number,
      xScale: ScaleTime<number, number>
    ): [TrendValue, number] {
      if (trend.length === 1) return [trend[0], 0];

      /**
       * @TODO figure this out. If we can do it without padding, we can move
       * this outside the component
       */
      const date = xScale.invert(xPosition - padding.left);

      const index = bisectLeft(
        trend.map((x) => x.__date),
        date,
        1
      );

      const d0 = trend[index - 1];
      const d1 = trend[index];

      if (!d1) return [d0, 0];

      return [+date - +d0.__date > +d1.__date - +date ? d1 : d0, index];
    },
    [padding]
  );

  const distance = (hoveredPoint: HoveredPoint, localPoint: Point) => {
    /**
     * @TODO rewrite this to getX getY
     *
     * can use use vix standard function for distance?
     *
     * we probably only need to look at the Y component, because all trend
     * values come from the same sample, and that sample has been picked with
     * the bisect call.
     */
    const x = localPoint.x - hoveredPoint.x;
    const y = localPoint.y - hoveredPoint.y;
    return Math.sqrt(x * x + y * y);
  };

  const handleHover = useCallback(
    (event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>) => {
      if (event.type === 'mouseleave') {
        hideTooltip();
        setHoveredPoints(undefined);
      }

      const point = localPoint(event);

      if (!point) {
        return;
      }

      const hoveredPoints = trendsList.map((trend, index) => {
        /**
         * @TODO we only really need to do the bisect once on a single trend
         * because all trend values come from the same original value object
         */
        const [trendValue, trendValueIndex] = bisect(trend, point.x, xScale);

        return {
          trendValue,
          trendValueIndex,
          seriesConfigIndex: index,
          /**
           * @TODO I don't think we need to include color here. Can we derive
           * active hover point index maybe?
           */
          color: seriesConfig[index].color,
          x: xScale(trendValue.__date) ?? 0,
          y: yScale(trendValue.__value) ?? 0,
        } as HoveredPoint;
      });

      // console.log('hoveredPoints', hoveredPoints);

      setHoveredPoints(hoveredPoints);

      const sortedPoints = [...hoveredPoints].sort(
        (left, right) => distance(left, point) - distance(right, point)
      );

      const nearestPoint = sortedPoints[0];

      showTooltip({
        tooltipData: {
          /**
           * Ideally I think we would pass the original value + the key that
           * this hover point belongs to. Similar to how the stacked-chart
           * hover works. But in order to do so I think we need to use
           * different hover logic, and possibly use mouse callbacks on the
           * trends individually.
           */
          value: values[nearestPoint.trendValueIndex],
          /**
           * The key of "value" that we are nearest to. Some tooltips might
           * want to use this to highlight a series.
           */
          key: seriesConfig[nearestPoint.seriesConfigIndex].metricProperty,
          /**
           * I'm passing the full config here because the tooltip needs colors
           * and labels. In the future this could be distilled maybe.
           */
          seriesConfig: seriesConfig,
        },
        tooltipLeft: nearestPoint.x,
        tooltipTop: nearestPoint.y,
      });
    },
    [
      bisect,
      trendsList,
      seriesConfig,
      xScale,
      yScale,
      hideTooltip,
      showTooltip,
      values,
    ]
  );

  const renderSeries = useCallback(
    () =>
      trendsList.map((trend, index) => (
        <Trend
          key={index}
          trend={trend}
          type="line"
          areaFillOpacity={seriesConfig[index].areaFillOpacity}
          strokeWidth={seriesConfig[index].strokeWidth}
          style={seriesConfig[index].style}
          xScale={xScale}
          yScale={yScale}
          color={seriesConfig[index].color}
          /**
           * Here we pass the index to handle hover. Not sure if that is
           * enough to avoid having to search for the point
           */
          onHover={handleHover}
        />
      )),
    [handleHover, seriesConfig, trendsList, xScale, yScale]
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
        <ChartContainer
          width={width}
          height={height}
          onHover={handleHover}
          padding={padding}
          ariaLabelledBy={ariaLabelledBy}
        >
          <ChartAxes
            bounds={bounds}
            yTickValues={tickValues}
            xScale={xScale}
            yScale={yScale}
          />

          {renderSeries()}
        </ChartContainer>

        {tooltipOpen && tooltipData && (
          <TooltipWithBounds
            left={tooltipLeft}
            top={tooltipTop}
            style={tooltipStyles}
            offsetLeft={isTinyScreen ? 0 : 50}
          >
            {/**
             * @TODO move this to Tooltip component together with default
             * formatting function
             */}
            <TooltipContainer>
              {typeof formatTooltip === 'function'
                ? formatTooltip(
                    tooltipData.value,
                    tooltipData.key,
                    tooltipData.seriesConfig
                  )
                : formatDefaultTooltip(
                    tooltipData.value,
                    tooltipData.key,
                    tooltipData.seriesConfig
                  )}
            </TooltipContainer>
          </TooltipWithBounds>
        )}

        {/**
         * @TODO see if we can bundle this wrapper with the marker logic and do not pass height and padding separately to Marker, because we already know the marker height
         */}
        {hoveredPoints && (
          <Box
            height={bounds.height}
            width={bounds.width}
            position="absolute"
            top={padding.top}
            left={padding.left}
            style={{
              pointerEvents: 'none',
            }}
          >
            <Markers
              hoveredPoints={hoveredPoints}
              showLine={showMarkerLine}
              dateSpanWidth={dateSpanScale.bandwidth()}
              height={height}
              padding={padding}
              lineColor={`#5B5B5B`}
            />
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
  _seriesConfig: SeriesConfig<T>[],
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
