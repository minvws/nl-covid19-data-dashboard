import {
  assert,
  NlVaccineCoveragePerAgeGroupArchived_20220908Value,
  VrVaccineCoveragePerAgeGroupArchived_20220908Value,
  GmVaccineCoveragePerAgeGroupArchived_20220908Value,
} from '@corona-dashboard/common';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { NarrowCoverageTable } from './components/narrow-coverage-table';
import { WideCoverageTable } from './components/wide-coverage-table';
import { SiteText } from '~/locale';
import { useBreakpoints } from '~/utils/use-breakpoints';
interface BoosterCoveragePerAgeGroupProps {
  title: string;
  description: string;
  metadata: MetadataProps;
  sortingOrder: string[];
  values:
    | NlVaccineCoveragePerAgeGroupArchived_20220908Value[]
    | VrVaccineCoveragePerAgeGroupArchived_20220908Value[]
    | GmVaccineCoveragePerAgeGroupArchived_20220908Value[];
  text: SiteText['pages']['vaccinations_page']['nl'];
}

export function BoosterShotCoveragePerAgeGroup({
  title,
  description,
  metadata,
  values,
  sortingOrder,
  text,
}: BoosterCoveragePerAgeGroupProps) {
  const breakpoints = useBreakpoints(true);

  const getSortingOrder = (ageGroup: string) => {
    const index = sortingOrder.findIndex((x) => x === ageGroup);

    assert(
      index >= 0,
      `[${BoosterShotCoveragePerAgeGroup.name}] No sorting order defined for age group ${ageGroup}`
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
