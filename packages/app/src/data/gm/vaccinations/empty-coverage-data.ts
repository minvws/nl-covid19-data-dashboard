// This file was introduced as part of COR-1226 which covers the municipality reorganisation of 2023.
// During this reorganisation, three municipalities (GMs) have been merged into a single GM, specifically
// GM0501, GM0530 and GM0614 became GM1992. This reorganisation resulted in missing coverage data
// for both booster vaccinations as well as base vaccinations. This file combats the missing data by
// generating 'empty' data objects with no values.

const emptyBoosterCoverageValue = {
  percentage: null,
  percentage_label: null,
  date_of_insertion_unix: null,
  date_unix: undefined,
};

const emptyVaccineCoveragePerAgeGroupValue = {
  has_one_shot_percentage: null,
  has_one_shot_percentage_label: null,
  fully_vaccinated_percentage: null,
  fully_vaccinated_percentage_label: null,
  date_of_insertion_unix: null,
  date_unix: null,
};

export const emptyCoverageData = {
  booster_coverage_archived_20220904: {
    values: [
      { age_group: '12+', ...emptyBoosterCoverageValue },
      { age_group: '18+', ...emptyBoosterCoverageValue },
    ],
  },
  vaccine_coverage_per_age_group_archived: {
    values: [
      { age_group_range: '18+', birthyear_range: '-2003', ...emptyVaccineCoveragePerAgeGroupValue },
      { age_group_range: '12+', birthyear_range: '-2009', ...emptyVaccineCoveragePerAgeGroupValue },
    ],
  },
  vaccine_coverage_per_age_group_archived_20220908: {
    values: [
      { age_group_range: '18+', birthyear_range: '-2004', ...emptyVaccineCoveragePerAgeGroupValue },
      { age_group_range: '12+', birthyear_range: '-2010', ...emptyVaccineCoveragePerAgeGroupValue },
    ],
  },
};
