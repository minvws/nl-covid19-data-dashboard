import { TickFormatter } from '@visx/axis';
import { localPoint } from '@visx/event';
import { Point } from '@visx/point';
import { bisectLeft, extent } from 'd3-array';
import { ScaleTime } from 'd3-scale';
import { useCallback, useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import text from '~/locale/index';
import { colors } from '~/style/theme';
import {
  formatDateFromMilliseconds,
  formatDateFromSeconds
} from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { TimeframeOption } from '~/utils/timeframe';
import { Legenda } from '../legenda';
import {
  ChartAxes,
  ChartPadding,
  ChartScales,
  defaultPadding
} from './components/chart-axes';
import { Marker } from './components/marker';
import { Tooltip } from './components/tooltip';
import { Trend } from './components/trend';
import {
  calculateYMax,
  getTrendData,
  isDailyValue,
  isWeeklyValue,
  TrendValue,
  Value,
  WeeklyValue
} from './helpers';

const dateToValue = (d: Date) => d.valueOf() / 1000;
const formatXAxis = (date: Date) =>
  formatDateFromSeconds(dateToValue(date), 'axis');
const formatYAxisFn = (y: number) => y.toString();
const formatYAxisPercentageFn = (y: number) => `${formatPercentage(y)}%`;

// This type limits the allowed property names to those with a number type,
// so its like keyof T, but filtered down to only the appropriate properties.
export type NumberProperty<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

export type LineConfig<T> = {
  metricProperty: NumberProperty<T>;
  color?: string;
  legendLabel?: string;
};

export type LineChartProps<T> = {
  values: T[];
  linesConfig: LineConfig<T>[];
  width?: number;
  height?: number;
  timeframe?: TimeframeOption;
  signaalwaarde?: number;
  formatTooltip?: (value: (T & TrendValue & Value)[]) => React.ReactNode;
  formatXAxis?: TickFormatter<Date>;
  formatYAxis?: TickFormatter<number>;
  showFill?: boolean;
  valueAnnotation?: string;
  isPercentage?: boolean;
  showMarkerLine?: boolean;
  formatMarkerLabel?: (value: T) => string;
  padding?: ChartPadding;
  showLegend?: boolean;
};

export type HoverPoint<T> = {
  data: T & Value & TrendValue;
  color: string;
  x: number;
  y: number;
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
  showFill = true,
  valueAnnotation,
  isPercentage,
  showMarkerLine = false,
  formatMarkerLabel,
  padding = defaultPadding,
  showLegend = false,
}: LineChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip<T & Value & TrendValue>();

  const [markerProps, setMarkerProps] = useState<{
    height: number;
    data: HoverPoint<T>[];
    padding: ChartPadding;
  }>();

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

  const yDomain = useMemo(() => [0, calculateYMax(trendsList, signaalwaarde)], [
    trendsList,
    metricProperties,
    signaalwaarde,
  ]);

  const bisect = useCallback(
    (
      trend: (T & TrendValue & Value)[],
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

  const distance = (point1: HoverPoint<unknown>, point2: Point) => {
    const x = point2.x - point1.x;
    const y = point2.y - point1.y;
    return Math.sqrt(x * x + y * y);
  };

  const handleHover = useCallback(
    (
      event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>,
      scales: ChartScales
    ) => {
      if (!trendsList.length || event.type === 'mouseleave') {
        toggleHoverElements(true);
      }

      const { xScale, yScale } = scales;

      const point = localPoint(event) || ({ x: 0, y: 0 } as Point);

      const sortByDistance = (left: HoverPoint<T>, right: HoverPoint<T>) =>
        distance(left, point) - distance(right, point);

      const hoverPoints = trendsList
        .map((trends, index) => {
          const data = bisect(trends, point.x, xScale);
          return data
            ? {
                data,
                color: linesConfig[index].color ?? colors.data.primary,
              }
            : undefined;
        })
        .filter(isDefined)
        .map<HoverPoint<T>>(({ data, color }) => {
          return {
            data,
            color,
            x: xScale(data.__date),
            y: yScale(data.__value),
          } as HoverPoint<T>;
        })
        .sort(sortByDistance);

      toggleHoverElements(false, hoverPoints);
    },
    [bisect, trendsList]
  );

  const toggleHoverElements = useCallback(
    (hide: boolean, hoverPoints?: HoverPoint<T>[]) => {
      if (hide) {
        hideTooltip();
        //setMarkerProps(undefined);
      } else if (hoverPoints?.length) {
        const first = hoverPoints[0];
        showTooltip({
          tooltipData: hoverPoints.map((x) => x.data),
          tooltipLeft: first.x,
          tooltipTop: first.y,
        });
        setMarkerProps({
          data: hoverPoints,
          height,
          padding,
        });
      }
    },
    [showTooltip, hideTooltip]
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
          {(renderProps) => (
            <>
              {trendsList.map((trend, index) => (
                <Trend
                  trend={trend}
                  type={showFill ? 'area' : 'line'}
                  xScale={renderProps.xScale}
                  yScale={renderProps.yScale}
                  color={linesConfig[index].color ?? colors.data.primary}
                />
              ))}
            </>
          )}
        </ChartAxes>

        {isDefined(tooltipData) && (
          <Tooltip
            bounds={{ right: width, left: 0, top: 0, bottom: height }}
            x={tooltipLeft + defaultPadding.left}
            y={tooltipTop + defaultPadding.top}
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
          <Legenda
            items={linesConfig.map((x) => ({
              color: x.color ?? colors.data.primary,
              label: x.legendLabel ?? '',
              shape: 'line',
            }))}
          />
        )}
      </Box>
    </Box>
  );
}

function formatDefaultTooltip<T extends Value & TrendValue>(
  values: T[],
  isPercentage?: boolean
) {
  // default tooltip assumes one line is rendered:
  const value = values[0];
  const isDaily = isDailyValue([value]);
  const isWeekly = isWeeklyValue([value]);

  if (isDaily) {
    return `${formatDateFromMilliseconds(
      (value as TrendValue).__date.getTime()
    )}: ${
      isPercentage
        ? `${formatPercentage(value.__value)}%`
        : formatNumber(value.__value)
    }`;
  } else if (isWeekly) {
    return `${formatDateFromSeconds(
      (value as WeeklyValue).week_start_unix,
      'short'
    )} - ${formatDateFromSeconds(
      (value as WeeklyValue).week_end_unix,
      'short'
    )}: ${
      isPercentage
        ? `${formatPercentage(value.__value)}%`
        : formatNumber(value.__value)
    }`;
  }

  if (isDailyValue([value])) {
    const date = formatDateFromSeconds(
      (value as TrendValue).__date.getSeconds()
    );
    const valueStr = isPercentage
      ? `${formatPercentage(value.__value)}%`
      : formatNumber(value.__value);

    return `${date}: ${valueStr}`;
  }

  if (isWeeklyValue([value])) {
    /**
     * Type narrowing should make the cast to WeeklyValue unnecessary but
     * somehow it doesn't seem to work here.
     */
    const dateFrom = formatDateFromSeconds(
      (value as WeeklyValue).week_start_unix,
      'short'
    );
    const dateTo = formatDateFromSeconds(
      (value as WeeklyValue).week_end_unix,
      'short'
    );
    const valueStr = isPercentage
      ? `${formatPercentage(value.__value)}%`
      : formatNumber(value.__value);

    return `${dateFrom} - ${dateTo}: ${valueStr}`;
  }

  throw new Error(
    `Invalid value passed to format tooltip function: ${JSON.stringify(values)}`
  );
}

function useTooltip<T>() {
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
