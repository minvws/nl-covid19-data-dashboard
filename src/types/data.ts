export interface National {
  last_generated: number;
  id: number;
  name: string;
  code: string;
  intake_intensivecare_ma: IntakeIntensivecareMa;
  intake_hospital_ma: IntakeHospitalMa;
  infected_people_total: InfectedPeopleTotal;
  infected_people_delta_normalized: InfectedPeopleDeltaNormalized;
  intake_share_age_groups: IntakeShareAgeGroups;
  infectious_people_count: InfectiousPeopleCount;
  infectious_people_count_normalized: InfectiousPeopleCount;
  reproduction_index: ReproductionIndex;
  infected_people_nursery_count_daily: DeceasedPeopleNurseryCountDaily;
  deceased_people_nursery_count_daily: DeceasedPeopleNurseryCountDaily;
  total_reported_locations: DeceasedPeopleNurseryCountDaily;
  total_newly_reported_locations: DeceasedPeopleNurseryCountDaily;
  verdenkingen_huisartsen: VerdenkingenHuisartsen;
  rioolwater_metingen: RioolwaterMetingen;
}

export interface DeceasedPeopleNurseryCountDaily {
  last_value: DeceasedPeopleNurseryCountDailyLastValue;
  values: DeceasedPeopleNurseryCountDailyLastValue[];
}

export interface DeceasedPeopleNurseryCountDailyLastValue {
  date_of_report_unix: number;
  infected_nursery_daily: number;
  deceased_nursery_daily: number;
  total_new_reported_locations: number;
  total_reported_locations: number;
}

export interface InfectedPeopleDeltaNormalized {
  last_value: InfectedPeopleDeltaNormalizedLastValue;
  values: InfectedPeopleDeltaNormalizedLastValue[];
}

export interface InfectedPeopleDeltaNormalizedLastValue {
  date_of_report_unix: number;
  infected_daily_increase: number;
}

export interface InfectedPeopleTotal {
  last_value: InfectedPeopleTotalLastValue;
  values: InfectedPeopleTotalLastValue[];
}

export interface InfectedPeopleTotalLastValue {
  date_of_report_unix: number;
  infected_daily_total: number;
}

export interface InfectiousPeopleCount {
  last_value: InfectiousPeopleCountLastValue;
  values: InfectiousPeopleCountLastValue[];
}

export interface InfectiousPeopleCountLastValue {
  date_of_report_unix: number;
  infectious_low: number;
  infectious_avg: number;
  infectious_high: number;
  infectious_low_normalized: number;
  infectious_avg_normalized: number;
  infectious_high_normalized: number;
}

export interface IntakeHospitalMa {
  last_value: IntakeHospitalMaLastValue;
  values: IntakeHospitalMaLastValue[];
}

export interface IntakeHospitalMaLastValue {
  date_of_report_unix: number;
  moving_average_hospital: number;
}

export interface IntakeIntensivecareMa {
  last_value: IntakeIntensivecareMaLastValue;
  values: IntakeIntensivecareMaLastValue[];
}

export interface IntakeIntensivecareMaLastValue {
  date_of_report_unix: number;
  moving_average_ic: number;
}

export interface IntakeShareAgeGroups {
  last_value: IntakeShareAgeGroupsLastValue;
  values: IntakeShareAgeGroupsLastValue[];
}

export interface IntakeShareAgeGroupsLastValue {
  date_of_report_unix: number;
  agegroup: string;
  infected_per_agegroup_increase: number;
}

export interface ReproductionIndex {
  last_value: ReproductionIndexLastValue;
  values: ReproductionIndexLastValue[];
}

export interface ReproductionIndexLastValue {
  date_of_report_unix: number;
  reproduction_index_low: number | null;
  reproduction_index_avg: number | null;
  reproduction_index_high: number | null;
}

export interface RioolwaterMetingen {
  last_value: RioolwaterMetingenLastValue;
  values: RioolwaterMetingenLastValue[];
}

export interface RioolwaterMetingenLastValue {
  week: number;
  average: string;
  last_week_unix: number;
}

export interface VerdenkingenHuisartsen {
  last_value: VerdenkingenHuisartsenLastValue;
  values: VerdenkingenHuisartsenLastValue[];
}

export interface VerdenkingenHuisartsenLastValue {
  week: number;
  incidentie: number;
  last_week_unix: number;
}
