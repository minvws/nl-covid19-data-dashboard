import CoronaVirus from '~/assets/coronavirus.svg';
import Gehandicaptenzorg from '~/assets/gehandicapte-zorg.svg';
import Locatie from '~/assets/locaties.svg';
import { ChartTile } from '~/components/chart-tile';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { useIntl } from '~/intl';
import {
  createPageArticlesQuery,
  PageArticlesQueryResult,
} from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrPageMetricData(),
  createGetContent<PageArticlesQueryResult>((context) => {
    const { locale = 'nl' } = context;
    return createPageArticlesQuery('disabilityCarePage', locale);
  })
);

const DisabilityCare = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedVrData: data, vrName, lastGenerated, content } = props;

  const { siteText } = useIntl();

  const locationsText =
    siteText.veiligheidsregio_gehandicaptenzorg_besmette_locaties;
  const positiveTestPeopleText =
    siteText.veiligheidsregio_gehandicaptenzorg_positief_geteste_personen;
  const mortalityText = siteText.veiligheidsregio_gehandicaptenzorg_oversterfte;

  const lastValue = data.disability_care.last_value;
  const values = data.disability_care.values;
  const underReportedDateStart = getBoundaryDateStartUnix(values, 7);

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(locationsText.metadata.title, {
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(locationsText.metadata.description, {
      safetyRegionName: vrName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout data={data} vrName={vrName} lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            category={
              siteText.veiligheidsregio_layout.headings.kwetsbare_groepen
            }
            screenReaderCategory={
              siteText.verpleeghuis_besmette_locaties.titel_sidebar
            }
            title={replaceVariablesInText(positiveTestPeopleText.titel, {
              safetyRegion: vrName,
            })}
            icon={<Gehandicaptenzorg />}
            description={replaceVariablesInText(
              positiveTestPeopleText.pagina_toelichting,
              {
                safetyRegion: vrName,
              }
            )}
            metadata={{
              datumsText: positiveTestPeopleText.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [positiveTestPeopleText.bronnen.rivm],
            }}
            referenceLink={positiveTestPeopleText.reference.href}
            articles={content.articles}
          />

          <TwoKpiSection>
            <KpiTile
              title={positiveTestPeopleText.barscale_titel}
              description={positiveTestPeopleText.extra_uitleg}
              metadata={{
                date: lastValue.date_unix,
                source: positiveTestPeopleText.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="newly_infected_people"
                absolute={lastValue.newly_infected_people}
                difference={
                  data.difference.disability_care__newly_infected_people
                }
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: positiveTestPeopleText.bronnen.rivm }}
            title={positiveTestPeopleText.linechart_titel}
            timeframeOptions={['all', '5weeks']}
            description={positiveTestPeopleText.linechart_description}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'disability_care_confirmed_cases_over_time_chart',
                }}
                values={values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'newly_infected_people_moving_average',
                    label:
                      positiveTestPeopleText.line_chart_newly_infected_people_moving_average,
                    shortLabel:
                      positiveTestPeopleText.line_chart_newly_infected_people_moving_average_short_label,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'newly_infected_people',
                    label: positiveTestPeopleText.line_chart_legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedDateStart,
                      end: Infinity,
                      label:
                        positiveTestPeopleText.line_chart_legend_inaccurate_label,
                      shortLabel: siteText.common.incomplete,
                      cutValuesForMetricProperties: [
                        'newly_infected_people_moving_average',
                      ],
                    },
                  ],
                }}
              />
            )}
          </ChartTile>

          <PageInformationBlock
            id="besmette-locaties"
            title={replaceVariablesInText(locationsText.titel, {
              safetyRegion: vrName,
            })}
            icon={<Locatie />}
            description={locationsText.pagina_toelichting}
            metadata={{
              datumsText: locationsText.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [locationsText.bronnen.rivm],
            }}
            referenceLink={locationsText.reference.href}
          />

          <TwoKpiSection>
            <KpiTile
              title={locationsText.kpi_titel}
              metadata={{
                date: lastValue.date_unix,
                source: locationsText.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_locations_total"
                absolute={lastValue.infected_locations_total}
                percentage={lastValue.infected_locations_percentage}
                difference={
                  data.difference.disability_care__infected_locations_total
                }
              />
              <Text>{locationsText.kpi_toelichting}</Text>
            </KpiTile>
            <KpiTile
              title={locationsText.barscale_titel}
              metadata={{
                date: lastValue.date_unix,
                source: locationsText.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="newly_infected_locations"
                absolute={lastValue.newly_infected_locations}
              />
              <Text>{locationsText.barscale_toelichting}</Text>
            </KpiTile>
          </TwoKpiSection>

          {lastValue.infected_locations_total !== undefined && (
            <ChartTile
              title={locationsText.linechart_titel}
              metadata={{
                source: locationsText.bronnen.rivm,
              }}
              timeframeOptions={['all', '5weeks']}
              description={locationsText.linechart_description}
            >
              {(timeframe) => (
                <TimeSeriesChart
                  accessibility={{
                    key: 'disability_care_infected_locations_over_time_chart',
                  }}
                  values={values}
                  timeframe={timeframe}
                  seriesConfig={[
                    {
                      type: 'area',
                      metricProperty: 'infected_locations_total',
                      label: locationsText.linechart_metric_label,
                      color: colors.data.primary,
                    },
                  ]}
                />
              )}
            </ChartTile>
          )}

          <PageInformationBlock
            id="sterfte"
            title={replaceVariablesInText(mortalityText.titel, {
              safetyRegion: vrName,
            })}
            icon={<CoronaVirus />}
            description={mortalityText.pagina_toelichting}
            metadata={{
              datumsText: mortalityText.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [mortalityText.bronnen.rivm],
            }}
            referenceLink={mortalityText.reference.href}
          />

          <TwoKpiSection>
            <KpiTile
              title={mortalityText.barscale_titel}
              description={mortalityText.extra_uitleg}
              metadata={{
                date: lastValue.date_unix,
                source: mortalityText.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="deceased_daily"
                absolute={lastValue.deceased_daily}
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: mortalityText.bronnen.rivm }}
            title={mortalityText.linechart_titel}
            timeframeOptions={['all', '5weeks']}
            description={mortalityText.linechart_description}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'disability_care_deceased_over_time_chart',
                }}
                values={values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'deceased_daily_moving_average',
                    label:
                      mortalityText.line_chart_deceased_daily_moving_average,
                    shortLabel:
                      mortalityText.line_chart_deceased_daily_moving_average_short_label,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'deceased_daily',
                    label: mortalityText.line_chart_legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedDateStart,
                      end: Infinity,
                      label: mortalityText.line_chart_legend_inaccurate_label,
                      shortLabel: siteText.common.incomplete,
                      cutValuesForMetricProperties: [
                        'deceased_daily_moving_average',
                      ],
                    },
                  ],
                }}
              />
            )}
          </ChartTile>
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default DisabilityCare;
