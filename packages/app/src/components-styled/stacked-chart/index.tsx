import { TickFormatter } from '@visx/axis';
import { extent } from 'd3-array';
import { useCallback, useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { colors } from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { Legenda } from '../legenda';
import {
  ChartAxes,
  ChartPadding,
  ChartScales,
  defaultPadding,
  HoverPoint,
  Marker,
  Tooltip,
} from './components';
import { calculateYMax, NumberProperty, TrendValue, Value } from './helpers';

const dateToValue = (d: Date) => d.valueOf() / 1000;
const formatXAxis = (date: Date) =>
  formatDateFromSeconds(dateToValue(date), 'axis');
const formatYAxisFn = (y: number) => formatNumber(y);
const formatYAxisPercentageFn = (y: number) => `${formatPercentage(y)}%`;

export type Config<T extends Value> = {
  metricProperty: NumberProperty<T>;
  color: string;
  legendLabel: string;
};

export type StackedChartProps<T extends Value> = {
  values: T[];
  config: Config<T>;
  valueAnnotation?: string;
  width?: number;
  height?: number;
  formatTooltip?: (value: (T & TrendValue)[]) => React.ReactNode;
  formatXAxis?: TickFormatter<Date>;
  formatYAxis?: TickFormatter<number>;
  isPercentage?: boolean;
};

export function StackedChart<T extends Value>({
  config,
  width = 500,
  height = 250,
  valueAnnotation,
  formatTooltip,
  formatYAxis,
  isPercentage,
}: StackedChartProps<T>) {
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip<T & TrendValue>();

  const xDomain = useMemo(() => {
    // const allData = trendsList.flat();
    const domain = extent(allData.map((d) => d.__date));

    return isDefined(domain[0]) ? (domain as [Date, Date]) : undefined;
  }, [trendsList]);

  const yMax = useMemo(() => calculateYMax(trendsList, signaalwaarde), [
    trendsList,
    signaalwaarde,
  ]);

  const yDomain = useMemo(() => [0, yMax], [yMax]);

  const renderBars = useCallback(
    (x: ChartScales) => (
      <>
        <div>I am a bar {x} </div>
      </>
    ),
    []
  );

  if (!xDomain) {
    return null;
  }

  const padding = defaultPadding;

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
          // benchmark={benchmark}
        >
          {renderBars}
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

        <Box pl={`${padding.left}px`}>
          <Legenda
            items={config.map((x) => ({
              color: x.color ?? colors.data.primary,
              label: x.legendLabel ?? '',
              shape: 'line',
            }))}
          />
        </Box>
      </Box>
    </Box>
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
