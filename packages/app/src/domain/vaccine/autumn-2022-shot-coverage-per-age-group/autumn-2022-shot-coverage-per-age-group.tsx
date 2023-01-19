import { ChartTile } from '~/components/chart-tile';
import { COLOR_FULLY_VACCINATED, COLOR_AUTUMN_2022_SHOT } from '~/domain/vaccine/common';
import { getPercentageData } from '~/components/tables/logic/get-percentage-data';
import { getSortingOrder } from '../logic/get-sorting-order';
import { MetadataProps } from '~/components/metadata';
import { NarrowTable } from '~/components/tables/narrow-table';
import { NlVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import { SiteText } from '~/locale';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useIntl } from '~/intl';
import { WideCoverageTable } from './components/wide-coverage-table';

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
  const componentName = Autumn2022ShotCoveragePerAgeGroup.name;
  const sortedValues = values.sort((a, b) => getSortingOrder(a.age_group_range, sortingOrder, componentName) - getSortingOrder(b.age_group_range, sortingOrder, componentName));
  const titles = { first: text.headers.autumn_2022_shot, second: text.headers.fully_vaccinated };
  const colors = { first: COLOR_AUTUMN_2022_SHOT, second: COLOR_FULLY_VACCINATED };
  const percentageKeys = {
    first: { propertyKey: 'autumn_2022_vaccinated_percentage', shouldFormat: true },
    second: { propertyKey: 'fully_vaccinated_percentage', shouldFormat: true }
  }
  const percentageData = getPercentageData(sortedValues, titles, colors, percentageKeys, undefined, text.no_data, formatPercentage);

  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      {breakpoints.lg ? (
        <WideCoverageTable values={sortedValues} text={text} />
      ) : (
        <NarrowTable 
          headerText={text.headers.agegroup}
          tableData={sortedValues}
          percentageData={percentageData}
          hasAgeGroups
        />
      )}
    </ChartTile>
  );
};
