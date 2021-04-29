import css from '@styled-system/css';
import { AxisBottom, TickRendererProps } from '@visx/axis';
import { GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { Text } from '@visx/text';
import { KeyboardEvent, MouseEvent } from 'react';
import styled from 'styled-components';
import theme, { colors } from '~/style/theme';
import { BarChartCoordinates, BarChartValue } from './bar-chart-coordinates';

export const BAR_CHART_TOOLTIP_MAX_WIDTH = 200;

interface BarChartGraphProps {
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
      fontSize={theme.fontSizes[0]}
      textAnchor="middle"
    >
      {formattedValue}
    </Text>
  );
};

export function BarChartGraph({
  coordinates,
  onKeyInput,
  onMouseMoveBar,
  onMouseLeaveBar,
  xAxisLabel,
  accessibilityDescription,
}: BarChartGraphProps) {
  const {
    width,
    height,
    spacing,
    spacingLabel,
    valueScale,
    labelScale,
    barsWidth,
    barsHeight,
    numTicks,
    values,
    getBarSize,
    getBarOffset,
    getLabel,
    labelFontSize,
  } = coordinates;

  return (
    <StyledSvg
      width={width}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={accessibilityDescription}
      tabIndex={0}
      onKeyUp={(event: KeyboardEvent<SVGElement>) => onKeyInput(event)}
      css={css({ width: '100%' })}
    >
      {/* Vertical lines */}
      <GridColumns
        scale={valueScale}
        width={barsWidth}
        height={barsHeight}
        left={spacing.left}
        top={spacing.top}
        numTicks={numTicks}
        stroke={colors.silver}
      />

      {/* Axis line, match up with the vertical lines */}
      <AxisBottom
        scale={valueScale}
        left={spacing.left}
        top={barsHeight}
        numTicks={numTicks}
        hideTicks={true}
        hideAxisLine={true}
        tickFormat={(a) => `${a}`}
        tickComponent={TickValue}
        label={xAxisLabel}
        labelProps={{
          verticalAnchor: 'start',
          textAnchor: 'middle',
          width: barsWidth,
          x: barsWidth / 2,
        }}
        labelClassName="bar-chart-x-axis-label"
      />

      {values.map((value, index) => {
        return (
          <HoverGroup key={index}>
            <Text
              textAnchor="end"
              verticalAnchor="middle"
              y={(getBarOffset(value) ?? 0) + labelScale.bandwidth() / 2}
              x={spacing.left - spacingLabel}
              fill={colors.body}
              fontSize={labelFontSize}
            >
              {getLabel(value)}
            </Text>

            {/* This bar takes all width to display the background color on hover */}
            <StyledHoverBar
              x={spacing.left}
              y={getBarOffset(value) ?? 0}
              height={labelScale.bandwidth()}
              width={barsWidth}
            />

            {/* Bar has a minimum width of 5 pixels to stay visible / clickable */}
            <Bar
              x={spacing.left}
              y={getBarOffset(value) ?? 0}
              height={labelScale.bandwidth()}
              width={Math.max(getBarSize(value) ?? 0, 5)}
              fill={value.color}
              onMouseMove={(event) => onMouseMoveBar(value, event)}
              onMouseLeave={onMouseLeaveBar}
            />
          </HoverGroup>
        );
      })}
    </StyledSvg>
  );
}

// Visx only allows to style labels through a classname
const StyledSvg = styled.svg(
  css({
    '&:not(:root)': {
      overflow: 'visible',
    },
    '&:focus': {
      outline: 'none',
    },
    '& .bar-chart-x-axis-label': {
      fontSize: 1,
      fill: 'annotation',
      fontFamily: '"RO Sans", Calibri, sans-serif',
    },
  })
);

const HoverGroup = styled(Group)({});
const StyledHoverBar = styled(Bar)(
  css({
    fill: 'transparent',
    // transparent stroke is to capture mouse movements in between bars for the tooltip
    stroke: 'transparent',

    [`${HoverGroup}:hover &`]: {
      fill: 'lightBlue',
    },
  })
);
