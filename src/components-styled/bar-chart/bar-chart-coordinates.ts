import { scaleBand, scaleLinear, ScaleTypeToD3Scale } from '@visx/scale';
import { ScaleBand } from 'd3-scale';
import { useMemo } from 'react';
import { GetTooltipCoordinates } from '../tooltip';

export interface BarChartValue {
  value: number;
  label: string;
  tooltip: string;
  color: string;
}

export interface BarChartCoordinates {
  width: number;
  height: number;
  spacing: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  spacingLabel: number;
  valueScale: ValueOf<ScaleTypeToD3Scale<any, any, any>>;
  labelScale: ScaleBand<string>;
  barsWidth: number;
  barsHeight: number;
  numTicks: number;
  values: BarChartValue[];
  getBarSize: (x: BarChartValue) => number;
  getBarOffset: (x: BarChartValue) => number | undefined;
  getLabel: (x: BarChartValue) => string;
  getTooltipCoordinates: GetTooltipCoordinates<BarChartValue>;
}

export function useBarChartCoordinates(
  values: BarChartValue[],
  parentWidth: number
) {
  return useMemo(() => {
    return generateBarChartCoordinates(values, parentWidth);
  }, [values, parentWidth]);
}

function generateBarChartCoordinates(
  values: BarChartValue[],
  parentWidth: number
): BarChartCoordinates {
  const width = parentWidth;

  const spacing = {
    top: 0,
    right: 0,
    bottom: 50, // used for x axis values and label
    left: 108, // for y axis labels
  };

  const spacingLabel = 10;

  const barsWidth = width - spacing.left - spacing.right;
  const barsHeight = values.length * 40;
  const height = barsHeight + spacing.top + spacing.bottom;

  const numTicks = 10;

  const getValue = (value: BarChartValue): number => value.value;
  const getLabel = (value: BarChartValue): string => value.label;

  const valueScale = scaleLinear({
    range: [0, barsWidth],
    round: true,
    domain: [0, Math.max(...values.map(getValue))],
  });

  const labelScale = scaleBand({
    range: [spacing.top, height - spacing.bottom],
    round: true,
    domain: values.map(getLabel),
    padding: 0.2,
  });

  const createPoint = (scale: any, accessor: any) => (value: BarChartValue) =>
    scale(accessor(value));

  const getBarSize = createPoint(valueScale, getValue);
  const getBarOffset = createPoint(labelScale, getLabel);

  // const xPoint = (value: BarChartValue) => xScale(getValue(value));
  // const yPoint = (value: BarChartValue) => yScale(getLabel(value));

  function getTooltipCoordinates(value: BarChartValue) {
    const left = getBarSize(value) ?? 0 + spacing.left;
    const top = getBarOffset(value) ?? 0 + spacing.top;

    return { left, top };
  }

  return {
    width,
    height,
    spacing,
    spacingLabel,
    valueScale,
    labelScale,
    barsWidth,
    barsHeight,
    numTicks,
    values,
    getBarSize,
    getBarOffset,
    getLabel,
    getTooltipCoordinates,
  };
}
