import { GmCollectionVaccineCoveragePerAgeGroup, VrCollectionVaccineCoveragePerAgeGroup, VrVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';
import { ageGroups, PercentageKeysOfAgeGroups, PercentageLabelKeysOfAgeGroups } from '../common';
import { parseVaccinatedPercentageLabel } from '../logic/parse-vaccinated-percentage-label';

type VaccineCoveragePerAgeGroups = GmCollectionVaccineCoveragePerAgeGroup | VrCollectionVaccineCoveragePerAgeGroup

export function selectVaccineCoverageData<T extends VaccineCoveragePerAgeGroups>(
  data: T[]
) {
  return data.map((vaccineCoveragePerAgeGroup) => {
    const parsedLabels: {
      vaccinated_percentage_12_plus?: number | null;
      vaccinated_percentage_18_plus?: number | null;
      vaccinated_percentage_60_plus?: number | null;
    } = {};

    ageGroups.forEach(ageGroup => {
      const ageGroupKey = `vaccinated_percentage_${ageGroup}_plus` as keyof PercentageKeysOfAgeGroups
      const ageGroupLabel = `vaccinated_percentage_${ageGroup}_plus_label` as keyof PercentageLabelKeysOfAgeGroups
      const coveragePercentage = vaccineCoveragePerAgeGroup[ageGroupLabel]

      if (isPresent(coveragePercentage)) {
        const result = parseVaccinatedPercentageLabel(
          coveragePercentage
        );
  
        if (isPresent(result)) {
          parsedLabels[ageGroupKey] =
            result.sign === '>' ? 100 : 0;
        }
      }
    });
    
    return { ...vaccineCoveragePerAgeGroup, ...parsedLabels };
  });
}
