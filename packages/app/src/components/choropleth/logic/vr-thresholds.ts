import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
} from '~/domain/behavior/logic/behavior-types';
import { SituationKey } from '~/domain/situations/logic/situations';
import { colors } from '~/style/theme';

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

const escalationThresholds: ChoroplethThresholdsValue<1 | 2 | 3 | 4>[] = [
  {
    color: colors.data.scale.magenta[0],
    threshold: 1,
  },
  {
    color: colors.data.scale.magenta[1],
    threshold: 2,
  },
  {
    color: colors.data.scale.magenta[2],
    threshold: 3,
  },
  {
    color: colors.data.scale.magenta[3],
    threshold: 4,
  },
];

const nursingHomeInfectedLocationsPercentageThresholds: ChoroplethThresholdsValue[] =
  [
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
    threshold: 10,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 50,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 100,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 250,
  },
  {
    color: colors.data.scale.blue[5],
    threshold: 500,
  },
  {
    color: colors.data.scale.blue[6],
    threshold: 1000,
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

const elderlyAtHomeThresholds: ChoroplethThresholdsValue[] = [
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

const behaviorThresholds = {
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
  ) as Record<`${BehaviorIdentifier}_compliance`, ChoroplethThresholdsValue[]>),
};

export const vrThresholds = {
  tested_overall: {
    infected_per_100k: positiveTestedThresholds,
  },
  hospital_nice: {
    admissions_on_date_of_reporting: hospitalAdmissionsThresholds,
  },
  escalation_levels: {
    level: escalationThresholds,
  },
  nursing_home: {
    infected_locations_percentage:
      nursingHomeInfectedLocationsPercentageThresholds,
  },
  disability_care: {
    infected_locations_percentage:
      nursingHomeInfectedLocationsPercentageThresholds,
  },
  sewer: {
    average: sewerThresholds,
  },
  behavior: behaviorThresholds,
  elderly_at_home: {
    positive_tested_daily_per_100k: elderlyAtHomeThresholds,
  },
  vaccine: {
    coverage_percentage: vaccineCoverageThresholds,
  },
  situations: <Record<SituationKey, ChoroplethThresholdsValue[]>>{
    has_sufficient_data: hasSufficientDataThresholds,
    home_and_visits: situationsThreshold,
    work: situationsThreshold,
    school_and_day_care: situationsThreshold,
    health_care: situationsThreshold,
    gathering: situationsThreshold,
    travel: situationsThreshold,
    hospitality: situationsThreshold,
    other: situationsThreshold,
  },
} as const;
