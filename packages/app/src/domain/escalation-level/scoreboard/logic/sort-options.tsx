import { VrScoreboardData } from './scoreboard-types';

export const scoreboardSortOptions = {
  location_a_to_z: (a: VrScoreboardData, b: VrScoreboardData) => {
    if (a.safetyRegionName < b.safetyRegionName) return -1;
    if (b.safetyRegionName < a.safetyRegionName) return 1;
    return 0;
  },
  positively_tested_high_to_low: (a: VrScoreboardData, b: VrScoreboardData) => {
    if (
      (a.data.positive_tested_per_100k ?? -Infinity) >
      (b.data.positive_tested_per_100k ?? -Infinity)
    )
      return -1;
    if (
      (b.data.positive_tested_per_100k ?? -Infinity) >
      (a.data.positive_tested_per_100k ?? -Infinity)
    )
      return 1;
    return 0;
  },
  positively_tested_low_to_high: (a: VrScoreboardData, b: VrScoreboardData) => {
    if (
      (a.data.positive_tested_per_100k ?? -Infinity) <
      (b.data.positive_tested_per_100k ?? -Infinity)
    )
      return -1;
    if (
      (b.data.positive_tested_per_100k ?? -Infinity) <
      (a.data.positive_tested_per_100k ?? -Infinity)
    )
      return 1;
    return 0;
  },
  hospital_admissions_high_to_low: (
    a: VrScoreboardData,
    b: VrScoreboardData
  ) => {
    if (
      (a.data.hospital_admissions_per_million ?? -Infinity) >
      (b.data.hospital_admissions_per_million ?? -Infinity)
    )
      return -1;
    if (
      (b.data.hospital_admissions_per_million ?? -Infinity) >
      (a.data.hospital_admissions_per_million ?? -Infinity)
    )
      return 1;
    return 0;
  },
  hospital_admissions_low_to_high: (
    a: VrScoreboardData,
    b: VrScoreboardData
  ) => {
    if (
      (a.data.hospital_admissions_per_million ?? -Infinity) <
      (b.data.hospital_admissions_per_million ?? -Infinity)
    )
      return -1;
    if (
      (b.data.hospital_admissions_per_million ?? -Infinity) <
      (a.data.hospital_admissions_per_million ?? -Infinity)
    )
      return 1;
    return 0;
  },
} as const;

export type SortIdentifier = keyof typeof scoreboardSortOptions;
