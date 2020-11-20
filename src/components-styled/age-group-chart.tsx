import { useCallback } from 'react';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleLinear, scaleBand } from '@visx/scale';
import { Text } from '@visx/text';
import { GridColumns } from '@visx/grid';
import { AxisBottom } from '@visx/axis';
// import { localPoint } from '@visx/event';
import { NationalInfectedAgeGroups, NationalInfectedAgeGroupsValue } from '~/types/data.d';

interface AgeGroupChartProps {
  data: NationalInfectedAgeGroups;
}

export function AgeGroupChart({ data }: AgeGroupChartProps) {
  const { values } = data;

  // Define the graph dimensions and margins
  const width = 750;
  const height = 500;
  const margin = { top: 20, bottom: 20, left: 20, right: 20 };

  const labelWidth = 65;

  // Then we'll create some bounds
  const xMax = (width - margin.left - margin.right - labelWidth) / 2;
  const yMax = height - margin.top - margin.bottom;

  // We'll make some helpers to get at the data we want
  const ageGroupPercentage = (d: NationalInfectedAgeGroupsValue) => d.age_group_percentage;
  const infectedPercentage = (d: NationalInfectedAgeGroupsValue) => d.infected_percentage;
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
  const compose = (scale: any, accessor: any) => (d: NationalInfectedAgeGroupsValue) => scale(accessor(d));
  const ageGroupPercentagePoint = compose(ageGroupPercentageScale, ageGroupPercentage);
  const infectedPercentagePoint = compose(infectedPercentageScale, infectedPercentage);
  const yPoint = compose(yScale, y);

  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGGElement> | React.MouseEvent<SVGGElement>) => {
      // const { x, y } = localPoint(event) || { x: 0, y: 0 };
    },
    [],
  );

  return (
    <svg width={width} height={height}>
      <GridColumns
        scale={ageGroupPercentageScale}
        width={xMax}
        height={yMax}
        left={margin.left}
        top={margin.top}
        numTicks={5}
      />
      <GridColumns
        scale={infectedPercentageScale}
        width={xMax}
        height={yMax}
        left={width / 2 + labelWidth / 2}
        top={margin.top}
        numTicks={5}
      />

      {values.map((d, i) => {
        const ageGroupPercentageWidth = xMax - ageGroupPercentagePoint(d);
        const infectedPercentageWidth = infectedPercentagePoint(d);
        return (
          <Group key={`bar-${i}`}

            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}>
            <Bar
              x={(width / 2 - labelWidth / 2) - ageGroupPercentageWidth}
              y={yPoint(d)}
              height={yScale.bandwidth()}
              width={ageGroupPercentageWidth}
              fill="lightgrey"
            />
            <Text textAnchor="middle" verticalAnchor="middle" dy={yPoint(d) + yScale.bandwidth() / 2} dx={(width / 2)}>{y(d)}</Text>
            <Bar
              x={width / 2 + labelWidth / 2}
              y={yPoint(d)}
              height={yScale.bandwidth()}
              width={infectedPercentageWidth}
              fill="#01689b"
            />
          </Group>
        );
      })}

      <AxisBottom
        scale={ageGroupPercentageScale}
        left={margin.left}
        top={yMax}
      />

      <AxisBottom
        scale={infectedPercentageScale}
        left={width / 2 + labelWidth / 2}
        top={yMax}
      />
    </svg>
  );

}