import { TimestampedValue } from '@corona-dashboard/common';
import { Bar } from '@visx/shape';
import { useTooltip } from '@visx/tooltip';
import { useEffect, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import useResizeObserver from 'use-resize-observer';
import { Box } from '~/components-styled/base';
import { TimeframeOption } from '~/utils/timeframe';
import {
  Axes,
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
  BarSeriesDefinition,
  useSeries,
  useCalculatedSeriesMaximum,
  useScales,
  useHoverState,
} from './logic';
import { BarTrend, DateMarker } from './components';

export type BarDefinition<T extends TimestampedValue> = {
  type: 'bar';
  metricProperty: keyof T;
  label: string;
  color: string;
  style?: 'solid' | 'striped';
};

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
export type VerticalBarChartProps<T extends TimestampedValue> = {
  title: string; // Used for default tooltip formatting
  values: T[];
  config: BarSeriesDefinition<T>;
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
  showDateMarker?: boolean;
  paddingLeft?: number;
  /**
   * The data specific options are grouped together. This way we can pass them
   * together with the seriesConfig to the tooltip formatter. The options
   * contain things that are essential to rendering a full tooltip layout
   */
  dataOptions?: DataOptions;
};

export function VerticalBarChart<T extends TimestampedValue>({
  values: allValues,
  config,
  width,
  height = 250,
  timeframe = 'all',
  formatTooltip,
  dataOptions,
  numGridLines = 3,
  tickValues,
  showDateMarker,
  paddingLeft,
  ariaLabelledBy,
  title,
}: VerticalBarChartProps<T>) {
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
  const series = useSeries(values, config);

  const calculatedMax = useCalculatedSeriesMaximum(values, config);
  const { xScale, yScale, getX, getY } = useScales({
    values,
    maximumValue: calculatedMax,
    tickValues,
    bounds,
    numTicks: tickValues?.length || numGridLines,
  });

  const [handleHover, hoverState] = useHoverState({
    series,
    paddingLeft: padding.left,
    xScale,
    yScale,
  });

  useEffect(() => {
    if (hoverState) {
      const { index, point } = hoverState;

      showTooltip({
        tooltipData: {
          value: values[index],
          valueKey: config.metricProperty,
          config: [config],
          options: dataOptions || {},
        },
        tooltipLeft: point.x,
        tooltipTop: point.y,
      });
    } else {
      hideTooltip();
    }
  }, [hoverState, config, values, hideTooltip, showTooltip, dataOptions]);

  return (
    <Box>
      <Box position="relative">
        <ChartContainer
          width={width}
          height={height}
          padding={padding}
          ariaLabelledBy={ariaLabelledBy}
        >
          <Axes
            bounds={bounds}
            numGridLines={numGridLines}
            yTickValues={tickValues}
            xScale={xScale}
            yScale={yScale}
            isPercentage={isPercentage}
            yAxisRef={yAxisRef}
          />

          <BarTrend
            key={0}
            series={series}
            color={config.color}
            secondaryColor={config.secondaryColor}
            getX={getX}
            getY={getY}
            barWidth={xScale.bandwidth()}
            yScale={yScale}
            onHover={handleHover}
          />
        </ChartContainer>

        <Tooltip
          title={title}
          data={tooltipData}
          left={tooltipLeft}
          top={tooltipTop}
          isOpen={tooltipOpen}
          formatTooltip={formatTooltip}
        />

        {hoverState && (
          <Overlay bounds={bounds} padding={padding}>
            <DateMarker point={hoverState.point} />
          </Overlay>
        )}
      </Box>
    </Box>
  );
}
