import css from '@styled-system/css';
import { AxisBottom, TickRendererProps } from '@visx/axis';
import { GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { PatternLines } from '@visx/pattern';
import { Bar } from '@visx/shape';
import { Text as VisxText } from '@visx/text';
import { KeyboardEvent, memo, MouseEvent } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { colors } from '~/style/theme';
import { AgeDemographicCoordinates } from './age-demographic-coordinates';
import { AgeDemographicChartText, AgeDemographicDefaultValue } from './types';
import { formatAgeGroupRange } from './utils';
import { useIntl } from '~/intl';

export const AGE_GROUP_TOOLTIP_WIDTH = 340;

interface AgeDemographicChartProps<T extends AgeDemographicDefaultValue> {
  coordinates: AgeDemographicCoordinates<T>;
  text: AgeDemographicChartText;
  onMouseMoveBar: (value: T, event: MouseEvent<SVGElement>) => void;
  onMouseLeaveBar: () => void;
  onKeyInput: (event: KeyboardEvent<SVGElement>) => void;
  metricProperty: keyof T;
  displayMaxPercentage?: number;
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

export const AgeDemographicChart = memo(
  AgeDemographicChartWithGenerics
) as typeof AgeDemographicChartWithGenerics;

function AgeDemographicChartWithGenerics<T extends AgeDemographicDefaultValue>({
  coordinates,
  text,
  onKeyInput,
  onMouseMoveBar,
  onMouseLeaveBar,
  metricProperty,
  displayMaxPercentage,
}: AgeDemographicChartProps<T>) {
  const {
    width,
    height,
    numTicks,
    xMax,
    yMax,
    ageRangeAxisWidth,
    ageGroupPercentageScale,
    infectedPercentageScale,
    ageGroupRangeScale,
    ageGroupPercentagePoint,
    infectedPercentagePoint,
    ageGroupRangePoint,
    margin,
    values,
    ageGroupRange,
  } = coordinates;

  const { formatPercentage } = useIntl();

  const hasClippedValue = !!values.find(
    (value) =>
      getIsClipped(value.age_group_percentage, displayMaxPercentage) ||
      getIsClipped(
        (value[metricProperty] as unknown) as number,
        displayMaxPercentage
      )
  );

  return (
    <Box>
      <svg
        width={width}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        id="age-demographic-chart"
        aria-label={text.accessibility_description}
        tabIndex={0}
        onKeyUp={(event) => onKeyInput(event)}
        css={css({
          width: '100%',
          overflow: 'visible',
          '&:focus': {
            outline: 'none',
          },
        })}
      >
        <VisxText
          textAnchor="end"
          verticalAnchor="start"
          y={0}
          x={width / 2 - ageRangeAxisWidth / 2}
          fill="black"
          fontWeight="bold"
          fontSize="1rem"
          width={xMax - 10}
        >
          {text.age_group_percentage_title}
        </VisxText>
        <VisxText
          textAnchor="start"
          verticalAnchor="start"
          y={0}
          x={width / 2 + ageRangeAxisWidth / 2}
          fill="black"
          fontWeight="bold"
          fontSize="1rem"
          width={xMax - 10}
        >
          {text.value_percentage_title}
        </VisxText>

        {/* Vertical lines */}
        <GridColumns
          scale={ageGroupPercentageScale}
          width={xMax}
          height={yMax}
          left={margin.left}
          top={margin.top}
          numTicks={numTicks}
          stroke={colors.silver}
        />
        <GridColumns
          scale={infectedPercentageScale}
          width={xMax}
          height={yMax}
          left={width / 2 + ageRangeAxisWidth / 2}
          top={margin.top}
          numTicks={numTicks}
          stroke={colors.silver}
        />

        <PatternLines
          id="is-clipped-pattern-age-range"
          height={6}
          width={6}
          stroke={colors.data.neutral}
          strokeWidth={2}
          orientation={['diagonalRightToLeft']}
        />

        <PatternLines
          id="is-clipped-pattern-infected-percentage"
          height={6}
          width={6}
          stroke={colors.data.primary}
          strokeWidth={2}
          orientation={['diagonal']}
        />

        {values.map((value, index) => {
          const ageGroupPercentageWidth = xMax - ageGroupPercentagePoint(value);
          const infectedPercentageWidth = infectedPercentagePoint(value);

          const isClippedAgeGroup = getIsClipped(
            value.age_group_percentage,
            displayMaxPercentage
          );

          const isClippedInfectedPercentage = getIsClipped(
            (value[metricProperty] as unknown) as number,
            displayMaxPercentage
          );

          const isClippedValue =
            isClippedAgeGroup || isClippedInfectedPercentage;

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
                height={ageGroupRangeScale.bandwidth()}
                width={width - margin.left - margin.right}
              />
              <Bar
                x={width / 2 - ageRangeAxisWidth / 2 - ageGroupPercentageWidth}
                y={ageGroupRangePoint(value)}
                height={ageGroupRangeScale.bandwidth()}
                width={ageGroupPercentageWidth}
                fill={
                  isClippedAgeGroup
                    ? `url(#is-clipped-pattern-age-range)`
                    : colors.data.neutral
                }
              />
              <VisxText
                textAnchor="middle"
                verticalAnchor="middle"
                y={
                  ageGroupRangePoint(value) + ageGroupRangeScale.bandwidth() / 2
                }
                x={width / 2}
                fill={colors.annotation}
              >
                {formatAgeGroupRange(ageGroupRange(value)) +
                  (isClippedValue ? ' *' : '')}
              </VisxText>
              <Bar
                x={width / 2 + ageRangeAxisWidth / 2}
                y={ageGroupRangePoint(value)}
                height={ageGroupRangeScale.bandwidth()}
                width={infectedPercentageWidth}
                fill={
                  isClippedInfectedPercentage
                    ? `url(#is-clipped-pattern-infected-percentage)`
                    : colors.data.primary
                }
              />
            </StyledGroup>
          );
        })}

        {/* Axis lines, match up with the vertical lines */}
        <AxisBottom
          scale={ageGroupPercentageScale}
          left={margin.left}
          top={height - margin.bottom}
          numTicks={numTicks}
          hideTicks={true}
          hideAxisLine={true}
          tickFormat={(a) => `${formatPercentage(a as number)}%`}
          tickComponent={TickValue}
        />

        <AxisBottom
          scale={infectedPercentageScale}
          left={width / 2 + ageRangeAxisWidth / 2}
          top={height - margin.bottom}
          numTicks={numTicks}
          hideTicks={true}
          hideAxisLine={true}
          tickFormat={(a) => `${formatPercentage(a as number)}%`}
          tickComponent={TickValue}
        />
      </svg>

      {hasClippedValue && (
        <Text color="gray">* {text.clipped_value_message}</Text>
      )}
    </Box>
  );
}

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
