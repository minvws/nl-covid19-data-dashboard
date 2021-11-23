import { Feature } from '~/types';

export const features: Feature[] = [
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
    name: 'nlVaccinationHospitalVaccinationStatus',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'hospital_vaccination_status',
  },
  {
    name: 'nlVaccinationIntensiveCareVaccinationStatus',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'intensive_care_vaccination_status',
  },
  {
    name: 'nlHospitalAdmissionsVaccineIncidencePerAgeGroup',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'hospital_vaccine_incidence_per_age_group',
  },
  {
    name: 'nlIcAdmissionsIncidencePerAgeGroup',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'hospital_vaccine_incidence_per_age_group',
  },
  {
    name: 'nlVaccinationsIncidencePerAgeGroup',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'hospital_vaccine_incidence_per_age_group',
  },
  {
    name: 'nlTestedOverallTopicalPage',
    isEnabled: false,
    dataScopes: ['nl', 'vr', 'gm'],
    metricName: 'tested_overall',
    metricProperties: ['infected_moving_average'],
  },
  {
    name: 'nlVaccinationsBoosterInformationBlock',
    isEnabled: false,
  },
  {
    name: 'nlVaccinationBoosterShotsPerAgeGroup',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_shot_per_age_group',
  },
  {
    name: 'nlVaccinationsBoosterShotsKpi',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_shot',
  },

  /**
   * These flags are only here that the schemas will not be required when validating.
   * But the features can be seen once toggled on with dummy data and have a seperate flag.
   */
  {
    name: 'nlVaccinationBoosterShotsPerAgeGroupSchemaDisable',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_shot_per_age_group',
  },
  {
    name: 'nlVaccinationsBoosterShotsKpiSchemaDisable',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_shot',
  },
];
