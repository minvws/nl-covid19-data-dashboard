import css from '@styled-system/css';
import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { AreaStack } from '@visx/shape';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import styled from 'styled-components';
import { colors } from '~/style/theme';
import { LegendShape } from '../legenda';
import { ChartBounds, ChartPadding, Trend } from '../line-chart/components';
import { AnyTickFormatter } from '../line-chart/components/chart-axes';
import { TrendValue } from '../line-chart/logic';

export type TrendConfig<T> = {
  values: T[];
  color?: string;
  style?: 'solid' | 'dashed';
  areaFill: boolean;
  areaFillOpacity?: number;
  strokeWidth?: number;
  legendLabel?: string;
  legendShape?: LegendShape;
};

export type AreaDisplay<T> = {
  name: string;
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
  padding: ChartPadding;
  scales: {
    xScale: ScaleTime<number, number>;
    yScale: ScaleLinear<number, number>;
  };
  numTicks: number;
  formatXAxis: TickFormatter<Date>;
  formatYAxis: TickFormatter<number>;
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
  } = props;
  const { xScale, yScale } = scales;

  return (
    <StyledSvg
      role="img"
      tabIndex={0}
      width={bounds.width}
      height={bounds.height}
    >
      <defs>
        {areas
          .map((x) => x.displays)
          .flat()
          .filter((display) => display.pattern === 'hatched')
          .map((display) => {
            return (
              <pattern
                key={`pattern-${display.name}-${display.metricProperty}`}
                id={`pattern-${display.name}-${display.metricProperty}`}
                width="10"
                height="10"
                patternTransform="rotate(-45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="10" height="10" fill={display.color} />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="10"
                  style={{ stroke: 'white', strokeWidth: 4 }}
                />
              </pattern>
            );
          })}
      </defs>
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
        numTicks={4}
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
      {areas.map((area, index) => (
        <AreaStack
          key={index}
          top={padding.top}
          left={padding.left}
          keys={area.displays.map((x) => x.metricProperty) as string[]}
          data={area.values}
          x={(d) => xScale(d.data.__date) ?? 0}
          y0={(d) => yScale(d[0]) ?? 0}
          y1={(d) => yScale(d[1]) ?? 0}
        >
          {({ stacks, path }) =>
            stacks.map((stack) => (
              <path
                key={`area-chart-stack-${stack.key}`}
                d={path(stack) || ''}
                stroke="transparent"
                fill={getFill(area.displays, stack.key)}
                onClick={() => {
                  alert(stack.key);
                }}
              />
            ))
          }
        </AreaStack>
      ))}
      {trends.length > 0 && (
        <g>
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
            />
          ))}
        </g>
      )}
    </StyledSvg>
  );
}

function getFill<T>(areaConfig: AreaDisplay<T>[], areaKey: string) {
  const display = areaConfig.find((x) => x.metricProperty === areaKey);
  if (display?.pattern === 'hatched') {
    return `url(#pattern-${display.name}-${display.metricProperty})`;
  }
  return display?.color ?? '#000';
}

const StyledSvg = styled.svg(
  css({
    '&:not(:root)': {
      overflow: 'visible',
    },
    '&:focus': {
      outline: 'none',
    },
    '& .area-chart-x-axis-label': {
      fontSize: 1,
      fill: 'annotation',
      fontFamily: '"RO Sans", Calibri, sans-serif',
    },
  })
);
