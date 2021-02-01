/**
 * Code loosely based on
 * https://codesandbox.io/s/github/airbnb/visx/tree/master/packages/visx-demo/src/sandboxes/visx-barstack
 */
import css from '@styled-system/css';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { BarStack } from '@visx/shape';
import { SeriesPoint } from '@visx/shape/lib/types';
/**
 * useTooltipInPortal will not work for IE11 at the moment. See this issue
 * https://github.com/airbnb/visx/issues/904
 */
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { NumberValue } from 'd3-scale';
import { isEmpty, set } from 'lodash';
import { transparentize } from 'polished';
import { MouseEvent, TouchEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { Legenda, LegendItem } from '~/components-styled/legenda';
import { InlineText } from '~/components-styled/typography';
import siteText from '~/locale';
import { colors } from '~/style/theme';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useBreakpoints } from '~/utils/useBreakpoints';
import {
  calculateSeriesMaximum,
  formatDayMonth,
  getSeriesData,
  getTotalSumForMetricProperty,
  getValuesInTimeframe,
  getWeekInfo,
  SeriesValue,
  Value,
} from './logic';

const tooltipStyles = {
  ...defaultStyles,
  padding: 0,
  zIndex: 100,
};

const NUM_TICKS = 3;
const NO_HOVER_INDEX = -1;
const NUM_1K = 1000;
const NUM_100K = 100000;
const NUM_1M = 1000000;

const tickFormatNumber = (v: NumberValue) => {
  const value1M = v.valueOf() / NUM_1M;
  const value100K = v.valueOf() / NUM_100K;

  return value1M > 1
    ? `${value1M}mln`
    : value100K > 0
    ? `${value100K}00k`
    : '0';
};
const tickFormatPercentage = (v: NumberValue) =>
  `${formatPercentage(v.valueOf())}%`;

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

export type Config<T extends Value> = {
  metricProperty: keyof T;
  color: string;
  legendLabel: string;
};

export type StackedChartProps<T extends Value> = {
  values: T[];
  config: Config<T>[];
  valueAnnotation?: string;
  width: number;
  formatTooltip?: TooltipFormatter;
  isPercentage?: boolean;
};

export function StackedChart<T extends Value>(props: StackedChartProps<T>) {
  /**
   * Destructuring here and not above, so we can easily switch between optional
   * passed-in formatter functions or their default counterparts that have the
   * same name.
   */
  const { values, config, width, isPercentage } = props;

  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
    tooltipOpen,
  } = useTooltip<TooltipData>();

  const breakpoints = useBreakpoints();
  const isExtraSmallScreen = !breakpoints.sm;
  const isTinyScreen = !breakpoints.xs;

  const padding = useMemo(
    () =>
      ({
        top: 0,
        right: isExtraSmallScreen ? 0 : 30,
        bottom: 20,
        left: 32,
      } as const),
    [isExtraSmallScreen]
  );

  const height = isExtraSmallScreen ? 200 : 400;

  const metricProperties = useMemo(() => config.map((x) => x.metricProperty), [
    config,
  ]);

  const timeframe = 'all';

  const valuesInTimeframe = useMemo(
    () => getValuesInTimeframe(values, timeframe),
    [values, timeframe]
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
   * We generate new legend items based on hover state. This is probably not a
   * very efficient way of handling this. Maybe we should break open the Legend
   * abstraction for this so that we can set the colors directly on the DOM
   * elements similar to how bars are rendered.
   */
  const legendaItems = useMemo(
    () =>
      config.map((x) => {
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
          label: x.legendLabel,
          shape: 'square',
        } as LegendItem;
      }),
    [config, hoveredIndex, metricProperties, hoverColors]
  );

  const labelByKey = useMemo(
    () =>
      config.reduce(
        (acc, x) => set(acc, x.metricProperty, x.legendLabel),
        {} as Record<string, string>
      ),
    [config]
  );

  const formatDateString = useCallback(
    (date: Date) => {
      const { weekNumber } = getWeekInfo(date);

      return isTinyScreen ? `Wk ${weekNumber}` : `Week ${weekNumber}`;
    },
    [isTinyScreen]
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
              (series as unknown) as Record<string, number>[],
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

      const isMillion = (v: number) => v / NUM_1M > 1;

      const { weekStartDate, weekEndDate } = getWeekInfo(date);

      const isTotalMillion = isMillion(seriesSumByKey[key]);
      const isWeekMillion = isMillion(data[key]);

      const allDates = series.map(getDate);

      const { weekNumber: weekNumberFrom } = getWeekInfo(allDates[0]);
      const { weekNumber: weekNumberTo } = getWeekInfo(
        allDates[allDates.length - 1]
      );

      return (
        <Box p={2} as="section" position="relative">
          <Box display="flex" alignItems="center" mb={2}>
            <Square color={color} />
            <InlineText ml={2} fontWeight="bold">
              {labelByKey[key]}
            </InlineText>
          </Box>
          <Box mb={2}>
            <InlineText fontWeight="bold">
              {`${formatDayMonth(weekStartDate)} - ${formatDayMonth(
                weekEndDate
              )}: `}
            </InlineText>
            {isWeekMillion
              ? `${formatPercentage(data[key] / NUM_1M)} mln`
              : `${formatNumber(Math.round(data[key] / NUM_1K))} k`}
          </Box>

          <Box mb={2}>
            <InlineText fontWeight="bold">
              {`${replaceVariablesInText(
                isTinyScreen
                  ? siteText.vaccinaties.verwachte_leveringen
                      .van_week_tot_week_klein_scherm
                  : siteText.vaccinaties.verwachte_leveringen.van_week_tot_week,
                { weekNumberFrom, weekNumberTo }
              )}: `}
            </InlineText>
            {isTotalMillion
              ? `${formatPercentage(seriesSumByKey[key] / NUM_1M)} mln `
              : `${formatNumber(Math.round(seriesSumByKey[key] / NUM_1K))} k `}
            {!isTinyScreen && siteText.waarde_annotaties.totaal}
          </Box>
        </Box>
      );
    },
    [labelByKey, seriesSumByKey, series, isTinyScreen]
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
  function handleHover(
    event: HoverEvent,
    tooltipData: TooltipData,
    hoverIndex: number
  ) {
    const isLeave = event.type === 'mouseleave';

    if (isLeave) {
      tooltipTimeout = window.setTimeout(() => {
        hideTooltip();
      }, 300);
      hoverTimeout = window.setTimeout(() => {
        setHoveredIndex(NO_HOVER_INDEX);
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
  }

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
    nice: true,
  }).range([yMax, 0]);

  return (
    <Box>
      <Box position="relative">
        <svg width={width} height={height} role="img">
          <Group left={padding.left} top={padding.top}>
            <GridRows
              scale={yScale}
              width={bounds.width}
              numTicks={NUM_TICKS}
              stroke={colors.data.axis}
            />
            <AxisBottom
              scale={xScale}
              tickValues={xScale.domain()}
              top={bounds.height}
              stroke={colors.data.axis}
              tickFormat={formatDateString}
              tickLabelProps={() => {
                return {
                  textAnchor: 'middle',
                  fill: colors.data.axisLabels,
                  fontSize: 12,
                };
              }}
              hideTicks
            />
            <AxisLeft
              scale={yScale}
              numTicks={4}
              hideTicks
              hideAxisLine
              stroke={colors.data.axis}
              tickFormat={
                isPercentage ? tickFormatPercentage : tickFormatNumber
              }
              tickLabelProps={() => ({
                fill: colors.data.axisLabels,
                fontSize: 12,
                dx: 0,
                textAnchor: 'end',
                verticalAnchor: 'middle',
              })}
            />
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
                    );
                  })
                )
              }
            </BarStack>
          </Group>
        </svg>

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

        <Box pl={`${padding.left}px`}>
          <Legenda items={legendaItems} />
        </Box>
      </Box>
    </Box>
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
export const TooltipContainer = styled.div(
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
