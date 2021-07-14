import { assert } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { Heading, InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { VariantSidebarValue } from '~/static-props/variants/get-variant-sidebar-value';
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
    <Box display="flex" flexDirection="column">
      <Heading level={4} fontSize={2} fontWeight="normal" m={0} as="div">
        {siteText.covid_varianten.sidebar_beschrijving}
      </Heading>
      <InlineText fontSize={3} fontWeight="bold" margin="0" marginRight={3}>
        {`${formatPercentage(data.percentage)}% ${variantName}`}
      </InlineText>
      <InlineText
        display="inline-block"
        margin="0"
        color="annotation"
        fontSize={1}
      >
        {dateText}
      </InlineText>
    </Box>
  );
}
