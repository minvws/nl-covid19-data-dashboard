export interface National {
  last_generated: number;
  name: string;
  code: string;
  intake_share_age_groups: IntakeShareAgeGroups;
  intake_hospital_ma: IntakeHospitalMa;
  intake_intensivecare_ma: IntakeIntensivecareMa;
  infected_people_total: InfectedPeopleTotal;
  infected_people_delta_normalized: InfectedPeopleDeltaNormalized;
  infectious_people_count: InfectiousPeopleCount;
  infectious_people_count_normalized: InfectiousPeopleCount;
  reproduction_index: ReproductionIndex;
  infected_people_nursery_count_daily: DeceasedPeopleNurseryCountDaily;
  deceased_people_nursery_count_daily: DeceasedPeopleNurseryCountDaily;
  total_reported_locations: DeceasedPeopleNurseryCountDaily;
  total_newly_reported_locations: DeceasedPeopleNurseryCountDaily;
  verdenkingen_huisartsen: RioolwaterMetingen;
  rioolwater_metingen: RioolwaterMetingen;
}

export interface DeceasedPeopleNurseryCountDaily {
  values: DeceasedPeopleNurseryCountDailyLastValue[];
  last_value: DeceasedPeopleNurseryCountDailyLastValue;
}

export interface DeceasedPeopleNurseryCountDailyLastValue {
  date_of_report_unix: number;
  infected_nursery_daily: number | null;
  deceased_nursery_daily: number | null;
  total_new_reported_locations: number | null;
  total_reported_locations: number | null;
  date_of_insertion_unix: number;
}

export interface InfectedPeopleDeltaNormalized {
  values: InfectedPeopleDeltaNormalizedLastValue[];
  last_value: InfectedPeopleDeltaNormalizedLastValue;
}

export interface InfectedPeopleDeltaNormalizedLastValue {
  date_of_report_unix: number;
  infected_daily_increase: number | null;
  date_of_insertion_unix: number;
}

export interface InfectedPeopleTotal {
  values: InfectedPeopleTotalLastValue[];
  last_value: InfectedPeopleTotalLastValue;
}

export interface InfectedPeopleTotalLastValue {
  date_of_report_unix: number;
  infected_daily_total: number | null;
}

export interface InfectiousPeopleCount {
  values: InfectiousPeopleCountLastValue[];
  last_value: InfectiousPeopleCountLastValue;
}

export interface InfectiousPeopleCountNormalized {
  values: InfectiousPeopleCountLastValueNormalized[];
  last_value: InfectiousPeopleCountLastValueNormalized;
}

export interface InfectiousPeopleCountLastValue {
  date_of_insertion_unix: number;
  date_of_report_unix: number;
  infectious_avg: number | null;
  infectious_high: number | null;
  infectious_low: number | null;
}

export interface InfectiousPeopleCountLastValueNormalized {
  date_of_insertion_unix: number;
  date_of_report_unix: number;
  infectious_avg_normalized: number | null;
  infectious_high_normalized: number | null;
  infectious_low_normalized: number | null;
}

export interface IntakeHospitalMa {
  values: IntakeHospitalMaLastValue[];
  last_value: IntakeHospitalMaLastValue;
}

export interface IntakeHospitalMaLastValue {
  date_of_report_unix: number;
  moving_average_hospital: number | null;
}

export interface IntakeIntensivecareMa {
  values: IntakeIntensivecareMaLastValue[];
  last_value: IntakeIntensivecareMaLastValue;
}

export interface IntakeIntensivecareMaLastValue {
  date_of_report_unix: number;
  moving_average_ic: number | null;
}

export interface IntakeShareAgeGroups {
  values: IntakeShareAgeGroupsLastValue[];
  last_value: IntakeShareAgeGroupsLastValue;
}

export interface IntakeShareAgeGroupsLastValue {
  date_of_report_unix: number;
  agegroup: string | null;
  infected_per_agegroup_increase: number | null;
}

export interface ReproductionIndex {
  values: ReproductionIndexLastValue[];
  last_value: ReproductionIndexLastValue;
}

export interface ReproductionIndexLastValue {
  date_of_report_unix: number;
  reproduction_index_low: number | null;
  reproduction_index_avg: number | null;
  reproduction_index_high: number | null;
  date_of_insertion_unix: number;
}

export interface RioolwaterMetingen {
  values: RioolwaterMetingenLastValue[];
  last_value: RioolwaterMetingenLastValue;
}

export interface RioolwaterMetingenLastValue {
  last_week_unix: number;
  week_unix: number;
  average?: string | null;
  date_of_insertion_unix: number;
  incidentie?: number | null;
}
