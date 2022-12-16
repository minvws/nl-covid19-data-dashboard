import { localPoint } from '@visx/event';
import { scaleBand, scaleLinear, ScaleTypeToD3Scale } from '@visx/scale';
import { MouseEvent, useMemo } from 'react';
import { GetTooltipCoordinates, TooltipCoordinates } from '~/components/tooltip';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { AGE_GROUP_TOOLTIP_WIDTH } from './age-demographic-chart';
import { AgeDemographicDefaultValue } from './types';

export interface AgeDemographicCoordinates<T extends AgeDemographicDefaultValue> {
  width: number;
  height: number;
  singleBarHeight: number;
  numTicks: number;
  xMax: number;
  yMax: number;
  leftScale: ValueOf<ScaleTypeToD3Scale<any, any, any>>;
  rightScale: ValueOf<ScaleTypeToD3Scale<any, any, any>>;
  leftPoint: (value: T) => any;
  rightPoint: (value: T) => any;
  ageGroupRangePoint: (value: T) => any;
  getTooltipCoordinates: GetTooltipCoordinates<T>;
  isSmallScreen: boolean;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  values: T[];
  ageGroupRange: (value: T) => string;
  axisWidth: number;
}

export function useAgeDemographicCoordinates<T extends AgeDemographicDefaultValue>(
  data: { values: T[] },
  rightMetricProperty: keyof T,
  leftMetricProperty: keyof T,
  maxDisplayValue?: number
) {
  const [ref, { width = 840 }] = useResizeObserver<HTMLDivElement>();

  const { xs, xl } = useBreakpoints();
  const isSmallScreen = !xl;
  const isExtraSmallScreen = xs;

  const coordinates = useMemo(() => {
    return calculateAgeDemographicCoordinates(data, rightMetricProperty, leftMetricProperty, isSmallScreen, width, isExtraSmallScreen, maxDisplayValue);
  }, [data, rightMetricProperty, leftMetricProperty, isSmallScreen, width, isExtraSmallScreen, maxDisplayValue]);

  return [ref, coordinates] as const;
}

function calculateAgeDemographicCoordinates<T extends AgeDemographicDefaultValue>(
  data: { values: T[] },
  rightMetricProperty: keyof T,
  leftMetricProperty: keyof T,
  isSmallScreen: boolean,
  parentWidth: number,
  isExtraSmallScreen: boolean,
  maxDisplayValue?: number
): AgeDemographicCoordinates<T> {
  const values = data.values.sort((a, b) => {
    return b.age_group_range.localeCompare(a.age_group_range);
  });

  const barCount = values.length;
  const singleBarHeight = 25;

  // Define the graph dimensions and margins
  const axisWidth = 100;
  const width = parentWidth;

  // Height and top margin are higher for small screens to fit the heading texts
  const isNarrowScreen = parentWidth < 400;
  // Set height height according to amount of bars in chart.
  const narrowScreenHeight = 234 + singleBarHeight * barCount;
  const normalScreenHeight = 214 + singleBarHeight * barCount;
  const height = isNarrowScreen ? narrowScreenHeight : normalScreenHeight;
  const marginX = isSmallScreen ? 10 : 40;
  const margin = {
    top: isNarrowScreen ? 55 : 35,
    bottom: 20,
    left: marginX,
    right: marginX,
  };

  const numTicks = isSmallScreen ? (isExtraSmallScreen ? 3 : 2) : 4;

  // Bounds of the graph
  const xMax = (width - margin.left - margin.right - axisWidth) / 2;
  const yMax = height - margin.top - margin.bottom;

  // Helper functions to retrieve parts of the values
  const getLeftValue = (value: T) => {
    const leftValue = value[leftMetricProperty];
    return typeof leftValue === 'number' ? leftValue : 0;
  };
  const getRightValue = (value: T) => {
    const rightValue = value[rightMetricProperty];
    return typeof rightValue === 'number' ? rightValue : 0;
  };
  const ageGroupRange = (value: T) => value.age_group_range;

  // Scales to map between values and coordinates

  // The scales for bar sizing will use the same domain
  const domainValues = [0, Math.max(...values.map((value) => Math.max(getLeftValue(value), getRightValue(value))))];

  /**
   * If there's a `displayMaxPercentage`-prop we'll clip the domain to that value
   */
  if (maxDisplayValue) {
    domainValues[1] = Math.min(maxDisplayValue, domainValues[1]);
  }

  const leftScale = scaleLinear({
    range: [xMax, 0],
    round: true,
    domain: domainValues,
    clamp: true,
    nice: true,
  });

  const rightScale = scaleLinear({
    range: [0, xMax],
    round: true,
    domain: domainValues,
    clamp: true,
    nice: true,
  });

  const ageGroupRangeScale = scaleBand({
    range: [margin.top, height - margin.top],
    round: true,
    domain: values.map(ageGroupRange),
    padding: 0.4,
  });

  // Compose together the scale and accessor functions to get point functions
  // The any/any is needed as typing would be a-flexible; and without it Typescript would complain
  const createPoint = (scale: any, accessor: any) => (value: T) => scale(accessor(value));
  const leftPoint = createPoint(leftScale, getLeftValue);
  const rightPoint = createPoint(rightScale, getRightValue);
  const ageGroupRangePoint = createPoint(ageGroupRangeScale, ageGroupRange);

  // Method for the tooltip to retrieve coordinates based on
  // The event and/or the value
  const getTooltipCoordinates: GetTooltipCoordinates<T> = (value: T, event?: MouseEvent<any>): TooltipCoordinates => {
    const point = event ? localPoint(event) || { x: width } : { x: 0 };

    // On small screens and when using keyboard
    // align the tooltip in the middle
    let left = (width - AGE_GROUP_TOOLTIP_WIDTH) / 2;

    // On desktop: align the tooltip with the bars
    // Not for keyboard (they don't pass a mouse event)
    if (!isSmallScreen && event) {
      const infectedPercentageSide = point.x > width / 2;
      if (infectedPercentageSide) {
        // Align the top left of the tooltip with the middle of the infected percentage bar
        left = width / 2 + axisWidth / 2 + rightPoint(value) / 2;
      } else {
        // Align the top right of the tooltip with the middle of the age group percentage bar
        left = width / 2 - axisWidth / 2 - (xMax - leftPoint(value)) / 2 - AGE_GROUP_TOOLTIP_WIDTH;
      }
    }

    const top = ageGroupRangePoint(value);
    return { left, top };
  };

  return {
    width,
    height,
    singleBarHeight,
    numTicks,
    xMax,
    yMax,
    leftScale,
    rightScale,
    leftPoint,
    rightPoint,
    ageGroupRangePoint,
    getTooltipCoordinates,
    isSmallScreen,
    margin,
    values,
    ageGroupRange,
    axisWidth,
  };
}
