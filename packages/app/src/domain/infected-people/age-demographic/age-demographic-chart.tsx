import css from '@styled-system/css';
import { AxisBottom, TickRendererProps } from '@visx/axis';
import { GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { Text } from '@visx/text';
import { KeyboardEvent, memo, MouseEvent } from 'react';
import styled from 'styled-components';
import siteText from '~/locale/index';
import { colors } from '~/style/theme';
import { NationalInfectedAgeGroupsValue } from '~/types/data.d';
import { formatPercentage } from '~/utils/formatNumber';
import { AgeDemographicCoordinates } from './age-demographic-coordinates';

export const AGE_GROUP_TOOLTIP_WIDTH = 340;

const text = siteText.infected_age_groups;

interface AgeDemographicChartProps {
  coordinates: AgeDemographicCoordinates;
  onMouseMoveBar: (
    value: NationalInfectedAgeGroupsValue,
    event: MouseEvent<SVGElement>
  ) => void;
  onMouseLeaveBar: () => void;
  onKeyInput: (event: KeyboardEvent<SVGElement>) => void;
}

const TickValue = ({ x, y, formattedValue }: TickRendererProps) => {
  return (
    <Text
      x={x}
      y={y}
      fill={colors.annotation}
      fontSize="1rem"
      textAnchor="middle"
    >
      {formattedValue}
    </Text>
  );
};

export const formatAgeGroupRange = (range: string): string => {
  return range.split('-').join(' – ');
};

export const AgeDemographicChart = memo<AgeDemographicChartProps>(
  ({ coordinates, onKeyInput, onMouseMoveBar, onMouseLeaveBar }) => {
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

    return (
      <svg
        width={width}
        height={height}
        role="img"
        id="age-demographic-chart"
        aria-label={text.graph.accessibility_description}
        tabIndex={0}
        onKeyUp={(event) => onKeyInput(event)}
        css={css({
          '&:focus': {
            outline: 'none',
          },
        })}
      >
        <Text
          textAnchor="end"
          verticalAnchor="start"
          y={0}
          x={width / 2 - ageRangeAxisWidth / 2}
          fill="black"
          fontWeight="bold"
          fontSize="1rem"
          width={xMax - 10}
        >
          {text.graph.age_group_percentage_title}
        </Text>
        <Text
          textAnchor="start"
          verticalAnchor="start"
          y={0}
          x={width / 2 + ageRangeAxisWidth / 2}
          fill="black"
          fontWeight="bold"
          fontSize="1rem"
          width={xMax - 10}
        >
          {text.graph.infected_percentage_title}
        </Text>

        {/* Vertical lines */}
        <GridColumns
          scale={ageGroupPercentageScale}
          width={xMax}
          height={yMax}
          left={margin.left}
          top={margin.top}
          numTicks={numTicks}
          stroke={colors.border}
        />
        <GridColumns
          scale={infectedPercentageScale}
          width={xMax}
          height={yMax}
          left={width / 2 + ageRangeAxisWidth / 2}
          top={margin.top}
          numTicks={numTicks}
          stroke={colors.border}
        />

        {values.map((value, index) => {
          const ageGroupPercentageWidth = xMax - ageGroupPercentagePoint(value);
          const infectedPercentageWidth = infectedPercentagePoint(value);
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
                fill={colors.data.neutral}
              />
              <Text
                textAnchor="middle"
                verticalAnchor="middle"
                y={
                  ageGroupRangePoint(value) + ageGroupRangeScale.bandwidth() / 2
                }
                x={width / 2}
                fill={colors.annotation}
              >
                {formatAgeGroupRange(ageGroupRange(value))}
              </Text>
              <Bar
                x={width / 2 + ageRangeAxisWidth / 2}
                y={ageGroupRangePoint(value)}
                height={ageGroupRangeScale.bandwidth()}
                width={infectedPercentageWidth}
                fill={colors.data.primary}
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
    );
  }
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
