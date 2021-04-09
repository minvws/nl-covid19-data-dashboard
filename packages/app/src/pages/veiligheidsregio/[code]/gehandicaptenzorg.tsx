import CoronaVirus from '~/assets/coronavirus.svg';
import Gehandicaptenzorg from '~/assets/gehandicapte-zorg.svg';
import Locatie from '~/assets/locaties.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { useIntl } from '~/intl';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { ChartTile } from '~/components-styled/chart-tile';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, getVrData } from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData
);

const DisabilityCare = (props: StaticProps<typeof getStaticProps>) => {
  const { data, safetyRegionName, lastGenerated } = props;

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
      safetyRegionName,
    }),
    description: replaceVariablesInText(locationsText.metadata.description, {
      safetyRegionName,
    }),
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
            title={replaceVariablesInText(positiveTestPeopleText.titel, {
              safetyRegion: safetyRegionName,
            })}
            icon={<Gehandicaptenzorg />}
            subtitle={replaceVariablesInText(
              positiveTestPeopleText.pagina_toelichting,
              {
                safetyRegion: safetyRegionName,
              }
            )}
            metadata={{
              datumsText: positiveTestPeopleText.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [positiveTestPeopleText.bronnen.rivm],
            }}
            reference={positiveTestPeopleText.reference}
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
            timeframeOptions={['all', '5weeks', 'week']}
          >
            {(timeframe) => (
              <TimeSeriesChart
                values={values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'area',
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
                    },
                  ],
                }}
              />
            )}
          </ChartTile>

          <ContentHeader
            id="besmette-locaties"
            skipLinkAnchor={true}
            title={replaceVariablesInText(locationsText.titel, {
              safetyRegion: safetyRegionName,
            })}
            icon={<Locatie />}
            subtitle={locationsText.pagina_toelichting}
            metadata={{
              datumsText: locationsText.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [locationsText.bronnen.rivm],
            }}
            reference={locationsText.reference}
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
              timeframeOptions={['all', '5weeks', 'week']}
            >
              {(timeframe) => (
                <TimeSeriesChart
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

          <ContentHeader
            id="sterfte"
            skipLinkAnchor={true}
            title={replaceVariablesInText(mortalityText.titel, {
              safetyRegion: safetyRegionName,
            })}
            icon={<CoronaVirus />}
            subtitle={mortalityText.pagina_toelichting}
            metadata={{
              datumsText: mortalityText.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [mortalityText.bronnen.rivm],
            }}
            reference={mortalityText.reference}
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
            timeframeOptions={['all', '5weeks', 'week']}
          >
            {(timeframe) => (
              <TimeSeriesChart
                values={values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'area',
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

export default DisabilityCare;
