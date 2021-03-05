import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Bar, Line } from '@visx/shape';
import { Text } from '@visx/text';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { ComponentProps, memo, MouseEvent, ReactNode, TouchEvent } from 'react';
import { colors } from '~/style/theme';
import css from '@styled-system/css';

const NUM_TICKS = 4;

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
  axis: colors.silver,
  axisLabels: colors.data.axisLabels,
  benchmark: colors.data.benchmark,
};

type Benchmark = {
  value: number;
  label: string;
};

export type ChartScales = {
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
};

export type ComponentCallbackFunction = (
  callbackInfo: ComponentCallbackInfo
) => ReactNode | undefined;

type ChartAxesProps = {
  benchmark?: Benchmark;
  onHover: (
    event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>,
    scales: ChartScales
  ) => void;
  xDomain: [Date, Date];
  yDomain: number[];
  width: number;
  height: number;
  padding: ChartPadding;
  formatXAxis: TickFormatter<Date>;
  formatYAxis: TickFormatter<number>;
  children: (props: ChartScales) => ReactNode;
  componentCallback?: ComponentCallbackFunction;
  ariaLabelledBy?: string;
  dateSpanWidth: number;
  yTickValues?: number[];
};

export type AnyTickFormatter = (value: any) => string;

export type ChartBounds = { width: number; height: number };

export const ChartAxes = memo(function ChartAxes({
  width,
  height,
  padding,
  xDomain,
  yDomain,
  onHover,
  benchmark,
  formatXAxis,
  formatYAxis,
  children,
  componentCallback = () => undefined,
  ariaLabelledBy,
  dateSpanWidth,
  yTickValues,
}: ChartAxesProps) {
  const bounds: ChartBounds = {
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
  };

  const markerPadding = dateSpanWidth / 2;

  const xScale = scaleTime({
    domain: xDomain,
    range: [markerPadding, bounds.width - markerPadding],
  });

  const yScale = scaleLinear({
    domain: yDomain,
    range: [bounds.height, 0],
    nice: yTickValues?.length || NUM_TICKS,
  });

  const scales = { xScale, yScale };

  const handleHover = (
    event: TouchEvent<SVGElement> | MouseEvent<SVGElement>
  ) => onHover(event, scales);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-labelledby={ariaLabelledBy}
      css={css({ overflow: 'visible' })}
    >
      <Group left={padding.left} top={padding.top}>
        {createComponent(
          {
            type: 'CustomBackground',
            props: {
              xScale,
              yScale,
              bounds,
            },
          },
          componentCallback
        )}
        {createComponent(
          {
            type: 'GridRows',
            props: {
              scale: yScale,
              width: bounds.width,
              // width: width,
              numTicks: NUM_TICKS,
              stroke: defaultColors.axis,
            },
          },
          componentCallback
        )}
        {createComponent(
          {
            type: 'AxisBottom',
            props: {
              scale: xScale,
              tickValues: xScale.domain(),
              tickFormat: formatXAxis as AnyTickFormatter,
              top: bounds.height,
              stroke: defaultColors.axis,
              tickLabelProps: () => ({
                dx: -25,
                fill: defaultColors.axisLabels,
                fontSize: 12,
              }),
              hideTicks: true,
            },
          },
          componentCallback
        )}
        {createComponent(
          {
            type: 'AxisLeft',
            props: {
              scale: yScale,
              numTicks: NUM_TICKS,
              tickValues: yTickValues,
              hideTicks: true,
              hideAxisLine: true,
              stroke: defaultColors.axis,
              tickFormat: formatYAxis as AnyTickFormatter,
              tickLabelProps: () => ({
                fill: defaultColors.axisLabels,
                fontSize: 12,
                dx: 0,
                textAnchor: 'end',
                verticalAnchor: 'middle',
              }),
            },
          },
          componentCallback
        )}

        {benchmark && (
          <Group top={yScale(benchmark.value)}>
            <Text fontSize="14px" dy={-8} fill={defaultColors.benchmark}>
              {`${benchmark.label}: ${benchmark.value}`}
            </Text>
            <Line
              stroke={defaultColors.benchmark}
              strokeDasharray="4,3"
              from={{ x: 0, y: 0 }}
              to={{ x: bounds.width, y: 0 }}
            />
          </Group>
        )}

        {children(scales)}

        {/**
         * Render the bar on top of the trends because it captures mouse hover when you are above the trend line
         */}
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          onTouchStart={handleHover}
          onTouchMove={handleHover}
          onMouseMove={handleHover}
          onMouseLeave={handleHover}
        />
      </Group>
    </svg>
  );
});

function createComponent(
  callbackInfo: ComponentCallbackInfo,
  componentCallback: ComponentCallbackFunction
) {
  const result = componentCallback(callbackInfo);
  switch (callbackInfo.type) {
    case 'GridRows': {
      return result !== undefined ? (
        result
      ) : (
        <GridRows {...callbackInfo.props} />
      );
    }
    case 'AxisBottom':
      return result !== undefined ? (
        result
      ) : (
        <AxisBottom {...callbackInfo.props} />
      );
    case 'AxisLeft':
      return result !== undefined ? (
        result
      ) : (
        <AxisLeft {...callbackInfo.props} />
      );
    default:
      return result !== undefined ? result : null;
  }
}

export type ComponentCallbackInfo =
  | {
      type: 'GridRows';
      props: ComponentProps<typeof GridRows>;
    }
  | {
      type: 'AxisBottom';
      props: ComponentProps<typeof AxisBottom>;
    }
  | {
      type: 'AxisLeft';
      props: ComponentProps<typeof AxisLeft>;
    }
  | {
      type: 'CustomBackground';
      props: CustomBackgroundProps;
    };

export type CustomBackgroundProps = {
  bounds: ChartBounds;
} & ChartScales;
