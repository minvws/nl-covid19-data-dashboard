import { NlVaccineAdministeredTotal } from '@corona-dashboard/common';
import Vaccinaties from '~/assets/vaccinaties.svg';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { LinkWithIcon } from '~/components/link-with-icon';
import { Heading, Text } from '~/components/typography';
import { VaccineAdministrationsOverTimeChart } from '~/domain/vaccine/vaccine-administrations-over-time-chart';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

interface TopicalVaccineProps {
  data: NlVaccineAdministeredTotal;
  areas?: { header: string; chart: string };
}

export function TopicalVaccineTile({ data, areas }: TopicalVaccineProps) {
  const estimated = data.last_value.estimated;
  const reverseRouter = useReverseRouter();
  const { siteText, formatNumber } = useIntl();

  const text = siteText.nationaal_actueel.mini_trend_tiles.toegediende_vaccins;

  return (
    <>
      <Box gridArea={areas?.header} position="relative">
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
            href={reverseRouter.nl.vaccinaties()}
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
      <Box gridArea={areas?.chart}>
        <div>
          <ErrorBoundary>
            <VaccineAdministrationsOverTimeChart
              accessibility={{
                key: 'topical_vaccine_administrations_over_time',
              }}
              title={text.title}
              values={data.values}
            />
          </ErrorBoundary>
        </div>
      </Box>
    </>
  );
}
