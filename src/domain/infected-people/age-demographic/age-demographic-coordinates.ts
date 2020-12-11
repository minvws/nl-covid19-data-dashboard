import { localPoint } from '@visx/event';
import { scaleBand, scaleLinear, ScaleTypeToD3Scale } from '@visx/scale';
import { ScaleBand } from 'd3-scale';
import { MouseEvent, useMemo } from 'react';
import {
  GetTooltipCoordinates,
  TooltipCoordinates,
} from '~/components-styled/tooltip';
import {
  NationalInfectedAgeGroups,
  NationalInfectedAgeGroupsValue,
} from '~/types/data';
import { AGE_GROUP_TOOLTIP_WIDTH } from './age-demographic-chart';

export interface AgeDemographicCoordinates {
  width: number;
  height: number;
  numTicks: number;
  xMax: number;
  yMax: number;
  ageGroupPercentageScale: ValueOf<ScaleTypeToD3Scale<any, any, any>>;
  infectedPercentageScale: ValueOf<ScaleTypeToD3Scale<any, any, any>>;
  ageGroupRangeScale: ScaleBand<string>;
  ageGroupPercentagePoint: (value: NationalInfectedAgeGroupsValue) => any;
  infectedPercentagePoint: (value: NationalInfectedAgeGroupsValue) => any;
  ageGroupRangePoint: (value: NationalInfectedAgeGroupsValue) => any;
  getTooltipCoordinates: GetTooltipCoordinates<NationalInfectedAgeGroupsValue>;
  isSmallScreen: boolean;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  values: NationalInfectedAgeGroupsValue[];
  ageGroupRange: (value: NationalInfectedAgeGroupsValue) => string;
  ageRangeAxisWidth: number;
}

export function useAgeDemographicCoordinates(
  data: NationalInfectedAgeGroups,
  isSmallScreen: boolean,
  parentWidth: number
) {
  return useMemo(() => {
    return calculateAgeDemographicCoordinates(data, isSmallScreen, parentWidth);
  }, [data, isSmallScreen, parentWidth]);
}

function calculateAgeDemographicCoordinates(
  data: NationalInfectedAgeGroups,
  isSmallScreen: boolean,
  parentWidth: number
): AgeDemographicCoordinates {
  const values = data.values.sort((a, b) => {
    return b.age_group_range.localeCompare(a.age_group_range);
  });

  // Define the graph dimensions and margins
  const ageRangeAxisWidth = isSmallScreen ? 60 : 100;
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

  const numTicks = isSmallScreen ? 3 : 4;

  // Bounds of the graph
  const xMax = (width - margin.left - margin.right - ageRangeAxisWidth) / 2;
  const yMax = height - margin.top - margin.bottom;

  // Helper functions to retrieve parts of the values
  const ageGroupPercentage = (value: NationalInfectedAgeGroupsValue) =>
    value.age_group_percentage * 100;
  const infectedPercentage = (value: NationalInfectedAgeGroupsValue) =>
    value.infected_percentage * 100;
  const ageGroupRange = (value: NationalInfectedAgeGroupsValue) =>
    value.age_group_range;

  // Scales to map between values and coordinates

  // The ageGroupPercentageScale and infectedPercentageScale will use the same domain
  const domainPercentages = [
    0,
    Math.max(
      ...values.map((value) =>
        Math.max(ageGroupPercentage(value), infectedPercentage(value))
      )
    ),
  ];

  const ageGroupPercentageScale = scaleLinear({
    range: [xMax, 0],
    round: true,
    domain: domainPercentages,
  });
  const infectedPercentageScale = scaleLinear({
    range: [0, xMax],
    round: true,
    domain: domainPercentages,
  });
  const ageGroupRangeScale = scaleBand({
    range: [margin.top, height - margin.top],
    round: true,
    domain: values.map(ageGroupRange),
    padding: 0.4,
  });

  // Compose together the scale and accessor functions to get point functions
  // The any/any is needed as typing would be a-flexible; and without it Typescript would complain
  const createPoint = (scale: any, accessor: any) => (
    value: NationalInfectedAgeGroupsValue
  ) => scale(accessor(value));
  const ageGroupPercentagePoint = createPoint(
    ageGroupPercentageScale,
    ageGroupPercentage
  );
  const infectedPercentagePoint = createPoint(
    infectedPercentageScale,
    infectedPercentage
  );
  const ageGroupRangePoint = createPoint(ageGroupRangeScale, ageGroupRange);

  // Method for the tooltip to retrieve coordinates based on
  // The event and/or the value
  const getTooltipCoordinates: GetTooltipCoordinates<NationalInfectedAgeGroupsValue> = (
    event?: MouseEvent<any>,
    value?: NationalInfectedAgeGroupsValue
  ): TooltipCoordinates => {
    const point = event ? localPoint(event) || { x: width } : { x: 0 };

    // On small screens and when using keyboard
    // align the tooltip in the middle
    let left = (width - AGE_GROUP_TOOLTIP_WIDTH) / 2;

    // On desktop: align the tooltip with the bars
    // Not for keyboard (they don't pass a mouse event)
    if (!isSmallScreen && event && value) {
      const infectedPercentageSide = point.x > width / 2;
      if (infectedPercentageSide) {
        // Align the top left of the tooltip with the middle of the infected percentage bar
        left =
          width / 2 +
          ageRangeAxisWidth / 2 +
          infectedPercentagePoint(value) / 2;
      } else {
        // Align the top right of the tooltio with the middle of the age group percentage bar
        left =
          width / 2 -
          ageRangeAxisWidth / 2 -
          (xMax - ageGroupPercentagePoint(value)) / 2 -
          AGE_GROUP_TOOLTIP_WIDTH;
      }
    }

    const top = value ? ageGroupRangePoint(value) : 0;
    return { left, top };
  };

  return {
    width,
    height,
    numTicks,
    xMax,
    yMax,
    ageGroupPercentageScale,
    infectedPercentageScale,
    ageGroupRangeScale,
    ageGroupPercentagePoint,
    infectedPercentagePoint,
    ageGroupRangePoint,
    getTooltipCoordinates,
    isSmallScreen,
    margin,
    values,
    ageGroupRange,
    ageRangeAxisWidth,
  };
}
