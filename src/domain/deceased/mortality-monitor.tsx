import { GridRows } from '@visx/grid';
import { curveMonotoneX } from '@visx/curve';
import { ParentSize } from '@visx/responsive';
import { Threshold } from '@visx/threshold';
import { scaleTime, scaleLinear } from '@visx/scale';
import { NationalDeceasedCbsValue } from '~/types/data';
import {
  Axis,
  AxisBottom,
  AxisLeft,
  AxisRight,
  AxisScale,
  Orientation,
  SharedAxisProps,
} from '@visx/axis';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';

export function MortalityMonitor({
  values,
}: {
  values: NationalDeceasedCbsValue[];
}) {
  return (
    <div>
      <ParentSize>
        {(parent) => (
          <MortalityMonitorChart
            width={parent.width}
            height={300}
            values={values}
          />
        )}
      </ParentSize>
    </div>
  );
}

const getDate = (d: NationalDeceasedCbsValue) => d.date_of_report_unix * 1000;
const getExpectedMin = (d: NationalDeceasedCbsValue) => d.expected_min;
const getExpectedMax = (d: NationalDeceasedCbsValue) => d.expected_max;
const getExpected = (d: NationalDeceasedCbsValue) => d.expected;
const getRegistered = (d: NationalDeceasedCbsValue) => d.registered;
const getAllYValues = (d: NationalDeceasedCbsValue) => [
  getExpected(d),
  getExpectedMin(d),
  getExpectedMax(d),
  getRegistered(d),
];

const margin = { top: 40, right: 30, bottom: 50, left: 40 };

function MortalityMonitorChart({
  values,
  width,
  height,
}: {
  values: NationalDeceasedCbsValue[];
  width: number;
  height: number;
}) {
  const timeScale = scaleTime<number>({
    domain: [
      Math.min(...values.map(getDate)),
      Math.max(...values.map(getDate)),
    ],
  });

  const mortalityScale = scaleLinear<number>({
    domain: [
      Math.min(...values.flatMap(getAllYValues)),
      Math.max(...values.flatMap(getAllYValues)),
    ],
    nice: true,
  });

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  timeScale.range([0, xMax]);
  mortalityScale.range([yMax, 0]);

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <AxisBottom
          top={yMax}
          scale={timeScale}
          numTicks={width > 520 ? 10 : 5}
        />

        <GridRows
          scale={mortalityScale}
          width={xMax}
          height={yMax}
          left={0}
          top={0}
          numTicks={3}
          stroke="#ccc"
        />

        <AxisLeft
          scale={mortalityScale}
          left={0}
          top={0}
          numTicks={3}
          hideTicks={true}
          hideAxisLine={true}
        />

        <Threshold
          id="margin"
          data={values}
          x={(d) => timeScale(getDate(d)) ?? 0}
          y0={(d) => mortalityScale(getExpectedMin(d))}
          y1={(d) => mortalityScale(getExpectedMax(d))}
          clipAboveTo={0}
          clipBelowTo={yMax}
          curve={curveMonotoneX}
          belowAreaProps={{ fill: '#D0EDFF' }}
          aboveAreaProps={{ fill: '#D0EDFF' }}
        />

        <LinePath
          curve={curveMonotoneX}
          data={values}
          x={(d) => timeScale(getDate(d))}
          y={(d) => mortalityScale(getExpected(d)) ?? 0}
          stroke="#5BADDB"
          strokeWidth="1.5"
          shapeRendering="geometricPrecision"
        />

        <LinePath
          curve={curveMonotoneX}
          data={values}
          x={(d) => timeScale(getDate(d))}
          y={(d) => mortalityScale(getRegistered(d)) ?? 0}
          stroke="#007BC7"
          strokeWidth="1.5"
          shapeRendering="geometricPrecision"
        />
      </Group>
    </svg>
  );
}
