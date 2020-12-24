import { scaleBand, scaleLinear, ScaleTypeToD3Scale } from '@visx/scale';
import { ScaleBand } from 'd3-scale';
import { useMemo } from 'react';
import { GetTooltipCoordinates } from '../tooltip';
import { BAR_CHART_TOOLTIP_MAX_WIDTH } from './bar-chart-graph';

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
  const barsHeight = values.length * 35;
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
    padding: 0.4,
  });

  const createPoint = (scale: any, accessor: any) => (value: BarChartValue) =>
    scale(accessor(value));

  const getBarSize = createPoint(valueScale, getValue);
  const getBarOffset = createPoint(labelScale, getLabel);

  function getTooltipCoordinates(value: BarChartValue) {
    const labelScaleStep = labelScale.step();
    const paddingBottom = (labelScaleStep * labelScale.paddingOuter() / 2);

    /**
    * Set the offset first, than calculate the padding on the bottom side and substract it with 1 full step to align 
    * Since the tooltip is placed right under the bar the padding calculation needs to be done
    */ 

    const top = getBarOffset(value) + paddingBottom - labelScaleStep;

    // Calculate if the tooltip is inside of the window size and if event target exists 
    const left = barsWidth - getBarSize(value) >= BAR_CHART_TOOLTIP_MAX_WIDTH 
      ? (getBarSize(value) ?? 0) + spacing.left + spacingLabel
      : spacing.left + spacingLabel
    
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
