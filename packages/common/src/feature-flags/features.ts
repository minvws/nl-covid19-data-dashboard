import { Feature } from '..';

export const features: Feature[] = [
  {
    name: 'vaccinationsCoverage',
    isEnabled: true,
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'vaccinationCampaigns',
    isEnabled: true,
    metricName: 'vaccine_campaigns',
  },
  {
    name: 'nlVaccinationCoveragePerAgeGroupAutumn2022',
    isEnabled: false,
    metricName: 'vaccine_coverage_per_age_group_estimated_autumn_2022',
    dataScopes: ['nl']
  },
  {
    name: 'nlVaccinationCoveragePerAgeGroupFullyVaccinated',
    isEnabled: false,
    metricName: 'vaccine_coverage_per_age_group_estimated_fully_vaccinated',
    dataScopes: ['nl']
  }
];
