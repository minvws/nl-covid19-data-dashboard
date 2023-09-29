import { NlVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import { AgeGroup } from '~/components/age-groups/age-group';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { useGetSingleCoveragePercentageData } from '~/components/tables/logic/use-get-single-coverage-percentage-data';
import { NarrowTable } from '~/components/tables/narrow-table';
import { SingleCoverageTableData } from '~/components/tables/types';
import { WideTable } from '~/components/tables/wide-table';
import { COLOR_FULLY_VACCINATED } from '~/domain/vaccine/common';
import { SiteText } from '~/locale';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { getSortingOrder } from '../logic/get-sorting-order';

interface PrimarySeriesShotCoveragePerAgeGroupProps {
  title: string;
  description: string;
  metadata: MetadataProps;
  sortingOrder: string[];
  values: NlVaccineCoveragePerAgeGroupValue[];
  text: SiteText['pages']['vaccinations_page']['nl']['vaccination_coverage'];
}

export const PrimarySeriesShotCoveragePerAgeGroup = ({ title, description, metadata, values, sortingOrder, text }: PrimarySeriesShotCoveragePerAgeGroupProps) => {
  const breakpoints = useBreakpoints(true);
  const componentName = PrimarySeriesShotCoveragePerAgeGroup.name;
  const requiredData: SingleCoverageTableData[] = values.map((value) => {
    return {
      id: `${componentName}-${value.age_group_range}`,
      percentage: value.fully_vaccinated_percentage,
      ageGroupRange: value.age_group_range,
      firstColumnLabel: (
        <AgeGroup peopleInAgeGroup={'age_group_total' in value ? value.age_group_total : undefined} range={value.age_group_range} birthYearRange={value.birthyear_range} />
      ),
    };
  });

  const sortedData = requiredData.sort((a, b) => getSortingOrder(a.ageGroupRange, sortingOrder, componentName) - getSortingOrder(b.ageGroupRange, sortingOrder, componentName));
  const percentageTitles = text.headers.fully_vaccinated;
  const percentageColors = COLOR_FULLY_VACCINATED;
  const percentageFormattingRules = { shouldFormat: true };
  const percentageData = useGetSingleCoveragePercentageData(sortedData, percentageTitles, percentageColors, percentageFormattingRules);

  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      {breakpoints.lg ? (
        <WideTable
          headerText={{
            firstColumn: text.headers.agegroup,
            secondColumn: text.headers.fully_vaccinated,
            thirdColumn: text.headers.difference_autumn_2022_shot_and_fully_vaccinated,
          }}
          tableData={sortedData}
          percentageData={percentageData}
        />
      ) : (
        <NarrowTable headerText={text.headers.agegroup} tableData={sortedData} percentageData={percentageData} />
      )}
    </ChartTile>
  );
};
