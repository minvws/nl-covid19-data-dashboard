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
  hospital_admissions: MunicipalHospitalAdmissions;
  positive_tested_people: MunicipalPositiveTestedPeople;
  sewer?: MunicipalSewer;
  sewer_per_installation?: MunicipalSewerPerInstallation;
}
export interface MunicipalHospitalAdmissions {
  values: HospitalAdmissionsLastValue[];
  last_value: HospitalAdmissionsLastValue;
}
export interface HospitalAdmissionsLastValue {
  date_of_report_unix: number;
  gmcode: string;
  municipality_name: string;
  moving_average_hospital: number;
  date_of_insertion_unix: number;
}
export interface MunicipalPositiveTestedPeople {
  values: PositiveTestedPeopleLastValue[];
  last_value: PositiveTestedPeopleLastValue;
}
export interface PositiveTestedPeopleLastValue {
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
  hospital_admissions: MunicipalitiesHospitalAdmissions[];
  positive_tested_people: MunicipalitiesPositiveTestedPeople[];
  deceased: Deceased[];
}
export interface MunicipalitiesHospitalAdmissions {
  date_of_report_unix: number;
  gmcode: string;
  hospital_admissions: number;
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
  verdenkingen_huisartsen: NationalHuisartsVerdenkingen;
  intake_hospital_ma: IntakeHospitalMa;
  infectious_people_count: InfectiousPeopleCount;
  infectious_people_count_normalized: InfectiousPeopleCountNormalized;
  intake_intensivecare_ma: IntakeIntensivecareMa;
  infected_people_clusters?: InfectedPeopleClusters;
  infected_people_total: NationalInfectedPeopleTotal;
  infected_people_delta_normalized: InfectedPeopleDeltaNormalized;
  infected_age_groups: InfectedAgeGroups;
  reproduction_index: ReproductionIndex;
  reproduction_index_last_known_average: ReproductionIndexLastKnownAverage;
  infectious_people_last_known_average: InfectiousPeopleLastKnownAverage;
  sewer: NationalSewer;
  sewer_per_installation: NationalSewerPerInstallation;
  hospital_beds_occupied: HospitalBedsOccupied;
  intensive_care_beds_occupied: IntensiveCareBedsOccupied;
  ggd: NationalGgd;
  nursing_home: NationalNursingHome;
  restrictions?: NationalRestrictions;
}
export interface NationalHuisartsVerdenkingen {
  values: NationalHuisartsVerdenkingenValue[];
  last_value: NationalHuisartsVerdenkingenValue;
  last_value_difference?: NationalHuisartsVerdenkingenValueDifference;
}
export interface NationalHuisartsVerdenkingenValue {
  week_unix: number;
  week_start_unix: number;
  week_end_unix: number;
  incidentie: number;
  geschat_aantal: number;
  date_of_insertion_unix: number;
}
export interface NationalHuisartsVerdenkingenValueDifference {
  incidentie_old: number;
  incidentie_difference: number;
  geschat_aantal_old: number;
  geschat_aantal_difference: number;
  date_of_report_unix_old: number;
}
export interface IntakeHospitalMa {
  values: IntakeHospitalMaLastValue[];
  last_value: IntakeHospitalMaLastValue;
}
export interface IntakeHospitalMaLastValue {
  moving_average_hospital: number;
  date_of_report_unix: number;
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
  last_value_difference?: NationalInfectedPeopleTotalValueDifference;
}
export interface NationalInfectedPeopleTotalValue {
  infected_daily_total: number;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
}
export interface NationalInfectedPeopleTotalValueDifference {
  infected_daily_total_old: number;
  infected_daily_total_difference: number;
  date_of_report_unix_old: number;
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
export interface InfectedAgeGroups {
  values: InfectedAgeGroup[];
}
export interface InfectedAgeGroup {
  age_group: string;
  infected_percentage: number;
  national_percentage: number;
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
export interface HospitalBedsOccupied {
  values: HospitalBedsOccupiedValue[];
  last_value: HospitalBedsOccupiedValue;
}
export interface HospitalBedsOccupiedValue {
  covid_occupied: number;
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
  sewer: RegionalSewer;
  sewer_per_installation: RegionalSewerPerInstallation;
  results_per_region: ResultsPerRegion;
  ggd: RegionalGgd;
  nursing_home: RegionalNursingHome;
  restrictions?: RegionalRestrictions;
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
  hospital_total_counts_per_region: number;
  active_clusters?: number | null;
  cluster_average?: number | null;
  infected_increase_per_region: number;
  hospital_increase_per_region: number;
  hospital_moving_avg_per_region: number;
  date_of_insertion_unix: number;
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

export interface Regions {
  last_generated: string;
  proto_name: "REGIONS";
  name: string;
  code: string;
  hospital_admissions: RegionHospitalAdmissions[];
  positive_tested_people: RegionPositiveTestedPeople[];
  deceased: RegionDeceased[];
  escalation_levels: EscalationLevels[];
  nursing_home: RegionsNursingHome[];
  sewer: RegionsSewer[];
}
export interface RegionHospitalAdmissions {
  date_of_report_unix: number;
  vrcode: string;
  hospital_admissions: number;
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
