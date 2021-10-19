import { colors, Nl } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { KpiValue } from '~/components/kpi-value';
import { MiniTrendChart } from '~/components/mini-trend-chart';
import { Tile } from '~/components/tile';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { createDate } from '~/utils/create-date';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { VaccineHeaderWithIcon } from './components/vaccine-header-with-icon';
import { VaccineTicker } from './components/vaccine-ticker';
interface VaccinePageIntroductionNlProps {
  data: Pick<
    Nl,
    | 'vaccine_administered_planned'
    | 'vaccine_administered_total'
    | 'vaccine_administered_rate_moving_average'
  >;
}

export function VaccinePageIntroductionNl({
  data,
}: VaccinePageIntroductionNlProps) {
  const { siteText, formatPercentage, formatDate } = useIntl();
  const text = siteText.vaccinaties;

  const roundedMillion =
    Math.floor(
      (data.vaccine_administered_total.last_value.estimated / 1_000_000) * 10
    ) / 10;

  return (
    <Tile noBorder>
      <VaccineHeaderWithIcon title={text.title} />

      <Box spacing={3}>
        <Box spacing={4}>
          <Text variant="h2" fontWeight="normal">
            {replaceComponentsInText(
              text.current_amount_of_administrations_text,
              {
                amount: (
                  <InlineText color="data.primary" fontWeight="bold">
                    {formatPercentage(roundedMillion)} {siteText.common.miljoen}
                  </InlineText>
                ),
              }
            )}
          </Text>

          <TwoKpiSection spacing={4}>
            <Box as="article" spacing={3}>
              <Heading level={3}>{text.grafiek_gezette_prikken.titel}</Heading>
              <Text>{text.grafiek_gezette_prikken.omschrijving}</Text>
              <div css={css({ position: 'relative' })}>
                <ErrorBoundary>
                  <MiniTrendChart
                    accessibility={{
                      key: 'vaccine_introduction_administrations_over_time',
                    }}
                    timeframe="all"
                    title={text.grafiek_gezette_prikken.titel}
                    values={data.vaccine_administered_total.values}
                    displayTooltipValueOnly
                    seriesConfig={[
                      {
                        type: 'area',
                        metricProperty: 'estimated',
                        color: colors.data.primary,
                        label: '',
                      },
                    ]}
                  />
                </ErrorBoundary>
              </div>
            </Box>

            <Box as="article" spacing={3}>
              <Heading level={3}>
                {text.kpi_geplande_prikken_deze_week.titel}
              </Heading>
              <KpiValue
                absolute={data.vaccine_administered_planned.last_value.doses}
              />
              <Text>
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
                    data.vaccine_administered_planned.last_value.date_start_unix
                  );
                  const dateTo = createDate(
                    data.vaccine_administered_planned.last_value.date_end_unix
                  );

                  const isSameMonth = dateFrom.getMonth() === dateTo.getMonth();

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
  );
}
