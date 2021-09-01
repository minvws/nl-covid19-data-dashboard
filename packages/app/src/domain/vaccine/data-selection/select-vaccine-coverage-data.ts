import {
  GmCollectionVaccineCoveragePerAgeGroup,
  VrCollectionVaccineCoveragePerAgeGroup,
} from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';
import { parseLabel } from '../logic/parse-fully-vaccinated-percentage-label';

export function selectVaccineCoverageData<
  T extends
    | GmCollectionVaccineCoveragePerAgeGroup
    | VrCollectionVaccineCoveragePerAgeGroup
>(data: T[]) {
  return data.map((el) => {
    if (isPresent(el.fully_vaccinated_percentage_label)) {
      const result = parseLabel(el.fully_vaccinated_percentage_label);

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
