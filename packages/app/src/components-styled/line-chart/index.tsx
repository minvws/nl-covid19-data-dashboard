import { TickFormatter } from '@visx/axis';
import { useTooltip } from '@visx/tooltip';
import { extent } from 'd3-array';
import { useCallback, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import text from '~/locale/index';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { TimeframeOption } from '~/utils/timeframe';
import { Chart, defaultMargin } from './chart';
import {
  calculateYMax,
  getTrendData,
  isDailyValue,
  isWeeklyValue,
  TrendValue,
  Value,
  WeeklyValue,
} from './helpers';
import { Tooltip } from './tooltip';

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
}: LineChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip<T & TrendValue>();

  const metricProperties = linesConfig.map((x) => x.metricProperty) as string[];

  const benchmark = signaalwaarde
    ? { value: signaalwaarde, label: text.common.barScale.signaalwaarde }
    : undefined;

  const trendData = useMemo(
    () => getTrendData(values, metricProperties[0], timeframe),
    [values, metricProperties, timeframe]
  );

  const xDomain = useMemo(() => {
    const domain = extent(trendData.map((d) => d.__date));

    return isDefined(domain[0]) ? (domain as [Date, Date]) : undefined;
  }, [trendData]);

  const yDomain = useMemo(
    () => [0, calculateYMax(values, metricProperties, signaalwaarde)],
    [values, metricProperties, signaalwaarde]
  );

  const handleHover = useCallback(
    (
      event:
        | React.TouchEvent<SVGRectElement>
        | React.MouseEvent<SVGRectElement>,
      data,
      xPosition,
      yPosition
    ) => {
      if (event.type === 'mouseleave') {
        hideTooltip();
      } else {
        showTooltip({
          tooltipData: data,
          tooltipLeft: xPosition,
          tooltipTop: yPosition,
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
            x={tooltipLeft + defaultMargin.left}
            y={tooltipTop + defaultMargin.top}
          >
            {formatTooltip
              ? formatTooltip(tooltipData)
              : formatStandardTooltip(
                  (tooltipData as unknown) as Value & TrendValue,
                  isPercentage
                )}
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

function formatStandardTooltip<T extends Value & TrendValue>(
  value: T,
  isPercentage?: boolean
) {
  const isDaily = isDailyValue([value]);
  const isWeekly = isWeeklyValue([value]);

  if (isDaily) {
    return `${formatDateFromSeconds(
      (value as TrendValue).__date.getSeconds()
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

  throw new Error(
    `Invalid value passed to format tooltip function: ${JSON.stringify(value)}`
  );
}
