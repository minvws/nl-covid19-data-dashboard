import { NlVariantsValue } from '@corona-dashboard/common';
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
   * Filter all the keys that end with a _percentage.
   */
  const filteredKeysOnPercentage = Object.fromEntries(
    Object.entries(data).filter(([key]) => key.endsWith('_percentage'))
  ) as Pick<NlVariantsValue, `${Variant}_percentage`>;

  /**
   * Sort the keys from the highest to lowest and get the highest one
   */
  const highestPercentageVariant = Object.entries(
    filteredKeysOnPercentage
  ).sort((a, b) => b[1] - a[1])[0];

  const dateText = replaceVariablesInText(commonText.dateOfReport, {
    dateOfReport: formatDateFromSeconds(data.date_end_unix, 'medium'),
  });

  return (
    <Box display="flex" flexDirection="column">
      <Heading level={4} fontSize={2} fontWeight="normal" m={0} as="div">
        {siteText.covid_varianten.sidebar_beschrijving}
      </Heading>
      <InlineText fontSize={3} fontWeight="bold" margin="0" marginRight={3}>
        {`${highestPercentageVariant[1]}% ${
          siteText.covid_varianten.varianten[
            highestPercentageVariant[0].slice(
              0,
              highestPercentageVariant[0].indexOf('_')
            ) as Variant
          ]
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
