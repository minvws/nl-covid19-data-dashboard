import css from '@styled-system/css';
import { AxisBottom, TickRendererProps } from '@visx/axis';
import { GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { Text } from '@visx/text';
import { KeyboardEvent, MouseEvent } from 'react';
import styled from 'styled-components';
import { colors } from '~/style/theme';
import { BarChartCoordinates, BarChartValue } from './bar-chart-coordinates';

interface BarChartChartProps {
  coordinates: BarChartCoordinates;
  onMouseMoveBar: (value: BarChartValue, event: MouseEvent<SVGElement>) => void;
  onMouseLeaveBar: () => void;
  onKeyInput: (event: KeyboardEvent<HTMLElement | SVGElement>) => void;
  xAxisLabel: string;
  accessibilityDescription: string;
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
  onKeyInput,
  onMouseMoveBar,
  onMouseLeaveBar,
  xAxisLabel,
  accessibilityDescription,
}: BarChartChartProps) {
  const {
    width,
    height,
    spacing,
    spacingLabel,
    xScale,
    yScale,
    barsWidth,
    barsHeight,
    numTicks,
    values,
    xPoint,
    yPoint,
    getLabel,
  } = coordinates;

  return (
    <StyledSvg
      width={width}
      height={height}
      role="img"
      aria-label={accessibilityDescription}
      tabIndex={0}
      onKeyUp={(event: KeyboardEvent<SVGElement>) => onKeyInput(event)}
    >
      {/* Vertical lines */}
      <GridColumns
        scale={xScale}
        width={barsWidth}
        height={barsHeight}
        left={spacing.left}
        top={spacing.top}
        numTicks={numTicks}
        stroke={colors.border}
      />

      {/* Axis line, match up with the vertical lines */}
      <AxisBottom
        scale={xScale}
        left={spacing.left}
        top={barsHeight}
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
              y={yPoint(value) ?? 0 + yScale.bandwidth() / 2}
              x={spacing.left - spacingLabel}
              fill={colors.annotation}
              fontSize="0.75rem"
            >
              {getLabel(value)}
            </Text>
            <Bar
              x={spacing.left}
              y={yPoint(value)}
              height={yScale.bandwidth()}
              width={Math.max(xPoint(value), 5)}
              fill={value.color}
              onMouseMove={(event) => onMouseMoveBar(value, event)}
              onMouseLeave={onMouseLeaveBar}
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
