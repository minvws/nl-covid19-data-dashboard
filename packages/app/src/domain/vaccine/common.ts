import { colors } from '@corona-dashboard/common';

// TODO: after removing feature-flag {nlVaccinationBoosterShotsPerAgeGroup}
// delete
// - COLOR_HAS_ONE_SHOT
// replace
// - COLOR_FULLY_VACCINATED with colors.data.scale.blue[3];
export const COLOR_HAS_ONE_SHOT = colors.data.scale.blue[0];
export const COLOR_FULLY_VACCINATED = colors.data.primary;
export const COLOR_FULLY_BOOSTERED = colors.data.scale.blue[5];
