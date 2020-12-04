/* tslint:disable */
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
  difference: MunicipalDifference;
  hospital: MunicipalHospital;
  positive_tested_people: MunicipalPositiveTestedPeople;
  sewer?: MunicipalSewer;
  sewer_per_installation?: MunicipalSewerPerInstallation;
}
export interface MunicipalDifference {
  positive_tested_people__infected_daily_increase?: DifferenceDecimal;
  positive_tested_people__infected_daily_total: DifferenceInteger;
  hospital__admissions_moving_average: DifferenceDecimal;
  sewer__average?: DifferenceDecimal;
}
export interface DifferenceDecimal {
  old_value: number;
  difference: number;
  old_date_of_report_unix: number;
  new_date_of_report_unix: number;
}
export interface DifferenceInteger {
  old_value: number;
  difference: number;
  old_date_of_report_unix: number;
  new_date_of_report_unix: number;
}
export interface MunicipalHospital {
  values: MunicipalHospitalValue[];
  last_value: MunicipalHospitalValue;
}
export interface MunicipalHospitalValue {
  date_of_report_unix: number;
  gmcode: string;
  municipality_name: string;
  admissions_moving_average: number;
  date_of_insertion_unix: number;
}
export interface MunicipalPositiveTestedPeople {
  values: MunicipalPositiveTestedPeopleValue[];
  last_value: MunicipalPositiveTestedPeopleValue;
}
export interface MunicipalPositiveTestedPeopleValue {
  date_of_report_unix: number;
  gmcode: string;
  municipality_name: string;
  infected_daily_total: number;
  infected_daily_increase: number;
  date_of_insertion_unix: number;
}
export interface MunicipalSewer {
  values: MunicipalSewerValue[];
  last_value: MunicipalSewerValue;
}
export interface MunicipalSewerValue {
  week_unix: number;
  week_start_unix: number;
  week_end_unix: number;
  gmcode: string;
  average: number;
  total_installation_count: number;
  date_of_insertion_unix: number;
}
export interface MunicipalSewerPerInstallation {
  values: MunicipalSewerPerInstallationInstallation[];
}
export interface MunicipalSewerPerInstallationInstallation {
  rwzi_awzi_code: string;
  values: MunicipalSewerPerInstallationValue[];
  last_value: MunicipalSewerPerInstallationValue;
}
export interface MunicipalSewerPerInstallationValue {
  date_measurement_unix: number;
  week_start_unix: number;
  week_end_unix: number;
  week: number;
  rwzi_awzi_code: string;
  rwzi_awzi_name: string;
  gmcode: string;
  rna_normalized: number;
  date_of_insertion_unix: number;
}

export interface Municipalities {
  last_generated: string;
  proto_name: "MUNICIPALITIES";
  name: string;
  code: string;
  hospital: MunicipalitiesHospital[];
  positive_tested_people: MunicipalitiesPositiveTestedPeople[];
  deceased: Deceased[];
}
export interface MunicipalitiesHospital {
  date_of_report_unix: number;
  gmcode: string;
  admissions_moving_average: number;
  date_of_insertion_unix: number;
}
export interface MunicipalitiesPositiveTestedPeople {
  date_of_report_unix: number;
  gmcode: string;
  positive_tested_people: number;
  total_positive_tested_people?: number;
  date_of_insertion_unix: number;
}
export interface Deceased {
  date_of_report_unix: number;
  gmcode: string;
  deceased: number;
  date_of_insertion_unix: number;
}

export interface National {
  last_generated: string;
  proto_name: "NL";
  name: string;
  code: string;
  difference: NationalDifference;
  verdenkingen_huisartsen: NationalHuisartsVerdenkingen;
  infectious_people_count: InfectiousPeopleCount;
  infectious_people_count_normalized: InfectiousPeopleCountNormalized;
  intake_intensivecare_ma: IntakeIntensivecareMa;
  infected_people_clusters?: InfectedPeopleClusters;
  infected_people_total: NationalInfectedPeopleTotal;
  infected_people_delta_normalized: InfectedPeopleDeltaNormalized;
  infected_age_groups: NationalInfectedAgeGroups;
  reproduction_index: ReproductionIndex;
  reproduction_index_last_known_average: ReproductionIndexLastKnownAverage;
  infectious_people_last_known_average: InfectiousPeopleLastKnownAverage;
  sewer: NationalSewer;
  sewer_per_installation: NationalSewerPerInstallation;
  hospital: NationalHospital;
  intensive_care_beds_occupied: IntensiveCareBedsOccupied;
  ggd: NationalGgd;
  nursing_home: NationalNursingHome;
  restrictions?: NationalRestrictions;
  behavior?: NationalBehavior;
}
export interface NationalDifference {
  infected_people_delta_normalized__infected_daily_increase?: DifferenceDecimal;
  infected_people_total__infected_daily_total: DifferenceInteger;
  ggd__tested_total?: DifferenceInteger;
  ggd__infected_percentage?: DifferenceDecimal;
  reproduction_index_last_known_average__reproduction_index_avg?: DifferenceDecimal;
  infectious_people_count_normalized__infectious_avg_normalized?: DifferenceDecimal;
  hospital__admissions_moving_average: DifferenceDecimal;
  hospital__beds_occupied_covid?: DifferenceInteger;
  intake_intensivecare_ma__moving_average_ic: DifferenceDecimal;
  intensive_care_beds_occupied__covid_occupied?: DifferenceInteger;
  huisarts_verdenkingen__incidentie?: DifferenceDecimal;
  huisarts_verdenkingen__geschat_aantal?: DifferenceInteger;
  sewer__average?: DifferenceDecimal;
  nursing_home__newly_infected_people?: DifferenceInteger;
  nursing_home__infected_locations_total?: DifferenceInteger;
  nursing_home__deceased_daily?: DifferenceInteger;
}
export interface DifferenceDecimal {
  old_value: number;
  difference: number;
  old_date_of_report_unix: number;
  new_date_of_report_unix: number;
}
export interface DifferenceInteger {
  old_value: number;
  difference: number;
  old_date_of_report_unix: number;
  new_date_of_report_unix: number;
}
export interface NationalHuisartsVerdenkingen {
  values: NationalHuisartsVerdenkingenValue[];
  last_value: NationalHuisartsVerdenkingenValue;
}
export interface NationalHuisartsVerdenkingenValue {
  week_unix: number;
  week_start_unix: number;
  week_end_unix: number;
  incidentie: number;
  geschat_aantal: number;
  date_of_insertion_unix: number;
}
export interface InfectiousPeopleCount {
  values: InfectiousPeopleCountLastValue[];
  last_value: InfectiousPeopleCountLastValue;
}
export interface InfectiousPeopleCountLastValue {
  infectious_low: number;
  infectious_avg: number | null;
  infectious_high: number;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
}
export interface InfectiousPeopleCountNormalized {
  values: InfectiousPeopleCountNormalizedLastValue[];
  last_value: InfectiousPeopleCountNormalizedLastValue;
}
export interface InfectiousPeopleCountNormalizedLastValue {
  infectious_low_normalized: number;
  infectious_avg_normalized: number | null;
  infectious_high_normalized: number;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
}
export interface IntakeIntensivecareMa {
  values: IntakeIntensivecareMaLastValue[];
  last_value: IntakeIntensivecareMaLastValue;
}
export interface IntakeIntensivecareMaLastValue {
  moving_average_ic: number;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
}
export interface InfectedPeopleClusters {
  values: InfectedPeopleClustersLastValue[];
  last_value: InfectedPeopleClustersLastValue;
}
export interface InfectedPeopleClustersLastValue {
  active_clusters: number | null;
  cluster_average: number | null;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalInfectedPeopleTotal {
  values: NationalInfectedPeopleTotalValue[];
  last_value: NationalInfectedPeopleTotalValue;
}
export interface NationalInfectedPeopleTotalValue {
  infected_daily_total: number;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
}
export interface InfectedPeopleDeltaNormalized {
  values: InfectedPeopleDeltaNormalizedLastValue[];
  last_value: InfectedPeopleDeltaNormalizedLastValue;
}
export interface InfectedPeopleDeltaNormalizedLastValue {
  infected_daily_increase: number;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalInfectedAgeGroups {
  values: NationalInfectedAgeGroupsValue[];
}
export interface NationalInfectedAgeGroupsValue {
  age_group_range: string;
  infected_percentage: number;
  age_group_percentage: number;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
}
export interface ReproductionIndex {
  values: ReproductionIndexLastValue[];
  last_value: ReproductionIndexLastValue;
}
export interface ReproductionIndexLastValue {
  reproduction_index_low: number | null;
  reproduction_index_avg: number | null;
  reproduction_index_high: number | null;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
}
export interface ReproductionIndexLastKnownAverage {
  values: ReproductionIndexLastKnownAverageLastValue[];
  last_value: ReproductionIndexLastKnownAverageLastValue;
}
export interface ReproductionIndexLastKnownAverageLastValue {
  reproduction_index_low: number;
  reproduction_index_avg: number;
  reproduction_index_high: number;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
}
export interface InfectiousPeopleLastKnownAverage {
  values: InfectiousPeopleLastKnownAverageValue[];
  last_value: InfectiousPeopleLastKnownAverageValue;
}
export interface InfectiousPeopleLastKnownAverageValue {
  infectious_low: number;
  infectious_avg: number;
  infectious_high: number;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalSewer {
  values: NationalSewerValue[];
  last_value: NationalSewerValue;
}
export interface NationalSewerValue {
  week_unix: number;
  average: number;
  total_installation_count: number;
  date_of_insertion_unix: number;
  week_start_unix: number;
  week_end_unix: number;
}
export interface NationalSewerPerInstallation {
  values: NationalSewerPerInstallationValue[];
  last_value: NationalSewerPerInstallationValue;
}
export interface NationalSewerPerInstallationValue {
  week_start_unix: number;
  week_end_unix: number;
  date_measurement_unix: number;
  rwzi_awzi_code: string;
  rwzi_awzi_name: string;
  gm_code: string;
  vrcode: string;
  vrnaam: string;
  rna_normalized: number;
  date_of_insertion_unix: number;
}
export interface NationalHospital {
  values: NationalHospitalValue[];
  last_value: NationalHospitalValue;
}
export interface NationalHospitalValue {
  admissions_moving_average: number;
  beds_occupied_covid: number;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
}
export interface IntensiveCareBedsOccupied {
  values: IntensiveCareBedsOccupiedValue[];
  last_value: IntensiveCareBedsOccupiedValue;
}
export interface IntensiveCareBedsOccupiedValue {
  covid_occupied: number;
  non_covid_occupied: number;
  covid_percentage_of_all_occupied: number;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalGgd {
  values: NationalGgdValue[];
  last_value: NationalGgdValue;
}
export interface NationalGgdValue {
  infected: number;
  infected_percentage: number;
  tested_total: number;
  week_unix: number;
  week_start_unix: number;
  week_end_unix: number;
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
  date_of_report_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalRestrictions {
  values: NationalRestrictionValue[];
}
export interface NationalRestrictionValue {
  restriction_id: string;
  target_region: string;
  escalation_level: 0 | 1 | 2 | 3 | 4 | 41 | 401;
  category_id:
    | "er_op_uit"
    | "bezoek"
    | "samenkomst"
    | "huwelijk"
    | "verpleeghuis"
    | "horeca"
    | "sport"
    | "reizen_binnenland"
    | "ov"
    | "uitvaart"
    | "onderwijs"
    | "werk"
    | "winkels"
    | "alcohol";
  restriction_order: number;
  valid_from_unix: number;
}
export interface NationalBehavior {
  values: NationalBehaviorValue[];
  last_value: NationalBehaviorValue;
}
export interface NationalBehaviorValue {
  number_of_participants: number;
  wash_hands_compliance: number | null;
  wash_hands_compliance_trend: ("up" | "down" | "equal") | null;
  keep_distance_compliance: number | null;
  keep_distance_compliance_trend: ("up" | "down" | "equal") | null;
  work_from_home_compliance: number | null;
  work_from_home_compliance_trend: ("up" | "down" | "equal") | null;
  avoid_crowds_compliance: number | null;
  avoid_crowds_compliance_trend: ("up" | "down" | "equal") | null;
  symptoms_stay_home_compliance: number | null;
  symptoms_stay_home_compliance_trend: ("up" | "down" | "equal") | null;
  symptoms_get_tested_compliance: number | null;
  symptoms_get_tested_compliance_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_indoors_compliance: number | null;
  wear_mask_public_indoors_compliance_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_transport_compliance: number | null;
  wear_mask_public_transport_compliance_trend: ("up" | "down" | "equal") | null;
  sneeze_cough_elbow_compliance: number | null;
  sneeze_cough_elbow_compliance_trend: ("up" | "down" | "equal") | null;
  max_visitors_compliance: number | null;
  max_visitors_compliance_trend: ("up" | "down" | "equal") | null;
  wash_hands_support: number | null;
  wash_hands_support_trend: ("up" | "down" | "equal") | null;
  keep_distance_support: number | null;
  keep_distance_support_trend: ("up" | "down" | "equal") | null;
  work_from_home_support: number | null;
  work_from_home_support_trend: ("up" | "down" | "equal") | null;
  avoid_crowds_support: number | null;
  avoid_crowds_support_trend: ("up" | "down" | "equal") | null;
  symptoms_stay_home_support: number | null;
  symptoms_stay_home_support_trend: ("up" | "down" | "equal") | null;
  symptoms_get_tested_support: number | null;
  symptoms_get_tested_support_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_indoors_support: number | null;
  wear_mask_public_indoors_support_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_transport_support?: number | null;
  wear_mask_public_transport_support_trend?: ("up" | "down" | "equal") | null;
  sneeze_cough_elbow_support: number | null;
  sneeze_cough_elbow_support_trend: ("up" | "down" | "equal") | null;
  max_visitors_support: number | null;
  max_visitors_support_trend: ("up" | "down" | "equal") | null;
  week_start_unix: number;
  week_end_unix: number;
  date_of_insertion_unix: number;
}

export interface Ranges {
  last_generated: string;
  proto_name: "RANGES";
  name: "ranges";
  code: "ra";
  min_max_values: MinMaxValues;
}
export interface MinMaxValues {
  values: MinMaxValuesItem[];
  last_value: MinMaxValuesItem;
}
export interface MinMaxValuesItem {
  date_of_report_unix: number;
  max_moving_average_hospital: number;
  min_moving_average_hospital: number;
  max_incidentie: number;
  min_incidentie: number;
  max_infectious_normalized_low: number;
  min_infectious_normalized_low: number;
  max_infectious_normalized_avg: number;
  min_infectious_normalized_avg: number;
  max_infectious_normalized_high: number;
  min_infectious_normalized_high: number;
  max_infectious_low: number;
  min_infectious_low: number;
  max_infectious_avg: number;
  min_infectious_avg: number;
  max_infectious_high: number;
  min_infectious_high: number;
  max_infected_daily_total: number;
  min_infected_daily_total: number;
  max_total_reported_increase_per_region: number;
  min_total_reported_increase_per_region: number;
  max_infected_total_counts_per_region: number;
  min_infected_total_counts_per_region: number;
  max_hospital_total_counts_per_region: number;
  min_hospital_total_counts_per_region: number;
  max_infected_increase_per_region: number;
  min_infected_increase_per_region: number;
  max_hospital_increase_per_region: number;
  min_hospital_increase_per_region: number;
  max_hospital_moving_avg_per_region: number;
  min_hospital_moving_avg_per_region: number;
  max_reproduction_index_low: number;
  min_reproduction_index_low: number;
  max_reproduction_index_avg: number;
  min_reproduction_index_avg: number;
  max_reproduction_index_high: number;
  min_reproduction_index_high: number;
  max_moving_average_ic: number;
  min_moving_average_ic: number;
  max_infected_daily_increase: number;
  min_infected_daily_increase: number;
  max_deceased_nursery_daily: number;
  min_deceased_nursery_daily: number;
  max_infected_nursery_daily: number;
  min_infected_nursery_daily: number;
  max_total_reported_locations: number;
  min_total_reported_locations: number;
  max_total_new_reported_locations: number;
  min_total_new_reported_locations: number;
  max_average: number;
  min_average: number;
  max_latest_rna_normalized: number;
  min_latest_rna_normalized: number;
  max_average_per_region: number;
  min_average_per_region: number;
  max_rna_normalized: number;
  min_rna_normalized: number;
}

export interface Regionaal {
  last_generated: string;
  proto_name: string;
  name: string;
  code: string;
  difference: RegionalDifference;
  sewer: RegionalSewer;
  sewer_per_installation: RegionalSewerPerInstallation;
  results_per_region: ResultsPerRegion;
  hospital: RegionalHospital;
  ggd: RegionalGgd;
  nursing_home: RegionalNursingHome;
  restrictions?: RegionalRestrictions;
  behavior?: RegionalBehavior;
}
export interface RegionalDifference {
  results_per_region__infected_increase_per_region?: DifferenceDecimal;
  results_per_region__total_reported_increase_per_region: DifferenceInteger;
  ggd__tested_total?: DifferenceInteger;
  ggd__infected_percentage?: DifferenceDecimal;
  hospital__admissions_moving_average: DifferenceDecimal;
  sewer__average?: DifferenceDecimal;
  nursing_home__newly_infected_people?: DifferenceInteger;
  nursing_home__infected_locations_total?: DifferenceInteger;
  nursing_home__deceased_daily?: DifferenceInteger;
}
export interface DifferenceDecimal {
  old_value: number;
  difference: number;
  old_date_of_report_unix: number;
  new_date_of_report_unix: number;
}
export interface DifferenceInteger {
  old_value: number;
  difference: number;
  old_date_of_report_unix: number;
  new_date_of_report_unix: number;
}
export interface RegionalSewer {
  values: RegionalSewerValue[];
  last_value: RegionalSewerValue;
}
export interface RegionalSewerValue {
  week_unix: number;
  week_start_unix: number;
  week_end_unix: number;
  vrcode: string;
  average: number;
  total_installation_count: number;
  date_of_insertion_unix: number;
}
export interface RegionalSewerPerInstallation {
  values: RegionalSewerPerInstallationInstallation[];
}
export interface RegionalSewerPerInstallationInstallation {
  rwzi_awzi_code: string;
  values: RegionalSewerPerInstallationValue[];
  last_value: RegionalSewerPerInstallationValue;
}
export interface RegionalSewerPerInstallationValue {
  date_measurement_unix: number;
  week: number;
  week_start_unix: number;
  week_end_unix: number;
  rwzi_awzi_code: string;
  rwzi_awzi_name: string;
  vrcode: string;
  vrnaam: string;
  gmcode: string;
  rna_normalized: number;
  date_of_insertion_unix: number;
}
export interface ResultsPerRegion {
  values: RegionaalValue[];
  last_value: RegionaalValue;
}
export interface RegionaalValue {
  date_of_report_unix: number;
  vrcode: string;
  total_reported_increase_per_region: number;
  infected_total_counts_per_region: number;
  active_clusters?: number | null;
  cluster_average?: number | null;
  infected_increase_per_region: number;
  date_of_insertion_unix: number;
}
export interface RegionalHospital {
  values: RegionalHospitalValue[];
  last_value: RegionalHospitalValue;
}
export interface RegionalHospitalValue {
  admissions_moving_average: number;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
  vrcode: string;
}
export interface RegionalGgd {
  values: RegionalGgdValue[];
  last_value: RegionalGgdValue;
}
export interface RegionalGgdValue {
  infected: number;
  infected_percentage: number;
  tested_total: number;
  week_unix: number;
  week_start_unix: number;
  week_end_unix: number;
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
  date_of_report_unix: number;
  date_of_insertion_unix: number;
  vrcode: string;
}
export interface RegionalRestrictions {
  values: RegionalRestrictionValue[];
}
export interface RegionalRestrictionValue {
  restriction_id: string;
  target_region: "nl" | "vr";
  escalation_level: 0 | 1 | 2 | 3 | 4 | 41 | 401;
  category_id:
    | "er_op_uit"
    | "bezoek"
    | "samenkomst"
    | "huwelijk"
    | "verpleeghuis"
    | "horeca"
    | "sport"
    | "reizen_binnenland"
    | "ov"
    | "uitvaart"
    | "onderwijs"
    | "werk"
    | "winkels"
    | "alcohol";
  restriction_order: number;
  valid_from_unix: number;
}
export interface RegionalBehavior {
  values: RegionalBehaviorValue[];
  last_value: RegionalBehaviorValue;
}
export interface RegionalBehaviorValue {
  number_of_participants: number;
  wash_hands_compliance: number | null;
  wash_hands_compliance_trend: ("up" | "down" | "equal") | null;
  keep_distance_compliance: number | null;
  keep_distance_compliance_trend: ("up" | "down" | "equal") | null;
  work_from_home_compliance: number | null;
  work_from_home_compliance_trend: ("up" | "down" | "equal") | null;
  avoid_crowds_compliance: number | null;
  avoid_crowds_compliance_trend: ("up" | "down" | "equal") | null;
  symptoms_stay_home_compliance: number | null;
  symptoms_stay_home_compliance_trend: ("up" | "down" | "equal") | null;
  symptoms_get_tested_compliance: number | null;
  symptoms_get_tested_compliance_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_indoors_compliance: number | null;
  wear_mask_public_indoors_compliance_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_transport_compliance: number | null;
  wear_mask_public_transport_compliance_trend: ("up" | "down" | "equal") | null;
  sneeze_cough_elbow_compliance: number | null;
  sneeze_cough_elbow_compliance_trend: ("up" | "down" | "equal") | null;
  max_visitors_compliance: number | null;
  max_visitors_compliance_trend: ("up" | "down" | "equal") | null;
  wash_hands_support: number | null;
  wash_hands_support_trend: ("up" | "down" | "equal") | null;
  keep_distance_support: number | null;
  keep_distance_support_trend: ("up" | "down" | "equal") | null;
  work_from_home_support: number | null;
  work_from_home_support_trend: ("up" | "down" | "equal") | null;
  avoid_crowds_support: number | null;
  avoid_crowds_support_trend: ("up" | "down" | "equal") | null;
  symptoms_stay_home_support: number | null;
  symptoms_stay_home_support_trend: ("up" | "down" | "equal") | null;
  symptoms_get_tested_support: number | null;
  symptoms_get_tested_support_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_indoors_support: number | null;
  wear_mask_public_indoors_support_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_transport_support?: number | null;
  wear_mask_public_transport_support_trend?: ("up" | "down" | "equal") | null;
  sneeze_cough_elbow_support: number | null;
  sneeze_cough_elbow_support_trend: ("up" | "down" | "equal") | null;
  max_visitors_support: number | null;
  max_visitors_support_trend: ("up" | "down" | "equal") | null;
  week_start_unix: number;
  week_end_unix: number;
  date_of_insertion_unix: number;
  vrcode: string;
}

export interface Regions {
  last_generated: string;
  proto_name: "REGIONS";
  name: string;
  code: string;
  hospital: RegionsHospital[];
  positive_tested_people: RegionPositiveTestedPeople[];
  deceased: RegionDeceased[];
  escalation_levels: EscalationLevels[];
  nursing_home: RegionsNursingHome[];
  sewer: RegionsSewer[];
  behavior?: RegionsBehavior[];
}
export interface RegionsHospital {
  date_of_report_unix: number;
  vrcode: string;
  admissions_moving_average: number;
  date_of_insertion_unix: number;
}
export interface RegionPositiveTestedPeople {
  date_of_report_unix: number;
  vrcode: string;
  positive_tested_people: number;
  total_positive_tested_people?: number;
  date_of_insertion_unix: number;
}
export interface RegionDeceased {
  date_of_report_unix: number;
  vrcode: string;
  deceased: number;
  date_of_insertion_unix: number;
}
export interface EscalationLevels {
  date_of_report_unix: number;
  vrcode: string;
  escalation_level: number;
  valid_from_unix: number;
  date_of_insertion_unix: number;
}
export interface RegionsNursingHome {
  newly_infected_people: number;
  newly_infected_locations: number;
  infected_locations_total: number;
  infected_locations_percentage: number;
  deceased_daily: number;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
  vrcode: string;
}
export interface RegionsSewer {
  week_unix: number;
  week_start_unix: number;
  week_end_unix: number;
  vrcode: string;
  average: number;
  total_installation_count: number;
  date_of_insertion_unix: number;
}
export interface RegionsBehavior {
  vrcode: string;
  number_of_participants: number;
  wash_hands_compliance: number | null;
  wash_hands_compliance_trend: ("up" | "down" | "equal") | null;
  keep_distance_compliance: number | null;
  keep_distance_compliance_trend: ("up" | "down" | "equal") | null;
  work_from_home_compliance: number | null;
  work_from_home_compliance_trend: ("up" | "down" | "equal") | null;
  avoid_crowds_compliance: number | null;
  avoid_crowds_compliance_trend: ("up" | "down" | "equal") | null;
  symptoms_stay_home_compliance: number | null;
  symptoms_stay_home_compliance_trend: ("up" | "down" | "equal") | null;
  symptoms_get_tested_compliance: number | null;
  symptoms_get_tested_compliance_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_indoors_compliance: number | null;
  wear_mask_public_indoors_compliance_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_transport_compliance: number | null;
  wear_mask_public_transport_compliance_trend: ("up" | "down" | "equal") | null;
  sneeze_cough_elbow_compliance: number | null;
  sneeze_cough_elbow_compliance_trend: ("up" | "down" | "equal") | null;
  max_visitors_compliance: number | null;
  max_visitors_compliance_trend: ("up" | "down" | "equal") | null;
  wash_hands_support: number | null;
  wash_hands_support_trend: ("up" | "down" | "equal") | null;
  keep_distance_support: number | null;
  keep_distance_support_trend: ("up" | "down" | "equal") | null;
  work_from_home_support: number | null;
  work_from_home_support_trend: ("up" | "down" | "equal") | null;
  avoid_crowds_support: number | null;
  avoid_crowds_support_trend: ("up" | "down" | "equal") | null;
  symptoms_stay_home_support: number | null;
  symptoms_stay_home_support_trend: ("up" | "down" | "equal") | null;
  symptoms_get_tested_support: number | null;
  symptoms_get_tested_support_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_indoors_support: number | null;
  wear_mask_public_indoors_support_trend: ("up" | "down" | "equal") | null;
  wear_mask_public_transport_support?: number | null;
  wear_mask_public_transport_support_trend?: ("up" | "down" | "equal") | null;
  sneeze_cough_elbow_support: number | null;
  sneeze_cough_elbow_support_trend: ("up" | "down" | "equal") | null;
  max_visitors_support: number | null;
  max_visitors_support_trend: ("up" | "down" | "equal") | null;
  week_start_unix: number;
  week_end_unix: number;
  date_of_insertion_unix: number;
}
