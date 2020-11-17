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
      color: '#DB5C94',
      threshold: 2,
    },
    {
      color: '#BC2166',
      threshold: 3,
    },
    {
      color: '#68032F',
      threshold: 4,
    },
  ],
};

const nursingHomeThresholds: ChoroplethThresholds = {
  thresholds: [
    {
      color: '#FFFFFF',
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

const nursingHomeInfectedLocationsPercentageThresholds: ChoroplethThresholds = {
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
      threshold: 20,
    },
    {
      color: '#3391cc',
      threshold: 30,
    },
    {
      color: '#0579b3',
      threshold: 40,
    },
  ],
};

const sewerThresholds: ChoroplethThresholds = {
  thresholds: [
    {
      color: '#C0E8FC',
      threshold: 0,
    },
    {
      color: '#8BD1FF',
      threshold: 5,
    },
    {
      color: '#61B6ED',
      threshold: 50,
    },
    {
      color: '#3597D4',
      threshold: 100,
    },
    {
      color: '#046899',
      threshold: 150,
    },
    {
      color: '#034566',
      threshold: 200,
    },
  ],
};

const behaviorThresholds: ChoroplethThresholds = {
  thresholds: [
    {
      color: '#034566',
      threshold: 0,
    },
    {
      color: '#0579B3',
      threshold: 40,
    },
    {
      color: '#3391CC',
      threshold: 50,
    },
    {
      color: '#5DAFE4',
      threshold: 60,
    },
    {
      color: '#87CBF8',
      threshold: 70,
    },
    {
      color: '#C0E8FC',
      threshold: 80,
    },
    {
      color: '#EBF8FF',
      threshold: 90,
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
    infected_locations_percentage: nursingHomeInfectedLocationsPercentageThresholds,
    newly_infected_people: nursingHomeThresholds,
  } as Record<Partial<TRegionsNursingHomeMetricName>, ChoroplethThresholds>,
  sewer: sewerThresholds,
  behavior: behaviorThresholds,
};
