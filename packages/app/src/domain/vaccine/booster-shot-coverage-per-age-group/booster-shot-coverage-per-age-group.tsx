import { ChartTile } from '~/components/chart-tile';
import { COLOR_FULLY_BOOSTERED, COLOR_FULLY_VACCINATED } from '../common';
import { getPercentageData } from '~/components/tables/logic/get-percentage-data';
import { getSortingOrder } from '../logic/get-sorting-order';
import { MetadataProps } from '~/components/metadata';
import { MobileTable } from '~/components/tables/mobile-table';
import { NlVaccineCoveragePerAgeGroupArchived_20220908Value, VrVaccineCoveragePerAgeGroupArchived_20220908Value, GmVaccineCoveragePerAgeGroupArchived_20220908Value } from '@corona-dashboard/common';
import { SiteText } from '~/locale';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useIntl } from '~/intl';
import { WideCoverageTable } from './components/wide-coverage-table';
import { PercentageDataPoint } from '~/components/tables/components/percentage-data';

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

export function BoosterShotCoveragePerAgeGroup({ title, description, metadata, values, sortingOrder, text}: BoosterCoveragePerAgeGroupProps) {
  const breakpoints = useBreakpoints(true);
  const { formatPercentage } = useIntl();
  const componentName = BoosterShotCoveragePerAgeGroup.name;
  const sortedValues = values.sort((a, b) => getSortingOrder(a.age_group_range, sortingOrder, componentName) - getSortingOrder(b.age_group_range, sortingOrder, componentName));
  const titles = { first: text.vaccination_coverage.headers.fully_vaccinated, second: text.archived.vaccination_coverage.campaign_headers.booster_shot };
  const colors = { first: COLOR_FULLY_VACCINATED, second: COLOR_FULLY_BOOSTERED};
  const percentageKeys = {
    first: { propertyKey: 'fully_vaccinated_percentage', shouldFormat: true},
    second: { propertyKey: 'booster_shot_percentage', shouldFormat: true}
  };
  const percentageData: PercentageDataPoint[][] = getPercentageData(sortedValues, titles, colors, percentageKeys, undefined, text.vaccination_coverage.no_data, formatPercentage);

  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      {breakpoints.lg ? (
        <WideCoverageTable values={sortedValues} text={text} />
      ) : (
        <MobileTable 
          headerText={text.vaccination_coverage.headers.agegroup}
          tableData={sortedValues}
          percentageData={percentageData}
          hasAgeGroups
        />
      )}
    </ChartTile>
  );
}
