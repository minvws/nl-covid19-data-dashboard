import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleTime } from '@visx/scale';
// import { Bar, Line } from '@visx/shape'; import { Text } from '@visx/text';
import { ScaleBand, ScaleLinear, ScaleTime } from 'd3-scale';
import { memo, MouseEvent, ReactNode, TouchEvent } from 'react';
// import { MARKER_MIN_WIDTH } from './marker';

const NUM_TICKS = 3;

export type ChartPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const defaultPadding: ChartPadding = {
  top: 10,
  right: 20,
  bottom: 30,
  left: 30,
};

const defaultColors = {
  axis: '#C4C4C4',
  axisLabels: '#666666',
  benchmark: '#4f5458',
};

// type Benchmark = {value: number; label: string;
// };

export type ChartScales = {
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
};

type ChartAxesProps = {
  // benchmark?: Benchmark; onHover: (event: React.TouchEvent<SVGElement> |
  // React.MouseEvent<SVGElement>, scales: ChartScales) => void; xDomain: [Date,
  // Date]; yDomain: number[];

  /**
   * ScaleTime is not used in StackedBarChart but it's attempting to make Axes
   * compatible with other charts.
   */
  xScale: ScaleTime<number, number> | ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  width: number;
  height: number;
  padding?: ChartPadding;
  formatXAxis: TickFormatter<Date>;
  formatYAxis: TickFormatter<number>;
  children: ReactNode;
};

type AnyTickFormatter = (value: any) => string;

export const ChartAxes = memo(function ChartAxes({
  width,
  height,
  padding = defaultPadding,
  xScale,
  yScale,
  // onHover, benchmark,
  formatXAxis,
  formatYAxis,
  children,
}: ChartAxesProps) {
  const bounds = {
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };

  // const markerPadding = MARKER_MIN_WIDTH / 2; const xScale =
  // scaleTime({domain: xDomain, range: [markerPadding, bounds.width -
  // markerPadding],
  // });

  // const xScale = scaleBand<string>({// domain: values.map(getDate), domain:
  //   xDomain, padding: 0.2,
  // });

  // const yScale = scaleLinear({domain: yDomain, range: [bounds.height, 0],
  //   nice: NUM_TICKS,
  // });

  // const scales = { xScale, yScale };

  // const handleMouse = (event: TouchEvent<SVGElement> |
  //   MouseEvent<SVGElement>) => onHover(event, scales);

  return (
    <svg width={width} height={height} role="img">
      <Group left={padding.left} top={padding.top}>
        <GridRows
          scale={yScale}
          width={bounds.width}
          numTicks={NUM_TICKS}
          stroke={defaultColors.axis}
        />
        <AxisBottom
          scale={xScale}
          tickValues={xScale.domain()}
          tickFormat={formatXAxis as AnyTickFormatter}
          top={bounds.height}
          stroke={defaultColors.axis}
          tickLabelProps={() => ({
            dx: -25,
            fill: defaultColors.axisLabels,
            fontSize: 12,
          })}
          hideTicks
        />
        <AxisLeft
          scale={yScale}
          numTicks={4}
          hideTicks
          hideAxisLine
          stroke={defaultColors.axis}
          tickFormat={formatYAxis as AnyTickFormatter}
          tickLabelProps={() => ({
            fill: defaultColors.axisLabels,
            fontSize: 12,
            dx: 0,
            textAnchor: 'end',
            verticalAnchor: 'middle',
          })}
        />

        {children}
      </Group>
    </svg>
  );
});
