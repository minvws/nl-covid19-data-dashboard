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
    if (isPresent(el.fully_vaccinated_percentage_label)) {
      const result = parseFullyVaccinatedPercentageLabel(
        el.fully_vaccinated_percentage_label
      );

      if (isPresent(result)) {
        return {
          ...el,
          fully_vaccinated_percentage: result.sign === '>' ? 100 : 0,
        };
      }
    }

    return el;
  });
}
