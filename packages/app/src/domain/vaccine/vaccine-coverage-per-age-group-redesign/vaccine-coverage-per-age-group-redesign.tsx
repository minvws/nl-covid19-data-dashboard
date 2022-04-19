import {
  GmVaccineCoveragePerAgeGroupValue,
  NlVaccineCoveragePerAgeGroupValue,
  VrVaccineCoveragePerAgeGroupValue,
  GmBoosterShotPerAgeGroupValue,
  NlBoosterShotPerAgeGroupValue,
  VrBoosterShotPerAgeGroupValue,
} from '@corona-dashboard/common';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { NarrowCoverageTable } from './components/narrow-coverage-table';
import { WideCoverageTable } from './components/wide-coverage-table';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { SiteText } from '~/locale';

interface vaccineCoveragePerAgeGroupRedesignProps {
  title: string;
  description: string;
  metadata: MetadataProps;
  sortingOrder: string[];
  valuesCoverage: 
  | NlVaccineCoveragePerAgeGroupValue[]
  | VrVaccineCoveragePerAgeGroupValue[]
  | GmVaccineCoveragePerAgeGroupValue[];
  valuesBooster: 
  | NlBoosterShotPerAgeGroupValue[]
  | VrBoosterShotPerAgeGroupValue[]
  | GmBoosterShotPerAgeGroupValue[];
  text: SiteText['pages']['vaccinationsPage']['nl']['booster_per_age_group_table'];
}

export function VaccineCoveragePerAgeGroupRedesign({
  title,
  description,
  metadata,
  valuesCoverage,
  valuesBooster,
  sortingOrder,
  text,
}: vaccineCoveragePerAgeGroupRedesignProps) {
  const breakpoints = useBreakpoints(true);

  const ageRangeFiltered = sortingOrder.filter((range) => range === valuesBooster && range === valuesCoverage));

  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      {breakpoints.md ? (
        <WideCoverageTable
          valuesBooster={sortedValuesBooster}
          valuesCoverage={sortedValuesCoverage}
          text={text}
        />
      ) : (
        <NarrowCoverageTable
          valuesBooster={sortedValuesBooster}
          valuesCoverage={sortedValuesCoverage}
          text={text}
        />
      )}
    </ChartTile>
  );
}
