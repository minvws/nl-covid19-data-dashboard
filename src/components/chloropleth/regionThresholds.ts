import {
  ChoroplethThresholds,
  TRegionMetricName,
  TRegionsNursingHomeMetricName,
} from './shared';

const positiveTestedThresholds: ChoroplethThresholds = {
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

const hospitalAdmissionsThresholds: ChoroplethThresholds = {
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

const escalationThresholds: ChoroplethThresholds = {
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

const nursingHomeThresholds: ChoroplethThresholds = {
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
  TRegionMetricName,
  | ChoroplethThresholds
  | Record<Partial<TRegionsNursingHomeMetricName>, ChoroplethThresholds>
> = {
  positive_tested_people: positiveTestedThresholds,
  hospital_admissions: hospitalAdmissionsThresholds,
  escalation_levels: escalationThresholds,
  nursing_home: {
    infected_locations_total: nursingHomeThresholds,
  } as Record<Partial<TRegionsNursingHomeMetricName>, ChoroplethThresholds>,
};
