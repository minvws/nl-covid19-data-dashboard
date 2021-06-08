import { TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Bar } from '@visx/shape';
import { useTooltip } from '@visx/tooltip';
import { first, last } from 'lodash';
import { useCallback, useEffect, useMemo } from 'react';
// Time Series Chart components and logic
import {
  Axes,
  ChartContainer,
  Overlay,
} from '~/components/time-series-chart/components';
import {
  COLLAPSE_Y_AXIS_THRESHOLD,
  DataOptions,
  useDimensions,
  useValuesInTimeframe,
} from '~/components/time-series-chart/logic';
import { TimeframeOption } from '~/utils/timeframe';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { useResponsiveContainer } from '~/utils/use-responsive-container';
import {
  BarHover,
  BarTrend,
  DateMarker,
  Tooltip,
  TooltipData,
  TooltipFormatter,
} from './components';
// Bar Chart specific components and logic
import {
  SeriesConfig,
  useCalculatedSeriesExtremes,
  useHoverState,
  useScales,
  useSeriesList,
} from './logic';

/**
 * Reference TimeSeriesChart for additional information on props
 */
export type VerticalBarChartProps<
  T extends TimestampedValue,
  C extends SeriesConfig<T>
> = {
  title?: string;
  values: T[];
  seriesConfig: C;
  initialWidth?: number;
  ariaLabelledBy: string;
  minHeight?: number;
  timeframe?: TimeframeOption;
  formatTooltip: TooltipFormatter<T>;
  numGridLines?: number;
  tickValues?: number[];
  paddingLeft?: number;
  dataOptions?: DataOptions;
  onSeriesClick?: (seriesConfig: C[number], value: T) => void;
};

export function VerticalBarChart<
  T extends TimestampedValue,
  C extends SeriesConfig<T>
>({
  values: allValues,
  seriesConfig,
  initialWidth = 840,
  minHeight = 250,
  timeframe = 'all',
  formatTooltip,
  dataOptions,
  numGridLines = 3,
  tickValues,
  paddingLeft,
  ariaLabelledBy,
  onSeriesClick,
  title,
}: VerticalBarChartProps<T, C>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
    tooltipOpen,
  } = useTooltip<TooltipData<T>>();

  const { ResponsiveContainer, ref, width, height } = useResponsiveContainer(
    initialWidth,
    minHeight
  );

  const { isPercentage } = dataOptions || {};
  const { padding, bounds, leftPaddingRef } = useDimensions({
    width,
    height,
    paddingLeft,
  });

  const values = useValuesInTimeframe(allValues, timeframe);

  const seriesList = useSeriesList(values, seriesConfig);

  const { max: calculatedMax, min: calculatedMin } =
    useCalculatedSeriesExtremes(values, seriesConfig);

  const { xScale, yScale, getX, getY } = useScales({
    values,
    maximumValue: calculatedMax,
    minimumValue: calculatedMin,
    tickValues,
    bounds,
    numTicks: tickValues?.length || numGridLines,
  });

  const xTickValues = useMemo(
    () => [first(xScale.domain()), last(xScale.domain())] as [number, number],
    [xScale]
  );

  const [handleHover, hoverState] = useHoverState({
    values,
    seriesList,
    seriesConfig,
    xScale,
    yScale,
  });

  useOnClickOutside([ref], () => tooltipData && hideTooltip());

  const handleClick = useCallback(() => {
    if (onSeriesClick && tooltipData) {
      onSeriesClick(seriesConfig[tooltipData.configIndex], tooltipData.value);
    }
  }, [onSeriesClick, seriesConfig, tooltipData]);

  useEffect(() => {
    if (hoverState) {
      const { valuesIndex, nearestPoint } = hoverState;

      if (!values[valuesIndex]) {
        hideTooltip();
      } else {
        showTooltip({
          tooltipData: {
            value: values[valuesIndex],
            configIndex: nearestPoint.seriesConfigIndex,
            config: seriesConfig,
            options: dataOptions || {},
          },
          tooltipLeft: nearestPoint.x,
          tooltipTop: nearestPoint.y,
        });
      }
    } else {
      hideTooltip();
    }
  }, [hoverState, seriesConfig, values, hideTooltip, showTooltip, dataOptions]);

  const hasNegativeValues = yScale.domain()[0] < 0;
  return (
    <ResponsiveContainer>
      <ChartContainer
        width={width}
        height={minHeight}
        padding={padding}
        ariaLabelledBy={ariaLabelledBy}
        onClick={handleClick}
      >
        <Axes
          bounds={bounds}
          numGridLines={numGridLines}
          yTickValues={tickValues}
          xTickValues={xTickValues}
          xScale={xScale}
          yScale={yScale}
          isPercentage={isPercentage}
          yAxisRef={leftPaddingRef}
          isYAxisCollapsed={width < COLLAPSE_Y_AXIS_THRESHOLD}
        />

        {hoverState && (
          <BarHover
            point={hoverState.nearestPoint}
            bounds={bounds}
            barWidth={xScale.bandwidth()}
          />
        )}

        <g css={css({ pointerEvents: 'all' })}>
          {seriesList.map((series, index) => (
            <BarTrend
              key={0}
              series={series}
              color={seriesConfig[index].color}
              secondaryColor={seriesConfig[index].secondaryColor}
              getX={getX}
              getY={getY}
              barWidth={xScale.bandwidth()}
              yScale={yScale}
              onHover={handleHover}
            />
          ))}
        </g>

        {hasNegativeValues && (
          <Bar
            // Highlights 0 on the y-axis when there are negative values
            x={0}
            y={yScale(0) - 1}
            width={bounds.width}
            height={2}
            fill="black"
          />
        )}
      </ChartContainer>

      {tooltipOpen && tooltipData && (
        <Tooltip
          title={title}
          data={tooltipData}
          left={tooltipLeft}
          top={tooltipTop}
          bounds={bounds}
          padding={padding}
          formatTooltip={formatTooltip}
        />
      )}

      {hoverState && (
        <Overlay bounds={bounds} padding={padding}>
          <DateMarker point={hoverState.nearestPoint} />
        </Overlay>
      )}
    </ResponsiveContainer>
  );
}
