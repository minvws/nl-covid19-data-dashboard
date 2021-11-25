import { colors } from '@corona-dashboard/common';
import { MapType } from '~/components/choropleth/logic';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
} from '~/domain/behavior/logic/behavior-types';

const positiveTestedThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.underReported,
    threshold: 0,
  },
  {
    color: colors.data.scale.blue[0],
    threshold: 0.1,
  },
  {
    color: colors.data.scale.blue[1],
    threshold: 4,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 7,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 10,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 20,
  },
  {
    color: colors.data.scale.blue[5],
    threshold: 30,
  },
];

const hospitalAdmissionsThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.underReported,
    threshold: 0,
  },
  {
    color: colors.data.scale.blue[0],
    threshold: 1,
  },
  {
    color: colors.data.scale.blue[1],
    threshold: 2,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 3,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 4,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 5,
  },
];

const elderlyAtHomeThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.underReported,
    threshold: 0,
  },
  {
    color: colors.data.scale.blue[0],
    threshold: 1,
  },
  {
    color: colors.data.scale.blue[1],
    threshold: 5,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 8,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 11,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 21,
  },
  {
    color: colors.data.scale.blue[5],
    threshold: 31,
  },
];

const sewerThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.underReported,
    threshold: 0,
  },
  {
    color: colors.data.scale.blue[0],
    threshold: 0.01,
  },
  {
    color: colors.data.scale.blue[1],
    threshold: 50,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 250,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 500,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 750,
  },
  {
    color: colors.data.scale.blue[5],
    threshold: 1000,
  },
];

const vrHospitalAdmissionsThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.underReported,
    threshold: 0,
  },
  {
    color: colors.data.scale.blue[0],
    threshold: 1,
  },
  {
    color: colors.data.scale.blue[1],
    threshold: 5,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 10,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 15,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 20,
  },
];

const infectedLocationsPercentageThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.underReported,
    threshold: 0,
  },
  {
    color: colors.data.scale.blue[0],
    threshold: 0.1,
  },
  {
    color: colors.data.scale.blue[1],
    threshold: 10,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 20,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 30,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 40,
  },
];

const behaviorComplianceThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.scale.blue[0],
    threshold: 0,
  },
  {
    color: colors.data.scale.blue[1],
    threshold: 40,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 50,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 60,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 70,
  },
  {
    color: colors.data.scale.blue[5],
    threshold: 80,
  },
  {
    color: colors.data.scale.blue[6],
    threshold: 90,
  },
];

const behaviorSupportThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.scale.yellow[0],
    threshold: 0,
  },
  {
    color: colors.data.scale.yellow[1],
    threshold: 40,
  },
  {
    color: colors.data.scale.yellow[2],
    threshold: 50,
  },
  {
    color: colors.data.scale.yellow[3],
    threshold: 60,
  },
  {
    color: colors.data.scale.yellow[4],
    threshold: 70,
  },
  {
    color: colors.data.scale.yellow[5],
    threshold: 80,
  },
  {
    color: colors.data.scale.yellow[6],
    threshold: 90,
  },
];

const vaccineCoverageThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.scale.blue[0],
    threshold: 0,
    label: '',
  },
  {
    color: colors.data.scale.blue[1],
    threshold: 10,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 30,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 40,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 50,
  },
  {
    color: colors.data.scale.blue[5],
    threshold: 70,
    label: '70+',
  },
];

const vaccineCoveragePercentageThresholds: ChoroplethThresholdsValue[] = [
  { color: colors.data.scale.blueDetailed[0], threshold: 0, label: '0%' },
  { color: colors.data.scale.blueDetailed[1], threshold: 50, label: '50%' },
  { color: colors.data.scale.blueDetailed[2], threshold: 60, label: '60%' },
  { color: colors.data.scale.blueDetailed[4], threshold: 70, label: '70%' },
  { color: colors.data.scale.blueDetailed[6], threshold: 80, label: '80%' },
  { color: colors.data.scale.blueDetailed[8], threshold: 90, label: '90%' },
];

const situationsThreshold: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.scale.blueDetailed[0],
    threshold: 0,
    label: '0%',
  },
  {
    color: colors.data.scale.blueDetailed[1],
    threshold: 10,
    label: '10%',
  },
  {
    color: colors.data.scale.blueDetailed[2],
    threshold: 20,
    label: '20%',
  },
  {
    color: colors.data.scale.blueDetailed[3],
    threshold: 30,
    label: '30%',
  },
  {
    color: colors.data.scale.blueDetailed[4],
    threshold: 40,
    label: '40%',
  },
  {
    color: colors.data.scale.blueDetailed[5],
    threshold: 50,
    label: '50%',
  },
  {
    color: colors.data.scale.blueDetailed[6],
    threshold: 60,
    label: '60%',
  },
  {
    color: colors.data.scale.blueDetailed[7],
    threshold: 70,
    label: '70%',
  },
  {
    color: colors.data.scale.blueDetailed[8],
    threshold: 80,
    label: '80%',
  },
  {
    color: colors.data.scale.blueDetailed[9],
    threshold: 90,
    label: '90%',
    endLabel: '100%',
  },
];

const hasSufficientDataThresholds = [
  {
    color: colors.silver,
    threshold: 0,
  },
  {
    color: colors.data.primary,
    threshold: 1,
  },
];

type Thresholds = Record<MapType, Record<string, ChoroplethThresholdsValue[]>>;

export const thresholds: Thresholds = {
  gm: {
    infected_per_100k: positiveTestedThresholds,
    admissions_on_date_of_admission: hospitalAdmissionsThresholds,
    elderly_at_home: elderlyAtHomeThresholds,
    average: sewerThresholds,
    fully_vaccinated_percentage: vaccineCoveragePercentageThresholds,
    has_one_shot_percentage: vaccineCoveragePercentageThresholds,
  },
  vr: {
    infected_per_100k: positiveTestedThresholds,
    admissions_on_date_of_admission: vrHospitalAdmissionsThresholds,
    infected_locations_percentage: infectedLocationsPercentageThresholds,
    average: sewerThresholds,
    positive_tested_daily_per_100k: elderlyAtHomeThresholds,
    coverage_percentage: vaccineCoverageThresholds,
    has_sufficient_data: hasSufficientDataThresholds,
    home_and_visits: situationsThreshold,
    work: situationsThreshold,
    school_and_day_care: situationsThreshold,
    health_care: situationsThreshold,
    gathering: situationsThreshold,
    travel: situationsThreshold,
    hospitality: situationsThreshold,
    fully_vaccinated_percentage: vaccineCoveragePercentageThresholds,
    has_one_shot_percentage: vaccineCoveragePercentageThresholds,
    other: situationsThreshold,
    ...(Object.fromEntries(
      behaviorIdentifiers.map((key) => [
        `${key}_support`,
        behaviorSupportThresholds,
      ])
    ) as Record<`${BehaviorIdentifier}_support`, ChoroplethThresholdsValue[]>),
    ...(Object.fromEntries(
      behaviorIdentifiers.map((key) => [
        `${key}_compliance`,
        behaviorComplianceThresholds,
      ])
    ) as Record<
      `${BehaviorIdentifier}_compliance`,
      ChoroplethThresholdsValue[]
    >),
  },
  in: {
    infected_per_100k_average: positiveTestedThresholds,
  },
};

export type ChoroplethThresholdsValue<T extends number = number> = {
  color: string;
  threshold: T;
  label?: string;
  /**
   * Optionally define the label which explains the "end" of a threshold
   */
  endLabel?: string;
};
