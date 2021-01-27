import { Box } from '~/components-styled/base';
import siteText from '~/locale';
import Vaccinaties from '~/assets/vaccinaties.svg';
import { Heading, Text } from '~/components-styled/typography';
import { formatNumber } from '@corona-dashboard/common';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';

export function TopicalVaccineTile() {
  const text = siteText.nationaal_actueel.mini_trend_tiles.vaccinaties;

  const data = {
    administeredVaccines: parseFloat(siteText.vaccinaties.data.kpi_total.value),
    expectedDelivery: parseFloat(
      siteText.vaccinaties.data.kpi_expected_delivery.value
    ),
  };

  return (
    <Box position="relative" pb={3}>
      <Box width="3.5rem" height="3.5rem" position="absolute" left={0} mr={1}>
        <Vaccinaties />
      </Box>
      <Heading
        level={3}
        as="h2"
        py={2}
        pl="3.5rem"
        mb={2}
        lineHeight={{ md: 0, lg: 2 }}
      >
        {text.title}
      </Heading>

      <Text fontSize="2.75rem" fontWeight="bold" my={0} lineHeight={0} mb={2}>
        {formatNumber(data.administeredVaccines)}
      </Text>

      <Text>
        {replaceComponentsInText(text.administered_tests, {
          administeredVaccines: (
            <strong>{formatNumber(data.administeredVaccines)}</strong>
          ),
        })}
      </Text>

      <Text fontWeight="bold" mb={0}>
        {text.sub_title}
      </Text>

      <Text mt={0}>
        {replaceComponentsInText(text.supply, {
          expectedDelivery: (
            <strong>{formatNumber(data.expectedDelivery)}</strong>
          ),
        })}
      </Text>
    </Box>
  );
}
