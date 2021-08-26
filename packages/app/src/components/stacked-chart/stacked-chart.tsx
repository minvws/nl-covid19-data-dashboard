/**
 * Code loosely based on
 * https://codesandbox.io/s/github/airbnb/visx/tree/master/packages/visx-demo/src/sandboxes/visx-barstack
 */
import {
  getValuesInTimeframe,
  TimeframeOption,
  TimestampedValue,
} from '@corona-dashboard/common';
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
import { Box, Spacer } from '~/components/base';
import { Legend } from '~/components/legend';
import { ValueAnnotation } from '~/components/value-annotation';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { useCurrentDate } from '~/utils/current-date-context';
import {
  AccessibilityDefinition,
  useAccessibilityAnnotations,
} from '~/utils/use-accessibility-annotations';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useIsMountedRef } from '~/utils/use-is-mounted-ref';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { useResponsiveContainer } from '~/utils/use-responsive-container';
import { Tooltip, TooltipData } from '../time-series-chart/components';
import { TooltipSeriesList } from '../time-series-chart/components/tooltip/tooltip-series-list';
import {
  calculateSeriesMaximum,
  getSeriesData,
  getWeekInfo,
  SeriesValue,
} from './logic';

type AnyTickFormatter = (value: any) => string;

/**
 * A timeout prevents the tooltip from closing directly when you move out of the
 * bar. This is needed because there is padding between the bars and the hover
 * state becomes very jittery without it.
 */
let tooltipTimeout: number;
let hoverTimeout: number;

/**
 * The TooltipFormatter returns the content for the tooltip.
 *
 * By passing the SeriesValue (which is an object with all trend values that are
 * showing in the chart with the date), plus the key for which the hover is
 * showing data, the formatter has all the information it needs to render any
 * kind of tooltip
 */
type TooltipFormatter = (
  value: SeriesValue,
  key: string,
  color?: string
) => JSX.Element;

type HoverEvent = TouchEvent<SVGElement> | MouseEvent<SVGElement>;

type Config<T extends TimestampedValue> = {
  metricProperty: keyof T;
  label: string;
  color: string;
};

type StackedChartProps<T extends TimestampedValue> = {
  accessibility: AccessibilityDefinition;
  values: T[];
  config: Config<T>[];
  valueAnnotation?: string;
  initialWidth?: number;
  expectedLabel: string;
  formatTooltip?: TooltipFormatter;
  isPercentage?: boolean;
  formatXAxis?: TickFormatter<Date>;
  formatTickValue?: (value: number) => string;
  timeframe?: TimeframeOption;
};

/**
 * @TODO the StackedChart is very specific to the vaccine availability
 * chart so it should probably be refactored once we start re-using this
 * chart for other things.
 */
export function StackedChart<T extends TimestampedValue>(
  props: StackedChartProps<T>
) {
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
    expectedLabel,
    formatTickValue: formatYTickValue,
    valueAnnotation,
    timeframe = 'all',
  } = props;

  const breakpoints = useBreakpoints();
  const isExtraSmallScreen = !breakpoints.sm;
  const isTinyScreen = !breakpoints.xs;

  const minHeight = isExtraSmallScreen ? 200 : 400;

  const { ResponsiveContainer, width, height } = useResponsiveContainer(
    initialWidth,
    minHeight
  );

  const { formatNumber, formatDate, formatPercentage, formatDateSpan } =
    useIntl();

  const annotations = useAccessibilityAnnotations(accessibility);

  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
    tooltipOpen,
  } = useTooltip<TooltipData<T>>();

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

  const metricProperties = useMemo(
    () => config.map((x) => x.metricProperty),
    [config]
  );

  const today = useCurrentDate();

  const valuesInTimeframe = useMemo(
    () => getValuesInTimeframe(values, timeframe, today),
    [values, timeframe, today]
  );

  const series = useMemo(
    () => getSeriesData(valuesInTimeframe, metricProperties),
    [valuesInTimeframe, metricProperties]
  );

  const seriesMax = useMemo(() => calculateSeriesMaximum(series), [series]);

  const colorScale = useMemo(() => {
    return scaleOrdinal<string, string>({
      domain: metricProperties as string[],
      range: config.map((x) => x.color),
    });
  }, [config, metricProperties]);

  /**
   * This is a bit of a hack for now because this chart should be replaced by
   * something more standardized anyway. We could introduce a special property
   * like is_estimate to trigger the hatched pattern in all charts.
   */
  const hatchedFromIndex = valuesInTimeframe.findIndex(
    (v) => (v as unknown as { is_estimate?: boolean }).is_estimate === true
  );

  /**
   * We generate new legend items based on hover state. This is probably not a
   * very efficient way of handling this. Maybe we should break open the Legend
   * abstraction for this so that we can set the colors directly on the DOM
   * elements similar to how bars are rendered.
   */
  const legendaItems = useMemo(() => {
    const barItems = config.map(({ color, label }) => {
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
      {
        label: expectedLabel,
        shape: 'custom' as const,
        shapeComponent: <HatchedSquare />,
      },
    ];
  }, [config, expectedLabel]);

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
        return isFirst
          ? formatDate(weekStartDate, 'axis')
          : isLast
          ? formatDate(weekEndDate, 'axis')
          : undefined;
      }

      const modulo = Math.ceil(all.length / numOfFittingLabels);
      const showTick = index % modulo === 0 && index < all.length - modulo;

      if (isFirst || isLast || showTick) {
        return rangeText;
      }
    },
    [formatDate, formatDateSpan, isNarrowChart, numOfFittingLabels]
  );

  const formatTooltip2: any = useCallback((context: SeriesValue) => {
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
    function handleHover(
      event: HoverEvent,
      bar: { width: number; x: number; index: number }
    ) {
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
          /**
           * The tooltip gets passed the original data value, plus the
           * nearest/active hover property and the full series configuration.
           * With these three arguments we should be able to render any sort of
           * tooltip.
           *
           * If we are hovering a timespanAnnotation, we use that data to cut
           * out any property values that should be blocked from the tooltip.
           */
          value: {
            date_unix: series[bar.index].__date.getTime() / 1000,
            ...series[bar.index],
          } as any,
          config: config.map((x) => ({ ...x, type: 'bar' })) as any,
          options: {
            isPercentage: false,
          },
          metricPropertyFormatters: {} as any,
          configIndex: bar.index,
        },
      });
    },
    [hideTooltip, showTooltip, isMountedRef, config, series]
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
          <Spacer mb={{ _: 2, sm: 0 }} />
        </>
      )}
      <Box height="100%">
        <ResponsiveContainer>
          <Box position="relative">
            {annotations.descriptionElement}
            <svg
              {...annotations.props}
              width={width}
              viewBox={`0 0 ${width} ${height}`}
              css={css({ width: '100%' })}
              role="img"
            >
              <HatchedPattern />

              <Group left={padding.left} top={padding.top}>
                <GridRows
                  scale={yScale}
                  width={bounds.width}
                  stroke={colors.data.axis}
                />
                <AxisBottom
                  scale={xScale}
                  tickValues={xScale.domain()}
                  top={bounds.height}
                  stroke={colors.data.axis}
                  tickFormat={props.formatXAxis ?? formatDateString}
                  tickLabelProps={() => {
                    return {
                      textAnchor: 'middle',
                      fill: colors.data.axisLabels,
                      fontSize: 12,
                    };
                  }}
                  tickComponent={({ x, y, formattedValue, ...props }) =>
                    formattedValue && (
                      <>
                        <Line
                          from={{ x, y: y - 20 }}
                          to={{ x, y: y - 13 }}
                          stroke={colors.data.axis}
                          strokeWidth={1}
                          strokeLinecap="square"
                        />
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
                    stroke={colors.data.axis}
                    tickFormat={
                      formatYTickValue
                        ? (formatYTickValue as AnyTickFormatter)
                        : isPercentage
                        ? (formatYAxisPercentage as AnyTickFormatter)
                        : (formatYAxis as AnyTickFormatter)
                    }
                    tickLabelProps={() => ({
                      fill: colors.data.axisLabels,
                      fontSize: 12,
                      dx: 0,
                      textAnchor: 'end',
                      verticalAnchor: 'middle',
                    })}
                  />
                </g>
                <BarStack<SeriesValue, string>
                  data={series}
                  keys={metricProperties as string[]}
                  x={getDate}
                  xScale={xScale}
                  yScale={yScale}
                  color={colorScale}
                >
                  {(barStacks) =>
                    barStacks.map((barStack) =>
                      barStack.bars.map((bar) => {
                        const barId = `bar-stack-${barStack.index}-${bar.index}`;
                        const fillColor = bar.color;

                        /**
                         * Capture the bar data for the hover handler using a
                         * closure for each bar.
                         */
                        const handleHoverWithBar = (event: HoverEvent) =>
                          handleHover(event, bar);

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
                              height={Math.max(
                                0,
                                bar.height - (isTinyScreen ? 1 : 2)
                              )}
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
                                height={Math.max(
                                  0,
                                  bar.height - (isTinyScreen ? 1 : 2)
                                )}
                                width={bar.width}
                                fill={
                                  breakpoints.lg
                                    ? 'url(#pattern-hatched)'
                                    : 'url(#pattern-hatched-small)'
                                }
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
            <Tooltip
              data={tooltipData}
              left={tooltipLeft}
              top={tooltipTop}
              formatTooltip={formatTooltip2}
              bounds={bounds}
              padding={padding}
            />
          )}
        </ResponsiveContainer>
      </Box>
      <Box pl={`${padding.left}px`}>
        <Legend items={legendaItems} />
      </Box>
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
    <svg height="15" width="15">
      <rect height="15" width="15" fill={colors.gray} />
      <rect height="15" width="15" fill="url(#pattern-hatched-small)" />
    </svg>
  );
}

function HatchedPattern() {
  const SIZE_LARGE = 8;
  const SIZE_SMALL = 4;

  return (
    <defs>
      <pattern
        id="pattern-hatched"
        width={SIZE_LARGE}
        height={SIZE_LARGE}
        patternTransform="rotate(-45 0 0)"
        patternUnits="userSpaceOnUse"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={SIZE_LARGE}
          style={{ stroke: 'white', strokeWidth: 4 }}
        />
      </pattern>
      <pattern
        id="pattern-hatched-small"
        width={SIZE_SMALL}
        height={SIZE_SMALL}
        patternTransform="rotate(-45 0 0)"
        patternUnits="userSpaceOnUse"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={SIZE_SMALL}
          style={{ stroke: 'white', strokeWidth: 3 }}
        />
      </pattern>
    </defs>
  );
}
