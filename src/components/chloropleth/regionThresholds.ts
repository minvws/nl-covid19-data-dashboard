import {
  ChoroplethThresholds,
  TRegionMetricName,
  TRegionsNursingHomeMetricName,
} from './shared';

export type RegionalThresholds = ChoroplethThresholds<TRegionMetricName>;

export type NursingHomeThresholds = ChoroplethThresholds<
  TRegionsNursingHomeMetricName
>;

const positiveTestedThresholds: RegionalThresholds = {
  dataKey: 'positive_tested_people',
  thresholds: [
    {
      color: '#C0E8FC',
      threshold: 0,
    },
    {
      color: '#8BD1FF',
      threshold: 4,
    },
    {
      color: '#61B6ED',
      threshold: 7,
    },
    {
      color: '#3597D4',
      threshold: 10,
    },
    {
      color: '#046899',
      threshold: 20,
    },
    {
      color: '#034566',
      threshold: 30,
    },
  ],
};

const hospitalAdmissionsThresholds: RegionalThresholds = {
  dataKey: 'hospital_admissions',
  thresholds: [
    {
      color: '#c0e8fc',
      threshold: 0,
    },
    {
      color: '#87cbf8',
      threshold: 10,
    },
    {
      color: '#5dafe4',
      threshold: 16,
    },
    {
      color: '#3391cc',
      threshold: 24,
    },
    {
      color: '#0579b3',
      threshold: 31,
    },
  ],
};

const escalationThresholds: RegionalThresholds = {
  dataKey: 'escalation_levels',
  svgClass: 'escalationMap',
  thresholds: [
    {
      color: '#F291BC',
      threshold: 1,
    },
    {
      color: '#D95790',
      threshold: 2,
    },
    {
      color: '#A11050',
      threshold: 3,
    },
  ],
};

const nursingHomeThresholds: NursingHomeThresholds = {
  dataKey: 'infected_locations_total',
  thresholds: [
    {
      color: '#CFFFFFF',
      threshold: 0,
    },
    {
      color: '#C0E8FC',
      threshold: 1,
    },
    {
      color: '#87CBF8',
      threshold: 3,
    },
    {
      color: '#5DAFE4',
      threshold: 7,
    },
    {
      color: '#3391CC',
      threshold: 11,
    },
    {
      color: '#0579B3',
      threshold: 21,
    },
    {
      color: '#034566',
      threshold: 30,
    },
  ],
};

export const regionThresholds: Record<
  string,
  RegionalThresholds | Record<string, NursingHomeThresholds>
> = {
  [positiveTestedThresholds.dataKey]: positiveTestedThresholds,
  [hospitalAdmissionsThresholds.dataKey]: hospitalAdmissionsThresholds,
  [escalationThresholds.dataKey]: escalationThresholds,
  nursing_home: {
    [nursingHomeThresholds.dataKey]: nursingHomeThresholds,
  },
};
