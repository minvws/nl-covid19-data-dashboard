import { TickFormatter } from '@visx/axis';
import { extent } from 'd3-array';
import { useCallback, useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import text from '~/locale/index';
import {
  formatDateFromMilliseconds,
  formatDateFromSeconds,
} from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { TimeframeOption } from '~/utils/timeframe';
import {
  Chart,
  ChartPadding,
  defaultPadding,
  HoverPoint,
} from './components/chart';
import { Marker } from './components/marker';
import { Tooltip } from './components/tooltip';
import {
  calculateYMax,
  getTrendData,
  isDailyValue,
  isWeeklyValue,
  TrendValue,
  Value,
  WeeklyValue,
} from './helpers';

const dateToValue = (d: Date) => d.valueOf() / 1000;
const formatXAxis = (date: Date) =>
  formatDateFromSeconds(dateToValue(date), 'axis');
const formatYAxisFn = (y: number) => y.toString();
const formatYAxisPercentageFn = (y: number) => `${formatPercentage(y)}%`;

export type LineChartProps<T> = {
  values: T[];
  linesConfig: [
    {
      metricProperty: keyof T;
      /**
       * For later when implementing multi line charts
       */
      color?: string;
    }
  ];
  width?: number;
  height?: number;
  timeframe?: TimeframeOption;
  signaalwaarde?: number;
  formatTooltip?: (value: T) => React.ReactNode;
  formatXAxis?: TickFormatter<Date>;
  formatYAxis?: TickFormatter<number>;
  showFill?: boolean;
  valueAnnotation?: string;
  isPercentage?: boolean;
  showMarkerLine?: boolean;
  formatMarkerLabel?: (value: T) => string;
  padding?: ChartPadding;
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
}: LineChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip<T & TrendValue>();

  const [markerProps, setMarkerProps] = useState<{
    height: number;
    data: HoverPoint[];
    padding: ChartPadding;
  }>();

  const metricProperties = useMemo(
    () => linesConfig.map((x) => x.metricProperty) as string[],
    [linesConfig]
  );

  const benchmark = useMemo(
    () =>
      signaalwaarde
        ? { value: signaalwaarde, label: text.common.barScale.signaalwaarde }
        : undefined,
    [signaalwaarde]
  );

  const trendData = useMemo(
    () => getTrendData(values, metricProperties[0], timeframe),
    [values, metricProperties, timeframe]
  );

  const xDomain = useMemo(() => {
    const domain = extent(trendData.map((d) => d.__date));

    return isDefined(domain[0]) ? (domain as [Date, Date]) : undefined;
  }, [trendData]);

  const yDomain = useMemo(
    () => [0, calculateYMax(trendData, metricProperties, signaalwaarde)],
    [trendData, metricProperties, signaalwaarde]
  );

  const handleHover = useCallback(
    (
      event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>,
      hoverPoints?: any[]
    ) => {
      if (event.type === 'mouseleave') {
        hideTooltip();
        setMarkerProps(undefined);
      } else if (hoverPoints) {
        const last = hoverPoints[hoverPoints.length - 1];
        showTooltip({
          tooltipData: last.data,
          tooltipLeft: last.x,
          tooltipTop: last.y,
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
        <Chart
          trend={trendData}
          type={showFill ? 'area' : 'line'}
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
          isHovered={!!tooltipData}
          benchmark={benchmark}
        />

        {isDefined(tooltipData) && (
          <Tooltip
            bounds={{ right: width, left: 0, top: 0, bottom: height }}
            x={tooltipLeft + defaultPadding.left}
            y={tooltipTop + defaultPadding.top}
          >
            {formatTooltip
              ? formatTooltip(tooltipData)
              : formatDefaultTooltip(
                  (tooltipData as unknown) as Value & TrendValue,
                  isPercentage
                )}
          </Tooltip>
        )}

        {markerProps && (
          <Marker
            {...markerProps}
            showLine={showMarkerLine}
            formatLabel={formatMarkerLabel}
          />
        )}
      </Box>
    </Box>
  );
}

function formatDefaultTooltip<T extends Value & TrendValue>(
  value: T,
  isPercentage?: boolean
) {
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
    `Invalid value passed to format tooltip function: ${JSON.stringify(value)}`
  );
}

function useTooltip<T>() {
  const [tooltipData, setTooltipData] = useState<T>();
  const [tooltipLeft, setTooltipLeft] = useState<number>();
  const [tooltipTop, setTooltipTop] = useState<number>();

  const showTooltip = useCallback(
    (x: { tooltipData: T; tooltipLeft: number; tooltipTop: number }) => {
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
