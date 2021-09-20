import {
  GmVaccineCoveragePerAgeGroupValue,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { parseFullyVaccinatedPercentageLabel } from './logic/parse-fully-vaccinated-percentage-label';
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
  const { siteText, formatDateFromSeconds, formatPercentage } = useIntl();
  const commonText = siteText.common.metricKPI;

  /**
   * Filter out only the the 18 plus value to show in the sidebar
   */
  const filteredAgeGroup = data.filter(
    (item) => item.age_group_range === '18+'
  )[0] as VrVaccineCoveragePerAgeGroupValue | GmVaccineCoveragePerAgeGroupValue;

  const dateText = replaceVariablesInText(commonText.dateOfReport, {
    dateOfReport: formatDateFromSeconds(filteredAgeGroup.date_unix, 'medium'),
  });

  let parsedVaccinatedLabel;
  if (isPresent(filteredAgeGroup.fully_vaccinated_percentage_label)) {
    parsedVaccinatedLabel = parseFullyVaccinatedPercentageLabel(
      filteredAgeGroup.fully_vaccinated_percentage_label
    );
  }

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
          {isPresent(parsedVaccinatedLabel)
            ? parsedVaccinatedLabel.sign === '>'
              ? replaceVariablesInText(
                  siteText.vaccinaties_common.labels.meer_dan,
                  {
                    value: formatPercentage(parsedVaccinatedLabel.value) + '%',
                  }
                )
              : replaceVariablesInText(
                  siteText.vaccinaties_common.labels.minder_dan,
                  {
                    value: formatPercentage(parsedVaccinatedLabel.value) + '%',
                  }
                )
            : isPresent(filteredAgeGroup.fully_vaccinated_percentage)
            ? `${formatPercentage(
                filteredAgeGroup.fully_vaccinated_percentage as number
              )}%`
            : '–'}
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
