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
    name: 'nlVaccinationsBoosterInformationBlock',
    isEnabled: false,
  },
  {
    name: 'nlVaccinationsBoosterThirdShotInformationBlock',
    isEnabled: false,
  },
  {
    name: 'nlBoosterShotDeliveredKpiTile',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_shot_delivered',
  },
  {
    name: 'nlBoosterShotPlannedKpiTile',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_shot_planned',
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
    name: 'nlBoosterShotAdministeredSchemaDisable',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_shot_delivered',
  },
  {
    name: 'nlBoosterShotDeliveredSchemaDisable',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_shot_delivered',
  },
  {
    name: 'nlBoosterShotPlannedSchemaDisable',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_shot_planned',
  },
  {
    name: 'nlThirdShotAdministeredDisable',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'third_shot_administered',
  },
  {
    name: 'loadingIndicator',
    isEnabled: false,
  },
  {
    name: 'nlVaccinationBoosterShotsPerAgeGroup',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_shot_per_age_group',
  },
  {
    name: 'nlBoosterShotAdministeredSchemaDisable',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_shot_administered',
    metricProperties: ['administered_total'],
  },
  {
    name: 'nlBoosterShotDeliveredSchemaDisable',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_shot_delivered',
  },
  {
    name: 'nlBoosterShotPlannedSchemaDisable',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_shot_planned',
  },
  {
    name: 'nlThirdShotAdministeredDisable',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'third_shot_administered',
  },
  {
    name: 'loadingIndicator',
    isEnabled: false,
  },
  {
    name: 'nlVaccinationBoosterShotsPerAgeGroup',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_shot_per_age_group',
  },
  {
    name: 'nlBoosterAndThirdShotAdministered',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'booster_and_third_shot_administered',
  },
  {
    name: 'boosterCoverage',
    isEnabled: false,
    dataScopes: ['vr', 'gm'],
    metricName: 'booster_coverage',
  },
  {
    name: 'riskLevel',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'risk_level',
  },
  {
    name: 'nlRepeatingShotAdministered',
    isEnabled: false,
    dataScopes: ['nl'],
    metricName: 'repeating_shot_administered',
  },
];
