import { TimestampedValue } from '@corona-dashboard/common';
import { Bar } from '@visx/shape';
import { useTooltip } from '@visx/tooltip';
import { first, isEmpty, last } from 'lodash';
import { useCallback, useEffect, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import useResizeObserver from 'use-resize-observer';
import { Box } from '~/components-styled/base';
import { TimeframeOption } from '~/utils/timeframe';
import {
  ChartContainer,
  Tooltip,
  TooltipData,
  TooltipFormatter,
  Overlay,
} from '~/components-styled/time-series-chart/components';
import {
  DataOptions,
  useValuesInTimeframe,
} from '~/components-styled/time-series-chart/logic';
import { useDimensions } from '~/components-styled/time-series-chart/logic/dimensions';

import {
  BarSeriesConfig,
  useSeriesList,
  useCalculatedSeriesExtremes,
  useScales,
  useHoverState,
} from './logic';
import { BarTrend, DateMarker, Axes } from './components';

/**
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
export type VerticalBarChartProps<
  T extends TimestampedValue,
  C extends BarSeriesConfig<T>
> = {
  title: string; // Used for default tooltip formatting
  values: T[];
  seriesConfig: C;
  width: number;
  ariaLabelledBy: string;
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
  onSeriesClick?: (seriesConfig: C[number], value: T) => void;
};

export function VerticalBarChart<
  T extends TimestampedValue,
  C extends BarSeriesConfig<T>
>({
  values: allValues,
  seriesConfig,
  width,
  height = 250,
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

  const { isPercentage } = dataOptions || {};

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

  const values = useValuesInTimeframe(allValues, timeframe);

  const seriesList = useSeriesList(values, seriesConfig);

  const {
    max: calculatedMax,
    min: calculatedMin,
  } = useCalculatedSeriesExtremes(values, seriesConfig);

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

  const handleClick = useCallback(() => {
    if (onSeriesClick && tooltipData) {
      onSeriesClick(seriesConfig[tooltipData.configIndex], tooltipData.value);
    }
  }, [onSeriesClick, seriesConfig, tooltipData]);

  useEffect(() => {
    if (hoverState) {
      const { valuesIndex, nearestPoint } = hoverState;

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
    } else {
      hideTooltip();
    }
  }, [hoverState, seriesConfig, values, hideTooltip, showTooltip, dataOptions]);

  return (
    <Box>
      <Box position="relative">
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
            yTickValues={tickValues}
            xTickValues={xTickValues}
            xScale={xScale}
            yScale={yScale}
            isPercentage={isPercentage}
            yAxisRef={yAxisRef}
          />

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
      </Box>
    </Box>
  );
}
