import { ARCHIVED_COLORS } from '../common';
import { ChartTile } from '~/components/chart-tile';
import { getPercentageData } from '~/components/tables/logic/get-percentage-data';
import { getSortingOrder } from '../logic/get-sorting-order';
import { GmVaccineCoveragePerAgeGroupArchivedValue, NlVaccineCoveragePerAgeGroupArchivedValue, VrVaccineCoveragePerAgeGroupArchivedValue } from '@corona-dashboard/common';
import { MetadataProps } from '~/components/metadata';
import { NarrowTable } from '~/components/tables/narrow-table';
import { SiteText } from '~/locale';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useIntl } from '~/intl';
import { WideCoverageTable } from '~/domain/vaccine/vaccine-coverage-per-age-group/components/wide-coverage-table';

interface VaccineCoveragePerAgeGroupProps {
  title: string;
  description: string;
  metadata: MetadataProps;
  sortingOrder: string[];
  values:
    | NlVaccineCoveragePerAgeGroupArchivedValue[]
    | VrVaccineCoveragePerAgeGroupArchivedValue[]
    | GmVaccineCoveragePerAgeGroupArchivedValue[];
  text: SiteText['pages']['vaccinations_page']['nl'];
}

export function VaccineCoveragePerAgeGroup({ title, description, metadata, values, sortingOrder, text}: VaccineCoveragePerAgeGroupProps) {
  const breakpoints = useBreakpoints(true);
  const { formatPercentage } = useIntl();
  const componentName = VaccineCoveragePerAgeGroup.name;
  const sortedValues = values.sort((a, b) => getSortingOrder(a.age_group_range, sortingOrder, componentName) - getSortingOrder(b.age_group_range, sortingOrder, componentName));
  const titles = { first: text.archived.vaccination_coverage.campaign_headers.first_shot, second: text.archived.vaccination_coverage.campaign_headers.coverage };
  const colors = { first: ARCHIVED_COLORS.COLOR_HAS_ONE_SHOT, second: ARCHIVED_COLORS.COLOR_FULLY_VACCINATED };
  const percentageKeys = {
    first: { propertyKey: 'has_one_shot_percentage', shouldFormat: true },
    second: { propertyKey: 'fully_vaccinated_percentage', shouldFormat: true }
  }
  const percentageData = getPercentageData(sortedValues, titles, colors, percentageKeys, undefined, text.vaccination_coverage.no_data, formatPercentage);

  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      {breakpoints.lg ? (
        <WideCoverageTable values={sortedValues} text={text} />
      ) : (
        <NarrowTable 
          headerText={text.vaccination_coverage.headers.agegroup}
          tableData={sortedValues}
          percentageData={percentageData}
          hasAgeGroups
        />
      )}
    </ChartTile>
  );
}
