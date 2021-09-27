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
  sortingOrder: string[];
  values:
    | NlVaccineCoveragePerAgeGroupValue[]
    | VrVaccineCoveragePerAgeGroupValue[]
    | GmVaccineCoveragePerAgeGroupValue[];
}

export function VaccineCoveragePerAgeGroup({
  title,
  description,
  metadata,
  values,
  sortingOrder,
}: VaccineCoveragePerAgeGroupProps) {
  const breakpoints = useBreakpoints(true);

  const getSortingOrder = (ageGroup: string) => {
    const index = sortingOrder.findIndex((x) => x === ageGroup);

    assert(index >= 0, `No sorting order defined for age group ${ageGroup}`);

    return index;
  };

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
