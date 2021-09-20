import {
  GmCollectionVaccineCoveragePerAgeGroup,
  VrCollectionVaccineCoveragePerAgeGroup,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';
import { parseFullyVaccinatedPercentageLabel } from '../logic/parse-fully-vaccinated-percentage-label';

export function selectVaccineCoverageData<
  T extends
    | GmCollectionVaccineCoveragePerAgeGroup
    | VrCollectionVaccineCoveragePerAgeGroup
    | VrVaccineCoveragePerAgeGroupValue
>(data: T[]) {
  return data.map((el) => {
    const parsedLabels: {
      fully_vaccinated_percentage?: number;
      has_one_shot_percentage?: number;
    } = {};

    if (isPresent(el.fully_vaccinated_percentage_label)) {
      const result = parseFullyVaccinatedPercentageLabel(
        el.fully_vaccinated_percentage_label
      );

      if (isPresent(result)) {
        parsedLabels.fully_vaccinated_percentage =
          result.sign === '>' ? 100 : 0;
      }
    }

    if (isPresent(el.has_one_shot_percentage_label)) {
      const result = parseFullyVaccinatedPercentageLabel(
        el.has_one_shot_percentage_label
      );

      if (isPresent(result)) {
        parsedLabels.has_one_shot_percentage = result.sign === '>' ? 100 : 0;
      }
    }

    return { ...el, ...parsedLabels };
  });
}
