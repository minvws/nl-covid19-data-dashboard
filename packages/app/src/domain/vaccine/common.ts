import { colors } from '@corona-dashboard/common';

export const COLOR_FULLY_VACCINATED = colors.data.scale.blueDetailed[3];
export const COLOR_FULLY_BOOSTERED = colors.data.scale.blue[5];
export const COLOR_AUTUMN_2022_SHOT = colors.data.scale.blueDetailed[8];

export const ARCHIVED_COLORS = {
  COLOR_HAS_ONE_SHOT: colors.data.scale.blue[0],
  COLOR_FULLY_VACCINATED: colors.data.primary,
};

type FullyVaccinatedAges = '12+' | '18+';
type Autumn2022Vaccinated = '12+' | '60+';

export type MatchingVaccineCoverageAgeGroupsType = {
  autumn_2022_vaccinated_percentage: Autumn2022Vaccinated[];
  fully_vaccinated_percentage: FullyVaccinatedAges[];
};