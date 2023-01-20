import {
  GmVaccineCoveragePerAgeGroupArchived_20220908Value,
  NlVaccineCoveragePerAgeGroupArchived_20220908Value,
  VrVaccineCoveragePerAgeGroupArchived_20220908Value,
} from '@corona-dashboard/common';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { getPercentageData } from '~/components/tables/logic/get-percentage-data';
import { NarrowTable } from '~/components/tables/narrow-table';
import { WideTable } from '~/components/tables/wide-table';
import { useIntl } from '~/intl';
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

export function BoosterShotCoveragePerAgeGroup({ title, description, metadata, values, sortingOrder, text }: BoosterCoveragePerAgeGroupProps) {
  const breakpoints = useBreakpoints(true);
  const { commonTexts, formatPercentage } = useIntl();
  const componentName = BoosterShotCoveragePerAgeGroup.name;
  const requiredData = values.map((value) => {
    return {
      id: value.age_group_range,
      ageGroupTotal: 'age_group_total' in value ? value.age_group_total : undefined,
      ageGroupRange: value.age_group_range,
      birthYearRange: value.birthyear_range,
      firstPercentage: value.fully_vaccinated_percentage,
      secondPercentage: value.booster_shot_percentage,
    };
  });
  const sortedData = requiredData.sort((a, b) => getSortingOrder(a.ageGroupRange, sortingOrder, componentName) - getSortingOrder(b.ageGroupRange, sortingOrder, componentName));
  const titles = { first: text.vaccination_coverage.headers.fully_vaccinated, second: text.archived.vaccination_coverage.campaign_headers.booster_shot };
  const colors = { first: COLOR_FULLY_VACCINATED, second: COLOR_FULLY_BOOSTERED };
  const percentageFormattingRules = { first: { shouldFormat: true }, second: { shouldFormat: true } };
  const percentageData = getPercentageData(sortedData, titles, colors, percentageFormattingRules, undefined, commonTexts.common.no_data, formatPercentage);

  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      {breakpoints.lg ? (
        <WideTable
          headerText={{
            firstColumn: text.vaccination_coverage.headers.agegroup,
            secondColumn: text.vaccination_coverage.headers.fully_vaccinated,
            thirdColumn: text.archived.vaccination_coverage.campaign_headers.booster_shot,
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
