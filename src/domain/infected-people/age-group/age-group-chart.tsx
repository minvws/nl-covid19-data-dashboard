import css from '@styled-system/css';
import { AxisBottom, TickRendererProps } from '@visx/axis';
import { GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import { Text } from '@visx/text';
import {
  NationalInfectedAgeGroups,
  NationalInfectedAgeGroupsValue,
} from '~/types/data.d';
import { formatPercentage } from '~/utils/formatNumber';

const TOOLTIP_WIDTH = 300;

interface AgeGroupChartProps {
  parentWidth: number;
  data: NationalInfectedAgeGroups;
  openTooltip: (
    value: NationalInfectedAgeGroupsValue,
    x: number,
    y: number
  ) => void;
  closeTooltip: () => void;
}

const TickValue = ({ x, y, formattedValue }: TickRendererProps) => {
  return (
    <Text x={x} y={y} fill="#595959" fontSize={'1rem'} textAnchor="middle">
      {formattedValue}
    </Text>
  );
};

const formatAgeGroupRange = (range: string): string => {
  return range.split('-').join(' – ');
};

export function AgeGroupChart({
  data,
  parentWidth,
  openTooltip,
  closeTooltip,
}: AgeGroupChartProps) {
  const { values } = data;

  // Define the graph dimensions and margins
  const isSmallScreen = parentWidth < 500;
  const ageRangeAxisWidth = isSmallScreen ? 60 : 100;
  const width = parentWidth;
  const height = 400;
  const marginX = isSmallScreen ? 6 : 40;
  const margin = { top: 20, bottom: 20, left: marginX, right: marginX };

  const numTicks = isSmallScreen ? 3 : 4;

  // Then we'll create some bounds
  const xMax = (width - margin.left - margin.right - ageRangeAxisWidth) / 2;
  const yMax = height - margin.top - margin.bottom;

  // We'll make some helpers to get at the data we want
  const ageGroupPercentage = (d: NationalInfectedAgeGroupsValue) =>
    d.age_group_percentage;
  const infectedPercentage = (d: NationalInfectedAgeGroupsValue) =>
    d.infected_percentage;
  const y = (d: NationalInfectedAgeGroupsValue) => d.age_group_range;

  // And then scale the graph by our data
  const ageGroupPercentageScale = scaleLinear({
    range: [xMax, 0],
    round: true,
    domain: [0, Math.max(...values.map(ageGroupPercentage))],
  });
  const infectedPercentageScale = scaleLinear({
    range: [0, xMax],
    round: true,
    domain: [0, Math.max(...values.map(infectedPercentage))],
  });
  const yScale = scaleBand({
    range: [0, yMax],
    round: true,
    domain: values.map(y),
    padding: 0.4,
  });

  // Compose together the scale and accessor functions to get point functions
  const compose = (scale: any, accessor: any) => (
    d: NationalInfectedAgeGroupsValue
  ) => scale(accessor(d));
  const ageGroupPercentagePoint = compose(
    ageGroupPercentageScale,
    ageGroupPercentage
  );
  const infectedPercentagePoint = compose(
    infectedPercentageScale,
    infectedPercentage
  );
  const yPoint = compose(yScale, y);

  return (
    <svg width={width} height={height}>
      {/* Vertical lines */}
      <GridColumns
        scale={ageGroupPercentageScale}
        width={xMax}
        height={yMax - 20}
        left={margin.left}
        top={margin.top}
        numTicks={numTicks}
        stroke="#c4c4c4"
      />
      <GridColumns
        scale={infectedPercentageScale}
        width={xMax}
        height={yMax - 20}
        left={width / 2 + ageRangeAxisWidth / 2}
        top={margin.top}
        numTicks={numTicks}
        stroke="#c4c4c4"
      />

      {values.map((d, i) => {
        const ageGroupPercentageWidth = xMax - ageGroupPercentagePoint(d);
        const infectedPercentageWidth = infectedPercentagePoint(d);
        return (
          <Group
            key={`bar-${i}`}
            onMouseMove={() =>
              openTooltip(d, (width - TOOLTIP_WIDTH) / 2, yPoint(d))
            }
            onMouseLeave={closeTooltip}
            css={css({
              '&:hover .hoverbar': {
                fill: '#E0EEF6',
              },
            })}
          >
            {/* This bar takes all width to display the background color on hover
              The tranparent stroke is to capture mouse movements in between bars for the tooltip */}
            <Bar
              x={0}
              y={yPoint(d)}
              height={yScale.bandwidth()}
              width={width}
              fill="transparent"
              className="hoverbar"
              stroke="transparent"
              strokeWidth={15}
            />
            <Bar
              x={width / 2 - ageRangeAxisWidth / 2 - ageGroupPercentageWidth}
              y={yPoint(d)}
              height={yScale.bandwidth()}
              width={ageGroupPercentageWidth}
              fill="#c6c8ca"
            />
            <Text
              textAnchor="middle"
              verticalAnchor="middle"
              y={yPoint(d) + yScale.bandwidth() / 2}
              x={width / 2}
              fill="#595959"
            >
              {formatAgeGroupRange(y(d))}
            </Text>
            <Bar
              x={width / 2 + ageRangeAxisWidth / 2}
              y={yPoint(d)}
              height={yScale.bandwidth()}
              width={infectedPercentageWidth}
              fill="#3391cc"
            />
          </Group>
        );
      })}

      {/* Axis lines, match up with the vertical lines */}
      <AxisBottom
        scale={ageGroupPercentageScale}
        left={margin.left}
        top={yMax}
        numTicks={numTicks}
        hideTicks={true}
        hideAxisLine={true}
        tickFormat={(a) => `${formatPercentage(a as number)}%`}
        tickComponent={TickValue}
      />

      <AxisBottom
        scale={infectedPercentageScale}
        left={width / 2 + ageRangeAxisWidth / 2}
        top={yMax}
        numTicks={numTicks}
        hideTicks={true}
        hideAxisLine={true}
        tickFormat={(a) => `${formatPercentage(a as number)}%`}
        tickComponent={TickValue}
      />
    </svg>
  );
}
