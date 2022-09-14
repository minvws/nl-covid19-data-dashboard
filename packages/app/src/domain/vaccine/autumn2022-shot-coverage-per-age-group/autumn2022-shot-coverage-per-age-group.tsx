import {
  assert,
  GmVaccineCoveragePerAgeGroupValue,
  NlVaccineCoveragePerAgeGroupValue,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { NarrowCoverageTable } from './components/narrow-coverage-table';
import { WideCoverageTable } from './components/wide-coverage-table';
import { SiteText } from '~/locale';
import { useBreakpoints } from '~/utils/use-breakpoints';

interface Autumn2022CoveragePerAgeGroupProps {
  title: string;
  description: string;
  metadata: MetadataProps;
  sortingOrder: string[];
  values:
    | NlVaccineCoveragePerAgeGroupValue[]
    | VrVaccineCoveragePerAgeGroupValue[]
    | GmVaccineCoveragePerAgeGroupValue[];
  text: SiteText['pages']['vaccinations_page']['nl']['vaccination_coverage'];
}

export function Autumn2022ShotCoveragePerAgeGroup({
  title,
  description,
  metadata,
  values,
  sortingOrder,
  text,
}: Autumn2022CoveragePerAgeGroupProps) {
  const breakpoints = useBreakpoints(true);

  const getSortingOrder = (ageGroup: string) => {
    const index = sortingOrder.findIndex((x) => x === ageGroup);

    assert(
      index >= 0,
      `[${Autumn2022ShotCoveragePerAgeGroup.name}] No sorting order defined for age group ${ageGroup}`
    );

    return index;
  };

  const sortedValues = values.sort(
    (a, b) =>
      getSortingOrder(a.age_group_range) - getSortingOrder(b.age_group_range)
  );
  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      {breakpoints.md ? (
        <WideCoverageTable values={sortedValues} text={text} />
      ) : (
        <NarrowCoverageTable values={sortedValues} text={text} />
      )}
    </ChartTile>
  );
}
