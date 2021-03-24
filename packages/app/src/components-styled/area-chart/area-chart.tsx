import { TimestampedValue } from '@corona-dashboard/common';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Line } from '@visx/shape';
import { Text } from '@visx/text';
import { ScaleTime } from 'd3-scale';
import { memo, MouseEvent, TouchEvent, useCallback, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import {
  ChartBounds,
  ChartPadding,
  HoverPoint,
} from '~/components-styled/line-chart/components';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { useIntl } from '~/intl';
import theme from '~/style/theme';
import { TimeframeOption } from '~/utils/timeframe';
import { useElementSize } from '~/utils/use-element-size';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { LegendShape } from '../legend';
import {
  AreaChartGraph,
  AreaConfig,
  AreaDisplay,
} from './components/area-chart-graph';
import { Marker } from './components/marker';
import { Tooltip } from './components/tooltip';
import { useAreaConfigs } from './hooks/use-area-configs';
import { useBisect } from './hooks/use-bisect';
import { useChartHover } from './hooks/use-chart-hover';
import { useChartPadding } from './hooks/use-chart-padding';
import { useDomains } from './hooks/use-domains';
import { useTooltip } from './hooks/use-tooltip';
import { useTrendConfigs } from './hooks/use-trend-configs';
import { TimestampedTrendValue } from './logic';

const NUM_TICKS = 3;

const defaultPadding: ChartPadding = {
  top: 10,
  right: 20,
  bottom: 30,
  left: 15,
};

export type TrendDisplay<T> = {
  metricProperty: keyof T;
  color?: string;
  style?: 'solid' | 'dashed';
  areaFill?: boolean;
  areaFillOpacity?: number;
  strokeWidth?: number;
  legendLabel?: string;
  legendShape?: LegendShape;
};

export type TrendDescriptor<T> = {
  values: T[];
  displays: TrendDisplay<T>[];
};

export type AreaDescriptor<T> = {
  values: T[];
  displays: AreaDisplay<T>[];
};

export type DividerConfig = {
  color: string;
  leftLabel: string;
  rightLabel: string;
};

type AreaChartProps<T extends TimestampedValue, K extends TimestampedValue> = {
  formatTooltip: (
    values: HoverPoint<
      (T & TimestampedTrendValue) | (K & TimestampedTrendValue)
    >[],
    isPercentage?: boolean
  ) => React.ReactNode;
  initialWidth?: number;
  trends: TrendDescriptor<T>[];
  areas: AreaDescriptor<K>[];
  valueAnnotation?: string;
  timeframe?: TimeframeOption;
  padding?: Partial<ChartPadding>;
  signaalwaarde?: number;
  isPercentage?: boolean;
  divider?: DividerConfig;
};

export function AreaChart<
  T extends TimestampedValue,
  K extends TimestampedValue
>(props: AreaChartProps<T, K>) {
  const { formatDateFromSeconds, formatNumber, formatPercentage } = useIntl();

  const dateToValue = (d: { valueOf(): number }) => d.valueOf() / 1000;
  const formatXAxis = (date: Date | { valueOf(): number }) =>
    formatDateFromSeconds(dateToValue(date), 'axis');
  const formatYAxisFn = (y: number) => formatNumber(y / 1000000);
  const formatYAxisPercentageFn = (y: number) => `${formatPercentage(y)}%`;

  const {
    trends,
    areas,
    initialWidth = 840,
    valueAnnotation,
    timeframe = 'all',
    padding: overridePadding,
    signaalwaarde,
    isPercentage = false,
    divider,
    formatTooltip,
  } = props;
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip<
    HoverPoint<(T & TimestampedTrendValue) | (K & TimestampedTrendValue)>
  >();

  const [sizeRef, { width }] = useElementSize<HTMLDivElement>(initialWidth);

  const breakpoints = useBreakpoints(true);
  const trendConfigs = useTrendConfigs(trends, timeframe);
  const areaConfigs = useAreaConfigs(areas, timeframe);

  const isExtraSmallScreen = !breakpoints.sm;
  const height = isExtraSmallScreen ? 200 : 400;

  const allValues = [
    ...trendConfigs.map((x) => x.values).flat(),
    ...areaConfigs.map((x) => x.values).flat(),
  ];

  const [xDomain, yDomain] = useDomains(allValues, signaalwaarde);

  const padding = useChartPadding(0, defaultPadding, overridePadding);

  const xMax = width - padding.left - padding.right;
  const yMax = height - padding.top - padding.bottom;

  const [markerProps, setMarkerProps] = useState<{
    data: HoverPoint<
      (T & TimestampedTrendValue) | (K & TimestampedTrendValue)
    >[];
  }>();

  const toggleHoverElements = useCallback(
    (
      hide: boolean,
      hoverPoints?: HoverPoint<
        (T & TimestampedTrendValue) | (K & TimestampedTrendValue)
      >[],
      nearestPoint?: HoverPoint<
        (T & TimestampedTrendValue) | (K & TimestampedTrendValue)
      >
    ) => {
      if (hide) {
        hideTooltip();
        setMarkerProps(undefined);
      } else if (hoverPoints?.length && nearestPoint) {
        showTooltip({
          tooltipData: hoverPoints,
          tooltipLeft: nearestPoint.x,
          tooltipTop: nearestPoint.y,
        });
        setMarkerProps({
          data: [nearestPoint],
        });
      }
    },
    [showTooltip, hideTooltip]
  );

  const bisect = useBisect(padding);

  const onHover = useChartHover(
    toggleHoverElements,
    trendConfigs,
    areaConfigs,
    bisect
  );

  const bounds: ChartBounds = {
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };

  const xScale = scaleTime({
    domain: xDomain,
    range: [0, bounds.width],
  });

  const yScale = scaleLinear({
    domain: yDomain,
    range: [bounds.height, 0],
    nice: NUM_TICKS,
  });

  const scales = { xScale, yScale };

  const handleHover = (
    event: TouchEvent<SVGElement> | MouseEvent<SVGElement>
  ) => onHover(event, scales);

  return (
    <>
      {isDefined(valueAnnotation) && (
        <ValueAnnotation mb={2} fontSize={1}>
          {valueAnnotation}
        </ValueAnnotation>
      )}
      <Box position="relative" ref={sizeRef}>
        <AreaChartGraph
          trends={trendConfigs}
          areas={areaConfigs}
          bounds={bounds}
          width={width}
          height={height}
          padding={padding}
          scales={scales}
          formatXAxis={formatXAxis}
          formatYAxis={isPercentage ? formatYAxisPercentageFn : formatYAxisFn}
          numTicks={6}
          onHover={handleHover}
        >
          {divider && (
            <Dividers
              areas={areaConfigs as any}
              divider={divider}
              height={height}
              padding={padding}
              xScale={xScale}
              smallscreen={!breakpoints.lg}
            />
          )}
        </AreaChartGraph>

        <Box
          height={yMax}
          width={xMax}
          position="absolute"
          top={padding.top}
          left={padding.left}
          style={{
            pointerEvents: 'none',
          }}
        >
          {markerProps && (
            <Marker
              {...markerProps}
              showLine={true}
              height={height}
              padding={padding}
            />
          )}
        </Box>

        {isDefined(tooltipData) && (
          <Tooltip
            bounds={{ right: width, left: 0, top: 0, bottom: height }}
            x={tooltipLeft + padding.left}
            y={tooltipTop + padding.top}
          >
            {formatTooltip(tooltipData, isPercentage)}
          </Tooltip>
        )}
      </Box>
    </>
  );
}

const Dividers = memo(DividersUnmemoized) as typeof DividersUnmemoized;

type DividersProps = {
  areas: AreaConfig<TimestampedTrendValue>[];
  divider: DividerConfig;
  height: number;
  padding: ChartPadding;
  xScale: ScaleTime<number, number>;
  smallscreen: boolean;
};

function DividersUnmemoized(props: DividersProps) {
  const { areas, divider, height, padding, xScale, smallscreen } = props;

  const dates = areas.map((area) => area.values[0].__date);
  dates.shift();

  const fontSize = smallscreen ? theme.fontSizes[0] : theme.fontSizes[1];

  return (
    <>
      {dates.map((date) => {
        const x = xScale(date);
        return x === undefined ? null : (
          <Group key={date.toISOString()}>
            <Text
              fontSize={fontSize}
              x={x - 15}
              y={padding.top * 2}
              textAnchor="end"
              fill={divider.color}
            >
              {divider.leftLabel}
            </Text>
            <Text
              fontSize={fontSize}
              x={x + 15}
              y={padding.top * 2}
              textAnchor="start"
              fill={divider.color}
            >
              {divider.rightLabel}
            </Text>
            <Line
              x1={x}
              y1={0}
              x2={x}
              y2={height - padding.bottom}
              style={{ stroke: divider.color, strokeWidth: 1 }}
            />
          </Group>
        );
      })}
    </>
  );
}
