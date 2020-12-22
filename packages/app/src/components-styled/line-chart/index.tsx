import { useTooltip } from '@visx/tooltip';
import { extent } from 'd3-array';
import { useCallback, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { TimeframeOption } from '~/utils/timeframe';
import { calculateYMax, getTrendData, TrendValue, Value } from './helpers';
import { Chart, defaultMargin } from './chart';
import { Tooltip } from './tooltip';
import text from '~/locale/index';

const dateToValue = (d: Date) => d.valueOf() / 1000;
const formatXAxis = (date: Date) =>
  formatDateFromSeconds(dateToValue(date), 'axis');
const formatYAxisFunc = (y: number) => y.toString();

export type LineChartProps<T> = {
  values: T[];
  linesConfig: [
    {
      valueKey: keyof T;
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
  formatYAxis?: (y: number) => string;
  showFill?: boolean;
  valueAnnotation?: string;
};

export function LineChart<T extends Value>({
  values,
  linesConfig,
  width = 500,
  height = 250,
  timeframe = '5weeks',
  signaalwaarde,
  formatTooltip,
  formatYAxis = formatYAxisFunc,
  showFill = true,
  valueAnnotation,
}: LineChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip<T & TrendValue>();

  const valueKeys = linesConfig.map((x) => x.valueKey) as string[];

  const benchmark = signaalwaarde
    ? { value: signaalwaarde, label: text.common.barScale.signaalwaarde }
    : undefined;

  const trendData = useMemo(
    () => getTrendData(values, valueKeys[0], timeframe),
    [values, valueKeys, timeframe]
  );

  const xDomain = useMemo(() => {
    const domain = extent<number>(trendData.map((d) => d.date_unix));
    /**
     * Is this really needed to make xDomain strongly typed? Why would we want
     * to deal with [undefined, undefined] ?
     */
    return isDefined(domain[0])
      ? (domain as [number, number])
      : ([0, 0] as [number, number]);
  }, [trendData]);

  const yDomain = useMemo(
    () => [0, calculateYMax(values, valueKeys, signaalwaarde)],
    [values, valueKeys, signaalwaarde]
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
          formatYAxis={formatYAxis}
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
              ? formatTooltip(tooltipData as T)
              : `${formatDateFromSeconds(tooltipData.date_unix)}: ${
                  tooltipData[valueKeys[0]]
                }`}
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
