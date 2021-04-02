/**
 * This a fork of TimeSeriesChart to do a spike on the split lines chart design
 * for the new sewer water concept.
 *
 */
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
import { ValueAnnotation } from '~/components-styled/value-annotation';
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
  Benchmark,
  Series,
} from '~/components-styled/time-series-chart/components';
import {
  calculateSeriesMaximum,
  DataOptions,
  SeriesConfig,
  useHoverState,
  useScales,
  useSeriesList,
  useValuesInTimeframe,
  getTimeDomain,
  useDimensions,
  SplitLineDefinition,
} from '~/components-styled/time-series-chart/logic';
import { useLegendItems } from './logic';

interface SplitLineChartProps<
  T extends TimestampedValue,
  C extends SeriesConfig<T>
> {
  tooltipTitle?: string;
  values: T[];
  seriesConfig: C;
  /**
   * @TODO making it optional for now until we figure out how we want to enforce
   * aria labels and descriptions
   */
  ariaLabelledBy?: string;
  /**
   * The initial width of the chart is used for server-side rendering. it will
   * use the available width when the chart mounts.
   */
  initialWidth?: number;
  height?: number;
  timeframe?: TimeframeOption;
  formatTooltip?: TooltipFormatter<T>;
  /**
   * number of grid lines and tick values should be determined by the splitPoints
   * config.
   */
  // numGridLines?: number;
  // tickValues?: number[];
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
}

export function SplitLineChart<
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
  formatTickValue: formatYTickValue,
  paddingLeft,
  ariaLabelledBy,
  tooltipTitle,
}: SplitLineChartProps<T, C>) {
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

  /**
   * @TODO generate legend items from the splitPoint values and colors
   */
  const legendItems = useLegendItems(seriesConfig, dataOptions);

  const values = useValuesInTimeframe(allValues, timeframe);

  const seriesList = useSeriesList(values, seriesConfig);

  const splitLineConfig = seriesConfig.find(
    (x) => x.type === 'split-line'
  ) as SplitLineDefinition<T>;

  const yTickValues = splitLineConfig.splitPoints.map((x) => x.value);

  /**
   * The maximum is calculated over all values, because you don't want the
   * y-axis scaling to change when toggling the timeframe setting.
   */
  const calculatedSeriesMax = useMemo(
    () => calculateSeriesMaximum(seriesList, seriesConfig, benchmark?.value),
    [seriesList, seriesConfig, benchmark?.value]
  );

  const seriesMax = isDefined(forcedMaximumValue)
    ? forcedMaximumValue
    : calculatedSeriesMax;

  const { xScale, yScale, getX, getY, getY0, getY1, dateSpanWidth } = useScales(
    {
      values,
      maximumValue: seriesMax,
      bounds,
      numTicks: yTickValues.length,
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
  ]);

  useOnClickOutside([sizeRef], () => tooltipData && hideTooltip());

  const handleClick = useCallback(() => {
    /* Nothing to do, but ChartContainer wants a click handler */
  }, []);

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
          ariaLabelledBy={ariaLabelledBy || ''}
          onHover={handleHover}
          onClick={handleClick}
        >
          <Axes
            bounds={bounds}
            numGridLines={yTickValues.length}
            yTickValues={yTickValues}
            xTickValues={xTickValues}
            formatYTickValue={formatYTickValue}
            xScale={xScale}
            yScale={yScale}
            isPercentage={isPercentage}
            yAxisRef={yAxisRef}
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
          />

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
              start={x.start}
              end={x.end}
              domain={xScale.domain() as [number, number]}
              getX={getX}
              height={bounds.height}
            />
          ))}
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
              lineColor="#5B5B5B"
              value={values[hoverState.valuesIndex]}
            />
            <PointMarkers points={hoverState.rangePoints} />
            <PointMarkers points={hoverState.linePoints} />
          </Overlay>
        )}
      </Box>

      {legendItems.length > 0 && (
        <Box pl={paddingLeft}>
          <Legend items={legendItems} />
        </Box>
      )}
    </Box>
  );
}
