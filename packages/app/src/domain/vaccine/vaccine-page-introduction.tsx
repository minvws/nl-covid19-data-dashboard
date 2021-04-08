import { National } from '@corona-dashboard/common';
import VaccinatieIcon from '~/assets/vaccinaties.svg';
import { Box } from '~/components-styled/base';
import { ContentHeader } from '~/components-styled/content-header';
import { HeadingWithIcon } from '~/components-styled/heading-with-icon';
import { KpiValue } from '~/components-styled/kpi-value';
import { Tile } from '~/components-styled/tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import { useIntl } from '~/intl';
import { createDate } from '~/utils/createDate';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
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
  const { siteText, formatPercentage, formatDate } = useIntl();

  const roundedMillion =
    Math.floor(
      (data.vaccine_administered_total.last_value.estimated / 1_000_000) * 10
    ) / 10;

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
            <Text fontSize="1.625rem" m={0}>
              {replaceComponentsInText(
                text.current_amount_of_administrations_text,
                {
                  amount: (
                    <InlineText color="data.primary" fontWeight="bold">
                      {formatPercentage(roundedMillion)}{' '}
                      {siteText.common.miljoen}
                    </InlineText>
                  ),
                }
              )}
            </Text>

            <TwoKpiSection spacing={4}>
              <Box as="article" spacing={3}>
                <Heading level={3}>
                  {text.grafiek_gezette_prikken.titel}
                </Heading>
                <Text m={0}>{text.grafiek_gezette_prikken.omschrijving}</Text>
                <VaccineAdministrationsOverTimeChart
                  title={text.grafiek_gezette_prikken.titel}
                  values={data.vaccine_administered_total.values}
                />
              </Box>

              <Box as="article" spacing={3}>
                <Heading level={3}>
                  {text.kpi_geplande_prikken_deze_week.titel}
                </Heading>
                <KpiValue
                  absolute={data.vaccine_administered_planned.last_value.doses}
                />
                <Text m={0}>
                  {(() => {
                    /**
                     * We'll render a date range either as:
                     *
                     * "1 tot en met 7 maart" (same month)
                     *
                     * or:
                     *
                     * "29 maart tot en met 4 april" (overlapping month)
                     *
                     */

                    const dateFrom = createDate(
                      data.vaccine_administered_planned.last_value
                        .date_start_unix
                    );
                    const dateTo = createDate(
                      data.vaccine_administered_planned.last_value.date_end_unix
                    );

                    const isSameMonth =
                      dateFrom.getMonth() === dateTo.getMonth();

                    const dateFromText = isSameMonth
                      ? dateFrom.getDate()
                      : formatDate(dateFrom);
                    const dateToText = formatDate(dateTo);

                    return replaceComponentsInText(
                      text.kpi_geplande_prikken_deze_week.omschrijving,
                      {
                        date_from: dateFromText,
                        date_to: dateToText,
                      }
                    );
                  })()}
                </Text>
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
