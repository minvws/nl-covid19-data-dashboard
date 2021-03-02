/**
* This file was automatically generated by json-schema-to-typescript.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run 'yarn generate-typescript' to regenerate this file.
*/

export interface Municipal {
  last_generated: string;
  proto_name: string;
  name: string;
  code: string;
  deceased_rivm: GmDeceasedRivm;
  difference: MunicipalDifference;
  hospital_nice: MunicipalHospitalNice;
  tested_overall: MunicipalTestedOverall;
  sewer?: MunicipalSewer;
  sewer_per_installation?: MunicipalSewerPerInstallation;
}
export interface GmDeceasedRivm {
  values: GmDeceasedRivmValue[];
  last_value: GmDeceasedRivmValue;
}
export interface GmDeceasedRivmValue {
  covid_daily: number;
  covid_total: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface MunicipalDifference {
  tested_overall__infected_per_100k: DifferenceDecimal;
  tested_overall__infected: DifferenceInteger;
  hospital_nice__admissions_on_date_of_reporting: DifferenceInteger;
  sewer__average?: DifferenceDecimal;
  deceased_rivm__covid_daily: DifferenceInteger;
}
export interface DifferenceDecimal {
  old_value: number;
  difference: number;
  old_date_unix: number;
  new_date_unix: number;
}
export interface DifferenceInteger {
  old_value: number;
  difference: number;
  old_date_unix: number;
  new_date_unix: number;
}
export interface MunicipalHospitalNice {
  values: MunicipalHospitalNiceValue[];
  last_value: MunicipalHospitalNiceValue;
}
export interface MunicipalHospitalNiceValue {
  date_unix: number;
  admissions_on_date_of_admission: number;
  admissions_on_date_of_reporting: number;
  date_of_insertion_unix: number;
}
export interface MunicipalTestedOverall {
  values: MunicipalTestedOverallValue[];
  last_value: MunicipalTestedOverallValue;
}
export interface MunicipalTestedOverallValue {
  date_unix: number;
  infected: number;
  infected_per_100k: number;
  date_of_insertion_unix: number;
}
export interface MunicipalSewer {
  values: MunicipalSewerValue[];
  last_value: MunicipalSewerValue;
}
export interface MunicipalSewerValue {
  date_start_unix: number;
  date_end_unix: number;
  average: number;
  total_number_of_samples: number;
  sampled_installation_count: number;
  total_installation_count: number;
  date_of_insertion_unix: number;
}
export interface MunicipalSewerPerInstallation {
  values: MunicipalSewerPerInstallationInstallation[];
}
export interface MunicipalSewerPerInstallationInstallation {
  rwzi_awzi_name: string;
  values: MunicipalSewerPerInstallationValue[];
  last_value: MunicipalSewerPerInstallationValue;
}
export interface MunicipalSewerPerInstallationValue {
  date_unix: number;
  rna_normalized: number;
  date_of_insertion_unix: number;
}

export interface Municipalities {
  last_generated: string;
  proto_name: "GM_COLLECTION";
  name: string;
  code: string;
  hospital_nice: MunicipalitiesHospitalNice[];
  tested_overall: MunicipalitiesTestedOverall[];
}
export interface MunicipalitiesHospitalNice {
  date_unix: number;
  gmcode: string;
  admissions_on_date_of_admission: number;
  admissions_on_date_of_reporting: number;
  date_of_insertion_unix: number;
}
export interface MunicipalitiesTestedOverall {
  date_unix: number;
  gmcode: string;
  infected_per_100k: number;
  infected: number;
  date_of_insertion_unix: number;
}

export interface National {
  last_generated: string;
  proto_name: "NL";
  name: string;
  code: string;
  difference: NationalDifference;
  doctor: NationalDoctor;
  infectious_people: NationalInfectiousPeople;
  intensive_care_nice: NationalIntensiveCareNice;
  tested_overall: NationalTestedOverall;
  tested_per_age_group: NationalTestedPerAgeGroup;
  reproduction: NationalReproduction;
  sewer: NationalSewer;
  hospital_nice: NationalHospitalNice;
  hospital_lcps: NationalHospitalLcps;
  intensive_care_lcps: NationalIntensiveCareLcps;
  tested_ggd_daily: NationalTestedGgdDaily;
  tested_ggd_average: NationalTestedGgdAverage;
  nursing_home: NationalNursingHome;
  disability_care: NationalDisabilityCare;
  behavior: NationalBehavior;
  deceased_rivm: NationalDeceasedRivm;
  deceased_rivm_per_age_group: NlDeceasedRivmPerAgeGroup;
  deceased_cbs: NationalDeceasedCbs;
  elderly_at_home: NationalElderlyAtHome;
  vaccine_support: NlVaccineSupport;
  corona_melder_app: NlCoronaMelderApp;
  vaccine_delivery: NlVaccineDelivery;
  vaccine_delivery_estimate: NlVaccineEstimateDelivery;
  vaccine_administered: NlVaccineAdministered;
  vaccine_administered_estimate: NlVaccineAdministeredEstimate;
  vaccine_administered_care_institutions: NlVaccineAdministeredCareInstitutions;
  vaccine_administered_doctors: NlVaccineAdministeredDoctors;
  vaccine_administered_ggd_ghor: NlVaccineAdministeredGgdGhor;
  vaccine_administered_ggd: NlVaccineAdministeredGgd;
  vaccine_administered_hospitals: NlVaccineAdministeredHospitals;
  vaccine_administered_lnaz: NlVaccineAdministeredLnaz;
  vaccine_administered_total: NlVaccineAdministeredTotal;
}
export interface NationalDifference {
  tested_overall__infected_per_100k: DifferenceDecimal;
  tested_overall__infected: DifferenceInteger;
  tested_ggd_daily__tested_total: DifferenceInteger;
  tested_ggd_daily__infected_percentage: DifferenceDecimal;
  tested_ggd_average__tested_total: DifferenceInteger;
  tested_ggd_average__infected_percentage: DifferenceDecimal;
  infectious_people__estimate: DifferenceInteger;
  hospital_nice__admissions_on_date_of_reporting: DifferenceInteger;
  hospital_lcps__beds_occupied_covid: DifferenceInteger;
  intensive_care_nice__admissions_moving_average: DifferenceDecimal;
  intensive_care_lcps__beds_occupied_covid: DifferenceInteger;
  doctor__covid_symptoms_per_100k: DifferenceDecimal;
  doctor__covid_symptoms: DifferenceInteger;
  sewer__average: DifferenceDecimal;
  nursing_home__newly_infected_people: DifferenceInteger;
  nursing_home__infected_locations_total: DifferenceInteger;
  nursing_home__deceased_daily: DifferenceInteger;
  reproduction__index_average: DifferenceDecimal;
  corona_melder_app__warned_daily: DifferenceInteger;
  disability_care__newly_infected_people: DifferenceInteger;
  disability_care__infected_locations_total: DifferenceInteger;
  elderly_at_home__positive_tested_daily: DifferenceInteger;
  deceased_rivm__covid_daily: DifferenceInteger;
}
export interface DifferenceDecimal {
  old_value: number;
  difference: number;
  old_date_unix: number;
  new_date_unix: number;
}
export interface DifferenceInteger {
  old_value: number;
  difference: number;
  old_date_unix: number;
  new_date_unix: number;
}
export interface NationalDoctor {
  values: NationalDoctorValue[];
  last_value: NationalDoctorValue;
}
export interface NationalDoctorValue {
  date_start_unix: number;
  date_end_unix: number;
  covid_symptoms_per_100k: number;
  covid_symptoms: number;
  date_of_insertion_unix: number;
}
export interface NationalInfectiousPeople {
  values: NationalInfectiousPeopleValue[];
  last_value: NationalInfectiousPeopleValue;
}
export interface NationalInfectiousPeopleValue {
  margin_low: number;
  estimate: number | null;
  margin_high: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalIntensiveCareNice {
  values: NationalIntensiveCareNiceValue[];
  last_value: NationalIntensiveCareNiceValue;
}
export interface NationalIntensiveCareNiceValue {
  admissions_moving_average: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalTestedOverall {
  values: NationalTestedOverallValue[];
  last_value: NationalTestedOverallValue;
}
export interface NationalTestedOverallValue {
  infected: number;
  infected_per_100k: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalTestedPerAgeGroup {
  values: NationalTestedPerAgeGroupValue[];
}
export interface NationalTestedPerAgeGroupValue {
  age_group_range: string;
  infected_percentage: number;
  age_group_percentage: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalReproduction {
  values: NationalReproductionValue[];
  last_value: NationalReproductionValue;
}
export interface NationalReproductionValue {
  index_low: number | null;
  index_average: number | null;
  index_high: number | null;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalSewer {
  values: NationalSewerValue[];
  last_value: NationalSewerValue;
}
export interface NationalSewerValue {
  average: number;
  total_number_of_samples: number;
  sampled_installation_count: number;
  total_installation_count: number;
  date_of_insertion_unix: number;
  date_start_unix: number;
  date_end_unix: number;
}
export interface NationalHospitalNice {
  values: NationalHospitalNiceValue[];
  last_value: NationalHospitalNiceValue;
}
export interface NationalHospitalNiceValue {
  admissions_on_date_of_admission: number;
  admissions_on_date_of_reporting: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalHospitalLcps {
  values: NationalHospitalLcpsValue[];
  last_value: NationalHospitalLcpsValue;
}
export interface NationalHospitalLcpsValue {
  beds_occupied_covid: number | null;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalIntensiveCareLcps {
  values: NationalIntensiveCareLcpsValue[];
  last_value: NationalIntensiveCareLcpsValue;
}
export interface NationalIntensiveCareLcpsValue {
  beds_occupied_covid: number | null;
  beds_occupied_non_covid: number | null;
  beds_occupied_covid_percentage: number | null;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalTestedGgdDaily {
  values: NationalTestedGgdDailyValue[];
  last_value: NationalTestedGgdDailyValue;
}
export interface NationalTestedGgdDailyValue {
  infected: number;
  infected_percentage: number;
  tested_total: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalTestedGgdAverage {
  values: NationalTestedGgdAverageValue[];
  last_value: NationalTestedGgdAverageValue;
}
export interface NationalTestedGgdAverageValue {
  infected: number;
  infected_percentage: number;
  tested_total: number;
  date_start_unix: number;
  date_end_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalNursingHome {
  values: NationalNursingHomeValue[];
  last_value: NationalNursingHomeValue;
}
export interface NationalNursingHomeValue {
  newly_infected_people: number;
  deceased_daily: number;
  newly_infected_locations: number;
  infected_locations_total: number;
  infected_locations_percentage: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalDisabilityCare {
  values: NationalDisabilityCareValue[];
  last_value: NationalDisabilityCareValue;
}
export interface NationalDisabilityCareValue {
  newly_infected_people: number;
  deceased_daily: number;
  newly_infected_locations: number;
  infected_locations_total: number;
  infected_locations_percentage: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalBehavior {
  values: NationalBehaviorValue[];
  last_value: NationalBehaviorValue;
}
export interface NationalBehaviorValue {
  number_of_participants: number;
  curfew_compliance: number | null;
  curfew_compliance_trend: ("up" | "down" | "equal") | null;
  wash_hands_compliance: number | null;
  wash_hands_compliance_trend: ("up" | "down" | "equal") | null;
  keep_distance_compliance: number | null;
  keep_distance_compliance_trend: ("up" | "down" | "equal") | null;
  work_from_home_compliance: number | null;
  work_from_home_compliance_trend: ("up" | "down" | "equal") | null;
  avoid_crowds_compliance: number | null;
  avoid_crowds_compliance_trend: ("up" | "down" | "equal") | null;
  symptoms_stay_home_compliance?: number | null;
  symptoms_stay_home_compliance_trend?: ("up" | "down" | "equal") | null;
  symptoms_get_tested_compliance?: number | null;
  symptoms_get_tested_compliance_trend?: ("up" | "down" | "equal") | null;
  wear_mask_public_indoors_compliance: number | null;
  wear_mask_public_indoors_compliance_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_transport_compliance?: number | null;
  wear_mask_public_transport_compliance_trend?: ("up" | "down" | "equal") | null;
  sneeze_cough_elbow_compliance: number | null;
  sneeze_cough_elbow_compliance_trend: ("up" | "down" | "equal") | null;
  max_visitors_compliance: number | null;
  max_visitors_compliance_trend: ("up" | "down" | "equal") | null;
  curfew_support: number | null;
  curfew_support_trend: ("up" | "down" | "equal") | null;
  wash_hands_support: number | null;
  wash_hands_support_trend: ("up" | "down" | "equal") | null;
  keep_distance_support: number | null;
  keep_distance_support_trend: ("up" | "down" | "equal") | null;
  work_from_home_support: number | null;
  work_from_home_support_trend: ("up" | "down" | "equal") | null;
  avoid_crowds_support: number | null;
  avoid_crowds_support_trend: ("up" | "down" | "equal") | null;
  symptoms_stay_home_support?: number | null;
  symptoms_stay_home_support_trend?: ("up" | "down" | "equal") | null;
  symptoms_get_tested_support?: number | null;
  symptoms_get_tested_support_trend?: ("up" | "down" | "equal") | null;
  wear_mask_public_indoors_support: number | null;
  wear_mask_public_indoors_support_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_transport_support?: number | null;
  wear_mask_public_transport_support_trend?: ("up" | "down" | "equal") | null;
  sneeze_cough_elbow_support: number | null;
  sneeze_cough_elbow_support_trend: ("up" | "down" | "equal") | null;
  max_visitors_support: number | null;
  max_visitors_support_trend: ("up" | "down" | "equal") | null;
  date_start_unix: number;
  date_end_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalDeceasedRivm {
  values: NationalDeceasedRivmValue[];
  last_value: NationalDeceasedRivmValue;
}
export interface NationalDeceasedRivmValue {
  covid_daily: number;
  covid_total: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NlDeceasedRivmPerAgeGroup {
  values: NlDeceasedRivmPerAgeGroupValue[];
}
export interface NlDeceasedRivmPerAgeGroupValue {
  age_group_range: string;
  age_group_percentage: number;
  covid_percentage: number;
  date_unix?: number;
  date_of_insertion_unix: number;
  [k: string]: unknown;
}
export interface NationalDeceasedCbs {
  values: NationalDeceasedCbsValue[];
  last_value: NationalDeceasedCbsValue;
}
export interface NationalDeceasedCbsValue {
  registered: number;
  expected: number;
  expected_min: number;
  expected_max: number;
  date_start_unix: number;
  date_end_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalElderlyAtHome {
  values: NationalElderlyAtHomeValue[];
  last_value: NationalElderlyAtHomeValue;
}
export interface NationalElderlyAtHomeValue {
  positive_tested_daily: number;
  positive_tested_daily_per_100k: number;
  deceased_daily: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NlVaccineSupport {
  values: NlVaccineSupportValue[];
  last_value: NlVaccineSupportValue;
}
export interface NlVaccineSupportValue {
  percentage_average: number;
  percentage_70_plus: number;
  percentage_55_69: number;
  percentage_40_54: number;
  percentage_25_39: number;
  percentage_16_24: number;
  date_start_unix: number;
  date_end_unix: number;
  date_of_insertion_unix: number;
}
export interface NlCoronaMelderApp {
  values: NlCoronaMelderAppValue[];
  last_value: NlCoronaMelderAppValue;
}
export interface NlCoronaMelderAppValue {
  downloaded_total: number;
  warned_daily: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NlVaccineDelivery {
  values: NlVaccineDeliveryValue[];
  last_value: NlVaccineDeliveryValue;
}
export interface NlVaccineDeliveryValue {
  total: number;
  date_of_insertion_unix: number;
  date_start_unix: number;
  date_end_unix: number;
}
export interface NlVaccineEstimateDelivery {
  values: NlVaccineDeliveryEstimateValue[];
  last_value: NlVaccineDeliveryEstimateValue;
}
export interface NlVaccineDeliveryEstimateValue {
  total: number;
  date_of_insertion_unix: number;
  date_start_unix: number;
  date_end_unix: number;
}
export interface NlVaccineAdministered {
  values: NlVaccineAdministeredValue[];
  last_value: NlVaccineAdministeredValue;
}
export interface NlVaccineAdministeredValue {
  pfizer?: number;
  moderna?: number;
  astra_zeneca?: number;
  cure_vac?: number;
  janssen?: number;
  sanofi?: number;
  date_of_insertion_unix: number;
  date_start_unix: number;
  date_end_unix: number;
}
export interface NlVaccineAdministeredEstimate {
  values: NlVaccineAdministeredEstimateValue[];
  last_value: NlVaccineAdministeredEstimateValue;
}
export interface NlVaccineAdministeredEstimateValue {
  pfizer?: number;
  moderna?: number;
  astra_zeneca?: number;
  cure_vac?: number;
  janssen?: number;
  sanofi?: number;
  date_of_insertion_unix: number;
  date_start_unix: number;
  date_end_unix: number;
}
export interface NlVaccineAdministeredCareInstitutions {
  values: NlVaccineAdministeredCareInstitutionsValue[];
  last_value: NlVaccineAdministeredCareInstitutionsValue;
}
export interface NlVaccineAdministeredCareInstitutionsValue {
  estimated: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NlVaccineAdministeredDoctors {
  values: NlVaccineAdministeredDoctorsValue[];
  last_value: NlVaccineAdministeredDoctorsValue;
}
export interface NlVaccineAdministeredDoctorsValue {
  estimated: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NlVaccineAdministeredGgdGhor {
  values: NlVaccineAdministeredGgdGhorValue[];
  last_value: NlVaccineAdministeredGgdGhorValue;
}
export interface NlVaccineAdministeredGgdGhorValue {
  reported: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NlVaccineAdministeredGgd {
  values: NlVaccineAdministeredGgdValue[];
  last_value: NlVaccineAdministeredGgdValue;
}
export interface NlVaccineAdministeredGgdValue {
  estimated: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NlVaccineAdministeredHospitals {
  values: NlVaccineAdministeredHospitalsValue[];
  last_value: NlVaccineAdministeredHospitalsValue;
}
export interface NlVaccineAdministeredHospitalsValue {
  estimated: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NlVaccineAdministeredLnaz {
  values: NlVaccineAdministeredLnazValue[];
  last_value: NlVaccineAdministeredLnazValue;
}
export interface NlVaccineAdministeredLnazValue {
  reported: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface NlVaccineAdministeredTotal {
  values: NlVaccineAdministeredTotalValue[];
  last_value: NlVaccineAdministeredTotalValue;
}
export interface NlVaccineAdministeredTotalValue {
  estimated: number;
  reported: number;
  date_unix: number;
  date_of_insertion_unix: number;
}

export interface Regionaal {
  last_generated: string;
  proto_name: string;
  name: string;
  code: string;
  difference: RegionalDifference;
  sewer: RegionalSewer;
  sewer_per_installation: RegionalSewerPerInstallation;
  tested_overall: RegionalTestedOverall;
  hospital_nice: RegionalHospitalNice;
  tested_ggd_daily: RegionalTestedGgdDaily;
  tested_ggd_average: RegionalTestedGgdAverage;
  nursing_home: RegionalNursingHome;
  disability_care: RegionalDisabilityCare;
  behavior: RegionalBehavior;
  deceased_rivm: RegionalDeceasedRivm;
  deceased_cbs: RegionalDeceasedCbs;
  elderly_at_home: RegionalElderlyAtHome;
  escalation_level: VrEscalationLevel;
  tested_overall_sum: VrTestedOverallSum;
  hospital_nice_sum: VrHospitalNiceSum;
}
export interface RegionalDifference {
  tested_overall__infected_per_100k: DifferenceDecimal;
  tested_overall__infected: DifferenceInteger;
  tested_ggd_average__tested_total: DifferenceInteger;
  tested_ggd_average__infected_percentage: DifferenceDecimal;
  tested_ggd_daily__tested_total: DifferenceInteger;
  tested_ggd_daily__infected_percentage: DifferenceDecimal;
  hospital_nice__admissions_on_date_of_reporting: DifferenceInteger;
  sewer__average: DifferenceDecimal;
  nursing_home__newly_infected_people: DifferenceInteger;
  nursing_home__infected_locations_total: DifferenceInteger;
  nursing_home__deceased_daily: DifferenceInteger;
  disability_care__newly_infected_people: DifferenceInteger;
  disability_care__infected_locations_total: DifferenceInteger;
  elderly_at_home__positive_tested_daily: DifferenceInteger;
  deceased_rivm__covid_daily: DifferenceInteger;
}
export interface DifferenceDecimal {
  old_value: number;
  difference: number;
  old_date_unix: number;
  new_date_unix: number;
}
export interface DifferenceInteger {
  old_value: number;
  difference: number;
  old_date_unix: number;
  new_date_unix: number;
}
export interface RegionalSewer {
  values: RegionalSewerValue[];
  last_value: RegionalSewerValue;
}
export interface RegionalSewerValue {
  date_start_unix: number;
  date_end_unix: number;
  average: number;
  total_number_of_samples: number;
  sampled_installation_count: number;
  total_installation_count: number;
  date_of_insertion_unix: number;
}
export interface RegionalSewerPerInstallation {
  values: RegionalSewerPerInstallationInstallation[];
}
export interface RegionalSewerPerInstallationInstallation {
  rwzi_awzi_name: string;
  values: RegionalSewerPerInstallationValue[];
  last_value: RegionalSewerPerInstallationValue;
}
export interface RegionalSewerPerInstallationValue {
  date_unix: number;
  rna_normalized: number;
  date_of_insertion_unix: number;
}
export interface RegionalTestedOverall {
  values: RegionalTestedOverallValue[];
  last_value: RegionalTestedOverallValue;
}
export interface RegionalTestedOverallValue {
  date_unix: number;
  infected: number;
  infected_per_100k: number;
  date_of_insertion_unix: number;
}
export interface RegionalHospitalNice {
  values: RegionalHospitalNiceValue[];
  last_value: RegionalHospitalNiceValue;
}
export interface RegionalHospitalNiceValue {
  admissions_on_date_of_admission: number;
  admissions_on_date_of_reporting: number;
  date_unix: number;
  date_of_insertion_unix: number;
}
export interface RegionalTestedGgdDaily {
  values: RegionalTestedGgdDailyValue[];
  last_value: RegionalTestedGgdDailyValue;
}
export interface RegionalTestedGgdDailyValue {
  infected: number;
  infected_percentage: number;
  tested_total: number;
  date_unix: number;
  date_of_insertion_unix: number;
  vrcode: string;
}
export interface RegionalTestedGgdAverage {
  values: RegionalTestedGgdAverageValue[];
  last_value: RegionalTestedGgdAverageValue;
}
export interface RegionalTestedGgdAverageValue {
  infected: number;
  infected_percentage: number;
  tested_total: number;
  date_start_unix: number;
  date_end_unix: number;
  date_of_insertion_unix: number;
  vrcode: string;
}
export interface RegionalNursingHome {
  values: RegionalNursingHomeValue[];
  last_value: RegionalNursingHomeValue;
}
export interface RegionalNursingHomeValue {
  newly_infected_people: number;
  newly_infected_locations: number;
  infected_locations_total: number;
  infected_locations_percentage: number;
  deceased_daily: number;
  date_unix: number;
  date_of_insertion_unix: number;
  vrcode: string;
}
export interface RegionalDisabilityCare {
  values: RegionalDisabilityCareValue[];
  last_value: RegionalDisabilityCareValue;
}
export interface RegionalDisabilityCareValue {
  newly_infected_people: number;
  newly_infected_locations: number;
  infected_locations_total: number;
  infected_locations_percentage: number;
  deceased_daily: number;
  date_unix: number;
  date_of_insertion_unix: number;
  vrcode: string;
}
export interface RegionalBehavior {
  values: RegionalBehaviorValue[];
  last_value: RegionalBehaviorValue;
}
export interface RegionalBehaviorValue {
  number_of_participants: number;
  curfew_compliance: number | null;
  curfew_compliance_trend: ("up" | "down" | "equal") | null;
  wash_hands_compliance: number | null;
  wash_hands_compliance_trend: ("up" | "down" | "equal") | null;
  keep_distance_compliance: number | null;
  keep_distance_compliance_trend: ("up" | "down" | "equal") | null;
  work_from_home_compliance: number | null;
  work_from_home_compliance_trend: ("up" | "down" | "equal") | null;
  avoid_crowds_compliance: number | null;
  avoid_crowds_compliance_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_indoors_compliance: number | null;
  wear_mask_public_indoors_compliance_trend: ("up" | "down" | "equal") | null;
  sneeze_cough_elbow_compliance: number | null;
  sneeze_cough_elbow_compliance_trend: ("up" | "down" | "equal") | null;
  max_visitors_compliance: number | null;
  max_visitors_compliance_trend: ("up" | "down" | "equal") | null;
  curfew_support: number | null;
  curfew_support_trend: ("up" | "down" | "equal") | null;
  wash_hands_support: number | null;
  wash_hands_support_trend: ("up" | "down" | "equal") | null;
  keep_distance_support: number | null;
  keep_distance_support_trend: ("up" | "down" | "equal") | null;
  work_from_home_support: number | null;
  work_from_home_support_trend: ("up" | "down" | "equal") | null;
  avoid_crowds_support: number | null;
  avoid_crowds_support_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_indoors_support: number | null;
  wear_mask_public_indoors_support_trend: ("up" | "down" | "equal") | null;
  sneeze_cough_elbow_support: number | null;
  sneeze_cough_elbow_support_trend: ("up" | "down" | "equal") | null;
  max_visitors_support: number | null;
  max_visitors_support_trend: ("up" | "down" | "equal") | null;
  date_start_unix: number;
  date_end_unix: number;
  date_of_insertion_unix: number;
  vrcode: string;
}
export interface RegionalDeceasedRivm {
  values: RegionalDeceasedRivmValue[];
  last_value: RegionalDeceasedRivmValue;
}
export interface RegionalDeceasedRivmValue {
  covid_daily: number;
  covid_total: number;
  date_unix: number;
  date_of_insertion_unix: number;
  vrcode: string;
}
export interface RegionalDeceasedCbs {
  values: RegionalDeceasedCbsValue[];
  last_value: RegionalDeceasedCbsValue;
}
export interface RegionalDeceasedCbsValue {
  registered: number;
  expected: number;
  expected_min: number;
  expected_max: number;
  date_start_unix: number;
  date_end_unix: number;
  date_of_insertion_unix: number;
}
export interface RegionalElderlyAtHome {
  values: RegionalElderlyAtHomeValue[];
  last_value: RegionalElderlyAtHomeValue;
}
export interface RegionalElderlyAtHomeValue {
  positive_tested_daily: number;
  positive_tested_daily_per_100k: number;
  deceased_daily: number;
  date_unix: number;
  date_of_insertion_unix: number;
  vrcode: string;
}
export interface VrEscalationLevel {
  date_unix: number;
  level: number;
  valid_from_unix: number;
  last_determined_unix: number;
  date_of_insertion_unix: number;
}
export interface VrTestedOverallSum {
  values: VrTestedOverallSumValue[];
  last_value: VrTestedOverallSumValue;
}
export interface VrTestedOverallSumValue {
  date_start_unix: number;
  date_end_unix: number;
  infected_per_100k: number;
  date_of_insertion_unix: number;
}
export interface VrHospitalNiceSum {
  values: VrHospitalNiceSumValue[];
  last_value: VrHospitalNiceSumValue;
}
export interface VrHospitalNiceSumValue {
  admissions_per_1m: number;
  date_start_unix: number;
  date_end_unix: number;
  date_of_insertion_unix: number;
}

export interface Regions {
  last_generated: string;
  proto_name: "VR_COLLECTION";
  name: string;
  code: string;
  hospital_nice: RegionsHospitalNice[];
  tested_overall: RegionsTestedOverall[];
  escalation_levels: EscalationLevels[];
  nursing_home: RegionsNursingHome[];
  sewer: RegionsSewer[];
  behavior: RegionsBehavior[];
  disability_care: RegionsDisabilityCare[];
  elderly_at_home: RegionsElderlyAtHome[];
}
export interface RegionsHospitalNice {
  date_unix: number;
  vrcode: string;
  admissions_on_date_of_admission: number;
  admissions_on_date_of_reporting: number;
  date_of_insertion_unix: number;
}
export interface RegionsTestedOverall {
  date_unix: number;
  vrcode: string;
  infected_per_100k: number;
  infected: number;
  date_of_insertion_unix: number;
}
export interface EscalationLevels {
  date_unix: number;
  vrcode: string;
  level: number;
  valid_from_unix: number;
  last_determined_unix: number;
  date_of_insertion_unix: number;
}
export interface RegionsNursingHome {
  newly_infected_people: number;
  newly_infected_locations: number;
  infected_locations_total: number;
  infected_locations_percentage: number;
  deceased_daily: number;
  date_unix: number;
  date_of_insertion_unix: number;
  vrcode: string;
}
export interface RegionsSewer {
  date_start_unix: number;
  date_end_unix: number;
  vrcode: string;
  average: number;
  total_installation_count: number;
  date_of_insertion_unix: number;
}
export interface RegionsBehavior {
  vrcode: string;
  number_of_participants: number;
  curfew_compliance: number | null;
  curfew_compliance_trend: ("up" | "down" | "equal") | null;
  wash_hands_compliance: number | null;
  wash_hands_compliance_trend: ("up" | "down" | "equal") | null;
  keep_distance_compliance: number | null;
  keep_distance_compliance_trend: ("up" | "down" | "equal") | null;
  work_from_home_compliance: number | null;
  work_from_home_compliance_trend: ("up" | "down" | "equal") | null;
  avoid_crowds_compliance: number | null;
  avoid_crowds_compliance_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_indoors_compliance: number | null;
  wear_mask_public_indoors_compliance_trend: ("up" | "down" | "equal") | null;
  sneeze_cough_elbow_compliance: number | null;
  sneeze_cough_elbow_compliance_trend: ("up" | "down" | "equal") | null;
  max_visitors_compliance: number | null;
  max_visitors_compliance_trend: ("up" | "down" | "equal") | null;
  curfew_support: number | null;
  curfew_support_trend: ("up" | "down" | "equal") | null;
  wash_hands_support: number | null;
  wash_hands_support_trend: ("up" | "down" | "equal") | null;
  keep_distance_support: number | null;
  keep_distance_support_trend: ("up" | "down" | "equal") | null;
  work_from_home_support: number | null;
  work_from_home_support_trend: ("up" | "down" | "equal") | null;
  avoid_crowds_support: number | null;
  avoid_crowds_support_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_indoors_support: number | null;
  wear_mask_public_indoors_support_trend: ("up" | "down" | "equal") | null;
  sneeze_cough_elbow_support: number | null;
  sneeze_cough_elbow_support_trend: ("up" | "down" | "equal") | null;
  max_visitors_support: number | null;
  max_visitors_support_trend: ("up" | "down" | "equal") | null;
  date_start_unix: number;
  date_end_unix: number;
  date_of_insertion_unix: number;
}
export interface RegionsDisabilityCare {
  newly_infected_people: number;
  newly_infected_locations: number;
  infected_locations_total: number;
  infected_locations_percentage: number;
  deceased_daily: number;
  date_unix: number;
  date_of_insertion_unix: number;
  vrcode: string;
}
export interface RegionsElderlyAtHome {
  positive_tested_daily: number;
  positive_tested_daily_per_100k: number;
  deceased_daily: number;
  date_unix: number;
  date_of_insertion_unix: number;
  vrcode: string;
}
