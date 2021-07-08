import { NlVariantsValue } from '@corona-dashboard/common';
import { maxBy } from 'lodash';
import { Box } from '~/components/base';
import { Heading, InlineText } from '~/components/typography';
import { Variant } from '~/domain/variants/variants-table-tile/logic/use-variants-table-data';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
interface VariantsSidebarMetricProps {
  data: NlVariantsValue;
}

export function VariantsSidebarMetric({ data }: VariantsSidebarMetricProps) {
  const { siteText, formatDateFromSeconds } = useIntl();
  const commonText = siteText.common.metricKPI;

  /**
   * Filter all the keys that end with a _percentage and find the highest value.
   */
  const highestPercentage = maxBy(
    Object.entries(data)
      .filter((x): x is [`${Variant}_percentage`, number] =>
        x[0].endsWith('_percentage')
      )
      .map(([key, value]) => ({
        variant: key.split('_')[0] as Variant,
        value,
      })),
    (x) => x.value
  );

  const dateText = replaceVariablesInText(commonText.dateRangeOfReport, {
    startDate: formatDateFromSeconds(data.date_start_unix, 'axis'),
    endDate: formatDateFromSeconds(data.date_end_unix, 'axis'),
  });

  return (
    <Box display="flex" flexDirection="column">
      <Heading level={4} fontSize={2} fontWeight="normal" m={0} as="div">
        {siteText.covid_varianten.sidebar_beschrijving}
      </Heading>
      <InlineText fontSize={3} fontWeight="bold" margin="0" marginRight={3}>
        {highestPercentage &&
          `${highestPercentage.value}% ${
            siteText.covid_varianten.varianten[highestPercentage.variant]
          }`}
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
