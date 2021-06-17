import { VrScoreboardData } from './scoreboard-types';

export const scoreboardSortOptions = {
  location_a_to_z: (a: VrScoreboardData, b: VrScoreboardData) => {
    if (a.safetyRegionName < b.safetyRegionName) return -1;
    if (b.safetyRegionName < a.safetyRegionName) return 1;
    return 0;
  },
  location_z_to_a: (a: VrScoreboardData, b: VrScoreboardData) => {
    if (a.safetyRegionName > b.safetyRegionName) return -1;
    if (b.safetyRegionName > a.safetyRegionName) return 1;
    return 0;
  },
  positively_tested_high_to_low: (a: VrScoreboardData, b: VrScoreboardData) => {
    if (
      (a.data.positive_tested_per_100k as number) >
      (b.data.positive_tested_per_100k as number)
    )
      return -1;
    if (
      (b.data.positive_tested_per_100k as number) >
      (a.data.positive_tested_per_100k as number)
    )
      return 1;
    return 0;
  },
  positively_tested_low_to_high: (a: VrScoreboardData, b: VrScoreboardData) => {
    if (
      (a.data.positive_tested_per_100k as number) <
      (b.data.positive_tested_per_100k as number)
    )
      return -1;
    if (
      (b.data.positive_tested_per_100k as number) <
      (a.data.positive_tested_per_100k as number)
    )
      return 1;
    return 0;
  },
  hospital_admissions_high_to_low: (
    a: VrScoreboardData,
    b: VrScoreboardData
  ) => {
    if (
      (a.data.hospital_admissions_per_million as number) >
      (b.data.hospital_admissions_per_million as number)
    )
      return -1;
    if (
      (b.data.hospital_admissions_per_million as number) >
      (a.data.hospital_admissions_per_million as number)
    )
      return 1;
    return 0;
  },
  hospital_admissions_low_to_high: (
    a: VrScoreboardData,
    b: VrScoreboardData
  ) => {
    if (
      (a.data.hospital_admissions_per_million as number) <
      (b.data.hospital_admissions_per_million as number)
    )
      return -1;
    if (
      (b.data.hospital_admissions_per_million as number) <
      (a.data.hospital_admissions_per_million as number)
    )
      return 1;
    return 0;
  },
} as const;

export const scoreboardSortIdentifiers = Object.keys(
  scoreboardSortOptions
) as SortIdentifier[];

export type SortIdentifier = keyof typeof scoreboardSortOptions;
