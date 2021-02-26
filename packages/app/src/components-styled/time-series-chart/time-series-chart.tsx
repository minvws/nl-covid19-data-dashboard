import { TimestampedValue } from '@corona-dashboard/common';
import { scaleBand, scaleLinear } from '@visx/scale';
import { useTooltip } from '@visx/tooltip';
import { extent } from 'd3-array';
import { useCallback, useEffect, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { TimeframeOption } from '~/utils/timeframe';
import { Legend } from '../legend';
import { ValueAnnotation } from '../value-annotation';
import {
  Axes,
  ChartContainer,
  DateLineMarker,
  DateSpanMarker,
  LineTrend,
  Overlay,
  PointMarkers,
  Tooltip,
  TooltipData,
  TooltipFormatter,
} from './components';
import { AreaTrend } from './components/area-trend';
import { RangeTrend } from './components/range-trend';
import {
  Bounds,
  calculateSeriesMaximum,
  getSeriesList,
  Padding,
  RangeSeriesValue,
  SeriesConfig,
  SeriesValue,
  useHoverState,
  useLegendItems,
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
 * - You can only set padding-left instead of all paddings, because only the
 *   left had a practical function (make space for larger numbers on the
 *   x-axis).
 * - The legend show/hide, items, shape and color are derived from seriesConfig
 *   definition and possibly other props that set things like date span
 *   annotations. We should be able to standardize this for all charts.
 * - formatAxis type callbacks have been removed as we should be able to
 *   standardize (a few flavors of) axis rendering.
 *
 * Components and logic are split up onto smaller abstractions so they can be
 * used more easily in composition. For example the Marker component is now
 * several components rendered separately inside an Overlay container. We might
 * not be able to avoid creating multiple chart root components, but with
 * smaller abstractions we should be able to re-use most elements and logic.
 *
 * The scales for x and y are using the same type (LinearScale). This was done
 * to see if we can use the date_unix timestamps from the data directly
 * everywhere without unnecessary conversion to and from Date objects.
 *
 * @TODO
 *
 * - Generate legend contents
 * - Include background rectangle in API
 * - Move more logic out of main component
 * - Add signaalwaarde/benchmark marker
 * - Implement RangeTrend component
 *
 * Known Issues:
 * - Bisect and nearest point calculations have a rounding / offset bug.
 */
export type TimeSeriesChartProps<T extends TimestampedValue> = {
  title: string; // Used for default tooltip formatting
  values: T[];
  seriesConfig: SeriesConfig<T>;
  width: number;
  height?: number;
  timeframe?: TimeframeOption;
  formatTooltip?: TooltipFormatter<T>;
  dataOptions?: {
    annotation?: string;
    benchmarkValue?: number;
    forcedMaximumValue?: number;
    isPercentage?: boolean;
  };
  numTicks?: number;
  tickValues?: number[];
  showDateMarker?: boolean;
  paddingLeft?: number;
  ariaLabelledBy: string;
};

export function TimeSeriesChart<T extends TimestampedValue>({
  values,
  seriesConfig,
  width,
  height = 250,
  timeframe = 'all',
  formatTooltip,
  dataOptions = {},
  numTicks = 3,
  tickValues,
  showDateMarker,
  paddingLeft,
  ariaLabelledBy,
  title,
}: TimeSeriesChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
    tooltipOpen,
  } = useTooltip<TooltipData<T>>();

  const {
    benchmarkValue,
    annotation,
    isPercentage,
    forcedMaximumValue,
  } = dataOptions;

  const legendItems = useLegendItems(seriesConfig);

  // const benchmark = useMemo(
  //   () =>
  //     benchmarkValue
  //       ? { value: signaalwaarde, label: text.common.barScale.signaalwaarde }
  //       : undefined,
  //   [signaalwaarde]
  // );

  const seriesList = useMemo(
    () => getSeriesList(values, seriesConfig, timeframe),
    [values, seriesConfig, timeframe]
  );

  const calculatedSeriesMax = useMemo(
    () => calculateSeriesMaximum(values, seriesConfig, benchmarkValue),
    [values, seriesConfig, benchmarkValue]
  );

  const seriesMax = isDefined(forcedMaximumValue)
    ? forcedMaximumValue
    : calculatedSeriesMax;

  const xDomain = useMemo(() => {
    const domain = extent(seriesList.flat().map((x) => x.__date_unix));

    return isDefined(domain[0]) && isDefined(domain[1])
      ? (domain as [number, number])
      : undefined;
  }, [seriesList]);

  const yDomain = useMemo(() => [0, seriesMax], [seriesMax]);

  const padding = useMemo(
    () =>
      ({
        ...defaultPadding,
        left: paddingLeft || defaultPadding.left,
      } as Padding),
    [paddingLeft]
  );

  const timespanMarkerData = seriesList[0];

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
        domain: timespanMarkerData.map((x) => x.__date_unix),
      }),
    [bounds.width, timespanMarkerData]
  );

  const markerPadding = dateSpanScale.bandwidth() / 2;

  /**
   * @TODO see if we can use scale linear instead and stick to unix numbers in
   * reverse lookup.
   */
  const xScale = scaleLinear({
    domain: xDomain,
    range: [markerPadding, bounds.width - markerPadding],
  });

  const yScale = scaleLinear({
    domain: yDomain,
    range: [bounds.height, 0],
    nice: tickValues?.length || numTicks,
  });

  /**
   * @TODO remove these and pass scales directly to trend components to keep it
   * consistent
   */
  const getX = useCallback((x: SeriesValue) => xScale(x.__date_unix), [xScale]);
  const getY = useCallback((x: SeriesValue) => yScale(x.__value), [yScale]);

  const [handleHover, hoverState] = useHoverState({
    values,
    paddingLeft: padding.left,
    seriesConfig,
    seriesList: seriesList,
    xScale,
    yScale,
  });

  useEffect(() => {
    if (hoverState) {
      const { nearestLinePoint: nearestPoint, valuesIndex } = hoverState;

      showTooltip({
        tooltipData: {
          /**
           * The tooltip gets passed the original data value, plus the
           * nearest/active hover property and the full series configuration.
           * With these three arguments we should be able to render any sort of
           * tooltip.
           */
          value: values[valuesIndex],
          valueKey: nearestPoint.metricProperty as keyof T,
          config: seriesConfig,
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
      seriesList.map((series, index) => {
        const config = seriesConfig[index];

        switch (config.type) {
          case 'line':
            return (
              <LineTrend
                key={index}
                series={series as SeriesValue[]}
                color={config.color}
                style={config.style}
                strokeWidth={config.strokeWidth}
                getX={getX}
                getY={getY}
                onHover={(evt) => handleHover(evt, index)}
              />
            );
          case 'area':
            return (
              <AreaTrend
                key={index}
                series={series as SeriesValue[]}
                color={config.color}
                style={config.style}
                fillOpacity={config.fillOpacity}
                strokeWidth={config.strokeWidth}
                getX={getX}
                getY={getY}
                yScale={yScale}
                onHover={(evt) => handleHover(evt, index)}
              />
            );

          case 'range':
            return (
              <RangeTrend
                key={index}
                series={series as RangeSeriesValue[]}
                color={config.color}
                fillOpacity={config.fillOpacity}
                strokeWidth={config.strokeWidth}
                // getX={getX}
                // getY={getY}
                xScale={xScale}
                yScale={yScale}
                // onHover={(evt) => handleHover(evt, index)}
              />
            );
        }
      }),
    [handleHover, seriesConfig, seriesList, yScale, getX, getY]
  );

  if (!xDomain) {
    return null;
  }

  return (
    <Box>
      {annotation && <ValueAnnotation mb={2}>{annotation}</ValueAnnotation>}

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
            isPercentage={isPercentage}
          />

          {renderSeries()}
        </ChartContainer>

        <Tooltip
          title={title}
          data={tooltipData}
          left={tooltipLeft}
          top={tooltipTop}
          isOpen={tooltipOpen}
          formatTooltip={formatTooltip}
          isPercentage={isPercentage}
        />

        {hoverState && (
          <Overlay bounds={bounds} padding={padding}>
            <DateSpanMarker
              width={dateSpanScale.bandwidth()}
              point={hoverState.nearestLinePoint}
            />
            {showDateMarker && (
              <DateLineMarker
                point={hoverState.nearestLinePoint}
                lineColor={`#5B5B5B`}
              />
            )}
            <PointMarkers points={hoverState.rangePoints} />
            <PointMarkers points={hoverState.linePoints} />
          </Overlay>
        )}
      </Box>

      {legendItems && (
        <Box pl={paddingLeft}>
          <Legend items={legendItems} />
        </Box>
      )}
    </Box>
  );
}
