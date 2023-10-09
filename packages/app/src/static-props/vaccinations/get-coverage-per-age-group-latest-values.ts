import { ArchivedNlVaccineCoveragePerAgeGroupAutumn_2022Value } from '@corona-dashboard/common';

export function getCoveragePerAgeGroupLatestValues(values: ArchivedNlVaccineCoveragePerAgeGroupAutumn_2022Value[]) {
  /**
   * Get all the unique age groups in the data.
   */
  const uniqueAgeKeys = [...new Set(values.map((item) => item.age_group_range).flat())];

  /**
   * Per unique age group get the latest value available.
   */
  const latestValuesPerAgeGroup = uniqueAgeKeys.map((ageGroup) => {
    return values
      .filter((item) => item.age_group_range === ageGroup)
      .sort((a, b) => a.date_unix - b.date_unix)
      .reverse()[0];
  });

  return latestValuesPerAgeGroup;
}
