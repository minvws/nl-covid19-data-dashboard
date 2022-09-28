import {
  GmCollectionVaccineCoveragePerAgeGroup,
  VrCollectionVaccineCoveragePerAgeGroup,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';
import { parseVaccinatedPercentageLabel } from '../logic/parse-vaccinated-percentage-label';

export function selectVaccineCoverageData<
  T extends
    | GmCollectionVaccineCoveragePerAgeGroup
    | VrCollectionVaccineCoveragePerAgeGroup
    | VrVaccineCoveragePerAgeGroupValue
>(data: T[]) {
  return data.map((vaccineCoveragePerAgeGroup) => {
    const parsedLabels: {
      fully_vaccinated_percentage?: number;
      autumn_2022_vaccinated_percentage?: number;
    } = {};

    if (isPresent(vaccineCoveragePerAgeGroup.fully_vaccinated_percentage_label)) {
      const result = parseVaccinatedPercentageLabel(
        vaccineCoveragePerAgeGroup.fully_vaccinated_percentage_label
      );

      if (isPresent(result)) {
        parsedLabels.fully_vaccinated_percentage =
          result.sign === '>' ? 100 : 0;
      }
    }

    if (isPresent(vaccineCoveragePerAgeGroup.autumn_2022_vaccinated_percentage_label)) {
      const result = parseVaccinatedPercentageLabel(
        vaccineCoveragePerAgeGroup.autumn_2022_vaccinated_percentage_label
      );

      if (isPresent(result)) {
        parsedLabels.autumn_2022_vaccinated_percentage =
          result.sign === '>' ? 100 : 0;
      }
    }

    return { ...vaccineCoveragePerAgeGroup, ...parsedLabels };
  });
}
