import { GridRows } from '@visx/grid';
import { curveCatmullRom } from '@visx/curve';
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

const date = (d: NationalDeceasedCbsValue) => d.date_of_report_unix * 1000;
const expectedMin = (d: NationalDeceasedCbsValue) => d.expected_min;
const expectedMax = (d: NationalDeceasedCbsValue) => d.expected_max;
const expected = (d: NationalDeceasedCbsValue) => d.expected;
const registered = (d: NationalDeceasedCbsValue) => d.registered;

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
    domain: [Math.min(...values.map(date)), Math.max(...values.map(date))],
  });

  const mortalityScale = scaleLinear<number>({
    domain: [
      Math.min(
        ...values.flatMap((d) => [
          expected(d),
          expectedMin(d),
          expectedMax(d),
          registered(d),
        ])
      ),
      Math.max(
        ...values.flatMap((d) => [
          expected(d),
          expectedMin(d),
          expectedMax(d),
          registered(d),
        ])
      ),
    ],
    nice: true,
  });

  // bounds
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
          id={`${Math.random()}`}
          data={values}
          x={(d) => timeScale(date(d)) ?? 0}
          y0={(d) => mortalityScale(expectedMin(d))}
          y1={(d) => mortalityScale(expectedMax(d))}
          clipAboveTo={0}
          clipBelowTo={yMax}
          curve={curveCatmullRom}
          belowAreaProps={{
            fill: 'green',
            fillOpacity: 0.4,
          }}
          aboveAreaProps={{
            fill: 'green',
            fillOpacity: 0.4,
          }}
        />
      </Group>
    </svg>
  );
}
