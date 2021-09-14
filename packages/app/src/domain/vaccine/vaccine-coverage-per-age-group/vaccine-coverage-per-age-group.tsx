import {
  assert,
  GmVaccineCoveragePerAgeGroupValue,
  NlVaccineCoveragePerAgeGroupValue,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { NarrowCoverageTable } from '~/domain/vaccine/vaccine-coverage-per-age-group/components/narrow-coverage-table';
import { WideCoverageTable } from '~/domain/vaccine/vaccine-coverage-per-age-group/components/wide-coverage-table';
import { useBreakpoints } from '~/utils/use-breakpoints';

interface VaccineCoveragePerAgeGroupProps {
  title: string;
  description: string;
  metadata: MetadataProps;
  values:
    | NlVaccineCoveragePerAgeGroupValue[]
    | VrVaccineCoveragePerAgeGroupValue[]
    | GmVaccineCoveragePerAgeGroupValue[];
}

const SORTING_ORDER = [
  '81+',
  '71-80',
  '61-70',
  '51-60',
  '41-50',
  '31-40',
  '18-30',
  '12-17',
];

function getSortingOrder(ageGroup: string) {
  const index = SORTING_ORDER.findIndex((x) => x === ageGroup);

  assert(index >= 0, `No sorting order defined for age group ${ageGroup}`);

  return index;
}

export function VaccineCoveragePerAgeGroup({
  title,
  description,
  metadata,
  values,
}: VaccineCoveragePerAgeGroupProps) {
  const breakpoints = useBreakpoints(true);

  const sortedValues = values.sort(
    (a, b) =>
      getSortingOrder(a.age_group_range) - getSortingOrder(b.age_group_range)
  );
  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      {breakpoints.md ? (
        <WideCoverageTable values={sortedValues} />
      ) : (
        <NarrowCoverageTable values={sortedValues} />
      )}
    </ChartTile>
  );
}
