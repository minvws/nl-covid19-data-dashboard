import { ChoroplethThresholds, TMunicipalityMetricName } from './shared';

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
