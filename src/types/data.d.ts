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
  hospital_admissions: HospitalAdmissions;
  positive_tested_people: PositiveTestedPeople;
  sewer_measurements?: SewerMeasurements;
  results_per_sewer_installation_per_municipality?: ResultsPerSewerInstallationPerMunicipality;
}
export interface HospitalAdmissions {
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
export interface PositiveTestedPeople {
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
export interface SewerMeasurements {
  values: SewerMeasurementsLastValue[];
  last_value: SewerMeasurementsLastValue;
}
export interface SewerMeasurementsLastValue {
  week_unix: number;
  week_start_unix: number;
  week_end_unix: number;
  gmcode: string;
  average: number;
  total_installation_count: number;
  date_of_insertion_unix: number;
}
export interface ResultsPerSewerInstallationPerMunicipality {
  values: ResultsPerSewerInstallationPerMunicipalityItem[];
}
export interface ResultsPerSewerInstallationPerMunicipalityItem {
  rwzi_awzi_code: string;
  values: ResultsPerSewerInstallationPerMunicipalityLastValue[];
  last_value: ResultsPerSewerInstallationPerMunicipalityLastValue;
}
export interface ResultsPerSewerInstallationPerMunicipalityLastValue {
  date_measurement_unix: number;
  week_start_unix: number;
  week_end_unix: number;
  week: number;
  rwzi_awzi_code: string;
  rwzi_awzi_name: string;
  gmcode: string;
  rna_per_ml: number;
  date_of_insertion_unix: number;
}

export interface Municipalities {
  last_generated: string;
  proto_name: "MUNICIPALITIES";
  name: string;
  code: string;
  hospital_admissions: HospitalAdmissions[];
  positive_tested_people: PositiveTestedPeople[];
  deceased: Deceased[];
}
export interface HospitalAdmissions {
  date_of_report_unix: number;
  gmcode: string;
  hospital_admissions: number;
  date_of_insertion_unix: number;
}
export interface PositiveTestedPeople {
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
  intake_share_age_groups: IntakeShareAgeGroups;
  reproduction_index: ReproductionIndex;
  reproduction_index_last_known_average: ReproductionIndexLastKnownAverage;
  infectious_people_last_known_average?: InfectiousPeopleLastKnownAverage;
  rioolwater_metingen: RioolwaterMetingen;
  rioolwater_metingen_per_rwzi: RioolwaterMetingenPerRwzi;
  hospital_beds_occupied: HospitalBedsOccupied;
  intensive_care_beds_occupied: IntensiveCareBedsOccupied;
  ggd: NationalGgd;
  nursing_home: NationalNursingHome;
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
export interface IntakeShareAgeGroups {
  values: IntakeShareAgeGroupsLastValue[];
  last_value: IntakeShareAgeGroupsLastValue;
}
export interface IntakeShareAgeGroupsLastValue {
  agegroup: string;
  infected_per_agegroup_increase: number;
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
export interface RioolwaterMetingen {
  values: RioolwaterMetingenLastValue[];
  last_value: RioolwaterMetingenLastValue;
}
export interface RioolwaterMetingenLastValue {
  week_unix: number;
  average: number;
  total_installation_count: number;
  date_of_insertion_unix: number;
  week_start_unix: number;
  week_end_unix: number;
}
export interface RioolwaterMetingenPerRwzi {
  values: RioolwaterMetingenPerRwziLastValue[];
  last_value: RioolwaterMetingenPerRwziLastValue;
}
export interface RioolwaterMetingenPerRwziLastValue {
  week_start_unix: number;
  week_end_unix: number;
  date_measurement_unix: number;
  rwzi_awzi_code: string;
  rwzi_awzi_name: string;
  gm_code: string;
  vrcode: string;
  vrnaam: string;
  rna_per_ml: number;
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
  infected_daily: number;
  infected_percentage_daily: number;
  tested_total_daily: number;
  date_of_report_unix: number;
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
  max_latest_rna_per_ml: number;
  min_latest_rna_per_ml: number;
  max_average_per_region: number;
  min_average_per_region: number;
  max_rna_per_ml: number;
  min_rna_per_ml: number;
}

export interface Regionaal {
  last_generated: string;
  proto_name: string;
  name: string;
  code: string;
  results_per_sewer_installation_per_region: ResultsPerSewerInstallationPerRegion;
  average_sewer_installation_per_region: AverageSewerInstallationPerRegion;
  results_per_region: ResultsPerRegion;
  ggd: RegionalGgd;
  nursing_home: RegionalNursingHome;
  restrictions?: RegionalRestrictions;
}
export interface ResultsPerSewerInstallationPerRegion {
  values: SewerValueElement[];
}
export interface SewerValueElement {
  rwzi_awzi_code: string;
  values: SewerValue[];
  last_value: SewerValue;
}
export interface SewerValue {
  date_measurement_unix: number;
  week: number;
  week_start_unix: number;
  week_end_unix: number;
  rwzi_awzi_code: string;
  rwzi_awzi_name: string;
  vrcode: string;
  vrnaam: string;
  gmcode: string;
  rna_per_ml: number;
  date_of_insertion_unix: number;
}
export interface AverageSewerInstallationPerRegion {
  values: AverageSewerInstallationPerRegionItem[];
  last_value: AverageSewerInstallationPerRegionItem;
}
export interface AverageSewerInstallationPerRegionItem {
  week_unix: number;
  week_start_unix: number;
  week_end_unix: number;
  vrcode: string;
  average: number;
  total_installation_count: number;
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
  infected_daily: number;
  infected_percentage_daily: number;
  tested_total_daily: number;
  date_of_report_unix: number;
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
  vrcode: string;
  values: number[];
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

export interface Restrictions {
  last_generated: string;
  proto_name: string;
  name: string;
  code: string;
  values: RestrictionsValue[];
}
export interface RestrictionsValue {
  identifier: number;
  target_region: "nl" | "vr";
  escalation_level: number;
  category_id: string;
  restriction_order: number;
}
