import { assert } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { InlineText, Text } from '~/components/typography';
import { VariantSidebarValue } from '~/domain/variants/static-props';
import { useIntl } from '~/intl';
interface VariantsSidebarMetricProps {
  data: VariantSidebarValue;
}

export function VariantsSidebarMetric({ data }: VariantsSidebarMetricProps) {
  const { siteText, formatPercentage } = useIntl();

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
      </Box>
    </Box>
  );
}
