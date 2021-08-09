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
import { localPoint } from '@visx/event';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { BarStack, Line } from '@visx/shape';
import { SeriesPoint } from '@visx/shape/lib/types';
import { Text } from '@visx/text';
/**
 * useTooltipInPortal will not work for IE11 at the moment. See this issue
 * https://github.com/airbnb/visx/issues/904
 */
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { isEmpty, set } from 'lodash';
import { transparentize } from 'polished';
import { MouseEvent, TouchEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box, Spacer } from '~/components/base';
import { Legend } from '~/components/legend';
import { InlineText } from '~/components/typography';
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
import {
  calculateSeriesMaximum,
  getSeriesData,
  getTotalSumForMetricProperty,
  getWeekInfo,
  SeriesValue,
} from './logic';

const tooltipStyles = {
  ...defaultStyles,
  padding: 0,
  zIndex: 100,
};

const NO_HOVER_INDEX = -1;

type AnyTickFormatter = (value: any) => string;

/**
 * A timeout prevents the tooltip from closing directly when you move out of the
 * bar. This is needed because there is padding between the bars and the hover
 * state becomes very jittery without it.
 */
let tooltipTimeout: number;
let hoverTimeout: number;

/**
 * The TooltipData is used by the hover handler to show and position the
 * Tooltip. A subsection of this data is then passed on to the ToolTipFormatter,
 * since that function only requires information to render its contents which
 * isn't position dependent.
 */
type TooltipData = {
  bar: SeriesPoint<SeriesValue>;
  key: string;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

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

  const {
    siteText,
    formatNumber,
    formatDate,
    formatPercentage,
    formatDateSpan,
  } = useIntl();

  const annotations = useAccessibilityAnnotations(accessibility);

  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
    tooltipOpen,
  } = useTooltip<TooltipData>();

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

  const [hoveredIndex, setHoveredIndex] = useState(NO_HOVER_INDEX);

  const colorScale = useMemo(() => {
    return scaleOrdinal<string, string>({
      domain: metricProperties as string[],
      range: config.map((x) => x.color),
    });
  }, [config, metricProperties]);

  const hoverColors = useMemo(
    () => config.map((x) => transparentize(0.6, x.color)),
    [config]
  );

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
    const barItems = config.map((x) => {
      const itemIndex = metricProperties.findIndex(
        (v) => v === x.metricProperty
      );

      return {
        color:
          hoveredIndex === NO_HOVER_INDEX
            ? x.color
            : hoveredIndex === itemIndex
            ? x.color
            : hoverColors[itemIndex],
        label: x.label,
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
  }, [config, hoveredIndex, metricProperties, hoverColors, expectedLabel]);

  const labelByKey = useMemo(
    () =>
      config.reduce(
        (acc, x) => set(acc, x.metricProperty, x.label),
        {} as Record<string, string>
      ),
    [config]
  );

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

  /**
   * Calculate the sum of every property over the whole x-axis range.
   *
   * @TODO this logic is probably very specific to the vaccine availability
   * chart so it should probably be moved outside once we start re-using this
   * stacked chart for other things.
   */
  const seriesSumByKey = useMemo(
    () =>
      config.reduce(
        (acc, x) =>
          set(
            acc,
            x.metricProperty,
            getTotalSumForMetricProperty(
              series as unknown as Record<string, number>[],
              x.metricProperty as string
            )
          ),
        {} as Record<string, number>
      ),
    [config, series]
  );

  /**
   * This format function should be moved outside of the chart if we want to
   * make this component reusable. But it depends on a lot of calculated data
   * like seriesSum and labelByKey, so it would make the calling context quite
   * messy if not done in a good way.
   *
   * I'm leaving that as an exercise for later.
   */
  const formatTooltip = useCallback(
    (data: SeriesValue, key: string, color: string) => {
      const date = getDate(data);

      const { weekStartDate, weekEndDate } = getWeekInfo(date);

      const allDates = series.map(getDate);

      const { weekStartDate: weekStartDateAll } = getWeekInfo(allDates[0]);
      const { weekEndDate: weekEndDateAll } = getWeekInfo(
        allDates[allDates.length - 1]
      );

      const [startSingle, endSingle] = formatDateSpan(
        weekStartDate,
        weekEndDate,
        'axis'
      );
      const [startAll, endAll] = formatDateSpan(
        weekStartDateAll,
        weekEndDateAll,
        'axis'
      );

      return (
        <Box p={2} as="section" position="relative" spacing={2}>
          <Box display="flex" alignItems="center" mb={2} spacingHorizontal={2}>
            <Square color={color} />
            <InlineText fontWeight="bold">{labelByKey[key]}</InlineText>
          </Box>
          <Box>
            <InlineText fontWeight="bold">{`${startSingle} - ${endSingle}: `}</InlineText>
            {formatNumber(data[key])}
          </Box>
          <Box>
            <InlineText fontWeight="bold">{`${startAll} - ${endAll}: `}</InlineText>
            {formatNumber(seriesSumByKey[key])}
            {!isTinyScreen && ' ' + siteText.waarde_annotaties.totaal}
          </Box>
        </Box>
      );
    },
    [
      series,
      formatDateSpan,
      labelByKey,
      formatNumber,
      seriesSumByKey,
      isTinyScreen,
      siteText.waarde_annotaties.totaal,
    ]
  );

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
   *
   * @TODO wrap in useCallback?
   */
  const handleHover = useCallback(
    function handleHover(
      event: HoverEvent,
      tooltipData: TooltipData,
      hoverIndex: number
    ) {
      const isLeave = event.type === 'mouseleave';

      if (isLeave) {
        tooltipTimeout = window.setTimeout(() => {
          if (isMountedRef.current) hideTooltip();
        }, 300);
        hoverTimeout = window.setTimeout(() => {
          if (isMountedRef.current) setHoveredIndex(NO_HOVER_INDEX);
        }, 300);
        return;
      }

      if (tooltipTimeout) clearTimeout(tooltipTimeout);
      if (hoverTimeout) clearTimeout(hoverTimeout);

      setHoveredIndex(hoverIndex);

      // @ts-expect-error
      const coords = localPoint(event.target.ownerSVGElement, event);
      showTooltip({
        tooltipLeft: coords?.x || 0,
        tooltipTop: coords?.y || 0,
        tooltipData,
      });
    },
    [hideTooltip, showTooltip, isMountedRef]
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
          <Spacer mb={2} />
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
                        const fillColor =
                          hoveredIndex === NO_HOVER_INDEX
                            ? bar.color
                            : barStack.index === hoveredIndex
                            ? bar.color
                            : hoverColors[barStack.index];

                        /**
                         * Capture the bar data for the hover handler using a
                         * closure for each bar.
                         */
                        const handleHoverWithBar = (event: HoverEvent) =>
                          handleHover(event, bar, barStack.index);

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
            <TooltipWithBounds
              left={tooltipLeft}
              top={tooltipTop}
              style={tooltipStyles}
              offsetLeft={isTinyScreen ? 0 : 10}
            >
              <TooltipContainer>
                {props.formatTooltip
                  ? props.formatTooltip(
                      tooltipData.bar.data,
                      tooltipData.key,
                      tooltipData.color
                    )
                  : formatTooltip(
                      tooltipData.bar.data,
                      tooltipData.key,
                      tooltipData.color
                    )}
              </TooltipContainer>
            </TooltipWithBounds>
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

/**
 * TooltipContainer from LineChart did not seem to be very compatible with the
 * design for this chart, so this is something to look at later.
 */
const TooltipContainer = styled.div(
  css({
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    minWidth: 72,
    color: 'body',
    backgroundColor: 'white',
    lineHeight: 2,
    borderColor: 'border',
    borderWidth: '1px',
    borderStyle: 'solid',
    px: 2,
    py: 1,
    fontSize: 1,
  })
);

const Square = styled.span<{ color: string }>((x) =>
  css({
    display: 'inline-block',
    backgroundColor: x.color,
    width: 15,
    height: 15,
  })
);

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
