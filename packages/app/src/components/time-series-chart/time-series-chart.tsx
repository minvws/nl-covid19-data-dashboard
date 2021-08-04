import { TimeframeOption, TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useTooltip } from '@visx/tooltip';
import { first, last } from 'lodash';
import { useCallback, useEffect, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { Box, Spacer } from '~/components/base';
import { Legend } from '~/components/legend';
import { ValueAnnotation } from '~/components/value-annotation';
import { useCurrentDate } from '~/utils/current-date-context';
import {
  AccessibilityDefinition,
  addAccessibilityFeatures,
} from '~/utils/use-accessibility-annotations';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { useResponsiveContainer } from '~/utils/use-responsive-container';
import { useUniqueId } from '../../utils/use-unique-id';
import { InlineText } from '../typography';
import {
  Axes,
  Benchmark,
  ChartContainer,
  DateLineMarker,
  DateSpanMarker,
  Overlay,
  PointMarkers,
  Series,
  TimespanAnnotation,
  Tooltip,
  TooltipData,
  TooltipFormatter,
} from './components';
import { TimeAnnotation } from './components/time-annotation';
import { Timeline, TimelineEventHighlight } from './components/timeline';
import { useTimelineState } from './components/timeline/logic';
import {
  calculateSeriesMaximum,
  calculateSeriesMinimum,
  COLLAPSE_Y_AXIS_THRESHOLD,
  DataOptions,
  extractCutValuesConfig,
  getTimeDomain,
  omitValuePropertiesForAnnotation,
  SeriesConfig,
  useDimensions,
  useHoverState,
  useLegendItems,
  useMetricPropertyFormatters,
  useScales,
  useSeriesList,
  useSplitLegendGroups,
  useValuesInTimeframe,
  useValueWidth,
} from './logic';
export type { SeriesConfig } from './logic';

/**
 * This chart started as a fork from MultiLineChart. It attempts to create a
 * more generic abstraction that can replace LineChart, MultiLineChart,
 * AreaChart and later possibly something like the vaccine delivery chart.
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
 * Components and logic are split up onto smaller abstractions so they can be
 * used more easily in composition. For example the Marker component is now
 * several components rendered separately inside an Overlay container. We might
 * not be able to avoid creating multiple chart root components, but with
 * smaller abstractions we should be able to re-use most elements and logic.
 *
 * The scales for x and y are using the same type (LinearScale). This was done
 * to see if we can use the date_unix timestamps from the data directly
 * everywhere without unnecessary conversion to and from Date objects.
 */
type TimeSeriesChartProps<
  T extends TimestampedValue,
  C extends SeriesConfig<T>
> = {
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  tooltipTitle?: string;
  values: T[];
  seriesConfig: C;
  /**
   * @TODO making it optional for now until we figure out how we want to enforce
   * aria labels and descriptions
   */
  /**
   * The initial width of the chart is used for server-side rendering. it will
   * use the available width when the chart mounts.
   */
  initialWidth?: number;
  minHeight?: number;
  timeframe?: TimeframeOption;
  formatTooltip?: TooltipFormatter<T>;
  /**
   * The number of grid lines also by default determines the number of y-axis
   * ticks, but the number of ticks can be overruled with specific tick values
   * via the tickValues prop.
   *
   * This way you can also have many more grid lines than tick values, like in
   * the vaccine support chart.
   */
  numGridLines?: number;
  showWeekNumbers?: boolean;
  tickValues?: number[];
  formatTickValue?: (value: number) => string;
  paddingLeft?: number;
  /**
   * The data specific options are grouped together. This way we can pass them
   * together with the seriesConfig to the tooltip formatter. The options
   * contain things that are essential to rendering a full tooltip layout
   */
  dataOptions?: DataOptions;
  disableLegend?: boolean;
  onSeriesClick?: (seriesConfig: C[number], value: T) => void;

  /**
   * By default markers for all series are displayed on hover, also the tooltip
   * will display all series of the selected X-value. The `markNearestPointOnly`
   * will result in a user interacting with the single nearest point only.
   */
  markNearestPointOnly?: boolean;

  /**
   * Display only values inside the tooltip.
   * This option only makes sense when we display a single trend.
   */
  displayTooltipValueOnly?: boolean;
};

export function TimeSeriesChart<
  T extends TimestampedValue,
  C extends SeriesConfig<T>
>({
  accessibility,
  values: allValues,
  seriesConfig,
  initialWidth = 840,
  minHeight = 250,
  timeframe = 'all',
  formatTooltip,
  dataOptions,
  showWeekNumbers,
  numGridLines = 4,
  tickValues: yTickValues,
  formatTickValue: formatYTickValue,
  paddingLeft,
  tooltipTitle,
  disableLegend,
  onSeriesClick,
  markNearestPointOnly,
  displayTooltipValueOnly,
}: TimeSeriesChartProps<T, C>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
    tooltipOpen,
  } = useTooltip<TooltipData<T>>();

  const today = useCurrentDate();
  const chartId = useUniqueId();

  const {
    valueAnnotation,
    isPercentage,
    forcedMaximumValue,
    benchmark,
    timespanAnnotations,
    timeAnnotations,
    timelineEvents,
  } = dataOptions || {};

  const {
    ResponsiveContainer,
    ref: containerRef,
    width,
    height,
  } = useResponsiveContainer(initialWidth, minHeight);

  const { padding, bounds, leftPaddingRef } = useDimensions({
    width,
    height,
    paddingLeft,
    paddingTop: showWeekNumbers ? 20 : undefined,
  });

  const values = useValuesInTimeframe(allValues, timeframe);

  const cutValuesConfig = useMemo(
    () => extractCutValuesConfig(timespanAnnotations),
    [timespanAnnotations]
  );

  const seriesList = useSeriesList(values, seriesConfig, cutValuesConfig);

  /**
   * The maximum is calculated over all values, because you don't want the
   * y-axis scaling to change when toggling the timeframe setting.
   */
  const [calculatedSeriesMin, calculatedSeriesMax] = useMemo(
    () => [
      calculateSeriesMinimum(seriesList, seriesConfig, benchmark?.value),
      calculateSeriesMaximum(seriesList, seriesConfig, benchmark?.value),
    ],
    [seriesList, seriesConfig, benchmark?.value]
  );

  const seriesMax = isDefined(forcedMaximumValue)
    ? forcedMaximumValue
    : calculatedSeriesMax;

  const {
    xScale,
    yScale,
    getX,
    getY,
    getY0,
    getY1,
    dateSpanWidth,
    hasAllZeroValues,
  } = useScales({
    values,
    maximumValue: seriesMax,
    minimumValue: calculatedSeriesMin,
    bounds,
    numTicks: yTickValues?.length || numGridLines,
  });

  const legendItems = useLegendItems(
    xScale.domain(),
    seriesConfig,
    dataOptions
  );

  const splitLegendGroups = useSplitLegendGroups(seriesConfig);

  const xTickValues = useMemo(
    () => getTimeDomain({ values, today, withPadding: false }),
    [values, today]
  );

  const timelineState = useTimelineState(timelineEvents, xScale);
  const [hoverState, chartEventHandlers] = useHoverState({
    values,
    padding,
    seriesConfig,
    seriesList,
    xScale,
    yScale,
    timespanAnnotations,
    timelineEvents: timelineState.events,
    markNearestPointOnly,
  });

  const metricPropertyFormatters = useMetricPropertyFormatters(
    seriesConfig,
    values
  );

  const valueMinWidth = useValueWidth(
    values,
    seriesConfig,
    isPercentage,
    metricPropertyFormatters
  );

  useEffect(() => {
    if (hoverState) {
      const {
        nearestPoint,
        valuesIndex,
        timespanAnnotationIndex,
        timelineEventIndex,
      } = hoverState;

      showTooltip({
        tooltipData: {
          /**
           * The tooltip gets passed the original data value, plus the
           * nearest/active hover property and the full series configuration.
           * With these three arguments we should be able to render any sort of
           * tooltip.
           *
           * If we are hovering a timespanAnnotation, we use that data to cut
           * out any property values that should be blocked from the tooltip.
           */
          value:
            timespanAnnotations && isDefined(timespanAnnotationIndex)
              ? omitValuePropertiesForAnnotation(
                  values[valuesIndex],
                  timespanAnnotations[timespanAnnotationIndex]
                )
              : values[valuesIndex],
          config: seriesConfig,
          configIndex: nearestPoint.seriesConfigIndex,
          markNearestPointOnly,
          displayTooltipValueOnly,
          options: dataOptions || {},
          /**
           * Pass the full annotation data. We could just pass the index because
           * dataOptions is already being passed, but it's cumbersome to have to
           * dig up the annotation from the array in the tooltip logic.
           */
          timespanAnnotation:
            timespanAnnotations && isDefined(timespanAnnotationIndex)
              ? timespanAnnotations[timespanAnnotationIndex]
              : undefined,
          timelineEvent: isDefined(timelineEventIndex)
            ? timelineState.events[timelineEventIndex]
            : undefined,

          valueMinWidth,
          metricPropertyFormatters,
        },
        tooltipLeft: nearestPoint.x,
        tooltipTop: nearestPoint.y,
      });
    } else {
      hideTooltip();
    }
  }, [
    hoverState,
    seriesConfig,
    values,
    hideTooltip,
    showTooltip,
    dataOptions,
    timespanAnnotations,
    markNearestPointOnly,
    displayTooltipValueOnly,
    valueMinWidth,
    timelineEvents,
    timelineState.events,
    metricPropertyFormatters,
  ]);

  useOnClickOutside([containerRef], () => tooltipData && hideTooltip());

  const handleClick = useCallback(() => {
    if (onSeriesClick && tooltipData) {
      onSeriesClick(seriesConfig[tooltipData.configIndex], tooltipData.value);
    }
  }, [onSeriesClick, seriesConfig, tooltipData]);

  const isYAxisCollapsed = width < COLLAPSE_Y_AXIS_THRESHOLD;
  const timeSeriesAccessibility = addAccessibilityFeatures(accessibility, [
    'keyboard_time_series_chart',
  ]);

  const highlightZero =
    (first(yScale.domain()) as number) < 0 &&
    (last(yScale.domain()) as number) > 0;

  return (
    <>
      {valueAnnotation && (
        <>
          <ValueAnnotation>{valueAnnotation}</ValueAnnotation>
          <Spacer mb={2} />
        </>
      )}

      <ResponsiveContainer>
        <Box position="relative" css={css({ userSelect: 'none' })}>
          <ChartContainer
            accessibility={timeSeriesAccessibility}
            width={width}
            height={height}
            padding={padding}
            onClick={handleClick}
            onHover={chartEventHandlers.handleHover}
            onFocus={chartEventHandlers.handleFocus}
            onBlur={chartEventHandlers.handleBlur}
          >
            <Axes
              bounds={bounds}
              numGridLines={numGridLines}
              yTickValues={yTickValues}
              xTickValues={xTickValues}
              formatYTickValue={formatYTickValue}
              xScale={xScale}
              yScale={yScale}
              isPercentage={isPercentage}
              yAxisRef={leftPaddingRef}
              isYAxisCollapsed={isYAxisCollapsed}
              hasAllZeroValues={hasAllZeroValues}
              showWeekNumbers={showWeekNumbers}
            />

            {/**
             * The renderSeries() callback has been replaced by this component. As
             * long as we use only very standardized series this might be a good
             * idea because it removes quite some lines of code from the main
             * component.
             *
             * With this amount of props if does feel like the wrong type of
             * abstraction, but I still think it's an improvement over
             * having it mixed in with the main component.
             */}
            <Series
              seriesConfig={seriesConfig}
              seriesList={seriesList}
              getX={getX}
              getY={getY}
              getY0={getY0}
              getY1={getY1}
              bounds={bounds}
              yScale={yScale}
              chartId={chartId}
            />

            {/**
             * Highlight 0 on the y-axis when there are positive and
             * negative values
             */}
            {highlightZero && (
              <rect
                x={0}
                y={yScale(0) - 1}
                width={bounds.width}
                height={2}
                fill="black"
              />
            )}

            {benchmark && (
              <Benchmark
                value={benchmark.value}
                label={benchmark.label}
                top={yScale(benchmark.value)}
                width={bounds.width}
              />
            )}

            {/**
             * Timespan annotations are rendered on top of the chart. It is
             * transparent thanks to the `mix-blend-mode` set to `multiply`.
             */}
            {timespanAnnotations?.map((x, index) => (
              <TimespanAnnotation
                key={index}
                domain={xScale.domain() as [number, number]}
                getX={getX}
                height={bounds.height}
                config={x}
              />
            ))}
            {timeAnnotations?.map((x, index) => (
              <TimeAnnotation
                key={index}
                domain={xScale.domain() as [number, number]}
                getX={getX}
                height={bounds.height}
                config={x}
              />
            ))}

            <TimelineEventHighlight
              height={bounds.height}
              timelineState={timelineState}
            />
          </ChartContainer>

          {tooltipOpen && tooltipData && (
            <Tooltip
              title={tooltipTitle}
              data={tooltipData}
              left={tooltipLeft}
              top={tooltipTop}
              formatTooltip={formatTooltip}
              bounds={bounds}
              padding={padding}
            />
          )}

          {hoverState && (
            <Overlay bounds={bounds} padding={padding}>
              <DateSpanMarker
                width={dateSpanWidth}
                point={hoverState.nearestPoint}
              />

              <DateLineMarker
                point={hoverState.nearestPoint}
                lineColor={
                  /**
                   * Only display a line when we have range- or line-points.
                   * Bar-series have no markers, which defeats the need of a line.
                   */
                  hoverState.rangePoints.length || hoverState.linePoints.length
                    ? '#5B5B5B'
                    : 'transparent'
                }
                value={values[hoverState.valuesIndex]}
              />
              <PointMarkers points={hoverState.rangePoints} />
              <PointMarkers points={hoverState.linePoints} />
            </Overlay>
          )}
        </Box>
      </ResponsiveContainer>

      {timelineState.events.length > 0 && (
        <Timeline
          padding={padding}
          bounds={bounds}
          width={width}
          timelineState={timelineState}
          highlightIndex={hoverState?.timelineEventIndex}
          isYAxisCollapsed={isYAxisCollapsed}
        />
      )}

      {!disableLegend && splitLegendGroups && (
        <>
          {splitLegendGroups.map((x) => (
            <Box
              key={x.label}
              pl={paddingLeft}
              display="flex"
              flexDirection={['column', 'row']}
              alignItems="baseline"
              spacingHorizontal={3}
            >
              <InlineText>{x.label}:</InlineText>
              <Legend items={x.items} />
            </Box>
          ))}
        </>
      )}
      {!disableLegend && legendItems && (
        <Box pl={paddingLeft}>
          <Legend items={legendItems} />
        </Box>
      )}
    </>
  );
}
