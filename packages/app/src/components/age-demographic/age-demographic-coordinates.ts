import { KeysOfType } from '@corona-dashboard/common';
import { localPoint } from '@visx/event';
import { scaleBand, scaleLinear, ScaleTypeToD3Scale } from '@visx/scale';
import { ScaleBand } from 'd3-scale';
import { MouseEvent, useMemo } from 'react';
import {
  GetTooltipCoordinates,
  TooltipCoordinates,
} from '~/components/tooltip';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { AGE_GROUP_TOOLTIP_WIDTH } from './age-demographic-chart';
import { AgeDemographicDefaultValue } from './types';

export interface AgeDemographicCoordinates<
  T extends AgeDemographicDefaultValue
> {
  width: number;
  height: number;
  numTicks: number;
  xMax: number;
  yMax: number;
  leftPercentageScale: ValueOf<ScaleTypeToD3Scale<any, any, any>>;
  rightPercentageScale: ValueOf<ScaleTypeToD3Scale<any, any, any>>;
  leftPercentagePoint: (value: T) => any;
  rightPercentagePoint: (value: T) => any;
  ageGroupRangeScale: ScaleBand<string>;
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

export function useAgeDemographicCoordinates<
  T extends AgeDemographicDefaultValue
>(
  data: { values: T[] },
  rightMetricProperty: KeysOfType<T, number, true>,
  leftMetricProperty: KeysOfType<T, number, true>,
  displayMaxPercentage?: number
) {
  const [ref, { width = 840 }] = useResizeObserver<HTMLDivElement>();

  const { xs, xl } = useBreakpoints();
  const isSmallScreen = !xl;
  const isExtraSmallScreen = xs;

  const coordinates = useMemo(() => {
    return calculateAgeDemographicCoordinates(
      data,
      rightMetricProperty,
      leftMetricProperty,
      isSmallScreen,
      width,
      isExtraSmallScreen,
      displayMaxPercentage
    );
  }, [
    data,
    rightMetricProperty,
    leftMetricProperty,
    isSmallScreen,
    width,
    isExtraSmallScreen,
    displayMaxPercentage,
  ]);

  return [ref, coordinates] as const;
}

function calculateAgeDemographicCoordinates<
  T extends AgeDemographicDefaultValue
>(
  data: { values: T[] },
  rightMetricProperty: KeysOfType<T, number, true>,
  leftMetricProperty: KeysOfType<T, number, true>,
  isSmallScreen: boolean,
  parentWidth: number,
  isExtraSmallScreen: boolean,
  displayMaxPercentage?: number
): AgeDemographicCoordinates<T> {
  const values = data.values.sort((a, b) => {
    return b.age_group_range.localeCompare(a.age_group_range);
  });

  // Define the graph dimensions and margins
  const axisWidth = isSmallScreen ? 60 : 100;
  const width = parentWidth;

  // Height and top margin are higher for small screens to fit the heading texts
  const isNarrowScreen = parentWidth < 400;
  const height = isNarrowScreen ? 420 : 400;
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
  const percentage = (value: number) => value * 100;
  const leftPercentage = (value: T) => percentage(value[leftMetricProperty]);
  const rightPercentage = (value: T) => percentage(value[rightMetricProperty]);
  const ageGroupRange = (value: T) => value.age_group_range;

  // Scales to map between values and coordinates

  // The ageGroupPercentageScale and infectedPercentageScale will use the same domain
  const domainPercentages = [
    0,
    Math.max(
      ...values.map((value) =>
        Math.max(leftPercentage(value), rightPercentage(value))
      )
    ),
  ];

  /**
   * If there's a `displayMaxPercentage`-prop we'll clip the domain to that value
   */
  if (displayMaxPercentage) {
    domainPercentages[1] = Math.min(displayMaxPercentage, domainPercentages[1]);
  }

  const leftPercentageScale = scaleLinear({
    range: [xMax, 0],
    round: true,
    domain: domainPercentages,
    clamp: true,
  });
  const rightPercentageScale = scaleLinear({
    range: [0, xMax],
    round: true,
    domain: domainPercentages,
    clamp: true,
  });
  const ageGroupRangeScale = scaleBand({
    range: [margin.top, height - margin.top],
    round: true,
    domain: values.map(ageGroupRange),
    padding: 0.4,
  });

  // Compose together the scale and accessor functions to get point functions
  // The any/any is needed as typing would be a-flexible; and without it Typescript would complain
  const createPoint = (scale: any, accessor: any) => (value: T) =>
    scale(accessor(value));
  const leftPercentagePoint = createPoint(leftPercentageScale, leftPercentage);
  const rightPercentagePoint = createPoint(
    rightPercentageScale,
    rightPercentage
  );
  const ageGroupRangePoint = createPoint(ageGroupRangeScale, ageGroupRange);

  // Method for the tooltip to retrieve coordinates based on
  // The event and/or the value
  const getTooltipCoordinates: GetTooltipCoordinates<T> = (
    value: T,
    event?: MouseEvent<any>
  ): TooltipCoordinates => {
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
        left = width / 2 + axisWidth / 2 + rightPercentagePoint(value) / 2;
      } else {
        // Align the top right of the tooltip with the middle of the age group percentage bar
        left =
          width / 2 -
          axisWidth / 2 -
          (xMax - leftPercentagePoint(value)) / 2 -
          AGE_GROUP_TOOLTIP_WIDTH;
      }
    }

    const top = ageGroupRangePoint(value);
    return { left, top };
  };

  return {
    width,
    height,
    numTicks,
    xMax,
    yMax,
    leftPercentageScale,
    rightPercentageScale,
    ageGroupRangeScale,
    leftPercentagePoint,
    rightPercentagePoint,
    ageGroupRangePoint,
    getTooltipCoordinates,
    isSmallScreen,
    margin,
    values,
    ageGroupRange,
    axisWidth,
  };
}
