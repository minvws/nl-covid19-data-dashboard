import { TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useTooltip } from '@visx/tooltip';
import { useEffect, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { useCurrentDate } from '~/utils/current-date-context';
import { TimeframeOption } from '~/utils/timeframe';
import { useElementSize } from '~/utils/use-element-size';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { useUniqueId } from '~/utils/use-unique-id';
import {
  Axes,
  ChartContainer,
  DateLineMarker,
  DateSpanMarker,
  Overlay,
  Tooltip,
  TooltipData,
} from './components';
import { Benchmark } from './components/benchmark';
import { Series } from './components/series';
import {
  BarSeriesDefinition,
  calculateSeriesMaximum,
  DataOptions,
  getTimeDomain,
  useHoverState,
  useScales,
  useSeriesList,
  useValuesInTimeframe,
} from './logic';
import { COLLAPSE_Y_AXIS_THRESHOLD, useDimensions } from './logic/dimensions';

export type TimeSeriesMiniBarChart<T extends TimestampedValue> = {
  values: T[];
  seriesConfig: BarSeriesDefinition<T>;
  ariaLabelledBy?: string;
  initialWidth?: number;
  height?: number;
  timeframe?: TimeframeOption;
  dataOptions?: DataOptions;
};

/**
 * The TimeSeriesMiniBarChart is a simplified TimeSeriesChart which only accepts
 * a single seriesConfig of type `bar`.
 *
 * Main differences:
 * - no Y-axis
 * - the horizontal chart padding is based on the benchmark value
 */
export function TimeSeriesMiniBarChart<T extends TimestampedValue>({
  values: allValues,
  seriesConfig: _seriesConfig,
  initialWidth = 840,
  height = 250,
  timeframe = 'all',
  dataOptions,
  ariaLabelledBy,
}: TimeSeriesMiniBarChart<T>) {
  const seriesConfig = useMemo(() => [_seriesConfig], [_seriesConfig]);
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
    tooltipOpen,
  } = useTooltip<TooltipData<T>>();

  const chartId = useUniqueId();

  const [sizeRef, { width }] = useElementSize<HTMLDivElement>(initialWidth);

  const { isPercentage, forcedMaximumValue, benchmark, timespanAnnotations } =
    dataOptions || {};

  const { padding, bounds, leftPaddingRef } = useDimensions({
    width,
    height,
    applySymmetricalPadding: true,
  });

  const values = useValuesInTimeframe(allValues, timeframe);

  const seriesList = useSeriesList(values, seriesConfig);

  const calculatedSeriesMax = useMemo(
    () => calculateSeriesMaximum(seriesList, seriesConfig, benchmark?.value),
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
    bounds,
    numTicks: 0,
  });

  const today = useCurrentDate();
  const xTickValues = useMemo(
    () => getTimeDomain({ values, today, withPadding: false }),
    [values, today]
  );

  const [hoverState, chartEventHandlers] = useHoverState({
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
      const { nearestPoint, valuesIndex } = hoverState;

      showTooltip({
        tooltipData: {
          value: values[valuesIndex],
          config: seriesConfig,
          configIndex: nearestPoint.seriesConfigIndex,
          displayTooltipValueOnly: true,
          options: dataOptions || {},
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

  return (
    <Box ref={sizeRef}>
      <Box position="relative" css={css({ userSelect: 'none' })}>
        <ChartContainer
          width={width}
          height={height}
          padding={padding}
          ariaLabelledBy={ariaLabelledBy || ''}
          onHover={chartEventHandlers.handleHover}
          onFocus={chartEventHandlers.handleFocus}
          onBlur={chartEventHandlers.handleBlur}
        >
          <Axes
            bounds={bounds}
            numGridLines={0}
            xTickValues={xTickValues}
            xScale={xScale}
            yScale={yScale}
            isPercentage={isPercentage}
            isYAxisCollapsed={width < COLLAPSE_Y_AXIS_THRESHOLD}
            xRangePadding={padding.left}
            hasAllZeroValues={hasAllZeroValues}
          />

          <Series
            chartId={chartId}
            seriesConfig={seriesConfig}
            seriesList={seriesList}
            getX={getX}
            getY={getY}
            getY0={getY0}
            getY1={getY1}
            bounds={bounds}
            yScale={yScale}
            benchmark={benchmark}
          />

          {benchmark && (
            <Benchmark
              value={benchmark.value}
              label={benchmark.label}
              top={yScale(benchmark.value)}
              width={bounds.width}
              textRef={leftPaddingRef}
              xRangePadding={padding.left}
            />
          )}
        </ChartContainer>

        {tooltipOpen && tooltipData && (
          <Tooltip
            data={tooltipData}
            left={tooltipLeft}
            top={tooltipTop}
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
              lineColor="transparent"
              value={values[hoverState.valuesIndex]}
            />
          </Overlay>
        )}
      </Box>
    </Box>
  );
}
