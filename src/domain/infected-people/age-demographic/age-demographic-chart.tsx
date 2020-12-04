import css from '@styled-system/css';
import { AxisBottom, TickRendererProps } from '@visx/axis';
import { GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { Text } from '@visx/text';
import { NationalInfectedAgeGroupsValue } from '~/types/data.d';
import { formatPercentage } from '~/utils/formatNumber';
import siteText from '~/locale/index';
import { MouseEvent } from 'react';
import { colors } from '~/style/theme';
import { AgeDemographicCoordinates } from './age-demographic-coordinates';

export const AGE_GROUP_TOOLTIP_WIDTH = 340;

const text = siteText.infected_age_groups;

interface AgeDemographicChartProps {
  coordinates: AgeDemographicCoordinates;
  openTooltip: (
    event: MouseEvent<any>,
    value: NationalInfectedAgeGroupsValue
  ) => void;
  closeTooltip: () => void;
  keyboardTooltip: (event: any) => void;
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

export function AgeDemographicChart({
  coordinates,
  keyboardTooltip,
  openTooltip,
  closeTooltip,
}: AgeDemographicChartProps) {
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
    isSmallScreen,
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
      onKeyUp={(event) => keyboardTooltip(event)}
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
        fontSize={isSmallScreen ? '1rem' : '1.2rem'}
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
        fontSize={isSmallScreen ? '1rem' : '1.2rem'}
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

      {values.map((d: NationalInfectedAgeGroupsValue, i: number) => {
        const ageGroupPercentageWidth = xMax - ageGroupPercentagePoint(d);
        const infectedPercentageWidth = infectedPercentagePoint(d);
        return (
          <Group
            key={i}
            onMouseMove={(event) => openTooltip(event, d)}
            onMouseLeave={closeTooltip}
            css={css({
              '&:hover .hoverbar': {
                fill: colors.lightBlue,
              },
            })}
          >
            {/* This bar takes all width to display the background color on hover
              The transparent stroke is to capture mouse movements in between bars for the tooltip */}
            <Bar
              x={margin.left}
              y={ageGroupRangePoint(d)}
              height={ageGroupRangeScale.bandwidth()}
              width={width - margin.left - margin.right}
              fill="transparent"
              className="hoverbar"
              stroke="transparent"
              strokeWidth={15}
            />
            <Bar
              x={width / 2 - ageRangeAxisWidth / 2 - ageGroupPercentageWidth}
              y={ageGroupRangePoint(d)}
              height={ageGroupRangeScale.bandwidth()}
              width={ageGroupPercentageWidth}
              fill={colors.data.neutral}
            />
            <Text
              textAnchor="middle"
              verticalAnchor="middle"
              y={ageGroupRangePoint(d) + ageGroupRangeScale.bandwidth() / 2}
              x={width / 2}
              fill={colors.annotation}
            >
              {formatAgeGroupRange(ageGroupRange(d))}
            </Text>
            <Bar
              x={width / 2 + ageRangeAxisWidth / 2}
              y={ageGroupRangePoint(d)}
              height={ageGroupRangeScale.bandwidth()}
              width={infectedPercentageWidth}
              fill={colors.data.primary}
            />
          </Group>
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
