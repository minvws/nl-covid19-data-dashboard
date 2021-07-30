import { NlVaccineAdministeredTotal } from '@corona-dashboard/common';
import Vaccinaties from '~/assets/vaccinaties.svg';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { HeadingLinkWithIcon } from '~/components/link-with-icon';
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
      <Box gridArea={areas?.header} position="relative" spacing={2} pb={3}>
        <Box width="3.5rem" height="3.5rem" position="absolute" left={0}>
          <Vaccinaties />
        </Box>
        <Heading level={3} as="h2">
          <Box as="span" display="block" py={2} pl="3.5rem" fontWeight="bold">
            <HeadingLinkWithIcon
              href={reverseRouter.nl.vaccinaties()}
              icon={<ArrowIconRight />}
              iconPlacement="right"
            >
              {text.title}
            </HeadingLinkWithIcon>
          </Box>
        </Heading>

        <Text variant="h1">{formatNumber(estimated)}</Text>

        <Text>
          {replaceComponentsInText(text.administered_tests, {
            administeredVaccines: <strong>{formatNumber(estimated)}</strong>,
          })}
        </Text>

        <Text fontWeight="bold">{text.sub_title}</Text>
      </Box>
      <Box gridArea={areas?.chart} pb={{ _: '1.5rem', md: 0 }}>
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
