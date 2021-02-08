import { TickFormatter } from '@visx/axis';
import { scaleBand } from '@visx/scale';
import { useCallback, useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { Legenda, LegendItem, LegendShape } from '~/components-styled/legenda';
import {
  ChartAxes,
  ChartPadding,
  ChartScales,
  ComponentCallbackFunction,
  defaultPadding,
} from '~/components-styled/line-chart/components';
import { Text } from '~/components-styled/typography';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import text from '~/locale/index';
import { colors } from '~/style/theme';
import {
  formatDateFromMilliseconds,
  formatDateFromSeconds,
} from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { TimeframeOption } from '~/utils/timeframe';
import { isDateSeries, isDateSpanSeries, Value } from '../stacked-chart/logic';
import { HoverPoint, Marker, Tooltip, Trend } from './components';
import { useBisect } from './hooks/use-bisect';
import { useChartHover } from './hooks/use-chart-hover';
import { useChartPadding } from './hooks/use-chart-padding';
import { useDomains } from './hooks/use-domains';
import { useTrendValues } from './hooks/use-trend-values';
import { TrendValue } from './logic';

const dateToValue = (d: Date) => d.valueOf() / 1000;
const formatXAxis = (date: Date) =>
  formatDateFromSeconds(dateToValue(date), 'axis');
const formatYAxisFn = (y: number) => formatNumber(y);
const formatYAxisPercentageFn = (y: number) => `${formatPercentage(y)}%`;

export type LineConfig<T extends Value> = {
  metricProperty: keyof T;
  color?: string;
  style?: 'solid' | 'dashed';
  areaFillOpacity?: number;
  strokeWidth?: number;
  legendLabel?: string;
  legendShape?: LegendShape;
};

export type LineChartProps<T extends Value> = {
  values: T[];
  linesConfig: LineConfig<T>[];
  width?: number;
  height?: number;
  timeframe?: TimeframeOption;
  signaalwaarde?: number;
  formatTooltip?: (value: (T & TrendValue)[]) => React.ReactNode;
  formatXAxis?: TickFormatter<Date>;
  formatYAxis?: TickFormatter<number>;
  hideFill?: boolean;
  valueAnnotation?: string;
  isPercentage?: boolean;
  showMarkerLine?: boolean;
  formatMarkerLabel?: (value: T) => string;
  padding?: Partial<ChartPadding>;
  showLegend?: boolean;
  legendItems?: LegendItem[];
  componentCallback?: ComponentCallbackFunction;
  ariaLabelledBy?: string;
  seriesMax?: number;
};

export function LineChart<T extends Value>({
  values,
  linesConfig,
  width = 500,
  height = 250,
  /**
   * @TODO This is a weird default. The chart should show "all" by default
   * because you might not have a timeframe toggle as part of the chart. I'm
   * leaving this for later as I don't have time to break stuff now.
   */
  timeframe = '5weeks',
  signaalwaarde,
  formatTooltip,
  formatYAxis,
  hideFill = false,
  valueAnnotation,
  isPercentage,
  showMarkerLine = false,
  formatMarkerLabel,
  padding: overridePadding,
  showLegend = false,
  legendItems = showLegend
    ? linesConfig.map((x) => ({
        color: x.color ?? colors.data.primary,
        label: x.legendLabel ?? '',
        shape: x.legendShape ?? 'line',
      }))
    : undefined,
  componentCallback,
  ariaLabelledBy,
  seriesMax: overrideSeriesMax,
}: LineChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip<T & TrendValue>();

  const benchmark = useMemo(
    () =>
      signaalwaarde
        ? { value: signaalwaarde, label: text.common.barScale.signaalwaarde }
        : undefined,
    [signaalwaarde]
  );

  const trendsList = useTrendValues(values, linesConfig, timeframe);

  const [xDomain, yDomain, seriesMax] = useDomains(
    trendsList,
    signaalwaarde,
    overrideSeriesMax
  );

  const padding = useChartPadding(
    seriesMax.toFixed(0).length * 10,
    defaultPadding,
    overridePadding
  );

  const timespanMarkerData = trendsList[0];

  const xMax = width - padding.left - padding.right;
  const yMax = height - padding.top - padding.bottom;

  function getDate(x: TrendValue) {
    return x.__date;
  }

  const dateSpanScale = useMemo(
    () =>
      scaleBand<Date>({
        range: [0, xMax],
        domain: timespanMarkerData.map(getDate),
      }),
    [xMax, timespanMarkerData]
  );

  const [markerProps, setMarkerProps] = useState<{
    data: HoverPoint<T>[];
  }>();

  const toggleHoverElements = useCallback(
    (
      hide: boolean,
      hoverPoints?: HoverPoint<T>[],
      nearestPoint?: HoverPoint<T>
    ) => {
      if (hide) {
        hideTooltip();
        setMarkerProps(undefined);
      } else if (hoverPoints?.length && nearestPoint) {
        showTooltip({
          tooltipData: hoverPoints.map((x) => x.data),
          tooltipLeft: nearestPoint.x,
          tooltipTop: nearestPoint.y,
        });
        setMarkerProps({
          data: hoverPoints,
        });
      }
    },
    [showTooltip, hideTooltip]
  );

  const bisect = useBisect(padding);

  const handleHover = useChartHover(
    toggleHoverElements,
    trendsList,
    linesConfig,
    bisect
  );

  const renderTrendLines = useCallback(
    (x: ChartScales) => (
      <>
        {trendsList.map((trend, index) => (
          <Trend
            key={index}
            trend={trend}
            type={hideFill ? 'line' : 'area'}
            areaFillOpacity={linesConfig[index].areaFillOpacity}
            strokeWidth={linesConfig[index].strokeWidth}
            style={linesConfig[index].style}
            xScale={x.xScale}
            yScale={x.yScale}
            color={linesConfig[index].color}
            onHover={handleHover}
          />
        ))}
      </>
    ),
    [handleHover, linesConfig, hideFill, trendsList]
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
        <ChartAxes
          padding={padding}
          height={height}
          width={width}
          xDomain={xDomain}
          yDomain={yDomain}
          formatYAxis={
            formatYAxis
              ? formatYAxis
              : isPercentage
              ? formatYAxisPercentageFn
              : formatYAxisFn
          }
          formatXAxis={formatXAxis}
          onHover={handleHover}
          benchmark={benchmark}
          componentCallback={componentCallback}
          ariaLabelledBy={ariaLabelledBy}
          dateSpanWidth={dateSpanScale.bandwidth()}
        >
          {renderTrendLines}
        </ChartAxes>

        {isDefined(tooltipData) && (
          <Tooltip
            bounds={{ right: width, left: 0, top: 0, bottom: height }}
            x={tooltipLeft + padding.left}
            y={tooltipTop + padding.top}
          >
            {formatTooltip
              ? formatTooltip(tooltipData)
              : formatDefaultTooltip(tooltipData, isPercentage)}
          </Tooltip>
        )}

        <Box
          height={yMax}
          width={xMax}
          position="absolute"
          top={padding.top}
          left={padding.left}
          style={{
            pointerEvents: 'none',
          }}
        >
          {markerProps && (
            <Marker
              {...markerProps}
              showLine={showMarkerLine}
              formatLabel={formatMarkerLabel}
              dateSpanWidth={dateSpanScale.bandwidth()}
            />
          )}
        </Box>

        {showLegend && legendItems && (
          <Box pl={`${padding.left}px`}>
            <Legenda items={legendItems} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

function formatDefaultTooltip<T extends Value>(
  values: (T & TrendValue)[],
  isPercentage?: boolean
) {
  // default tooltip assumes one line is rendered:
  const value = values[0];
  const isDaily = isDateSeries(values);
  const isWeekly = isDateSpanSeries(values);

  if (isDateSeries(values)) {
    const value = values[0];
    return (
      <>
        <Text as="span" fontWeight="bold">
          {`${formatDateFromMilliseconds(value.__date.getTime())}: `}
        </Text>
        {isPercentage
          ? `${formatPercentage(value.__value)}%`
          : formatNumber(value.__value)}
      </>
    );
  } else if (isDateSpanSeries(values)) {
    const value = values[0];
    const dateStartString = formatDateFromSeconds(
      value.date_start_unix,
      'short'
    );
    const dateEndString = formatDateFromSeconds(value.date_end_unix, 'short');

    return (
      <>
        <Text as="span" fontWeight="bold">
          {`${dateStartString} - ${dateEndString}: `}
        </Text>
        {isPercentage
          ? `${formatPercentage(value.__value)}%`
          : formatNumber(value.__value)}
      </>
    );
  }

  throw new Error(
    `Invalid value passed to format tooltip function: ${JSON.stringify(values)}`
  );
}

function useTooltip<T extends Value>() {
  const [tooltipData, setTooltipData] = useState<T[]>();
  const [tooltipLeft, setTooltipLeft] = useState<number>();
  const [tooltipTop, setTooltipTop] = useState<number>();

  const showTooltip = useCallback(
    (x: { tooltipData: T[]; tooltipLeft: number; tooltipTop: number }) => {
      setTooltipData(x.tooltipData);
      setTooltipLeft(x.tooltipLeft);
      setTooltipTop(x.tooltipTop);
    },
    []
  );

  const hideTooltip = useCallback(() => {
    setTooltipData(undefined);
    setTooltipLeft(undefined);
    setTooltipTop(undefined);
  }, []);

  return {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    showTooltip,
    hideTooltip,
  };
}
