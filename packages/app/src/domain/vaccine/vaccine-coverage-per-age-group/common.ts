import {
  GmVaccineCoveragePerAgeGroupValue,
  NlVaccineCoveragePerAgeGroupValue,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { colors } from '~/style/theme';

export type CoverageTableRow =
  | NlVaccineCoveragePerAgeGroupValue[]
  | VrVaccineCoveragePerAgeGroupValue[]
  | GmVaccineCoveragePerAgeGroupValue[];

export const COLOR_HAS_ONE_SHOT = colors.data.scale.blue[0];
export const COLOR_FULLY_VACCINATED = colors.data.primary;
