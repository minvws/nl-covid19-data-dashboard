import { Color, colors, KeysOfType } from '@corona-dashboard/common';
import css from '@styled-system/css';
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
import {
  AccessibilityDefinition,
  useAccessibilityAnnotations,
} from '~/utils/use-accessibility-annotations';
import { AgeDemographicCoordinates } from './age-demographic-coordinates';
import { AgeDemographicChartText, AgeDemographicDefaultValue } from './types';
import { formatAgeGroupRange } from './utils';

export const AGE_GROUP_TOOLTIP_WIDTH = 340;

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
  rightMetricProperty: KeysOfType<T, number, true>;
  leftMetricProperty: KeysOfType<T, number, true>;
  rightColor: Color;
  leftColor: Color;
  maxDisplayValue?: number;
  formatValue: (n: number) => string;
}

const TickValue = ({ x, y, formattedValue }: TickRendererProps) => {
  return (
    <VisxText
      x={x}
      y={y}
      fill={colors.annotation}
      fontSize="1rem"
      textAnchor="middle"
    >
      {formattedValue}
    </VisxText>
  );
};

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
  const {
    width,
    height,
    singleBarHeight,
    numTicks,
    xMax,
    yMax,
    axisWidth,
    leftScale,
    leftPoint,
    rightScale,
    rightPoint,
    ageGroupRangePoint,
    ageGroupRange,
    margin,
    values,
  } = coordinates;

  const annotations = useAccessibilityAnnotations(accessibility);

  const hasClippedValue = !!values.find(
    (value) =>
      getIsClipped(
        value[leftMetricProperty] as unknown as number,
        maxDisplayValue
      ) ||
      getIsClipped(
        value[rightMetricProperty] as unknown as number,
        maxDisplayValue
      )
  );

  return (
    <Box>
      {annotations.descriptionElement}
      <svg
        {...annotations.props}
        width={width}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        tabIndex={0}
        onKeyUp={(event) => onKeyInput(event)}
        css={css({
          width: '100%',
          overflow: 'visible',
          '&:focus': {
            outline: 'none',
          },
          // For the bottom axes, the tickLabelProps or labelProps won't change the fontSize
          '.visx-axis-bottom tspan': {
            fontSize: 12,
          },
        })}
      >
        <VisxText
          textAnchor="end"
          verticalAnchor="start"
          y={0}
          x={width / 2 - axisWidth / 2}
          fill="black"
          fontWeight="bold"
          fontSize="1rem"
          width={xMax - 10}
        >
          {text.left_title}
        </VisxText>
        <VisxText
          textAnchor="start"
          verticalAnchor="start"
          y={0}
          x={width / 2 + axisWidth / 2}
          fill="black"
          fontWeight="bold"
          fontSize="1rem"
          width={xMax - 10}
        >
          {text.right_title}
        </VisxText>

        {/* Vertical lines */}
        <GridColumns
          scale={leftScale}
          width={xMax}
          height={yMax}
          left={margin.left}
          top={margin.top}
          numTicks={numTicks}
          stroke={colors.silver}
        />

        <GridColumns
          scale={rightScale}
          width={xMax}
          height={yMax}
          left={width / 2 + axisWidth / 2}
          top={margin.top}
          numTicks={numTicks}
          stroke={colors.silver}
        />

        <StyledPatternLines
          id="is-clipped-pattern-left"
          height={6}
          width={6}
          stroke={leftColor}
          strokeWidth={2}
          orientation={['diagonalRightToLeft']}
        />

        <StyledPatternLines
          id="is-clipped-pattern-right"
          height={6}
          width={6}
          stroke={rightColor}
          strokeWidth={2}
          orientation={['diagonal']}
        />

        {values.map((value, index) => {
          const leftBarWidth = xMax - leftPoint(value);
          const rightBarWidth = rightPoint(value);

          const isClippedLeftGroup = getIsClipped(
            value[leftMetricProperty] as unknown as number,
            maxDisplayValue
          );

          const isClippedRightGroup = getIsClipped(
            value[rightMetricProperty] as unknown as number,
            maxDisplayValue
          );

          const isClippedValue = isClippedLeftGroup || isClippedRightGroup;

          return (
            <StyledGroup
              key={index}
              onMouseMove={(event) => onMouseMoveBar(value, event)}
              onMouseLeave={onMouseLeaveBar}
            >
              {/* This bar takes all width to display the background color on hover */}
              <StyledHoverBar
                x={margin.left}
                y={ageGroupRangePoint(value)}
                height={singleBarHeight}
                width={width - margin.left - margin.right}
              />
              <Bar
                x={width / 2 - axisWidth / 2 - leftBarWidth}
                y={ageGroupRangePoint(value)}
                height={singleBarHeight}
                width={leftBarWidth}
                css={css({
                  fill: isClippedLeftGroup
                    ? `url(#is-clipped-pattern-left)`
                    : leftColor,
                })}
              />
              <VisxText
                textAnchor="middle"
                verticalAnchor="middle"
                fontSize="12"
                y={ageGroupRangePoint(value) + singleBarHeight / 2}
                x={width / 2}
                fill={colors.annotation}
              >
                {formatAgeGroupRange(ageGroupRange(value)) +
                  (isClippedValue ? ' *' : '')}
              </VisxText>
              <Bar
                x={width / 2 + axisWidth / 2}
                y={ageGroupRangePoint(value)}
                height={singleBarHeight}
                width={rightBarWidth}
                css={css({
                  fill: isClippedRightGroup
                    ? `url(#is-clipped-pattern-right)`
                    : rightColor,
                })}
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
          hideTicks={true}
          hideAxisLine={true}
          tickFormat={formatValue}
          tickComponent={TickValue}
        />

        <AxisBottom
          scale={rightScale}
          left={width / 2 + axisWidth / 2}
          top={height - margin.bottom}
          numTicks={numTicks}
          hideTicks={true}
          hideAxisLine={true}
          tickFormat={formatValue}
          tickComponent={TickValue}
        />
      </svg>

      {hasClippedValue && (
        <Box mt={2}>
          <Text variant="label1" color="annotation">
            {text.clipped_value_message}
          </Text>
        </Box>
      )}
    </Box>
  );
}

const StyledPatternLines = styled(PatternLines)<{ stroke: Color }>((p) =>
  css({ stroke: p.stroke })
);

const StyledGroup = styled(Group)({});
const StyledHoverBar = styled(Bar)(
  css({
    fill: 'transparent',
    // transparent stroke is to capture mouse movements in between bars for the tooltip
    stroke: 'transparent',
    strokeWidth: 12,

    [`${StyledGroup}:hover &`]: {
      fill: 'lightBlue',
    },
  })
);

function getIsClipped(value: number, maxValue: number | undefined) {
  if (!maxValue) return false;

  return value * 100 > maxValue;
}
