import {
  GmVaccineCoveragePerAgeGroupArchived_20220908Value,
  NlVaccineCoveragePerAgeGroupArchived_20220908Value,
  VrVaccineCoveragePerAgeGroupArchived_20220908Value,
} from '@corona-dashboard/common';
import { AgeGroup } from '~/components/age-groups/age-group';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { useGetPercentageData } from '~/components/tables/logic/use-get-percentage-data';
import { NarrowTable } from '~/components/tables/narrow-table';
import { TableData } from '~/components/tables/types';
import { WideTable } from '~/components/tables/wide-table';
import { SiteText } from '~/locale';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { COLOR_FULLY_BOOSTERED, COLOR_FULLY_VACCINATED } from '../common';
import { getSortingOrder } from '../logic/get-sorting-order';

interface BoosterCoveragePerAgeGroupProps {
  title: string;
  description: string;
  metadata: MetadataProps;
  sortingOrder: string[];
  values: NlVaccineCoveragePerAgeGroupArchived_20220908Value[] | VrVaccineCoveragePerAgeGroupArchived_20220908Value[] | GmVaccineCoveragePerAgeGroupArchived_20220908Value[];
  text: SiteText['pages']['vaccinations_page']['nl'];
}

export const BoosterShotCoveragePerAgeGroup = ({ title, description, metadata, values, sortingOrder, text }: BoosterCoveragePerAgeGroupProps) => {
  const breakpoints = useBreakpoints(true);
  const componentName = BoosterShotCoveragePerAgeGroup.name;
  const requiredData: TableData[] = values.map((value) => {
    return {
      id: `${componentName}-${value.age_group_range}`,
      firstPercentage: value.fully_vaccinated_percentage,
      secondPercentage: value.booster_shot_percentage,
      ageGroupRange: value.age_group_range,
      firstColumnLabel: (
        <AgeGroup peopleInAgeGroup={'age_group_total' in value ? value.age_group_total : undefined} range={value.age_group_range} birthYearRange={value.birthyear_range} />
      ),
    };
  });

  const sortedData = requiredData.sort((a, b) => getSortingOrder(a.ageGroupRange, sortingOrder, componentName) - getSortingOrder(b.ageGroupRange, sortingOrder, componentName));
  const percentageTitles = { first: text.vaccination_coverage.headers.fully_vaccinated, second: text.archived.vaccination_coverage.campaign_headers.booster_shot };
  const percentageColors = { first: COLOR_FULLY_VACCINATED, second: COLOR_FULLY_BOOSTERED };
  const percentageFormattingRules = { first: { shouldFormat: true }, second: { shouldFormat: true } };
  const percentageData = useGetPercentageData(sortedData, percentageTitles, percentageColors, percentageFormattingRules);

  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      {breakpoints.lg ? (
        <WideTable
          headerText={{
            firstColumn: text.vaccination_coverage.headers.agegroup,
            secondColumn: text.vaccination_coverage.headers.fully_vaccinated,
            thirdColumn: text.archived.vaccination_coverage.campaign_headers.booster_shot,
            fourthColumn: text.archived.vaccination_coverage.headers.difference_booster_shot_and_fully_vaccinated,
          }}
          tableData={sortedData}
          percentageData={percentageData}
        />
      ) : (
        <NarrowTable headerText={text.vaccination_coverage.headers.agegroup} tableData={sortedData} percentageData={percentageData} />
      )}
    </ChartTile>
  );
};
