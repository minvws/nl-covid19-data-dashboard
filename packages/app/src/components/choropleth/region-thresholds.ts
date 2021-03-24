import { colors } from '~/style/theme';
import { ChoroplethThresholdsValue } from '@corona-dashboard/common';

const positiveTestedThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.scale.blue[0],
    threshold: 0,
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

const nursingHomeInfectedLocationsPercentageThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.scale.blue[0],
    threshold: 0,
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
    color: colors.data.scale.blue[0],
    threshold: 0,
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

const behaviorThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.scale.blue[5],
    threshold: 0,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 40,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 50,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 60,
  },
  {
    color: colors.data.scale.blue[1],
    threshold: 70,
  },
  {
    color: colors.data.scale.blue[0],
    threshold: 80,
  },
  {
    // this color is not part of the scale (as discussed with design / AG)
    color: '#DDEFF8',
    threshold: 90,
  },
];

const elderlyAtHomeThresholds: ChoroplethThresholdsValue[] = [
  {
    color: '#ffffff',
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

export const regionThresholds = {
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
    infected_locations_percentage: nursingHomeInfectedLocationsPercentageThresholds,
  },
  disability_care: {
    infected_locations_percentage: nursingHomeInfectedLocationsPercentageThresholds,
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
} as const;
