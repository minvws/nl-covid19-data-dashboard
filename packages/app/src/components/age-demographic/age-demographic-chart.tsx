import { Color, colors } from '@corona-dashboard/common';
import { AxisBottom, TickRendererProps } from '@visx/axis';
import { GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { PatternLines } from '@visx/pattern';
import { Bar } from '@visx/shape';
import { Text as VisxText } from '@visx/text';
import { KeyboardEvent, MouseEvent } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { fontSizes, fontWeights, space } from '~/style/theme';
import { replaceVariablesInText } from '~/utils';
import { AccessibilityDefinition, useAccessibilityAnnotations } from '~/utils/use-accessibility-annotations';
import { AgeDemographicCoordinates } from './age-demographic-coordinates';
import { AgeDemographicChartText, AgeDemographicDefaultValue } from './types';
import { formatAgeGroupRange } from './utils';

export const AGE_GROUP_TOOLTIP_WIDTH = 340;

const TickValue = ({ x, y, formattedValue }: TickRendererProps) => {
  return (
    <VisxText x={x} y={y} fill={colors.gray7} fontSize={fontSizes[2]} textAnchor="middle">
      {formattedValue}
    </VisxText>
  );
};

interface AgeDemographicChartProps<T extends AgeDemographicDefaultValue> {
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  coordinates: AgeDemographicCoordinates<T>;
  text: AgeDemographicChartText;
  onMouseMoveBar: (value: T, event: MouseEvent<SVGElement>) => void;
  onMouseLeaveBar: () => void;
  onKeyInput: (event: KeyboardEvent<SVGElement>) => void;
  rightMetricProperty: keyof T;
  leftMetricProperty: keyof T;
  rightColor: Color | string;
  leftColor: Color | string;
  maxDisplayValue?: number;
  formatValue: (n: number) => string;
}

export function AgeDemographicChart<T extends AgeDemographicDefaultValue>({
  accessibility,
  coordinates,
  text,
  onKeyInput,
  onMouseMoveBar,
  onMouseLeaveBar,
  rightMetricProperty,
  leftMetricProperty,
  rightColor,
  leftColor,
  maxDisplayValue,
  formatValue,
}: AgeDemographicChartProps<T>) {
  const { width, height, singleBarHeight, numTicks, xMax, yMax, axisWidth, leftScale, leftPoint, rightScale, rightPoint, ageGroupRangePoint, ageGroupRange, margin, values } =
    coordinates;

  const annotations = useAccessibilityAnnotations(accessibility);

  const getNumberValue = (data: T, key: keyof T): number => {
    const value = data[key];
    return typeof value === 'number' ? value : 0;
  };

  const hasClippedValue = !!values.find(
    (value) => getIsClipped(getNumberValue(value, leftMetricProperty), maxDisplayValue) || getIsClipped(getNumberValue(value, rightMetricProperty), maxDisplayValue)
  );

  return (
    <Box>
      {annotations.descriptionElement}
      <StyledSVG {...annotations.props} width={width} viewBox={`0 0 ${width} ${height}`} role="img" tabIndex={0} onKeyUp={(event) => onKeyInput(event)}>
        <VisxText
          textAnchor="end"
          verticalAnchor="start"
          y={0}
          x={width / 2 - axisWidth / 2}
          fill={colors.black}
          fontWeight={fontWeights.bold}
          fontSize={fontSizes[2]}
          width={xMax - 10}
        >
          {text.left_title}
        </VisxText>
        <VisxText
          textAnchor="start"
          verticalAnchor="start"
          y={0}
          x={width / 2 + axisWidth / 2}
          fill={colors.black}
          fontWeight={fontWeights.bold}
          fontSize={fontSizes[2]}
          width={xMax - 10}
        >
          {text.right_title}
        </VisxText>

        {/* Vertical lines */}
        <GridColumns scale={leftScale} width={xMax} height={yMax} left={margin.left} top={margin.top} numTicks={numTicks} stroke={colors.gray3} />

        <GridColumns scale={rightScale} width={xMax} height={yMax} left={width / 2 + axisWidth / 2} top={margin.top} numTicks={numTicks} stroke={colors.gray3} />

        <StyledPatternLines id="is-clipped-pattern-left" height={6} width={6} stroke={leftColor} strokeWidth={2} orientation={['diagonalRightToLeft']} />

        <StyledPatternLines id="is-clipped-pattern-right" height={6} width={6} stroke={rightColor} strokeWidth={2} orientation={['diagonal']} />

        {values.map((value, index) => {
          const leftBarWidth = xMax - leftPoint(value);
          const rightBarWidth = rightPoint(value);

          const isClippedLeftGroup = getIsClipped(getNumberValue(value, leftMetricProperty), maxDisplayValue);

          const isClippedRightGroup = getIsClipped(getNumberValue(value, rightMetricProperty), maxDisplayValue);

          const isClippedValue = isClippedLeftGroup || isClippedRightGroup;

          return (
            <StyledGroup key={index} onMouseMove={(event) => onMouseMoveBar(value, event)} onMouseLeave={onMouseLeaveBar}>
              {/* This bar takes all width to display the background color on hover */}
              <StyledHoverBar x={margin.left} y={ageGroupRangePoint(value)} height={singleBarHeight} width={width - margin.left - margin.right} />
              <StyledBar
                x={width / 2 - axisWidth / 2 - leftBarWidth}
                y={ageGroupRangePoint(value)}
                height={singleBarHeight}
                width={leftBarWidth}
                color={leftColor}
                isClipped={isClippedLeftGroup}
                isClippedPattern="is-clipped-pattern-left"
              />
              <VisxText
                textAnchor="middle"
                verticalAnchor="middle"
                fontSize={fontSizes[0]}
                fontWeight={fontWeights.bold}
                y={ageGroupRangePoint(value) + singleBarHeight / 2}
                x={width / 2}
                fill={colors.black}
              >
                {replaceVariablesInText(text.age_group_range_tooltip, {
                  ageGroupRange: formatAgeGroupRange(ageGroupRange(value)) + (isClippedValue ? ' *' : ''),
                })}
              </VisxText>
              <StyledBar
                x={width / 2 + axisWidth / 2}
                y={ageGroupRangePoint(value)}
                height={singleBarHeight}
                width={rightBarWidth}
                color={rightColor}
                isClipped={isClippedRightGroup}
                isClippedPattern="is-clipped-pattern-right"
              />
            </StyledGroup>
          );
        })}

        {/* Axis lines, match up with the vertical lines */}
        <AxisBottom
          scale={leftScale}
          left={margin.left}
          top={height - margin.bottom}
          numTicks={numTicks}
          tickFormat={formatValue}
          tickComponent={TickValue}
          hideTicks
          hideAxisLine
        />

        <AxisBottom
          scale={rightScale}
          left={width / 2 + axisWidth / 2}
          top={height - margin.bottom}
          numTicks={numTicks}
          tickFormat={formatValue}
          tickComponent={TickValue}
          hideTicks
          hideAxisLine
        />
      </StyledSVG>

      {hasClippedValue && (
        <Box marginTop={space[2]}>
          <Text variant="label1" color="gray7">
            {text.clipped_value_message}
          </Text>
        </Box>
      )}
    </Box>
  );
}

const StyledSVG = styled.svg`
  overflow: visible;
  width: 100%;

  &:focus {
    outline: none;
  }

  // For the bottom axes, the tickLabelProps or labelProps won't change the fontSize
  .visx-axis-bottom tspan {
    font-size: ${fontSizes[0]};
  }
`;

interface StyledPatternLinesProps {
  stroke: Color | string;
}

const StyledPatternLines = styled(PatternLines)<StyledPatternLinesProps>`
  stroke: ${({ stroke }) => stroke};
`;

const StyledGroup = styled(Group)({});
const StyledHoverBar = styled(Bar)`
  fill: ${colors.transparent};
  stroke: ${colors.transparent};
  stroke-width: 12px;

  ${StyledGroup}:hover & {
    fill: ${colors.blue1};
  }
`;

interface StyledBarProps {
  color: Color | string;
  isClipped: boolean;
  isClippedPattern: string;
}

const StyledBar = styled(Bar)<StyledBarProps>`
  fill: ${({ color, isClipped, isClippedPattern }) => (isClipped ? `url(#${isClippedPattern})` : color)};
`;

function getIsClipped(value: number, maxValue: number | undefined) {
  if (!maxValue) return false;

  return value * 100 > maxValue;
}
