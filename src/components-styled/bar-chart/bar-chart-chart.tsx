import css from '@styled-system/css';
import { AxisBottom, TickRendererProps } from '@visx/axis';
import { GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { Text } from '@visx/text';
import { MouseEvent } from 'react';
import styled from 'styled-components';
import { colors } from '~/style/theme';
import { BarChartCoordinates } from './bar-chart-coordinates';

interface BarChartChartProps {
  coordinates: BarChartCoordinates;
  openTooltip: (event: MouseEvent<any>, value: any) => void;
  closeTooltip: () => void;
  keyboardTooltip: (event: any) => void;
  xAxisLabel: string;
}

const TickValue = ({ x, y, formattedValue }: TickRendererProps) => {
  return (
    <Text
      x={x}
      y={y}
      fill={colors.annotation}
      fontSize="0.75rem"
      textAnchor="middle"
    >
      {formattedValue}
    </Text>
  );
};

export function BarChartChart({
  coordinates,
  keyboardTooltip,
  openTooltip,
  closeTooltip,
  xAxisLabel,
}: BarChartChartProps) {
  const {
    width,
    height,
    margin,
    spacingLabel,
    xScale,
    yScale,
    xMax,
    yMax,
    numTicks,
    values,
    xPoint,
    yPoint,
    y,
  } = coordinates;

  return (
    <StyledSvg
      width={width}
      height={height}
      role="img"
      id="age-demographic-chart"
      aria-label="aria-labeltje"
      tabIndex={0}
      onKeyUp={(event: any) => keyboardTooltip(event)}
    >
      {/* Vertical lines */}
      <GridColumns
        scale={xScale}
        width={xMax}
        height={yMax}
        left={margin.left}
        top={margin.top}
        numTicks={numTicks}
        stroke={colors.border}
      />

      {/* Axis line, match up with the vertical lines */}
      <AxisBottom
        scale={xScale}
        left={margin.left}
        top={yMax}
        numTicks={numTicks}
        hideTicks={true}
        hideAxisLine={true}
        tickFormat={(a) => `${a}`}
        tickComponent={TickValue}
        label={xAxisLabel}
        labelClassName="bar-chart-x-axis-label"
      />

      {values.map((value, index) => {
        return (
          <Group key={index}>
            <Text
              textAnchor="end"
              verticalAnchor="middle"
              y={yPoint(value) + yScale.bandwidth() / 2}
              x={margin.left - spacingLabel}
              fill={colors.annotation}
              fontSize="0.75rem"
            >
              {y(value)}
            </Text>
            <Bar
              x={margin.left}
              y={yPoint(value)}
              height={yScale.bandwidth()}
              width={Math.max(xPoint(value), 5)}
              fill={value.color}
              onMouseMove={(event) => openTooltip(event, value)}
              onMouseLeave={closeTooltip}
            />
          </Group>
        );
      })}
    </StyledSvg>
  );
}

// Visx only allows to style labels through a classname
const StyledSvg = styled.svg(
  css({
    '& .bar-chart-x-axis-label': {
      fontSize: '0.75rem',
      fill: 'annotation',
      fontFamily: '"RO Sans", Calibri, sans-serif',
    },
  })
);
