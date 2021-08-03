import { assert } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { InlineText, Text } from '~/components/typography';
import { VariantSidebarValue } from '~/domain/variants/static-props';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
interface VariantsSidebarMetricProps {
  data: VariantSidebarValue;
}

export function VariantsSidebarMetric({ data }: VariantsSidebarMetricProps) {
  const { siteText, formatDateFromSeconds, formatPercentage } = useIntl();
  const commonText = siteText.common.metricKPI;

  /**
   * Filter all the keys that end with a _percentage and find the highest value.
   */
  const dateText = replaceVariablesInText(commonText.dateRangeOfReport, {
    startDate: formatDateFromSeconds(data.date_start_unix, 'axis'),
    endDate: formatDateFromSeconds(data.date_end_unix, 'axis'),
  });

  const variantName = (
    siteText.covid_varianten.varianten as Record<string, string>
  )[data.name];

  assert(variantName, `No translation found for variant called ${data.name}`);

  return (
    <Box width="100%" minHeight="4rem" spacing={2}>
      <Text>{siteText.covid_varianten.sidebar_beschrijving}</Text>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        flexWrap="wrap"
        spacingHorizontal={2}
      >
        <InlineText variant="h3">
          {`${formatPercentage(data.percentage)}% ${variantName}`}
        </InlineText>

        <InlineText variant="label1" color="annotation" fontWeight="bold">
          {dateText}
        </InlineText>
      </Box>
    </Box>
  );
}
