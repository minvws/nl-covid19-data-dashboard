import { TickFormatter } from '@visx/axis';
import { localPoint } from '@visx/event';
import { Point } from '@visx/point';
import { bisectLeft, extent } from 'd3-array';
import { ScaleTime } from 'd3-scale';
import { useCallback, useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
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
import { Legenda } from '../legenda';
import {
  ChartAxes,
  ChartPadding,
  ChartScales,
  defaultPadding,
  HoverPoint,
  Marker,
  Tooltip,
  Trend,
} from './components';
import {
  calculateYMax,
  getTrendData,
  isDailyValue,
  isWeeklyValue,
  NumberProperty,
  TrendValue,
  Value,
  WeeklyValue,
} from './helpers';

const dateToValue = (d: Date) => d.valueOf() / 1000;
const formatXAxis = (date: Date) =>
  formatDateFromSeconds(dateToValue(date), 'axis');
const formatYAxisFn = (y: number) => formatNumber(y);
const formatYAxisPercentageFn = (y: number) => `${formatPercentage(y)}%`;

export type LineConfig<T extends Value> = {
  metricProperty: NumberProperty<T>;
  color?: string;
  style?: 'solid' | 'dashed';
  legendLabel?: string;
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
};

export function LineChart<T extends Value>({
  values,
  linesConfig,
  width = 500,
  height = 250,
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
}: LineChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip<T & TrendValue>();

  const metricProperties = useMemo(
    () => linesConfig.map((x) => x.metricProperty),
    [linesConfig]
  );

  const benchmark = useMemo(
    () =>
      signaalwaarde
        ? { value: signaalwaarde, label: text.common.barScale.signaalwaarde }
        : undefined,
    [signaalwaarde]
  );

  const trendsList = useMemo(
    () => getTrendData(values, metricProperties, timeframe),
    [values, metricProperties, timeframe]
  );

  const xDomain = useMemo(() => {
    const allData = trendsList.flat();
    const domain = extent(allData.map((d) => d.__date));

    return isDefined(domain[0]) ? (domain as [Date, Date]) : undefined;
  }, [trendsList]);

  const yMax = useMemo(() => calculateYMax(trendsList, signaalwaarde), [
    trendsList,
    signaalwaarde,
  ]);

  const yDomain = useMemo(() => [0, yMax], [yMax]);

  const padding: ChartPadding = useMemo(() => {
    const { top, right, bottom, left } = {
      ...defaultPadding,
      ...overridePadding,
    };

    return {
      top,
      right,
      bottom,
      // Increase space for larger labels
      left: Math.max(yMax.toFixed(0).length * 10, left),
    };
  }, [overridePadding, yMax]);

  const [markerProps, setMarkerProps] = useState<{
    height: number;
    data: HoverPoint<T>[];
    padding: ChartPadding;
  }>();

  const bisect = useCallback(
    (
      trend: (TrendValue & Value)[],
      xPosition: number,
      xScale: ScaleTime<number, number>
    ) => {
      if (!trend.length) return;
      if (trend.length === 1) return trend[0];

      const date = xScale.invert(xPosition - padding.left);

      const index = bisectLeft(
        trend.map((x) => x.__date),
        date,
        1
      );

      const d0 = trend[index - 1];
      const d1 = trend[index];

      if (!d1) return d0;

      return +date - +d0.__date > +d1.__date - +date ? d1 : d0;
    },
    [padding]
  );

  const distance = (point1: HoverPoint<Value>, point2: Point) => {
    const x = point2.x - point1.x;
    const y = point2.y - point1.y;
    return Math.sqrt(x * x + y * y);
  };

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
          height,
          padding: padding,
        });
      }
    },
    [showTooltip, hideTooltip, height, padding]
  );

  const handleHover = useCallback(
    (
      event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>,
      scales: ChartScales
    ) => {
      if (!trendsList.length || event.type === 'mouseleave') {
        toggleHoverElements(true);
        return;
      }

      const { xScale, yScale } = scales;

      const point = localPoint(event);

      if (!point) {
        return;
      }

      const sortByNearest = (left: HoverPoint<T>, right: HoverPoint<T>) =>
        distance(left, point) - distance(right, point);

      const hoverPoints = trendsList
        .map((trends, index) => {
          const trendValue = bisect(trends, point.x, xScale);
          return trendValue
            ? {
                data: trendValue,
                color: linesConfig[index].color,
              }
            : undefined;
        })
        .filter(isDefined)
        .map<HoverPoint<T>>(
          ({ data, color }: { data: any; color?: string }) => {
            return {
              data,
              color,
              x: xScale(data.__date) ?? 0,
              y: yScale(data.__value) ?? 0,
            };
          }
        );
      const nearest = hoverPoints.slice().sort(sortByNearest);

      toggleHoverElements(false, hoverPoints, nearest[0]);
    },
    [bisect, trendsList, linesConfig, toggleHoverElements]
  );

  const renderAxes = useCallback(
    (x: ChartScales) => (
      <>
        {trendsList.map((trend, index) => (
          <>
            <Trend
              key={index}
              trend={trend}
              type={hideFill ? 'line' : 'area'}
              style={linesConfig[index].style}
              xScale={x.xScale}
              yScale={x.yScale}
              color={linesConfig[index].color}
              onHover={handleHover}
            />
          </>
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
        >
          {renderAxes}
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

        {markerProps && (
          <Marker
            {...markerProps}
            showLine={showMarkerLine}
            formatLabel={formatMarkerLabel}
          />
        )}

        {showLegend && (
          <Box pl={`${padding.left}px`}>
            <Legenda
              items={linesConfig.map((x) => ({
                color: x.color ?? colors.data.primary,
                label: x.legendLabel ?? '',
                shape: 'line',
              }))}
            />
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
  const isDaily = isDailyValue(values);
  const isWeekly = isWeeklyValue(values);

  if (isDaily) {
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
  } else if (isWeekly) {
    return (
      <>
        <Text as="span" fontWeight="bold">
          {formatDateFromSeconds(
            ((value as unknown) as WeeklyValue).date_start_unix,
            'short'
          )}{' '}
          -{' '}
          {formatDateFromSeconds(
            ((value as unknown) as WeeklyValue).date_end_unix,
            'short'
          )}
          :
        </Text>{' '}
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
