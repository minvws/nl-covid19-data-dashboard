import { formatNumber } from '@corona-dashboard/common';

import Vaccinaties from '~/assets/vaccinaties.svg';
import { Box } from '~/components-styled/base';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import { Heading, Text } from '~/components-styled/typography';
import siteText from '~/locale';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { ArrowIconRight } from '~/components-styled/arrow-icon';
interface TopicalVaccineProps {
  estimated: number;
}

export function TopicalVaccineTile(props: TopicalVaccineProps) {
  const { estimated } = props;

  const text = siteText.nationaal_actueel.mini_trend_tiles.toegediende_vaccins;

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
        lineHeight={{ md: 0, lg: 1 }}
        fontSize="1.25rem"
      >
        <LinkWithIcon
          href={'/landelijk/vaccinaties'}
          icon={<ArrowIconRight />}
          iconPlacement="right"
          fontWeight="bold"
          headingLink
        >
          {text.title}
        </LinkWithIcon>
      </Heading>

      <Text fontSize="2.25rem" fontWeight="bold" my={0} lineHeight={0} mb={2}>
        {formatNumber(estimated)}
      </Text>

      <Text mt={0}>
        {replaceComponentsInText(text.administered_tests, {
          administeredVaccines: <strong>{formatNumber(estimated)}</strong>,
        })}
      </Text>

      <Text fontWeight="bold" mb={0}>
        {text.sub_title}
      </Text>
    </Box>
  );
}
