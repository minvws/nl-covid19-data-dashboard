import { Feature } from '..';

export const features: Feature[] = [
  {
    name: 'nlVaccinationCoveragePerAgeGroupAutumn2022',
    isEnabled: false,
    metricName: 'vaccine_coverage_per_age_group_estimated_autumn_2022',
    dataScopes: ['nl'],
  },
  {
    name: 'nlVaccinationCoveragePerAgeGroupFullyVaccinated',
    isEnabled: false,
    metricName: 'vaccine_coverage_per_age_group_estimated_fully_vaccinated',
    dataScopes: ['nl'],
  },
  {
    name: 'nlBehaviorIndicatorPosTest',
    isEnabled: false,
    metricName: 'behavior',
    metricProperties: ['posttest_isolation_support_trend', 'posttest_isolation_compliance_trend'],
    dataScopes: ['nl'],
  },
];
