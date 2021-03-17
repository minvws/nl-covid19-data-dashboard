import { TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useTooltip } from '@visx/tooltip';
import { useCallback, useEffect, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import useResizeObserver from 'use-resize-observer';
import { Box } from '~/components-styled/base';
import { Legend } from '~/components-styled/legend';
import { TimeframeOption } from '~/utils/timeframe';
import { useElementSize } from '~/utils/use-element-size';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { ValueAnnotation } from '../value-annotation';
import {
  Axes,
  ChartContainer,
  DateLineMarker,
  DateSpanMarker,
  Overlay,
  PointMarkers,
  TimespanAnnotation,
  Tooltip,
  TooltipData,
  TooltipFormatter,
} from './components';
import { Benchmark } from './components/benchmark';
import { Series } from './components/series';
import {
  calculateSeriesMaximum,
  DataOptions,
  SeriesConfig,
  useHoverState,
  useLegendItems,
  useScales,
  useSeriesList,
  useValuesInTimeframe,
  getTimeDomain,
} from './logic';
import { useDimensions } from './logic/dimensions';
export type { SeriesConfig } from './logic';

/**
 * This chart started as a fork from MultiLineChart. It attempts to create a
 * more generic abstraction that can replace LineChart, MultiLineChart,
 * AreaChart and later possibly something like the vaccine delivery
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
 * - Render date start /end on x-axis for date spans series
 * - Configure y-axis for standard charts
 *
 * Known Issues:
 * - Nearest point / tooltip valueKey calculation seems to be off by some
 *   margin. This is currently not used in any charts but would be nice to solve
 *   at some point.
 */
export type TimeSeriesChartProps<
  T extends TimestampedValue,
  C extends SeriesConfig<T>
> = {
  title?: string; // Used for default tooltip formatting
  values: T[];
  seriesConfig: C;
  ariaLabelledBy: string;
  /**
   * The initial width of the chart is used for server-side rendering. it will
   * use the available width when the chart mounts.
   */
  initialWidth?: number;
  height?: number;
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
  tickValues?: number[];
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
};

export function TimeSeriesChart<
  T extends TimestampedValue,
  C extends SeriesConfig<T>
>({
  values: allValues,
  seriesConfig,
  initialWidth = 840,
  height = 250,
  timeframe = 'all',
  formatTooltip,
  dataOptions,
  numGridLines = 3,
  tickValues: yTickValues,
  paddingLeft,
  ariaLabelledBy,
  title,
  disableLegend,
  onSeriesClick,
  markNearestPointOnly,
}: TimeSeriesChartProps<T, C>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
    tooltipOpen,
  } = useTooltip<TooltipData<T>>();

  const [sizeRef, { width }] = useElementSize<HTMLDivElement>(initialWidth);

  const {
    valueAnnotation,
    isPercentage,
    forcedMaximumValue,
    benchmark,
    timespanAnnotations,
  } = dataOptions || {};

  const {
    width: yAxisWidth = 0,
    ref: yAxisRef,
    // @ts-expect-error useResizeObserver expects element extending HTMLElement
  } = useResizeObserver<SVGElement>();

  const { padding, bounds } = useDimensions(
    width,
    height,
    paddingLeft ?? yAxisWidth + 10 // 10px seems to be enough padding
  );

  const legendItems = useLegendItems(seriesConfig, dataOptions);

  const values = useValuesInTimeframe(allValues, timeframe);

  const seriesList = useSeriesList(values, seriesConfig);

  /**
   * The maximum is calculated over all values, because you don't want the
   * y-axis scaling to change when toggling the timeframe setting.
   */
  const calculatedSeriesMax = useMemo(
    () => calculateSeriesMaximum(allValues, seriesConfig, benchmark?.value),
    [allValues, seriesConfig, benchmark]
  );

  const seriesMax = isDefined(forcedMaximumValue)
    ? forcedMaximumValue
    : calculatedSeriesMax;

  const { xScale, yScale, getX, getY, getY0, getY1, dateSpanWidth } = useScales(
    {
      values,
      maximumValue: seriesMax,
      bounds,
      numTicks: yTickValues?.length || numGridLines,
    }
  );

  const xTickValues = useMemo(
    () => getTimeDomain(values, { withPadding: false }),
    [values]
  );

  const [handleHover, hoverState] = useHoverState({
    values,
    padding,
    seriesConfig,
    seriesList,
    xScale,
    yScale,
    timespanAnnotations,
    markNearestPointOnly,
  });

  useEffect(() => {
    if (hoverState) {
      const { nearestPoint, valuesIndex, timespanAnnotationIndex } = hoverState;

      showTooltip({
        tooltipData: {
          /**
           * The tooltip gets passed the original data value, plus the
           * nearest/active hover property and the full series configuration.
           * With these three arguments we should be able to render any sort of
           * tooltip.
           */
          value: values[valuesIndex],
          config: seriesConfig,
          configIndex: nearestPoint.seriesConfigIndex,
          markNearestPointOnly,
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
  ]);

  useOnClickOutside([sizeRef], () => tooltipData && hideTooltip());

  const handleClick = useCallback(() => {
    if (onSeriesClick && tooltipData) {
      onSeriesClick(seriesConfig[tooltipData.configIndex], tooltipData.value);
    }
  }, [onSeriesClick, seriesConfig, tooltipData]);

  return (
    <Box ref={sizeRef}>
      {valueAnnotation && (
        <ValueAnnotation mb={2}>{valueAnnotation}</ValueAnnotation>
      )}

      <Box position="relative" css={css({ userSelect: 'none' })}>
        <ChartContainer
          width={width}
          height={height}
          padding={padding}
          ariaLabelledBy={ariaLabelledBy}
          onHover={handleHover}
          onClick={handleClick}
        >
          <Axes
            bounds={bounds}
            numGridLines={numGridLines}
            yTickValues={yTickValues}
            xTickValues={xTickValues}
            xScale={xScale}
            yScale={yScale}
            isPercentage={isPercentage}
            yAxisRef={yAxisRef}
          />

          {timespanAnnotations &&
            timespanAnnotations.map((x, index) => (
              <TimespanAnnotation
                key={index}
                start={x.start}
                end={x.end}
                color={x.color}
                fillOpacity={x.fillOpacity}
                domain={xScale.domain() as [number, number]}
                getX={getX}
                height={bounds.height}
              />
            ))}

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
          />

          {benchmark && (
            <Benchmark
              value={benchmark.value}
              label={benchmark.label}
              top={yScale(benchmark.value)}
              width={bounds.width}
            />
          )}
        </ChartContainer>

        {tooltipOpen && tooltipData && (
          <Tooltip
            title={title}
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
              lineColor="#5B5B5B"
              value={values[hoverState.valuesIndex]}
            />
            <PointMarkers points={hoverState.rangePoints} />
            <PointMarkers points={hoverState.linePoints} />
          </Overlay>
        )}
      </Box>

      {!disableLegend && legendItems.length > 0 && (
        <Box pl={paddingLeft}>
          <Legend items={legendItems} />
        </Box>
      )}
    </Box>
  );
}
