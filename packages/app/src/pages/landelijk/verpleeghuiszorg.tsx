import {
  Coronavirus,
  Locatie,
  Verpleeghuiszorg,
} from '@corona-dashboard/icons';
import { Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
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
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectNlData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlData(
    'difference.nursing_home__infected_locations_total',
    'difference.nursing_home__newly_infected_people',
    'nursing_home'
  ),
  createGetChoroplethData({
    vr: ({ nursing_home }) => ({ nursing_home }),
  }),
  createGetContent<PageArticlesQueryResult>((context) => {
    const { locale } = context;
    return createPageArticlesQuery('nursingHomePage', locale);
  })
);

const NursingHomeCare = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, choropleth, lastGenerated, content } = props;
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

  const metadata = {
    ...siteText.nationaal_metadata,
    title: infectedLocationsText.metadata.title,
    description: infectedLocationsText.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.kwetsbare_groepen}
            screenReaderCategory={
              siteText.sidebar.metrics.nursing_home_care.title
            }
            title={positiveTestedPeopleText.titel}
            icon={<Verpleeghuiszorg />}
            description={
              <Markdown content={positiveTestedPeopleText.pagina_toelichting} />
            }
            metadata={{
              datumsText: positiveTestedPeopleText.datums,
              dateOrRange: nursinghomeDataLastValue.date_unix,
              dateOfInsertionUnix:
                nursinghomeDataLastValue.date_of_insertion_unix,
              dataSources: [positiveTestedPeopleText.bronnen.rivm],
            }}
            referenceLink={positiveTestedPeopleText.reference.href}
            articles={content.articles}
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
                isAmount
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: positiveTestedPeopleText.bronnen.rivm }}
            title={positiveTestedPeopleText.linechart_titel}
            description={positiveTestedPeopleText.linechart_description}
            timeframeOptions={['all', '5weeks']}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'nursing_home_confirmed_cases_over_time_chart',
                }}
                values={data.nursing_home.values}
                timeframe={timeframe}
                seriesConfig={[
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
                      cutValuesForMetricProperties: [
                        'newly_infected_people_moving_average',
                      ],
                    },
                  ],
                }}
              />
            )}
          </ChartTile>

          <Spacer pb={3} />

          <PageInformationBlock
            id="besmette-locaties"
            title={infectedLocationsText.titel}
            icon={<Locatie />}
            description={infectedLocationsText.pagina_toelichting}
            metadata={{
              datumsText: infectedLocationsText.datums,
              dateOrRange: nursinghomeDataLastValue.date_unix,
              dateOfInsertionUnix:
                nursinghomeDataLastValue.date_of_insertion_unix,
              dataSources: [infectedLocationsText.bronnen.rivm],
            }}
            referenceLink={infectedLocationsText.reference.href}
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
                isAmount
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
              thresholds: thresholds.vr.infected_locations_percentage,
              title: infectedLocationsText.chloropleth_legenda.titel,
            }}
          >
            <DynamicChoropleth
              renderTarget="canvas"
              map="vr"
              accessibility={{
                key: 'nursing_home_infected_people_choropleth',
              }}
              data={choropleth.vr.nursing_home}
              dataConfig={{
                metricName: 'nursing_home',
                metricProperty: 'infected_locations_percentage',
              }}
              dataOptions={{
                isPercentage: true,
                getLink: reverseRouter.vr.verpleeghuiszorg,
              }}
            />
          </ChoroplethTile>

          <ChartTile
            metadata={{ source: infectedLocationsText.bronnen.rivm }}
            title={infectedLocationsText.linechart_titel}
            timeframeOptions={['all', '5weeks']}
            description={infectedLocationsText.linechart_description}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'nursing_home_infected_locations_over_time_chart',
                }}
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

          <Spacer pb={3} />

          <PageInformationBlock
            id="sterfte"
            title={deceased.titel}
            icon={<Coronavirus />}
            description={deceased.pagina_toelichting}
            metadata={{
              datumsText: deceased.datums,
              dateOrRange: nursinghomeDataLastValue.date_unix,
              dateOfInsertionUnix:
                nursinghomeDataLastValue.date_of_insertion_unix,
              dataSources: [deceased.bronnen.rivm],
            }}
            referenceLink={deceased.reference.href}
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

          <ChartTile
            metadata={{ source: deceased.bronnen.rivm }}
            title={deceased.linechart_titel}
            timeframeOptions={['all', '5weeks']}
            description={deceased.linechart_description}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'nursing_home_deceased_over_time_chart',
                }}
                values={data.nursing_home.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'deceased_daily_moving_average',
                    label:
                      deceased.line_chart_legend_trend_moving_average_label,
                    shortLabel:
                      deceased.tooltip_labels.deceased_daily_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'deceased_daily',
                    label: deceased.line_chart_legend_trend_label,
                    shortLabel: deceased.tooltip_labels.deceased_daily,
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
      </NlLayout>
    </Layout>
  );
};

export default NursingHomeCare;
