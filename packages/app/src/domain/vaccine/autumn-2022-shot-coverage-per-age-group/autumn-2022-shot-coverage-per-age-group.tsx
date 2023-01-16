import { assert, NlVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { NarrowCoverageTable } from './components/narrow-coverage-table';
import { WideCoverageTable } from './components/wide-coverage-table';
import { SiteText } from '~/locale';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { MobileTable } from '~/components/tables/mobile-table';
import { COLOR_FULLY_VACCINATED, COLOR_AUTUMN_2022_SHOT } from '~/domain/vaccine/common';
import { useIntl } from '~/intl';

interface Autumn2022ShotCoveragePerAgeGroupProps {
  title: string;
  description: string;
  metadata: MetadataProps;
  sortingOrder: string[];
  values: NlVaccineCoveragePerAgeGroupValue[];
  text: SiteText['pages']['vaccinations_page']['nl']['vaccination_coverage'];
}

export const Autumn2022ShotCoveragePerAgeGroup = ({ title, description, metadata, values, sortingOrder, text }: Autumn2022ShotCoveragePerAgeGroupProps) => {
  const breakpoints = useBreakpoints(true);
  const { formatPercentage } = useIntl();

  const getSortingOrder = (ageGroup: string) => {
    const index = sortingOrder.findIndex((sortingIndex) => sortingIndex === ageGroup);
    assert(index >= 0, `[${Autumn2022ShotCoveragePerAgeGroup.name}] No sorting order defined for age group ${ageGroup}`);
    return index;
  };

  const sortedValues = values.sort((a, b) => getSortingOrder(a.age_group_range) - getSortingOrder(b.age_group_range));
  const percentageData = sortedValues.map(value => {
    return [
      {
        title: text.headers.autumn_2022_shot,
        percentage: {
          color: COLOR_AUTUMN_2022_SHOT,
          value: value.autumn_2022_vaccinated_percentage !== null ? `${formatPercentage(value.autumn_2022_vaccinated_percentage)}%` : text.no_data
        }
      },
      {
        title: text.headers.fully_vaccinated,
        percentage: {
          color: COLOR_FULLY_VACCINATED,
          value: `${formatPercentage(value.fully_vaccinated_percentage)}%`
        }
      }
    ]
  });

  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      {breakpoints.lg ? (
        <WideCoverageTable values={sortedValues} text={text} />
      ) : (
        <MobileTable 
          headerText={text.headers.agegroup}
          tableData={sortedValues}
          percentageData={percentageData}
          hasAgeGroups
        />
      )}
    </ChartTile>
  );
};
