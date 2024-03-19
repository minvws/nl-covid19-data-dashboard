/**
 * DO NOT MANUALLY CHANGE THE CONTENTS OF THIS FILE!
 * This file is generated based on the JSON schema's by yarn generate-data-structures in the cli package.
 */
export const dataStructure = {
  archived_gm: {
    deceased_rivm_archived_20221231: ['covid_daily', 'covid_daily_moving_average', 'covid_total'],
    vaccine_coverage_per_age_group_archived_20220622: [
      'age_group_range',
      'fully_vaccinated_percentage',
      'has_one_shot_percentage',
      'birthyear_range',
      'fully_vaccinated_percentage_label',
      'has_one_shot_percentage_label',
    ],
    vaccine_coverage_per_age_group_archived_20220908: [
      'age_group_range',
      'fully_vaccinated_percentage',
      'booster_shot_percentage',
      'has_one_shot_percentage',
      'birthyear_range',
      'fully_vaccinated_percentage_label',
      'booster_shot_percentage_label',
      'has_one_shot_percentage_label',
    ],
    vaccine_coverage_per_age_group_archived_20231004: [
      'vaccination_type',
      'birthyear_range_12_plus',
      'birthyear_range_18_plus',
      'birthyear_range_60_plus',
      'vaccinated_percentage_12_plus',
      'vaccinated_percentage_12_plus_label',
      'vaccinated_percentage_18_plus',
      'vaccinated_percentage_18_plus_label',
      'vaccinated_percentage_60_plus',
      'vaccinated_percentage_60_plus_label',
    ],
    booster_coverage_archived_20220904: ['age_group', 'percentage', 'percentage_label'],
    sewer_archived_20230623: ['average', 'total_number_of_samples', 'sampled_installation_count', 'total_installation_count', 'data_is_outdated'],
    tested_overall_archived_20230331: ['infected', 'infected_moving_average', 'infected_moving_average_rounded', 'infected_per_100k', 'infected_per_100k_moving_average'],
    hospital_nice_archived_20240228: [
      'admissions_on_date_of_admission',
      'admissions_on_date_of_admission_moving_average',
      'admissions_on_date_of_admission_moving_average_rounded',
      'admissions_in_the_last_7_days',
      'admissions_on_date_of_reporting',
    ],
  },
  archived_gm_collection: {
    hospital_nice_choropleth_archived_20230830: ['admissions_on_date_of_admission', 'admissions_on_date_of_admission_per_100000', 'admissions_on_date_of_reporting'],
    hospital_nice_choropleth_archived_20240228: ['admissions_in_the_last_7_days_per_100000'],
    sewer_archived_20230623: ['average', 'total_installation_count', 'data_is_outdated'],
    tested_overall_archived_20230331: ['infected_per_100k', 'infected'],
    vaccine_coverage_per_age_group_choropleth_archived_20231004: [
      'vaccination_type',
      'birthyear_range_12_plus',
      'birthyear_range_18_plus',
      'birthyear_range_60_plus',
      'vaccinated_percentage_12_plus',
      'vaccinated_percentage_12_plus_label',
      'vaccinated_percentage_18_plus',
      'vaccinated_percentage_18_plus_label',
      'vaccinated_percentage_60_plus',
      'vaccinated_percentage_60_plus_label',
    ],
  },
  archived_nl: {
    behavior_archived_20230411: [
      'number_of_participants',
      'curfew_compliance',
      'curfew_compliance_trend',
      'wash_hands_compliance',
      'wash_hands_compliance_trend',
      'keep_distance_compliance',
      'keep_distance_compliance_trend',
      'work_from_home_compliance',
      'work_from_home_compliance_trend',
      'avoid_crowds_compliance',
      'avoid_crowds_compliance_trend',
      'symptoms_stay_home_if_mandatory_compliance',
      'symptoms_stay_home_if_mandatory_compliance_trend',
      'symptoms_get_tested_compliance',
      'symptoms_get_tested_compliance_trend',
      'wear_mask_public_indoors_compliance',
      'wear_mask_public_indoors_compliance_trend',
      'wear_mask_public_transport_compliance',
      'wear_mask_public_transport_compliance_trend',
      'sneeze_cough_elbow_compliance',
      'sneeze_cough_elbow_compliance_trend',
      'max_visitors_compliance',
      'max_visitors_compliance_trend',
      'ventilate_home_compliance',
      'ventilate_home_compliance_trend',
      'selftest_visit_compliance',
      'selftest_visit_compliance_trend',
      'posttest_isolation_compliance',
      'posttest_isolation_compliance_trend',
      'curfew_support',
      'curfew_support_trend',
      'wash_hands_support',
      'wash_hands_support_trend',
      'keep_distance_support',
      'keep_distance_support_trend',
      'work_from_home_support',
      'work_from_home_support_trend',
      'avoid_crowds_support',
      'avoid_crowds_support_trend',
      'symptoms_stay_home_if_mandatory_support',
      'symptoms_stay_home_if_mandatory_support_trend',
      'symptoms_get_tested_support',
      'symptoms_get_tested_support_trend',
      'wear_mask_public_indoors_support',
      'wear_mask_public_indoors_support_trend',
      'wear_mask_public_transport_support',
      'wear_mask_public_transport_support_trend',
      'sneeze_cough_elbow_support',
      'sneeze_cough_elbow_support_trend',
      'max_visitors_support',
      'max_visitors_support_trend',
      'ventilate_home_support',
      'ventilate_home_support_trend',
      'selftest_visit_support',
      'selftest_visit_support_trend',
      'posttest_isolation_support',
      'posttest_isolation_support_trend',
    ],
    behavior_annotations_archived_20230412: ['behavior_indicator', 'message_title_nl', 'message_title_en', 'message_desc_nl', 'message_desc_en'],
    booster_shot_administered_archived_20220904: ['administered_total', 'ggd_administered_total', 'others_administered_total'],
    booster_coverage_archived_20220904: ['age_group', 'percentage'],
    deceased_rivm_archived_20221231: ['covid_daily', 'covid_daily_moving_average', 'covid_total'],
    deceased_rivm_per_age_group_archived_20221231: ['age_group_range', 'age_group_percentage', 'covid_percentage'],
    doctor_archived_20210903: ['covid_symptoms_per_100k', 'covid_symptoms'],
    disability_care_archived_20230126: [
      'newly_infected_people',
      'newly_infected_people_moving_average',
      'deceased_daily',
      'deceased_daily_moving_average',
      'newly_infected_locations',
      'infected_locations_total',
      'infected_locations_percentage',
    ],
    elderly_at_home_archived_20230126: [
      'positive_tested_daily',
      'positive_tested_daily_moving_average',
      'positive_tested_daily_per_100k',
      'deceased_daily',
      'deceased_daily_moving_average',
    ],
    g_number_archived_20220607: ['g_number'],
    nursing_home_archived_20230126: [
      'newly_infected_people',
      'newly_infected_people_moving_average',
      'deceased_daily',
      'deceased_daily_moving_average',
      'newly_infected_locations',
      'infected_locations_total',
      'infected_locations_percentage',
    ],
    tested_ggd_archived_20230321: [
      'infected',
      'infected_moving_average',
      'infected_percentage',
      'infected_percentage_moving_average',
      'tested_total',
      'tested_total_moving_average',
      'tested_total_moving_average_rounded',
    ],
    tested_overall_archived_20230331: ['infected', 'infected_moving_average', 'infected_moving_average_rounded', 'infected_per_100k', 'infected_per_100k_moving_average'],
    tested_per_age_group_archived_20230331: [
      'infected_age_0_9_per_100k',
      'infected_age_10_19_per_100k',
      'infected_age_20_29_per_100k',
      'infected_age_30_39_per_100k',
      'infected_age_40_49_per_100k',
      'infected_age_50_59_per_100k',
      'infected_age_60_69_per_100k',
      'infected_age_70_79_per_100k',
      'infected_age_80_89_per_100k',
      'infected_age_90_plus_per_100k',
      'infected_overall_per_100k',
    ],
    sewer_archived_20230623: ['average'],
    vaccine_coverage_per_age_group_archived_20220622: [
      'age_group_range',
      'age_group_percentage',
      'age_group_total',
      'fully_vaccinated',
      'has_one_shot',
      'fully_vaccinated_percentage',
      'has_one_shot_percentage',
      'date_of_report_unix',
      'birthyear_range',
    ],
    vaccine_coverage_per_age_group_archived_20220908: [
      'age_group_range',
      'age_group_percentage',
      'age_group_total',
      'fully_vaccinated',
      'booster_shot',
      'has_one_shot',
      'fully_vaccinated_percentage',
      'booster_shot_percentage',
      'has_one_shot_percentage',
      'date_of_report_unix',
      'birthyear_range',
    ],
    vaccine_coverage_per_age_group_estimated_archived_20220908: [
      'age_18_plus_fully_vaccinated',
      'age_18_plus_has_one_shot',
      'age_18_plus_birthyear',
      'age_12_plus_fully_vaccinated',
      'age_12_plus_has_one_shot',
      'age_12_plus_birthyear',
    ],
    vulnerable_nursing_home_archived_20230711: ['newly_infected_locations', 'infected_locations_total', 'infected_locations_percentage'],
    reproduction_archived_20230711: ['index_low', 'index_average', 'index_high'],
    vaccine_vaccinated_or_support_archived_20230411: ['percentage_average', 'percentage_70_plus', 'percentage_55_69', 'percentage_40_54', 'percentage_25_39', 'percentage_16_24'],
    vaccine_administered_archived_20220914: ['pfizer', 'moderna', 'astra_zeneca', 'cure_vac', 'janssen', 'sanofi', 'novavax', 'total'],
    vaccine_administered_doctors_archived_20220324: ['estimated'],
    vaccine_administered_ggd_ghor_archived_20220324: ['reported'],
    vaccine_administered_ggd_archived_20220324: ['estimated'],
    vaccine_administered_hospitals_and_care_institutions_archived_20220324: ['estimated'],
    vaccine_administered_total_archived_20220324: ['estimated', 'reported'],
    vaccine_administered_planned_archived_20220518: ['doses'],
    vaccine_coverage_archived_20220518: ['booster_vaccinated', 'partially_vaccinated', 'fully_vaccinated', 'partially_or_fully_vaccinated'],
    vaccine_coverage_per_age_group_archived_20231004: [
      'age_group_range',
      'age_group_percentage',
      'age_group_total',
      'autumn_2022_vaccinated',
      'fully_vaccinated',
      'autumn_2022_vaccinated_percentage',
      'fully_vaccinated_percentage',
      'date_of_report_unix',
      'birthyear_range',
    ],
    vaccine_coverage_per_age_group_estimated_autumn_2022_archived_20231004: ['age_12_plus_birthyear', 'age_12_plus_vaccinated', 'age_60_plus_birthyear', 'age_60_plus_vaccinated'],
    vaccine_coverage_per_age_group_estimated_fully_vaccinated_archived_20231004: [
      'age_12_plus_birthyear',
      'age_12_plus_vaccinated',
      'age_18_plus_birthyear',
      'age_18_plus_vaccinated',
    ],
    vaccine_delivery_per_supplier_archived_20211101: [
      'total',
      'bio_n_tech_pfizer',
      'moderna',
      'astra_zeneca',
      'cure_vac',
      'janssen',
      'sanofi',
      'is_estimate',
      'week_number',
      'date_of_report_unix',
    ],
    vaccine_stock_archived_20211024: [
      'total_available',
      'total_not_available',
      'bio_n_tech_pfizer_available',
      'bio_n_tech_pfizer_not_available',
      'bio_n_tech_pfizer_total',
      'moderna_available',
      'moderna_not_available',
      'moderna_total',
      'astra_zeneca_available',
      'astra_zeneca_not_available',
      'astra_zeneca_total',
      'janssen_available',
      'janssen_not_available',
      'janssen_total',
    ],
    variants_archived_20231101: ['variant_code', 'values', 'last_value'],
    repeating_shot_administered_20220713: ['ggd_administered_total'],
    corona_melder_app_warning_archived_20220421: ['count'],
    corona_melder_app_download_archived_20220421: ['count'],
    infectious_people_archived_20210709: ['margin_low', 'estimate', 'margin_high'],
  },
  archived_vr_collection: {
    vulnerable_nursing_home_archived_20230711: ['newly_infected_locations', 'infected_locations_total', 'infected_locations_percentage'],
    disability_care_archived_20230126: ['newly_infected_people', 'newly_infected_locations', 'infected_locations_total', 'infected_locations_percentage', 'deceased_daily'],
    elderly_at_home_archived_20230126: ['positive_tested_daily', 'positive_tested_daily_per_100k', 'deceased_daily'],
  },
  gm: { sewer: ['average', 'data_is_outdated'] },
  gm_collection: { sewer: ['average', 'data_is_outdated'] },
  nl: {
    intensive_care_nice: [
      'admissions_on_date_of_admission',
      'admissions_on_date_of_admission_moving_average',
      'admissions_on_date_of_admission_moving_average_rounded',
      'admissions_on_date_of_reporting',
    ],
    intensive_care_nice_per_age_group: [
      'admissions_age_0_19_per_million',
      'admissions_age_20_29_per_million',
      'admissions_age_30_39_per_million',
      'admissions_age_40_49_per_million',
      'admissions_age_50_59_per_million',
      'admissions_age_60_69_per_million',
      'admissions_age_70_79_per_million',
      'admissions_age_80_89_per_million',
      'admissions_age_90_plus_per_million',
      'admissions_overall_per_million',
    ],
    sewer: ['average'],
    hospital_nice: [
      'admissions_on_date_of_admission',
      'admissions_on_date_of_admission_moving_average',
      'admissions_on_date_of_admission_moving_average_rounded',
      'admissions_on_date_of_reporting',
    ],
    hospital_nice_per_age_group: [
      'admissions_age_0_19_per_million',
      'admissions_age_20_29_per_million',
      'admissions_age_30_39_per_million',
      'admissions_age_40_49_per_million',
      'admissions_age_50_59_per_million',
      'admissions_age_60_69_per_million',
      'admissions_age_70_79_per_million',
      'admissions_age_80_89_per_million',
      'admissions_age_90_plus_per_million',
      'admissions_overall_per_million',
    ],
    hospital_lcps: ['beds_occupied_covid', 'beds_occupied_covid_moving_average', 'influx_covid_patients', 'influx_covid_patients_moving_average'],
    intensive_care_lcps: [
      'beds_occupied_covid',
      'beds_occupied_covid_moving_average',
      'beds_occupied_covid_percentage',
      'influx_covid_patients',
      'influx_covid_patients_moving_average',
    ],
    deceased_cbs: ['registered', 'expected', 'expected_min', 'expected_max'],
    variants: ['variant_code', 'values', 'last_value'],
    self_test_overall: ['infected_percentage', 'n_participants_total_unfiltered'],
    infectionradar_symptoms_trend_per_age_group_weekly: [
      'date_of_report_unix',
      'percentage_0_24',
      'percentage_25_39',
      'percentage_40_49',
      'percentage_50_59',
      'percentage_60_69',
      'percentage_70_plus',
      'percentage_average',
    ],
  },
};
