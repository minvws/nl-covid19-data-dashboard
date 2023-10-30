/**
 * Code loosely based on
 * https://codesandbox.io/s/github/airbnb/visx/tree/master/packages/visx-demo/src/sandboxes/visx-barstack
 */
import { colors, getValuesInTimeframe, TimeframeOption, TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { BarStack, Line } from '@visx/shape';
import { Text } from '@visx/text';
/**
 * useTooltipInPortal will not work for IE11 at the moment. See this issue
 * https://github.com/airbnb/visx/issues/904
 */
import { useTooltip } from '@visx/tooltip';
import { isEmpty } from 'lodash';
import { MouseEvent, TouchEvent, useCallback, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { Box, Spacer } from '~/components/base';
import { Legend } from '~/components/legend';
import { ValueAnnotation } from '~/components/value-annotation';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { useCurrentDate } from '~/utils/current-date-context';
import { AccessibilityDefinition, useAccessibilityAnnotations } from '~/utils/use-accessibility-annotations';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useIsMountedRef } from '~/utils/use-is-mounted-ref';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { useResponsiveContainer } from '~/utils/use-responsive-container';
import { DateSpanMarker, Overlay, Tooltip, TooltipData, TooltipFormatter } from '../time-series-chart/components';
import { TooltipSeriesList } from '../time-series-chart/components/tooltip/tooltip-series-list';
import { calculateSeriesMaximum, getSeriesData, getWeekInfo, SeriesValue } from './logic';

type AnyTickFormatter = (value: any) => string;

/**
 * A timeout prevents the tooltip from closing directly when you move out of the
 * bar. This is needed because there is padding between the bars and the hover
 * state becomes very jittery without it.
 */
let tooltipTimeout: number;
let hoverTimeout: number;

type HoverEvent = TouchEvent<SVGElement> | MouseEvent<SVGElement>;

type Config<T extends TimestampedValue> = VisibleBarConfig<T> | InvisibleBarConfig<T>;

type VisibleBarConfig<T extends TimestampedValue> = {
  metricProperty: keyof T;
  label: string;
  color: string;
};

type InvisibleBarConfig<T extends TimestampedValue> = {
  type: 'invisible';
  metricProperty: keyof T;
  label: string;
};

type StackedChartProps<T extends TimestampedValue> = {
  accessibility: AccessibilityDefinition;
  values: T[];
  config: Config<T>[];
  valueAnnotation?: string;
  initialWidth?: number;
  disableLegend?: boolean;
  expectedLabel?: string;
  formatTooltip?: TooltipFormatter<T & StackedBarTooltipData>;
  isPercentage?: boolean;
  formatXAxis?: TickFormatter<Date>;
  formatTickValue?: (value: number) => string;
  timeframe?: TimeframeOption;
};

type BarRenderData = {
  x: number;
  width: number;
  index: number;
  color: string;
  height: number;
  key: string;
};

export type StackedBarTooltipData = {
  bar: BarRenderData;
  isHatched: boolean;
  date_unix: number;
};

/**
 * @TODO the StackedChart is very specific to the vaccine availability
 * chart so it should probably be refactored once we start re-using this
 * chart for other things.
 */
export function StackedChart<T extends TimestampedValue>(props: StackedChartProps<T>) {
  /**
   * Destructuring here and not above, so we can easily switch between optional
   * passed-in formatter functions or their default counterparts that have the
   * same name.
   */
  const {
    accessibility,
    values,
    config,
    initialWidth = 840,
    isPercentage,
    disableLegend,
    expectedLabel,
    formatTickValue: formatYTickValue,
    formatTooltip,
    valueAnnotation,
    timeframe = TimeframeOption.ALL,
  } = props;

  const breakpoints = useBreakpoints();
  const isExtraSmallScreen = !breakpoints.sm;
  const isTinyScreen = !breakpoints.xs;

  const isVisible = useCallback(function (configValue: Config<T>): configValue is VisibleBarConfig<T> {
    return !('type' in configValue);
  }, []);

  const chartConfig = useMemo(() => config.filter(isVisible), [config, isVisible]);

  const minHeight = isExtraSmallScreen ? 200 : 400;

  const { ResponsiveContainer, width, height } = useResponsiveContainer(initialWidth, minHeight);

  const { formatNumber, formatDate, formatPercentage, formatDateSpan } = useIntl();

  const annotations = useAccessibilityAnnotations(accessibility);

  const { tooltipData, tooltipLeft = 0, tooltipTop = 0, showTooltip, hideTooltip, tooltipOpen } = useTooltip<TooltipData<T & StackedBarTooltipData>>();

  const isMountedRef = useIsMountedRef();

  const [yAxisRef, yAxisSize] = useResizeObserver<SVGGElement>();

  const padding = useMemo(
    () =>
      ({
        top: 10,
        right: isExtraSmallScreen ? 0 : 30,
        bottom: 30,
        left: (yAxisSize.width ?? 0) + 10, // 10px seems to be enough padding,
      } as const),
    [isExtraSmallScreen, yAxisSize.width]
  );

  const metricProperties = useMemo(() => chartConfig.map((x) => x.metricProperty), [chartConfig]);

  const today = useCurrentDate();

  const valuesInTimeframe = useMemo(() => getValuesInTimeframe(values, timeframe, today), [values, timeframe, today]);

  const series = useMemo(() => getSeriesData(valuesInTimeframe, metricProperties), [valuesInTimeframe, metricProperties]);

  const seriesMax = useMemo(() => calculateSeriesMaximum(series), [series]);

  const colorScale = useMemo(() => {
    return scaleOrdinal<string, string>({
      domain: metricProperties as string[],
      range: chartConfig.map((x) => x.color),
    });
  }, [chartConfig, metricProperties]);

  /**
   * This is a bit of a hack for now because this chart should be replaced by
   * something more standardized anyway. We could introduce a special property
   * like is_estimate to trigger the hatched pattern in all charts.
   */
  let hatchedFromIndex = valuesInTimeframe.findIndex((v) => (v as unknown as { is_estimate?: boolean }).is_estimate === true);
  if (hatchedFromIndex < 0) {
    hatchedFromIndex = Infinity;
  }

  /**
   * We generate new legend items based on hover state. This is probably not a
   * very efficient way of handling this. Maybe we should break open the Legend
   * abstraction for this so that we can set the colors directly on the DOM
   * elements similar to how bars are rendered.
   */
  const legendItems = useMemo(() => {
    const barItems = chartConfig.map(({ color, label }) => {
      return {
        color: color,
        label: label,
        shape: 'square' as const,
      };
    });

    /**
     * @TODO this is a hard-coded addition to the chart legend. We should
     * refactor this if we ever want to re-use this component. But I think we
     * better create a new stacked start based on TimeSeriesChart components or
     * something and try to refactor this one.
     */
    return [
      ...barItems,
      expectedLabel
        ? {
            label: expectedLabel,
            shape: 'custom' as const,
            shapeComponent: <HatchedSquare />,
          }
        : undefined,
    ].filter(isDefined);
  }, [chartConfig, expectedLabel]);

  /**
   * Date range labels (eg "28 okt - 3 dec") are ~85 px wide. Use that number
   * to determine the amount of labels which should fit.
   */
  const numOfFittingLabels = Math.floor(width / 85);
  const isNarrowChart = width < 475;
  const formatDateString = useCallback(
    (date: Date, index: number, all: unknown[]) => {
      const { weekStartDate, weekEndDate } = getWeekInfo(date);
      const [start, end] = formatDateSpan(weekStartDate, weekEndDate, 'axis');

      const rangeText = `${start} - ${end}`;

      if (all.length <= numOfFittingLabels) {
        return rangeText;
      }

      const isFirst = index === 0;
      const isLast = index === all.length - 1;

      if (isNarrowChart) {
        return isFirst ? formatDate(weekStartDate, 'axis') : isLast ? formatDate(weekEndDate, 'axis') : undefined;
      }

      const modulo = Math.ceil(all.length / numOfFittingLabels);
      const showTick = index % modulo === 0 && index < all.length - modulo;

      if (isFirst || isLast || showTick) {
        return rangeText;
      }
    },
    [formatDate, formatDateSpan, isNarrowChart, numOfFittingLabels]
  );

  const defaultFormatTooltip: TooltipFormatter<T & StackedBarTooltipData> = useCallback((context: TooltipData<T & StackedBarTooltipData>) => {
    return <TooltipSeriesList data={context} />;
  }, []);

  const formatYAxis = useCallback(
    (y: number) => {
      return formatNumber(y);
    },
    [formatNumber]
  );

  const formatYAxisPercentage = useCallback(
    (y: number) => {
      return `${formatPercentage(y)}%`;
    },
    [formatPercentage]
  );

  /**
   * ========== hooks end ==========
   */

  /**
   * Every chart stack/column gets its own mouse handler, which is then tied to
   * the bar variable via closure. This bar data contains also the original
   * SeriesValue, which can be passed to the tooltip.
   */
  const handleHover = useCallback(
    function handleHover(event: HoverEvent, bar: BarRenderData) {
      const isLeave = event.type === 'mouseleave';

      if (isLeave) {
        tooltipTimeout = window.setTimeout(() => {
          if (isMountedRef.current) hideTooltip();
        }, 300);
        return;
      }

      if (tooltipTimeout) clearTimeout(tooltipTimeout);
      if (hoverTimeout) clearTimeout(hoverTimeout);

      showTooltip({
        tooltipLeft: bar.x + Math.round(bar.width / 2) + 0.5,
        tooltipTop: 0,

        tooltipData: {
          value: {
            bar,
            isHatched: bar.index >= hatchedFromIndex,
            date_unix: series[bar.index].__date.getTime() / 1000,
            ...valuesInTimeframe[bar.index],
          },
          config: config.map((x) => ({
            ...x,
            type: 'bar',
            fillOpacity: 1,
          })) as any,
          options: {
            isPercentage: false,
          },
          metricPropertyFormatters: {} as any,
          configIndex: bar.index,
        },
      });
    },
    [hideTooltip, showTooltip, isMountedRef, config, series, hatchedFromIndex, valuesInTimeframe]
  );

  if (isEmpty(series)) {
    return null;
  }

  const xMax = width - padding.left - padding.right;
  const yMax = height - padding.top - padding.bottom;

  const bounds = {
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };

  const xScale = scaleBand<Date>({
    domain: series.map(getDate),
    padding: isExtraSmallScreen ? 0.4 : 0.2,
  }).rangeRound([0, xMax]);

  const yScale = scaleLinear<number>({
    domain: [0, seriesMax],
    range: [yMax, 0],
    nice: true,
  });

  return (
    <>
      {valueAnnotation && (
        <>
          <ValueAnnotation>{valueAnnotation}</ValueAnnotation>
          <Spacer marginBottom={{ _: space[2], sm: '0' }} />
        </>
      )}
      <Box height="100%">
        <ResponsiveContainer>
          <Box position="relative">
            {annotations.descriptionElement}
            <svg {...annotations.props} width={width} viewBox={`0 0 ${width} ${height}`} css={css({ width: '100%' })} role="img">
              <HatchedPattern />

              <Group left={padding.left} top={padding.top}>
                <GridRows scale={yScale} width={bounds.width} stroke={colors.gray3} />
                <AxisBottom
                  scale={xScale}
                  tickValues={xScale.domain()}
                  top={bounds.height}
                  stroke={colors.gray3}
                  tickFormat={props.formatXAxis ?? formatDateString}
                  tickLabelProps={() => {
                    return {
                      textAnchor: 'middle',
                      fill: colors.gray6,
                      fontSize: 12,
                    };
                  }}
                  tickComponent={({ x, y, formattedValue, ...props }) =>
                    formattedValue && (
                      <>
                        <Line from={{ x, y: y - 20 }} to={{ x, y: y - 13 }} stroke={colors.gray3} strokeWidth={1} strokeLinecap="square" />
                        <Text x={x} y={y} {...props}>
                          {formattedValue}
                        </Text>
                      </>
                    )
                  }
                  hideTicks
                />
                <g ref={yAxisRef}>
                  <AxisLeft
                    scale={yScale}
                    hideTicks
                    hideAxisLine
                    stroke={colors.gray3}
                    tickFormat={
                      formatYTickValue ? (formatYTickValue as AnyTickFormatter) : isPercentage ? (formatYAxisPercentage as AnyTickFormatter) : (formatYAxis as AnyTickFormatter)
                    }
                    tickLabelProps={() => ({
                      fill: colors.gray6,
                      fontSize: 12,
                      dx: 0,
                      textAnchor: 'end',
                      verticalAnchor: 'middle',
                    })}
                  />
                </g>
                <BarStack<SeriesValue, string> data={series} keys={metricProperties as string[]} x={getDate} xScale={xScale} yScale={yScale} color={colorScale}>
                  {(barStacks) =>
                    barStacks.map((barStack) =>
                      barStack.bars.map((bar) => {
                        const barId = `bar-stack-${barStack.index}-${bar.index}`;
                        const fillColor = bar.color;

                        /**
                         * Capture the bar data for the hover handler using a
                         * closure for each bar.
                         */
                        const handleHoverWithBar = (event: HoverEvent) => handleHover(event, bar);

                        return (
                          <Group key={barId}>
                            <rect
                              id={barId}
                              key={barId}
                              x={bar.x}
                              /**
                               * Create a little gap between the stacked bars. Bars
                               * can be 0 height so we need to clip it on 0 since
                               * negative height is not allowed.
                               */
                              y={bar.y + (isTinyScreen ? 1 : 2)}
                              height={bar.height}
                              width={bar.width}
                              fill={fillColor}
                              onMouseLeave={handleHoverWithBar}
                              onMouseMove={handleHoverWithBar}
                              onTouchStart={handleHoverWithBar}
                            />
                            {bar.index >= hatchedFromIndex && (
                              <rect
                                pointerEvents="none"
                                x={bar.x}
                                /**
                                 * Create a little gap between the stacked bars. Bars
                                 * can be 0 height so we need to clip it on 0 since
                                 * negative height is not allowed.
                                 */
                                y={bar.y + (isTinyScreen ? 1 : 2)}
                                height={bar.height}
                                width={bar.width}
                                fill={breakpoints.lg ? 'url(#pattern-hatched)' : 'url(#pattern-hatched-small)'}
                                onMouseLeave={handleHoverWithBar}
                                onMouseMove={handleHoverWithBar}
                                onTouchStart={handleHoverWithBar}
                              />
                            )}
                          </Group>
                        );
                      })
                    )
                  }
                </BarStack>
              </Group>
            </svg>
          </Box>
          {tooltipOpen && tooltipData && (
            <>
              <Tooltip data={tooltipData} left={tooltipLeft} top={tooltipTop} formatTooltip={formatTooltip ?? defaultFormatTooltip} bounds={bounds} padding={padding} />
              <Overlay bounds={bounds} padding={padding}>
                <DateSpanMarker width={tooltipData.value.bar.width} point={{ x: tooltipLeft }} />
              </Overlay>
            </>
          )}
        </ResponsiveContainer>
      </Box>
      {!disableLegend && legendItems && (
        <Box paddingLeft={`${padding.left}px`}>
          <Legend items={legendItems} />
        </Box>
      )}
    </>
  );
}

/**
 * The getDate value is used to extract the Date from the SeriesValue, for
 * example to determine the xScale domain. It should not return the x-axis
 * visual label since that one is not necessarily in alphabetically sorted order
 * and that would mess up the rendering of elements.
 */
function getDate(x: SeriesValue) {
  return x.__date;
}

function HatchedSquare() {
  return (
    <svg height="15px" width="15px">
      <rect height="15px" width="15px" fill={colors.gray5} />
      <rect height="15px" width="15px" fill="url(#pattern-hatched-small)" />
    </svg>
  );
}

function HatchedPattern() {
  const SIZE_LARGE = 8;
  const SIZE_SMALL = 4;

  return (
    <defs>
      <pattern id="pattern-hatched" width={SIZE_LARGE} height={SIZE_LARGE} patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2={SIZE_LARGE} style={{ stroke: 'white', strokeWidth: 4 }} />
      </pattern>
      <pattern id="pattern-hatched-small" width={SIZE_SMALL} height={SIZE_SMALL} patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2={SIZE_SMALL} style={{ stroke: 'white', strokeWidth: 3 }} />
      </pattern>
    </defs>
  );
}
