import { scaleBand, scaleLinear, ScaleTypeToD3Scale } from '@visx/scale';
import { ScaleBand } from 'd3-scale';
import { useMemo } from 'react';
import theme from '~/style/theme';
import { Breakpoints, useBreakpoints } from '~/utils/use-breakpoints';
import { GetTooltipCoordinates } from '../tooltip';
import { BAR_CHART_TOOLTIP_MAX_WIDTH } from './bar-chart-graph';

const SVG_NS = 'http://www.w3.org/2000/svg';
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
  labelFontSize: string;
}

function calculateMaximumLabelLength(labels: string[], fontSize: string) {
  const longestLabel = labels.reduce(
    (longest, label) => (label.length > longest.length ? label : longest),
    ''
  );

  if (typeof window !== 'undefined' && longestLabel.length > 0) {
    const textElement = window.document.createElementNS(SVG_NS, 'text');
    textElement.textContent = longestLabel;
    textElement.setAttributeNS(null, 'font-size', fontSize);
    textElement.setAttributeNS(null, 'font-family', theme.fonts.body);

    const svgElement = window.document.createElementNS(SVG_NS, 'svg');
    svgElement.append(textElement);

    document.body.appendChild(svgElement);

    const length = textElement.getComputedTextLength();
    document.body.removeChild(svgElement);

    return length;
  }

  /**
   * Multiply to give SSR y-axis enough space
   */
  return longestLabel.length * 4;
}

export function useBarChartCoordinates(
  values: BarChartValue[],
  parentWidth: number
) {
  const breakpoints = useBreakpoints();

  return useMemo(() => {
    return generateBarChartCoordinates(values, parentWidth, breakpoints);
  }, [values, parentWidth, breakpoints]);
}

function generateBarChartCoordinates(
  values: BarChartValue[],
  parentWidth: number,
  breakpoints: Breakpoints
): BarChartCoordinates {
  const getValue = (value: BarChartValue): number => value.value;
  const getLabel = (value: BarChartValue): string => value.label;

  const width = parentWidth;

  const labelFontSize = breakpoints.md
    ? theme.fontSizes[2]
    : theme.fontSizes[0];

  const labels = values.map(getLabel);

  const maxLabelLength = calculateMaximumLabelLength(labels, labelFontSize);

  const spacing = {
    top: 0,
    right: 0,
    bottom: 54, // used for x axis values and label
    left: maxLabelLength, // for y axis labels
  };

  const spacingLabel = 10;

  const barsWidth = width - spacing.left - spacing.right;
  const barsHeight = values.length * 35;
  const height = barsHeight + spacing.top + spacing.bottom;

  const numTicks = width > 400 ? 10 : 6;

  const valueScale = scaleLinear({
    range: [0, barsWidth],
    round: true,
    domain: [0, Math.max(...values.map(getValue))],
  });

  const labelScale = scaleBand({
    range: [spacing.top, height - spacing.bottom],
    round: true,
    domain: labels,
    padding: 0.4,
  });

  const createPoint = (scale: any, accessor: any) => (value: BarChartValue) =>
    scale(accessor(value));

  const getBarSize = createPoint(valueScale, getValue);
  const getBarOffset = createPoint(labelScale, getLabel);

  function getTooltipCoordinates(value: BarChartValue) {
    const labelScaleStep = labelScale.step();
    const paddingBottom = (labelScaleStep * labelScale.paddingOuter()) / 2;

    /**
     * Set the offset first, than calculate the padding on the bottom side and substract it with 1 full step to align
     * Since the tooltip is placed right under the bar the padding calculation needs to be done
     */

    const top = getBarOffset(value) + paddingBottom - labelScaleStep;

    // Calculate if the tooltip is inside of the window size and if event target exists
    const left =
      barsWidth - getBarSize(value) >= BAR_CHART_TOOLTIP_MAX_WIDTH
        ? (getBarSize(value) ?? 0) + spacing.left + spacingLabel
        : spacing.left + spacingLabel;

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
    labelFontSize,
  };
}
