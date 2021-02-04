import css from '@styled-system/css';
import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { AreaStack } from '@visx/shape';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import styled from 'styled-components';
import { colors } from '~/style/theme';
import { LegendShape } from '../legenda';
import { LineConfig } from '../line-chart';
import { ChartBounds, ChartPadding } from '../line-chart/components';
import { AnyTickFormatter } from '../line-chart/components/chart-axes';
import { SingleTrendData, TrendData } from '../line-chart/logic';

export type AreaConfig = {
  metricProperty: string;
  color?: string;
  strokeWidth?: number;
  legendLabel?: string;
  legendShape?: LegendShape;
};

const defaultColors = {
  axis: colors.silver,
  axisLabels: colors.data.axisLabels,
  benchmark: colors.data.benchmark,
};

type AreaChartGraphProps = {
  trendValues: TrendData;
  lineConfigs: LineConfig[];
  areaValues: SingleTrendData;
  areaConfig: Record<string, AreaConfig>;
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

export function AreaChartGraph(props: AreaChartGraphProps) {
  const {
    areaValues,
    areaConfig,
    bounds,
    scales,
    numTicks,
    formatXAxis,
    formatYAxis,
    padding,
  } = props;
  const { xScale, yScale } = scales;
  const areaKeys = Object.keys(areaConfig);

  return (
    <StyledSvg
      role="img"
      tabIndex={0}
      width={bounds.width}
      height={bounds.height}
    >
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

      <AreaStack
        top={padding.top}
        left={padding.left}
        keys={areaKeys}
        data={areaValues}
        x={(d) => xScale(d.data.__date) ?? 0}
        y0={(d) => yScale(d[0]) ?? 0}
        y1={(d) => yScale(d[1]) ?? 0}
      >
        {({ stacks, path }) =>
          stacks.map((stack) => (
            <path
              key={`area-chart-stack-${stack.key}`}
              d={path(stack) || ''}
              stroke="black"
              fill={areaConfig[stack.key].color}
              onClick={() => {
                alert(stack.key);
              }}
            />
          ))
        }
      </AreaStack>
    </StyledSvg>
  );
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
