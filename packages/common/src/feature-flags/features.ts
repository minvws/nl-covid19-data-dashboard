import { Feature } from '~/types';

export const features: Feature[] = [
  {
    name: 'situationsPage',
    isEnabled: true,
    dataScopes: ['vr', 'vr_collection'],
    metricName: 'situations',
  },
  {
    name: 'nlVariantsPage',
    isEnabled: true,
    dataScopes: ['nl'],
    metricName: 'variants',
  },
  {
    name: 'inHomePage',
    isEnabled: false,
  },
  {
    name: 'inPositiveTestsPage',
    isEnabled: false,
    dataScopes: ['in', 'in_collection'],
    metricName: 'tested_overall',
  },
  {
    name: 'inVariantsPage',
    isEnabled: false,
    dataScopes: ['in'],
    metricName: 'variants',
  },
  {
    name: 'nlGpSuspicionsIsHistorical',
    isEnabled: true,
  },
  {
    name: 'vrVaccinationPage',
    isEnabled: true,
    dataScopes: ['vr', 'vr_collection'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'gmVaccinationPage',
    isEnabled: true,
    dataScopes: ['gm', 'gm_collection'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'nlVaccinationChoropleth',
    isEnabled: true,
    dataScopes: ['gm_collection', 'vr_collection'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'gmRankingHospital',
    isEnabled: false,
    dataScopes: ['gm'],
    metricName: 'hospital_nice_sum',
  },
  {
    name: 'gmRankingTested',
    isEnabled: false,
    dataScopes: ['gm'],
    metricName: 'tested_overall_sum',
  },
  {
    name: 'nlVaccineCoverageEstimated',
    isEnabled: true,
    dataScopes: ['nl'],
    metricName: 'vaccine_coverage_per_age_group_estimated',
  },
  {
    name: 'vrVaccineCoverageEstimated',
    isEnabled: true,
    dataScopes: ['vr'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'gmVaccineCoverageEstimated',
    isEnabled: true,
    dataScopes: ['gm'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'nlVaccinationPerAgeGroup',
    isEnabled: true,
    dataScopes: ['nl'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'vrVaccinationPerAgeGroup',
    isEnabled: true,
    dataScopes: ['vr'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'gmVaccinationPerAgeGroup',
    isEnabled: true,
    dataScopes: ['gm'],
    metricName: 'vaccine_coverage_per_age_group',
  },
  {
    name: 'nlVaccineAdministeredGgd',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'vaccine_administered_ggd',
  },
  {
    name: 'nlVaccineAdministeredHospitalsAndCareInstitutions',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'vaccine_administered_hospitals_and_care_institutions',
  },
  {
    name: 'nlVaccineAdministeredDoctors',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'vaccine_administered_doctors',
  },
  {
    name: 'nlVaccineAdministeredGgdGhor',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'vaccine_administered_ggd_ghor',
  },
  {
    name: 'nlHospitalVaccinationStatus',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'hospital_vaccination_status',
  },
  {
    name: 'nlIntensiveCareVaccinationStatus',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'intensive_care_vaccination_status',
  },
  {
    name: 'nlVaccinationVaccinationStatus',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'intensive_care_vaccination_status',
  },
];
