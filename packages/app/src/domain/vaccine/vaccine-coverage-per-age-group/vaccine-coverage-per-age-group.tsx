import { GmVaccineCoveragePerAgeGroupArchivedValue, NlVaccineCoveragePerAgeGroupArchivedValue, VrVaccineCoveragePerAgeGroupArchivedValue } from '@corona-dashboard/common';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { getPercentageData } from '~/components/tables/logic/get-percentage-data';
import { NarrowTable } from '~/components/tables/narrow-table';
import { WideTable } from '~/components/tables/wide-table';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { ARCHIVED_COLORS } from '../common';
import { getSortingOrder } from '../logic/get-sorting-order';

interface VaccineCoveragePerAgeGroupProps {
  title: string;
  description: string;
  metadata: MetadataProps;
  sortingOrder: string[];
  values: NlVaccineCoveragePerAgeGroupArchivedValue[] | VrVaccineCoveragePerAgeGroupArchivedValue[] | GmVaccineCoveragePerAgeGroupArchivedValue[];
  text: SiteText['pages']['vaccinations_page']['nl'];
}

export function VaccineCoveragePerAgeGroup({ title, description, metadata, values, sortingOrder, text }: VaccineCoveragePerAgeGroupProps) {
  const breakpoints = useBreakpoints(true);
  const { commonTexts, formatPercentage } = useIntl();
  const componentName = VaccineCoveragePerAgeGroup.name;
  const requiredData = values.map((value) => {
    return {
      id: value.age_group_range,
      ageGroupTotal: 'age_group_total' in value ? value.age_group_total : undefined,
      ageGroupRange: value.age_group_range,
      birthYearRange: value.birthyear_range,
      firstPercentage: value.has_one_shot_percentage,
      secondPercentage: value.fully_vaccinated_percentage,
    };
  });
  const sortedData = requiredData.sort((a, b) => getSortingOrder(a.ageGroupRange, sortingOrder, componentName) - getSortingOrder(b.ageGroupRange, sortingOrder, componentName));
  const titles = { first: text.archived.vaccination_coverage.campaign_headers.first_shot, second: text.archived.vaccination_coverage.campaign_headers.coverage };
  const colors = { first: ARCHIVED_COLORS.COLOR_HAS_ONE_SHOT, second: ARCHIVED_COLORS.COLOR_FULLY_VACCINATED };
  const percentageFormattingRules = { first: { shouldFormat: true }, second: { shouldFormat: true } };
  const percentageData = getPercentageData(sortedData, titles, colors, percentageFormattingRules, undefined, commonTexts.common.no_data, formatPercentage);

  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      {breakpoints.lg ? (
        <WideTable
          headerText={{
            firstColumn: text.vaccination_coverage.headers.agegroup,
            secondColumn: text.archived.vaccination_coverage.campaign_headers.first_shot,
            thirdColumn: text.archived.vaccination_coverage.campaign_headers.coverage,
            fourthColumn: '',
          }}
          tableData={sortedData}
          percentageData={percentageData}
          hasAgeGroups
        />
      ) : (
        <NarrowTable headerText={text.vaccination_coverage.headers.agegroup} tableData={sortedData} percentageData={percentageData} hasAgeGroups />
      )}
    </ChartTile>
  );
}
