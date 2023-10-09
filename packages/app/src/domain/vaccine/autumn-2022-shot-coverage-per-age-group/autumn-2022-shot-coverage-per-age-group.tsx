import { ArchivedNlVaccineCoveragePerAgeGroupAutumn_2022Value } from '@corona-dashboard/common';
import { AgeGroup } from '~/components/age-groups/age-group';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { NarrowTable } from '~/components/tables/narrow-table';
import { SingleCoverageTableData } from '~/components/tables/types';
import { WideTable } from '~/components/tables/wide-table';
import { COLOR_AUTUMN_2022_SHOT } from '~/domain/vaccine/common';
import { SiteText } from '~/locale';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { getSortingOrder } from '../logic/get-sorting-order';
import { useGetSingleCoveragePercentageData } from '~/components/tables/logic/use-get-single-coverage-percentage-data';

interface Autumn2022ShotCoveragePerAgeGroupProps {
  title: string;
  description: string;
  metadata: MetadataProps;
  sortingOrder: string[];
  values: ArchivedNlVaccineCoveragePerAgeGroupAutumn_2022Value[];
  text: SiteText['pages']['vaccinations_page']['nl']['vaccination_coverage'];
}

export const Autumn2022ShotCoveragePerAgeGroup = ({ title, description, metadata, values, sortingOrder, text }: Autumn2022ShotCoveragePerAgeGroupProps) => {
  const breakpoints = useBreakpoints(true);
  const componentName = Autumn2022ShotCoveragePerAgeGroup.name;
  const requiredData: SingleCoverageTableData[] = values.map((value) => {
    return {
      id: `${componentName}-${value.age_group_range}`,
      firstPercentage: value.autumn_2022_vaccinated_percentage,
      ageGroupRange: value.age_group_range,
      firstColumnLabel: (
        <AgeGroup peopleInAgeGroup={'age_group_total' in value ? value.age_group_total : undefined} range={value.age_group_range} birthYearRange={value.birthyear_range} />
      ),
    };
  });

  const sortedData = requiredData.sort((a, b) => getSortingOrder(a.ageGroupRange, sortingOrder, componentName) - getSortingOrder(b.ageGroupRange, sortingOrder, componentName));
  const percentageTitles = text.headers.autumn_2022_shot;
  const percentageColors = COLOR_AUTUMN_2022_SHOT;
  const percentageFormattingRules = { shouldFormat: true };
  const percentageData = useGetSingleCoveragePercentageData(sortedData, percentageTitles, percentageColors, percentageFormattingRules);

  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      {breakpoints.lg ? (
        <WideTable
          headerText={{
            firstColumn: text.headers.agegroup,
            secondColumn: text.headers.autumn_2022_shot,
            thirdColumn: text.headers.fully_vaccinated,
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
