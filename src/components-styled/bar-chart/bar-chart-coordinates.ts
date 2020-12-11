import { scaleBand, scaleLinear, ScaleTypeToD3Scale } from '@visx/scale';
import { ScaleBand } from 'd3-scale';
import { MouseEvent, useMemo } from 'react';
import { GetTooltipCoordinates } from '../tooltip';

export interface BarChartCoordinates {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  spacingLabel: number;
  xScale: ValueOf<ScaleTypeToD3Scale<any, any, any>>;
  yScale: ScaleBand<string>;
  xMax: number;
  yMax: number;
  numTicks: number;
  values: any[];
  xPoint: (x: any) => number;
  yPoint: (x: any) => number;
  y: (x: any) => string;
  getTooltipCoordinates: GetTooltipCoordinates<any>;
}

export function useBarChartCoordinates(
  data: any[],
  keys: string[],
  parentWidth: number
) {
  return useMemo(() => {
    return generateBarChartCoordinates(data, keys, parentWidth);
  }, [data, keys, parentWidth]);
}

function generateBarChartCoordinates(
  data: any[],
  keys: string[],
  parentWidth: number
): BarChartCoordinates {
  const values = data;
  const width = parentWidth;

  const margin = {
    top: 0,
    right: 0,
    bottom: 50, // used for x axis values and label
    left: 108, // for y axis labels
  };

  const spacingLabel = 10;

  const xMax = width - margin.left - margin.right;
  const yMax = values.length * 40;
  const height = yMax + margin.top + margin.bottom;

  const numTicks = 10;

  const x = (value: any): number => value.y;
  const y = (value: any) => {
    const index = values.indexOf(value);
    return keys[index];
  };

  const xScale = scaleLinear({
    range: [0, xMax],
    round: true,
    domain: [0, Math.max(...values.map(x))],
  });

  const yScale = scaleBand({
    range: [margin.top, height - margin.bottom],
    round: true,
    domain: values.map(y),
    padding: 0.2,
  });

  const createPoint = (scale: any, accessor: any) => (value: any) =>
    scale(accessor(value));

  const xPoint = createPoint(xScale, x);
  const yPoint = createPoint(yScale, y);

  function getTooltipCoordinates(event?: MouseEvent<any>, value?: any) {
    const left = (value ? xPoint(value) : 0) + margin.left;
    const top = (value ? yPoint(value) : 0) + margin.top;

    return { left, top };
  }

  return {
    width,
    height,
    margin,
    spacingLabel,
    xScale,
    yScale,
    xMax,
    yMax,
    numTicks,
    values,
    xPoint,
    yPoint,
    y,
    getTooltipCoordinates,
  };
}
