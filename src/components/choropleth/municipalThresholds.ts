import { ChoroplethThresholds, TMunicipalityMetricName } from './shared';

const positiveTestedThresholds: ChoroplethThresholds = {
  thresholds: [
    {
      color: '#C0E8FC',
      threshold: 0,
    },
    {
      color: '#8BD1FF',
      threshold: 10,
    },
    {
      color: '#61B6ED',
      threshold: 20,
    },
    {
      color: '#3389c4',
      threshold: 40,
    },
    {
      color: '#04537e',
      threshold: 60,
    },
    {
      color: '#06416e',
      threshold: 80,
    },
    {
      color: '#2f2657',
      threshold: 100,
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
      threshold: 3,
    },
    {
      color: '#5dafe4',
      threshold: 6,
    },
    {
      color: '#3391cc',
      threshold: 9,
    },
    {
      color: '#0579b3',
      threshold: 15,
    },
  ],
};

export const municipalThresholds: Record<
  TMunicipalityMetricName,
  ChoroplethThresholds
> = {
  positive_tested_people: positiveTestedThresholds,
  hospital_admissions: hospitalAdmissionsThresholds,
};
