import { TimestampedValue } from '@corona-dashboard/common';
import { useTooltip } from '@visx/tooltip';
import { useEffect, useMemo } from 'react';
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
  Overlay,
  PointMarkers,
  Tooltip,
  TooltipData,
  TooltipFormatter,
} from './components';
import { Benchmark } from './components/benchmark';
import { Series } from './components/series';
import {
  calculateSeriesMaximum,
  SeriesConfig,
  useHoverState,
  useLegendItems,
  useScales,
  useSeriesList,
} from './logic';
import { useDimensions } from './logic/dimensions';
export type { SeriesConfig } from './logic';

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
 * - Include props for background rectangle aka date span annotation
 * - Add signaalwaarde/benchmark marker
 * - Finish RangeTrend component
 *
 * Known Issues:
 * - Nearest point / tooltip valueKey calculation seems to be off by some
 *   margin. This is currently not used in any charts but would be nice to solve
 *   at some point.
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
    forcedMaximumValue?: number;
    isPercentage?: boolean;
  };
  benchmark?: {
    value: number;
    label: string;
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
  benchmark,
}: TimeSeriesChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
    tooltipOpen,
  } = useTooltip<TooltipData<T>>();

  const { annotation, isPercentage, forcedMaximumValue } = dataOptions;

  const { padding, bounds } = useDimensions(width, height, paddingLeft);

  const legendItems = useLegendItems(seriesConfig);

  const seriesList = useSeriesList(values, seriesConfig, timeframe);

  const calculatedSeriesMax = useMemo(
    () => calculateSeriesMaximum(values, seriesConfig, benchmark?.value),
    [values, seriesConfig, benchmark]
  );

  const seriesMax = isDefined(forcedMaximumValue)
    ? forcedMaximumValue
    : calculatedSeriesMax;

  const { xScale, yScale, getX, getY, getY0, getY1, dateSpanWidth } = useScales(
    {
      seriesList,
      maximumValue: seriesMax,
      bounds,
      numTicks: tickValues?.length || numTicks,
    }
  );

  const [handleHover, hoverState] = useHoverState({
    values,
    paddingLeft: padding.left,
    seriesConfig,
    seriesList,
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
            onHover={handleHover}
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
              width={dateSpanWidth}
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
