import { National } from '@corona-dashboard/common';
import VaccinatieIcon from '~/assets/vaccinaties.svg';
import { Box } from '~/components-styled/base';
import { ContentHeader } from '~/components-styled/content-header';
import { HeadingWithIcon } from '~/components-styled/heading-with-icon';
import { KpiValue } from '~/components-styled/kpi-value';
import { Markdown } from '~/components-styled/markdown';
import { Tile } from '~/components-styled/tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { VaccineTicker } from './components/vaccine-ticker';
import { VaccineAdministrationsOverTimeChart } from './vaccine-administrations-over-time-chart';

interface VaccinePageIntroductionProps {
  text: any;
  data: National;
}

export function VaccinePageIntroduction({
  text,
  data,
}: VaccinePageIntroductionProps) {
  const { siteText, formatPercentage, formatDateSpan } = useIntl();

  const roundedMillion =
    Math.floor(
      (data.vaccine_administered_total.last_value.estimated / 1_000_000) * 10
    ) / 10;

  const [
    vaccineAdministeredStartDate,
    vaccineAdministeredEndDate,
  ] = formatDateSpan(
    {
      seconds: data.vaccine_administered_planned.last_value.date_start_unix,
    },
    {
      seconds: data.vaccine_administered_planned.last_value.date_end_unix,
    }
  );

  return (
    <Box spacing={4}>
      <Tile>
        <Box spacing={3}>
          <HeadingWithIcon
            icon={<VaccinatieIcon />}
            title={text.title}
            headingLevel={1}
          />
          <Box spacing={4} px={{ md: 5 }}>
            <TwoKpiSection spacing={4}>
              <Text fontSize="1.625rem" m={0}>
                {replaceComponentsInText(
                  text.current_amount_of_administrations_text,
                  {
                    amount: (
                      <InlineText fontWeight="bold">
                        {formatPercentage(roundedMillion)}{' '}
                        {siteText.common.miljoen}
                      </InlineText>
                    ),
                  }
                )}
              </Text>

              <Box as="article">
                <VaccineAdministrationsOverTimeChart
                  values={data.vaccine_administered_total.values}
                />
              </Box>
            </TwoKpiSection>

            <TwoKpiSection spacing={4}>
              {data.vaccine_coverage && (
                <Box as="article" spacing={3}>
                  <Heading level={3}>{text.kpi_vaccinatiegraad.titel}</Heading>
                  <KpiValue
                    percentage={
                      data.vaccine_coverage.last_value
                        .fully_vaccinated_percentage
                    }
                  />
                  <Markdown content={text.kpi_vaccinatiegraad.omschrijving} />
                </Box>
              )}
              <Box as="article" spacing={3}>
                <Heading level={3}>
                  {text.kpi_geplande_prikken_deze_week.titel}
                </Heading>
                <KpiValue
                  absolute={data.vaccine_administered_planned.last_value.doses}
                />
                <Markdown
                  content={replaceVariablesInText(
                    text.kpi_geplande_prikken_deze_week.omschrijving,
                    {
                      date_from: vaccineAdministeredStartDate,
                      date_to: vaccineAdministeredEndDate,
                    }
                  )}
                />
              </Box>
            </TwoKpiSection>

            <VaccineTicker
              data={data.vaccine_administered_rate_moving_average.last_value}
            />
          </Box>
        </Box>
      </Tile>

      <Box px={{ _: 3, sm: 4 }}>
        <ContentHeader
          subtitle={text.description}
          reference={text.reference}
          metadata={{
            datumsText: text.datums,
            dateOrRange: data.vaccine_administered_total.last_value.date_unix,
            dateOfInsertionUnix:
              data.vaccine_administered_total.last_value.date_of_insertion_unix,
            dataSources: [],
            moreInformationLabel: text.more_information.label,
            moreInformationLink: text.more_information.link,
          }}
        />
      </Box>
    </Box>
  );
}
