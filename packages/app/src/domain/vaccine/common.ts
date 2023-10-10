import { colors, ArchivedGmCollectionVaccineCoveragePerAgeGroupChoropleth } from '@corona-dashboard/common';

export const COLOR_FULLY_VACCINATED = colors.scale.blueDetailed[3];
export const COLOR_FULLY_BOOSTERED = colors.scale.blue[5];
export const COLOR_AUTUMN_2022_SHOT = colors.scale.blueDetailed[8];

export const ARCHIVED_COLORS = {
  COLOR_HAS_ONE_SHOT: colors.scale.blue[0],
  COLOR_FULLY_VACCINATED: colors.primary,
};

// set Age groups once inside AllAgeGroups and use them on the AgeGroups type and variable
const AllAgeGroups = ['12', '18', '60'] as const;
type AgeGroupsCombined = typeof AllAgeGroups;
export type AgeGroups = AgeGroupsCombined[number];
export const ageGroups = Object.values(AllAgeGroups);

type PrimarySeriesVaccinatedAges = Extract<AgeGroups, '18' | '12'>;
type Autumn2022Vaccinated = Extract<AgeGroups, '60' | '12'>;

type MatchingVaccineCoverageAgeGroupsType = {
  autumn_2022: Autumn2022Vaccinated[];
  primary_series: PrimarySeriesVaccinatedAges[];
};

export type VaccineCoverageData = ArchivedGmCollectionVaccineCoveragePerAgeGroupChoropleth;

export const matchingAgeGroups: MatchingVaccineCoverageAgeGroupsType = {
  autumn_2022: ['60', '12'],
  primary_series: ['18', '12'],
};

export type PercentageKeysOfAgeGroups = Pick<VaccineCoverageData, 'vaccinated_percentage_12_plus' | 'vaccinated_percentage_18_plus' | 'vaccinated_percentage_60_plus'>;

export type PercentageLabelKeysOfAgeGroups = Pick<
  VaccineCoverageData,
  'vaccinated_percentage_12_plus_label' | 'vaccinated_percentage_18_plus_label' | 'vaccinated_percentage_60_plus_label'
>;
export type BirthyearRangeKeysOfAgeGroups = Pick<VaccineCoverageData, 'birthyear_range_12_plus' | 'birthyear_range_18_plus' | 'birthyear_range_60_plus'>;

export type DataPerAgeGroup = {
  birthyear_range_plus: BirthyearRangeKeysOfAgeGroups;
  vaccinated_percentage_plus: PercentageKeysOfAgeGroups;
  vaccinated_percentage_plus_label: PercentageLabelKeysOfAgeGroups;
};
