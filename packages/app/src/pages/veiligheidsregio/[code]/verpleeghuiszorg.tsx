import CoronaVirus from '~/assets/coronavirus.svg';
import Locatie from '~/assets/locaties.svg';
import Verpleeghuiszorg from '~/assets/verpleeghuiszorg.svg';
import { ChartTile } from '~/components/chart-tile';
import { ContentHeader } from '~/components/content-header';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrPageMetricData()
);

const NursingHomeCare = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedVrData: data, safetyRegionName, lastGenerated } = props;

  const { siteText } = useIntl();

  const infectedLocationsText =
    siteText.veiligheidsregio_verpleeghuis_besmette_locaties;
  const positiveTestedPeopleText =
    siteText.veiligheidsregio_verpleeghuis_positief_geteste_personen;
  const deceased = siteText.veiligheidsregio_verpleeghuis_oversterfte;

  const nursinghomeLastValue = data.nursing_home.last_value;
  const underReportedDateStart = getBoundaryDateStartUnix(
    data.nursing_home.values,
    7
  );

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(infectedLocationsText.metadata.title, {
      safetyRegionName,
    }),
    description: replaceVariablesInText(
      infectedLocationsText.metadata.description,
      {
        safetyRegionName,
      }
    ),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <SafetyRegionLayout
        data={data}
        safetyRegionName={safetyRegionName}
        lastGenerated={lastGenerated}
      >
        <TileList>
          <ContentHeader
            category={
              siteText.veiligheidsregio_layout.headings.kwetsbare_groepen
            }
            screenReaderCategory={
              siteText.verpleeghuis_besmette_locaties.titel_sidebar
            }
            title={replaceVariablesInText(positiveTestedPeopleText.titel, {
              safetyRegion: safetyRegionName,
            })}
            icon={<Verpleeghuiszorg />}
            subtitle={replaceVariablesInText(
              positiveTestedPeopleText.pagina_toelichting,
              {
                safetyRegion: safetyRegionName,
              }
            )}
            metadata={{
              datumsText: positiveTestedPeopleText.datums,
              dateOrRange: nursinghomeLastValue.date_unix,
              dateOfInsertionUnix: nursinghomeLastValue.date_of_insertion_unix,
              dataSources: [positiveTestedPeopleText.bronnen.rivm],
            }}
            reference={positiveTestedPeopleText.reference}
          />

          <TwoKpiSection>
            <KpiTile
              title={positiveTestedPeopleText.barscale_titel}
              description={positiveTestedPeopleText.extra_uitleg}
              metadata={{
                date: nursinghomeLastValue.date_unix,
                source: positiveTestedPeopleText.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="newly_infected_people"
                absolute={nursinghomeLastValue.newly_infected_people}
                difference={data.difference.nursing_home__newly_infected_people}
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: positiveTestedPeopleText.bronnen.rivm }}
            title={positiveTestedPeopleText.linechart_titel}
            timeframeOptions={['all', '5weeks']}
          >
            {(timeframe) => (
              <TimeSeriesChart
                values={data.nursing_home.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'bar',
                    metricProperty: 'newly_infected_people',
                    color: colors.data.primary,
                    label:
                      positiveTestedPeopleText.line_chart_legend_trend_label,
                    shortLabel:
                      positiveTestedPeopleText.tooltip_labels
                        .newly_infected_people,
                  },
                  {
                    type: 'line',
                    metricProperty: 'newly_infected_people_moving_average',
                    color: colors.data.primary,
                    label:
                      positiveTestedPeopleText.line_chart_legend_trend_moving_average_label,
                    shortLabel:
                      positiveTestedPeopleText.tooltip_labels
                        .newly_infected_people_moving_average,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedDateStart,
                      end: Infinity,
                      label:
                        positiveTestedPeopleText.line_chart_legend_inaccurate_label,
                      shortLabel:
                        positiveTestedPeopleText.tooltip_labels.inaccurate,
                    },
                  ],
                }}
              />
            )}
          </ChartTile>

          <ContentHeader
            id="besmette-locaties"
            skipLinkAnchor={true}
            title={replaceVariablesInText(infectedLocationsText.titel, {
              safetyRegion: safetyRegionName,
            })}
            icon={<Locatie />}
            subtitle={infectedLocationsText.pagina_toelichting}
            metadata={{
              datumsText: infectedLocationsText.datums,
              dateOrRange: nursinghomeLastValue.date_unix,
              dateOfInsertionUnix: nursinghomeLastValue.date_of_insertion_unix,
              dataSources: [infectedLocationsText.bronnen.rivm],
            }}
            reference={infectedLocationsText.reference}
          />

          <TwoKpiSection>
            <KpiTile
              title={infectedLocationsText.kpi_titel}
              metadata={{
                date: nursinghomeLastValue.date_unix,
                source: infectedLocationsText.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_locations_total"
                absolute={nursinghomeLastValue.infected_locations_total}
                percentage={nursinghomeLastValue.infected_locations_percentage}
                difference={
                  data.difference.nursing_home__infected_locations_total
                }
              />
              <Text>{infectedLocationsText.kpi_toelichting}</Text>
            </KpiTile>
            <KpiTile
              title={infectedLocationsText.barscale_titel}
              metadata={{
                date: nursinghomeLastValue.date_unix,
                source: infectedLocationsText.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="newly_infected_locations"
                absolute={nursinghomeLastValue.newly_infected_locations}
              />
              <Text>{infectedLocationsText.barscale_toelichting}</Text>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: infectedLocationsText.bronnen.rivm }}
            title={infectedLocationsText.linechart_titel}
            timeframeOptions={['all', '5weeks']}
          >
            {(timeframe) => (
              <TimeSeriesChart
                values={data.nursing_home.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'area',
                    metricProperty: 'infected_locations_total',
                    label:
                      siteText.verpleeghuis_besmette_locaties
                        .linechart_tooltip_label,
                    color: colors.data.primary,
                  },
                ]}
              />
            )}
          </ChartTile>

          <ContentHeader
            id="sterfte"
            skipLinkAnchor={true}
            title={replaceVariablesInText(deceased.titel, {
              safetyRegion: safetyRegionName,
            })}
            icon={<CoronaVirus />}
            subtitle={deceased.pagina_toelichting}
            metadata={{
              datumsText: deceased.datums,
              dateOrRange: nursinghomeLastValue.date_unix,
              dateOfInsertionUnix: nursinghomeLastValue.date_of_insertion_unix,
              dataSources: [deceased.bronnen.rivm],
            }}
            reference={deceased.reference}
          />

          <TwoKpiSection>
            <KpiTile
              title={deceased.barscale_titel}
              description={deceased.extra_uitleg}
              metadata={{
                date: nursinghomeLastValue.date_unix,
                source: deceased.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="deceased_daily"
                absolute={nursinghomeLastValue.deceased_daily}
                difference={data.difference.nursing_home__deceased_daily}
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: deceased.bronnen.rivm }}
            title={deceased.linechart_titel}
            timeframeOptions={['all', '5weeks']}
          >
            {(timeframe) => (
              <TimeSeriesChart
                values={data.nursing_home.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'bar',
                    metricProperty: 'deceased_daily',
                    label: deceased.line_chart_legend_trend_label,
                    shortLabel: deceased.tooltip_labels.deceased_daily,
                    color: colors.data.primary,
                  },
                  {
                    type: 'line',
                    metricProperty: 'deceased_daily_moving_average',
                    label:
                      deceased.line_chart_legend_trend_moving_average_label,
                    shortLabel:
                      deceased.tooltip_labels.deceased_daily_moving_average,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedDateStart,
                      end: Infinity,
                      label: deceased.line_chart_legend_inaccurate_label,
                      shortLabel: deceased.tooltip_labels.inaccurate,
                    },
                  ],
                }}
              />
            )}
          </ChartTile>
        </TileList>
      </SafetyRegionLayout>
    </Layout>
  );
};

export default NursingHomeCare;
