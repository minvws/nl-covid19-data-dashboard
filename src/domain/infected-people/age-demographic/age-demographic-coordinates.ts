import { localPoint } from '@visx/event';
import { scaleBand, scaleLinear } from '@visx/scale';
import {
  NationalInfectedAgeGroups,
  NationalInfectedAgeGroupsValue,
} from '~/types/data';

const AGE_GROUP_TOOLTIP_WIDTH = 350;

export interface AgeDemographicCoordinates {
  width: number;
  height: number;
  numTicks: number;
  xMax: number;
  yMax: number;
  ageGroupPercentageScale: any;
  infectedPercentageScale: any;
  ageGroupRangeScale: any;
  ageGroupPercentagePoint: any;
  infectedPercentagePoint: any;
  ageGroupRangePoint: any;
  getTooltipCoordinates: any;
  isSmallScreen: boolean;
  margin: any;
  values: any;
  ageGroupRange: any;
  ageRangeAxisWidth: number;
}

export function getAgeDemographicCoordinates(
  data: NationalInfectedAgeGroups,
  isSmallScreen: boolean,
  parentWidth: number
): AgeDemographicCoordinates {
  const values = data.values.sort((a, b) => {
    const aStart = parseInt(a.age_group_range, 10);
    const bStart = parseInt(b.age_group_range, 10);
    return bStart - aStart;
  });

  // Define the graph dimensions and margins
  const ageRangeAxisWidth = isSmallScreen ? 60 : 100;
  const width = parentWidth;
  const height = 400;
  const marginX = isSmallScreen ? 6 : 40;
  const margin = { top: 35, bottom: 20, left: marginX, right: marginX };

  const numTicks = isSmallScreen ? 3 : 4;

  // Then we'll create some bounds
  const xMax = (width - margin.left - margin.right - ageRangeAxisWidth) / 2;
  const yMax = height - margin.top - margin.bottom;

  // We'll make some helpers to get at the data we want
  const ageGroupPercentage = (d: NationalInfectedAgeGroupsValue) =>
    d.age_group_percentage * 100;
  const infectedPercentage = (d: NationalInfectedAgeGroupsValue) =>
    d.infected_percentage * 100;
  const ageGroupRange = (d: NationalInfectedAgeGroupsValue) =>
    d.age_group_range;

  // And then scale the graph by our data
  const domainPercentages = [
    0,
    Math.max(
      ...values.map((d) =>
        Math.max(ageGroupPercentage(d), infectedPercentage(d))
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
  const createPoint = (scale: any, accessor: any) => (
    d: NationalInfectedAgeGroupsValue
  ) => scale(accessor(d));
  const ageGroupPercentagePoint = createPoint(
    ageGroupPercentageScale,
    ageGroupPercentage
  );
  const infectedPercentagePoint = createPoint(
    infectedPercentageScale,
    infectedPercentage
  );
  const ageGroupRangePoint = createPoint(ageGroupRangeScale, ageGroupRange);

  const getTooltipCoordinates = (
    event: MouseEvent,
    value: NationalInfectedAgeGroupsValue
  ) => {
    const point = localPoint(event) || { x: width };

    // On small screens: align the tooltip in the middle
    let x = (width - AGE_GROUP_TOOLTIP_WIDTH) / 2;

    // On desktop: align the tooltip with the bars
    if (!isSmallScreen) {
      const infectedPercentageSide = point.x > width / 2;
      if (infectedPercentageSide) {
        // Align the top left of the tooltip with the middle of the infected percentage bar
        x =
          width / 2 +
          ageRangeAxisWidth / 2 +
          infectedPercentagePoint(value) / 2;
      } else {
        // Align the top right of the tooltio with the middle of the age group percentage bar
        x =
          width / 2 -
          ageRangeAxisWidth / 2 -
          (xMax - ageGroupPercentagePoint(value)) / 2 -
          AGE_GROUP_TOOLTIP_WIDTH;
      }
    }

    const y = ageGroupRangePoint(value);
    return { x, y };
  };

  const coordinates = {
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

  return coordinates;
}
