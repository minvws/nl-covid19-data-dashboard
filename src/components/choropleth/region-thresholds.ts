import { ChoroplethThresholds, TRegionsNursingHomeMetricName } from './shared';
import { colors } from '~/style/theme';

const positiveTestedThresholds: ChoroplethThresholds = {
  thresholds: [
    {
      color: colors.chart.blueScale[0],
      threshold: 0,
    },
    {
      color: colors.chart.blueScale[1],
      threshold: 4,
    },
    {
      color: colors.chart.blueScale[2],
      threshold: 7,
    },
    {
      color: colors.chart.blueScale[3],
      threshold: 10,
    },
    {
      color: colors.chart.blueScale[4],
      threshold: 20,
    },
    {
      color: colors.chart.blueScale[5],
      threshold: 30,
    },
  ],
};

const hospitalAdmissionsThresholds: ChoroplethThresholds = {
  thresholds: [
    {
      color: colors.chart.blueScale[0],
      threshold: 0,
    },
    {
      color: colors.chart.blueScale[1],
      threshold: 10,
    },
    {
      color: colors.chart.blueScale[2],
      threshold: 16,
    },
    {
      color: colors.chart.blueScale[3],
      threshold: 24,
    },
    {
      color: colors.chart.blueScale[4],
      threshold: 31,
    },
  ],
};

const escalationThresholds: ChoroplethThresholds<1 | 2 | 3 | 4 | 5> = {
  thresholds: [
    {
      color: colors.chart.redScale[0],
      threshold: 1,
    },
    {
      color: colors.chart.redScale[1],
      threshold: 2,
    },
    {
      color: colors.chart.redScale[2],
      threshold: 3,
    },
    {
      color: colors.chart.redScale[3],
      threshold: 4,
    },
  ],
};

const nursingHomeInfectedLocationsPercentageThresholds: ChoroplethThresholds = {
  thresholds: [
    {
      color: colors.chart.blueScale[0],
      threshold: 0,
    },
    {
      color: colors.chart.blueScale[1],
      threshold: 10,
    },
    {
      color: colors.chart.blueScale[2],
      threshold: 20,
    },
    {
      color: colors.chart.blueScale[3],
      threshold: 30,
    },
    {
      color: colors.chart.blueScale[4],
      threshold: 40,
    },
  ],
};

const sewerThresholds: ChoroplethThresholds = {
  thresholds: [
    {
      color: colors.chart.blueScale[0],
      threshold: 0,
    },
    {
      color: colors.chart.blueScale[1],
      threshold: 5,
    },
    {
      color: colors.chart.blueScale[2],
      threshold: 50,
    },
    {
      color: colors.chart.blueScale[3],
      threshold: 100,
    },
    {
      color: colors.chart.blueScale[4],
      threshold: 150,
    },
    {
      color: colors.chart.blueScale[5],
      threshold: 200,
    },
  ],
};

const behaviorThresholds: ChoroplethThresholds = {
  thresholds: [
    {
      color: colors.chart.blueScale[5],
      threshold: 0,
    },
    {
      color: colors.chart.blueScale[4],
      threshold: 40,
    },
    {
      color: colors.chart.blueScale[3],
      threshold: 50,
    },
    {
      color: colors.chart.blueScale[2],
      threshold: 60,
    },
    {
      color: colors.chart.blueScale[1],
      threshold: 70,
    },
    {
      color: colors.chart.blueScale[0],
      threshold: 80,
    },
    {
      // this color is not part of the scale (as discussed with design / AG)
      color: '#DDEFF8',
      threshold: 90,
    },
  ],
};

export const regionThresholds = {
  positive_tested_people: positiveTestedThresholds,
  hospital_admissions: hospitalAdmissionsThresholds,
  escalation_levels: escalationThresholds,
  nursing_home: {
    infected_locations_percentage: nursingHomeInfectedLocationsPercentageThresholds,
  } as Record<Partial<TRegionsNursingHomeMetricName>, ChoroplethThresholds>,
  sewer: sewerThresholds,
  behavior: behaviorThresholds,
} as const;
