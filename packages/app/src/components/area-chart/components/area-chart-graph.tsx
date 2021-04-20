import css from '@styled-system/css';
import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { AreaStack, Bar } from '@visx/shape';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { MouseEvent, ReactNode, TouchEvent } from 'react';
import styled from 'styled-components';
import { LegendShape } from '~/components/legend';
import {
  ChartBounds,
  ChartPadding,
  Trend,
} from '~/components/line-chart/components';
import { AnyTickFormatter } from '~/components/line-chart/components/chart-axes';
import { TrendValue } from '~/components/line-chart/logic';
import { colors } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';

export type TrendConfig<T> = {
  values: T[];
  color?: string;
  style?: 'solid' | 'dashed';
  areaFill?: boolean;
  areaFillOpacity?: number;
  strokeWidth?: number;
  legendLabel?: string;
  legendShape?: LegendShape;
};

export type AreaDisplay<T> = {
  id?: string;
  metricProperty: keyof T;
  color?: string;
  pattern?: 'hatched' | 'none';
  strokeWidth?: number;
  legendLabel?: string;
  legendShape?: LegendShape;
};

export type AreaConfig<T> = {
  values: T[];
  displays: AreaDisplay<T>[];
};

const defaultColors = {
  axis: colors.silver,
  axisLabels: colors.data.axisLabels,
  benchmark: colors.data.benchmark,
};

type AreaChartGraphProps<T extends TrendValue, K extends TrendValue> = {
  trends: TrendConfig<T>[];
  areas: AreaConfig<K>[];
  bounds: ChartBounds;
  width: number;
  height: number;
  padding: ChartPadding;
  scales: {
    xScale: ScaleTime<number, number>;
    yScale: ScaleLinear<number, number>;
  };
  numTicks: number;
  formatXAxis: TickFormatter<Date>;
  formatYAxis: TickFormatter<number>;
  onHover: (event: TouchEvent<SVGElement> | MouseEvent<SVGElement>) => void;
  children?: ReactNode;
};

export function AreaChartGraph<T extends TrendValue, K extends TrendValue>(
  props: AreaChartGraphProps<T, K>
) {
  const {
    trends,
    areas,
    bounds,
    scales,
    numTicks,
    formatXAxis,
    formatYAxis,
    padding,
    onHover,
    width,
    height,
    children,
  } = props;
  const { xScale, yScale } = scales;

  const breakpoints = useBreakpoints();

  const handleHover = (
    event: TouchEvent<SVGElement> | MouseEvent<SVGElement>
  ) => onHover(event);

  return (
    <StyledSvg
      role="img"
      tabIndex={0}
      width={width}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        {areas
          .map((x) => x.displays)
          .flat()
          .filter((display) => display.pattern === 'hatched')
          .map((display) => {
            /**
             * @TODO If the hatched pattern is rendered as a white/transparent
             * overlay than we only need to create one pattern (See stacked bar
             * chart implementation).
             *
             * This is probably only worth refactoring if we need to make the
             * styling consistent with the stacked bar chart.
             */
            return (
              <HatchedPattern
                key={`pattern-${display.id}-${display.metricProperty}`}
                id={`pattern-${display.id}-${display.metricProperty}`}
                color={display.color}
                isSmallScreen={!breakpoints.lg}
              />
            );
          })}
      </defs>
      <Group left={padding.left} top={padding.top}>
        <GridRows
          scale={yScale}
          width={bounds.width}
          numTicks={numTicks}
          stroke={defaultColors.axis}
        />

        <AxisBottom
          scale={xScale}
          tickValues={xScale.domain()}
          tickFormat={formatXAxis as AnyTickFormatter}
          top={bounds.height}
          stroke={defaultColors.axis}
          tickLabelProps={() => ({
            dx: -25,
            fill: defaultColors.axisLabels,
            fontSize: 12,
          })}
          hideTicks={true}
        />

        <AxisLeft
          scale={yScale}
          numTicks={6}
          hideTicks={true}
          hideAxisLine={true}
          stroke={defaultColors.axis}
          tickFormat={formatYAxis as AnyTickFormatter}
          tickLabelProps={() => ({
            fill: defaultColors.axisLabels,
            fontSize: 12,
            dx: 0,
            textAnchor: 'end',
            verticalAnchor: 'middle',
          })}
        />

        <Group>
          {areas.map((area, index) => (
            <AreaStack
              key={index}
              keys={area.displays.map((x) => x.metricProperty) as string[]}
              data={area.values}
              x={(d) => xScale(d.data.__date) ?? 0}
              y0={(d) => yScale(d[0]) ?? 0}
              y1={(d) => yScale(d[1]) ?? 0}
            >
              {({ stacks, path }) =>
                stacks.map((stack) => (
                  <path
                    key={`area-chart-stack-${stack.key}-${index}`}
                    d={path(stack) || ''}
                    stroke="transparent"
                    fill={getFill(area.displays, stack.key)}
                  />
                ))
              }
            </AreaStack>
          ))}
        </Group>

        {trends.length > 0 && (
          <Group>
            {trends.map((trendConfig, index) => (
              <Trend
                areaFillOpacity={trendConfig.areaFillOpacity}
                key={index}
                trend={trendConfig.values}
                type={trendConfig.areaFill ? 'area' : 'line'}
                strokeWidth={trendConfig.strokeWidth}
                style={trendConfig.style}
                xScale={xScale}
                yScale={yScale}
                color={trendConfig.color}
                smallscreen={!breakpoints.lg}
              />
            ))}
          </Group>
        )}

        {children}

        {/**
         * Render the bar on top of the trends because it captures mouse hover when you are above the trend line
         */}
        <Bar
          x={0}
          y={0}
          width={bounds.width}
          height={bounds.height}
          fill="transparent"
          onTouchStart={handleHover}
          onTouchMove={handleHover}
          onMouseMove={handleHover}
          onMouseLeave={handleHover}
        />
      </Group>
    </StyledSvg>
  );
}

function getFill<T>(areaConfig: AreaDisplay<T>[], areaKey: string) {
  const display = areaConfig.find((x) => x.metricProperty === areaKey);
  if (display?.pattern === 'hatched') {
    return `url(#pattern-${display.id}-${display.metricProperty})`;
  }
  return display?.color ?? '#000';
}

const StyledSvg = styled.svg(
  css({
    width: '100%',
    '&:not(:root)': {
      overflow: 'visible',
    },
    '&:focus': {
      outline: 'none',
    },
  })
);

type HatchedPatternProps = {
  id: string;
  color?: string;
  isSmallScreen: boolean;
};

function HatchedPattern(props: HatchedPatternProps) {
  const { id, color, isSmallScreen } = props;
  const size = isSmallScreen ? 4 : 8;
  const strokeWidth = isSmallScreen ? 3 : 4;

  return (
    <pattern
      id={id}
      width={size}
      height={size}
      patternTransform="rotate(-45 0 0)"
      patternUnits="userSpaceOnUse"
    >
      <rect x="0" y="0" width={size} height={size} fill={color} />
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={size}
        style={{ stroke: 'white', strokeWidth }}
      />
    </pattern>
  );
}
