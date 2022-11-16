import { colors } from '@corona-dashboard/common';

export const COLOR_FULLY_VACCINATED = colors.scale.blueDetailed[3];
export const COLOR_FULLY_BOOSTERED = colors.scale.blue[5];
export const COLOR_AUTUMN_2022_SHOT = colors.scale.blueDetailed[8];

export const ARCHIVED_COLORS = {
  COLOR_HAS_ONE_SHOT: colors.scale.blue[0],
  COLOR_FULLY_VACCINATED: colors.primary,
};

type FullyVaccinatedAges = '18+' | '12+';
type Autumn2022Vaccinated = '60+' | '12+';

type MatchingVaccineCoverageAgeGroupsType = {
  autumn_2022_vaccinated_percentage: Autumn2022Vaccinated[];
  fully_vaccinated_percentage: FullyVaccinatedAges[];
};

export const matchingAgeGroups: MatchingVaccineCoverageAgeGroupsType = {
  autumn_2022_vaccinated_percentage: ['60+', '12+'],
  fully_vaccinated_percentage: ['18+', '12+'],
};
