import {
  GmVaccineCoveragePerAgeGroupValue,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useVaccineCoveragePercentageFormatter } from './logic/use-vaccine-coverage-percentage-formatter';
interface VariantsSidebarMetricProps {
  data:
    | VrVaccineCoveragePerAgeGroupValue[]
    | GmVaccineCoveragePerAgeGroupValue[];
  description: string;
}

export function VaccineSidebarMetricVrGm({
  data,
  description,
}: VariantsSidebarMetricProps) {
  const { siteText, formatDateFromSeconds } = useIntl();
  const commonText = siteText.common.metricKPI;

  const formatCoveragePercentage = useVaccineCoveragePercentageFormatter();

  /**
   * Filter out only the the 18 plus value to show in the sidebar
   */
  const filteredAgeGroup = data.filter(
    (item) => item.age_group_range === '18+'
  )[0] as VrVaccineCoveragePerAgeGroupValue | GmVaccineCoveragePerAgeGroupValue;

  const dateText = replaceVariablesInText(commonText.dateOfReport, {
    dateOfReport: formatDateFromSeconds(filteredAgeGroup.date_unix, 'medium'),
  });

  return (
    <Box width="100%" minHeight="4rem" spacing={2}>
      <Text>{description}</Text>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        flexWrap="wrap"
        spacingHorizontal={2}
      >
        <InlineText variant="h3">
          {formatCoveragePercentage(
            filteredAgeGroup,
            'fully_vaccinated_percentage'
          )}
        </InlineText>

        <Box pt="2px">
          <InlineText variant="label1" color="annotation">
            {dateText}
          </InlineText>
        </Box>
      </Box>
    </Box>
  );
}
