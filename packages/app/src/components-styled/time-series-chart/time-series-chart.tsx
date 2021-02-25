import { TimestampedValue } from '@corona-dashboard/common';
import { scaleBand, scaleLinear, scaleTime } from '@visx/scale';
import { useTooltip } from '@visx/tooltip';
import { extent } from 'd3-array';
import { useCallback, useEffect, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { TimeframeOption } from '~/utils/timeframe';
import { ValueAnnotation } from '../value-annotation';
import {
  Axes,
  ChartContainer,
  DateSpanMarker,
  LineMarker,
  PointMarkers,
  Tooltip,
  TooltipData,
  TooltipFormatter,
  Trend,
  Overlay,
} from './components';
import {
  Bounds,
  calculateSeriesMaximum,
  getTrendData,
  Padding,
  SeriesConfig,
  TrendValue,
  useHoverState,
} from './logic';
export type { SeriesConfig } from './logic';

const defaultPadding: Padding = {
  top: 10,
  right: 20,
  bottom: 30,
  left: 30,
};

/**
 * This chart started as a fork from MultiLineChart. It attempts to create a
 * more generic abstraction that can replace LineChart, MultiLineChart,
 * (highcharts) AreaChart and later possibly something like the vaccine delivery
 * chart.
 *
 * The main focus in this iteration is to try to reduce complexity as much as
 * possible while rethinking the abstractions on which we build.
 *
 * It assumes that all data for the chart (regardless of multiple sources) is
 * passed in a single type on the values prop. If some trends do not overlap in
 * time, the remaining values should contain null for those properties.
 *
 * The series config defines the type and visual properties for each of the
 * trends, like color and line/range/area type.
 *
 * Some of the customization functions have been stripped from the component
 * public API to reduce complexity and in an attempt to enforce consistency in
 * design. For example:
 *
 * - You can only set padding-left instead of all paddings
 * - showLegend, legend items, shape and color are derived from seriesConfig definition.
 * - formatAxis type callbacks have been removed.
 *
 * Components and logic are split up onto smaller abstractions so they can be used more
 * easily in composition. For example the Marker component is now several
 * components rendered separately inside an Overlay container. We might not be
 * able to avoid creating multiple chart root components, but with smaller
 * abstractions we should be able to re-use most elements and logic.
 *
 * @TODO
 *
 * - Include background rectangle in API
 * - Move logic out of main component
 * - Add signaalwaarde/benchmark marker
 *
 * Other possibly interesting things to look at:
 *
 * - Perform bisect once, on values directly. Since all trends originate from
 *   the same value in the input values array, all bisect results always point
 *   to the same index, so we can do it just once.
 * - Avoid nearest point calculation when element calls onHover with index.
 *   Individual elements like trends have their own onHover handler and from
 *   that call we already know the nearest point belongs to that trend.
 * - Calculate nearest point directly from value properties. We don't really
 *   need to do a distance calculation if all points originate from to the same
 *   input value object. We only need to translate the mouse Y position to a
 *   value in the domain, and then we can look at the different value properties
 *   to see which one is closest.
 */
export type TimeSeriesChartProps<T extends TimestampedValue> = {
  values: T[];
  seriesConfig: SeriesConfig<T>[];
  width: number;
  height?: number;
  timeframe?: TimeframeOption;
  signaalwaarde?: number;
  formatTooltip?: TooltipFormatter<T>;
  dataOptions?: {
    annotation?: string;
    maximumValue?: number;
    isPercentage?: boolean;
  };
  numTicks?: number;
  tickValues?: number[];
  showMarkerLine?: boolean;
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
    () => getTrendData(values, metricProperties, timeframe),
    [values, metricProperties, timeframe]
  );

  const calculatedSeriesMax = useMemo(
    () => calculateSeriesMaximum(trendsList, signaalwaarde),
    [trendsList, signaalwaarde]
  );

  const forcedMaximumValue = dataOptions?.maximumValue;

  const seriesMax = isDefined(forcedMaximumValue)
    ? forcedMaximumValue
    : calculatedSeriesMax;

  const xDomain = useMemo(() => {
    const domain = extent(trendsList.flat().map((x) => x.__date_ms));

    return isDefined(domain[0]) && isDefined(domain[1])
      ? (domain as [number, number])
      : undefined;
  }, [trendsList]);

  const yDomain = useMemo(() => [0, seriesMax], [seriesMax]);

  const padding = useMemo(
    () =>
      ({
        ...defaultPadding,
        left: paddingLeft || defaultPadding.left,
      } as Padding),
    [paddingLeft]
  );

  const timespanMarkerData = trendsList[0];

  const bounds: Bounds = {
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };

  /**
   * @TODO move calculation of datespan to hook only, maybe only pass in
   * original data and not trend
   */
  const dateSpanScale = useMemo(
    () =>
      scaleBand<number>({
        range: [0, bounds.width],
        domain: timespanMarkerData.map((x) => x.__date_ms),
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

  const getX = useCallback((x: TrendValue) => xScale(x.__date_ms), [xScale]);

  const getY = useCallback((x: TrendValue) => yScale(x.__value), [yScale]);

  const [handleHover, hoverState] = useHoverState({
    values,
    paddingLeft: padding.left,
    getX,
    getY,
    seriesConfig,
    trendsList,
    xScale,
  });

  useEffect(() => {
    const nearestPoint = hoverState?.nearestPoint;

    if (nearestPoint) {
      showTooltip({
        tooltipData: {
          /**
           * Ideally I think we would pass the original value + the key that
           * this hover point belongs to. Similar to how the stacked-chart hover
           * works. But in order to do so I think we need to use different hover
           * logic, and possibly use mouse callbacks on the trends individually.
           */
          value: values[nearestPoint.valuesIndex],
          /**
           * The key of "value" that we are nearest to. Some tooltips might want
           * to use this to highlight a series.
           */
          valueKey: seriesConfig[nearestPoint.seriesConfigIndex].metricProperty,
          /**
           * I'm passing the full config here because the tooltip needs colors
           * and labels. In the future this could be distilled maybe.
           */
          seriesConfig: seriesConfig,
          seriesConfigIndex: nearestPoint.seriesConfigIndex,
        },
        tooltipLeft: nearestPoint.x,
        tooltipTop: nearestPoint.y,
      });
    } else {
      hideTooltip();
    }
  }, [hoverState, seriesConfig, values, hideTooltip, showTooltip]);

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
          getX={getX}
          getY={getY}
          yScale={yScale}
          color={seriesConfig[index].color}
          /**
           * Here we pass the trend index to handle hover. Then we can bypass
           * the "nearest point" calculation, because we already know what
           * property this event belongs to.
           */
          onHover={(evt) => handleHover(evt, index)}
        />
      )),
    [handleHover, seriesConfig, trendsList, yScale, getX, getY]
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
          <Axes
            bounds={bounds}
            yTickValues={tickValues}
            xScale={xScale}
            yScale={yScale}
            isPercentage={dataOptions?.isPercentage}
          />

          {renderSeries()}
        </ChartContainer>

        <Tooltip
          data={tooltipData}
          left={tooltipLeft}
          top={tooltipTop}
          isOpen={tooltipOpen}
          formatTooltip={formatTooltip}
        />

        {hoverState && (
          <Overlay bounds={bounds} padding={padding}>
            <DateSpanMarker
              width={dateSpanScale.bandwidth()}
              point={hoverState.nearestPoint}
            />
            {showMarkerLine && (
              <LineMarker
                point={hoverState.nearestPoint}
                lineColor={`#5B5B5B`}
              />
            )}
            <PointMarkers points={hoverState.points} />
          </Overlay>
        )}
      </Box>
    </Box>
  );
}
