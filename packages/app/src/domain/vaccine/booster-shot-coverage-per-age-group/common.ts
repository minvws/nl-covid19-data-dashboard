import {
  colors,
  NlBehaviorPerAgeGroupValue,
  NlBoosterShotPerAgeGroup,
  NlBoosterShotPerAgeGroupValue,
} from '@corona-dashboard/common';

export type CoverageTableRow = NlBoosterShotPerAgeGroupValue[];
export const COLOR_HAS_ONE_SHOT = colors.data.scale.blue[0];
export const COLOR_FULLY_VACCINATED = colors.data.primary;
export const COLOR_FULLY_BOOSTERED = colors.data.scale.blue[5];
