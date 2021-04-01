import {
  RegionsNursingHome,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import CoronaVirus from '~/assets/coronavirus.svg';
import Locatie from '~/assets/locaties.svg';
import Verpleeghuiszorg from '~/assets/verpleeghuiszorg.svg';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TileList } from '~/components-styled/tile-list';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { InfectedLocationsRegionalTooltip } from '~/components/choropleth/tooltips/region/infected-locations-regional-tooltip';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
  getNlData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  createGetChoroplethData({
    vr: ({ nursing_home }) => ({ nursing_home }),
  })
);

const NursingHomeCare = (props: StaticProps<typeof getStaticProps>) => {
  const { data, choropleth, lastGenerated } = props;
  const nursinghomeDataLastValue = data.nursing_home.last_value;
  const underReportedDateStart = getBoundaryDateStartUnix(
    data.nursing_home.values,
    7
  );

  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const infectedLocationsText = siteText.verpleeghuis_besmette_locaties;
  const positiveTestedPeopleText =
    siteText.verpleeghuis_positief_geteste_personen;
  const deceased = siteText.verpleeghuis_oversterfte;
  const graphDescriptions = siteText.accessibility.grafieken;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: infectedLocationsText.metadata.title,
    description: infectedLocationsText.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          <ContentHeader
            category={siteText.nationaal_layout.headings.kwetsbare_groepen}
            screenReaderCategory={
              siteText.verpleeghuis_besmette_locaties.titel_sidebar
            }
            title={positiveTestedPeopleText.titel}
            icon={<Verpleeghuiszorg />}
            subtitle={positiveTestedPeopleText.pagina_toelichting}
            metadata={{
              datumsText: positiveTestedPeopleText.datums,
              dateOrRange: nursinghomeDataLastValue.date_unix,
              dateOfInsertionUnix:
                nursinghomeDataLastValue.date_of_insertion_unix,
              dataSources: [positiveTestedPeopleText.bronnen.rivm],
            }}
            reference={positiveTestedPeopleText.reference}
          />

          <TwoKpiSection>
            <KpiTile
              title={positiveTestedPeopleText.barscale_titel}
              description={positiveTestedPeopleText.extra_uitleg}
              metadata={{
                date: nursinghomeDataLastValue.date_unix,
                source: positiveTestedPeopleText.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="newly_infected_people"
                absolute={nursinghomeDataLastValue.newly_infected_people}
                difference={data.difference.nursing_home__newly_infected_people}
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTileWithTimeframe
            metadata={{ source: positiveTestedPeopleText.bronnen.rivm }}
            title={positiveTestedPeopleText.linechart_titel}
            ariaDescription={graphDescriptions.verpleeghuiszorg_positief_getest}
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
          </ChartTileWithTimeframe>

          <ContentHeader
            id="besmette-locaties"
            skipLinkAnchor={true}
            title={infectedLocationsText.titel}
            icon={<Locatie />}
            subtitle={infectedLocationsText.pagina_toelichting}
            metadata={{
              datumsText: infectedLocationsText.datums,
              dateOrRange: nursinghomeDataLastValue.date_unix,
              dateOfInsertionUnix:
                nursinghomeDataLastValue.date_of_insertion_unix,
              dataSources: [infectedLocationsText.bronnen.rivm],
            }}
            reference={infectedLocationsText.reference}
          />

          <TwoKpiSection>
            <KpiTile
              title={infectedLocationsText.kpi_titel}
              metadata={{
                date: nursinghomeDataLastValue.date_unix,
                source: infectedLocationsText.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_locations_total"
                absolute={nursinghomeDataLastValue.infected_locations_total}
                percentage={
                  nursinghomeDataLastValue.infected_locations_percentage
                }
                difference={
                  data.difference.nursing_home__infected_locations_total
                }
              />
              <Text>{infectedLocationsText.kpi_toelichting}</Text>
            </KpiTile>

            <KpiTile
              title={infectedLocationsText.barscale_titel}
              metadata={{
                date: nursinghomeDataLastValue.date_unix,
                source: infectedLocationsText.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="newly_infected_locations"
                absolute={nursinghomeDataLastValue.newly_infected_locations}
              />
              <Text>{infectedLocationsText.barscale_toelichting}</Text>
            </KpiTile>
          </TwoKpiSection>

          <ChoroplethTile
            title={infectedLocationsText.map_titel}
            description={infectedLocationsText.map_toelichting}
            metadata={{
              date: nursinghomeDataLastValue.date_unix,
              source: infectedLocationsText.bronnen.rivm,
            }}
            legend={{
              thresholds:
                regionThresholds.nursing_home.infected_locations_percentage,
              title: infectedLocationsText.chloropleth_legenda.titel,
            }}
          >
            <SafetyRegionChoropleth
              data={choropleth.vr}
              getLink={reverseRouter.vr.verpleeghuiszorg}
              metricName="nursing_home"
              metricProperty="infected_locations_percentage"
              tooltipContent={(
                context: SafetyRegionProperties & RegionsNursingHome
              ) => <InfectedLocationsRegionalTooltip context={context} />}
            />
          </ChoroplethTile>

          <ChartTileWithTimeframe
            metadata={{ source: infectedLocationsText.bronnen.rivm }}
            title={infectedLocationsText.linechart_titel}
            timeframeOptions={['all', '5weeks']}
            ariaDescription={
              graphDescriptions.verpleeghuiszorg_besmette_locaties
            }
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
          </ChartTileWithTimeframe>

          <ContentHeader
            id="sterfte"
            skipLinkAnchor={true}
            title={deceased.titel}
            icon={<CoronaVirus />}
            subtitle={deceased.pagina_toelichting}
            metadata={{
              datumsText: deceased.datums,
              dateOrRange: nursinghomeDataLastValue.date_unix,
              dateOfInsertionUnix:
                nursinghomeDataLastValue.date_of_insertion_unix,
              dataSources: [deceased.bronnen.rivm],
            }}
            reference={deceased.reference}
          />

          <TwoKpiSection>
            <KpiTile
              title={deceased.barscale_titel}
              description={deceased.extra_uitleg}
              metadata={{
                date: nursinghomeDataLastValue.date_unix,
                source: deceased.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="deceased_daily"
                absolute={nursinghomeDataLastValue.deceased_daily}
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTileWithTimeframe
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
          </ChartTileWithTimeframe>
        </TileList>
      </NationalLayout>
    </Layout>
  );
};

export default NursingHomeCare;
