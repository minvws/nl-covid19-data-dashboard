import {
  VrCollectionDisabilityCare,
  VrProperties,
} from '@corona-dashboard/common';
import CoronaVirus from '~/assets/coronavirus.svg';
import Gehandicaptenzorg from '~/assets/gehandicapte-zorg.svg';
import Locatie from '~/assets/locaties.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ChartTile } from '~/components/chart-tile';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { DisablityInfectedLocationsRegionalTooltip } from '~/components/choropleth/tooltips/region/disability-infected-locations-regional-tooltip';
import { VrChoropleth } from '~/components/choropleth/vr-choropleth';
import { ContentHeader } from '~/components/content-header';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData(),
  createGetChoroplethData({
    vr: ({ disability_care }) => ({ disability_care }),
  }),
  createGetContent<{
    articles?: ArticleSummary[];
  }>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('disabilityCarePage', locale);
  })
);

const DisabilityCare = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, choropleth, lastGenerated, content } = props;
  const lastValue = data.disability_care.last_value;
  const values = data.disability_care.values;
  const underReportedDateStart = getBoundaryDateStartUnix(values, 7);

  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const infectedLocationsText = siteText.gehandicaptenzorg_besmette_locaties;
  const positiveTestedPeopleText =
    siteText.gehandicaptenzorg_positief_geteste_personen;
  const locationDeaths = siteText.gehandicaptenzorg_oversterfte;

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
              siteText.verpleeghuis_positief_geteste_personen.titel_sidebar
            }
            title={positiveTestedPeopleText.titel}
            icon={<Gehandicaptenzorg />}
            subtitle={positiveTestedPeopleText.pagina_toelichting}
            metadata={{
              datumsText: positiveTestedPeopleText.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [positiveTestedPeopleText.bronnen.rivm],
            }}
            reference={positiveTestedPeopleText.reference}
          />

          {content.articles && <ArticleStrip articles={content.articles} />}

          <TwoKpiSection>
            <KpiTile
              title={positiveTestedPeopleText.barscale_titel}
              description={positiveTestedPeopleText.extra_uitleg}
              metadata={{
                date: lastValue.date_unix,
                source: positiveTestedPeopleText.bronnen.rivm,
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
            metadata={{ source: positiveTestedPeopleText.bronnen.rivm }}
            title={positiveTestedPeopleText.linechart_titel}
            timeframeOptions={['all', '5weeks']}
            description={positiveTestedPeopleText.linechart_description}
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
                    color: colors.data.primary,
                    label:
                      positiveTestedPeopleText.line_chart_newly_infected_people_moving_average,
                    shortLabel:
                      positiveTestedPeopleText.line_chart_newly_infected_people_moving_average_short_label,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'newly_infected_people',
                    label:
                      positiveTestedPeopleText.line_chart_legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedDateStart,
                      end: Infinity,
                      label:
                        positiveTestedPeopleText.line_chart_legend_inaccurate_label,
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

          <ContentHeader
            id="besmette-locaties"
            skipLinkAnchor={true}
            title={infectedLocationsText.titel}
            icon={<Locatie />}
            subtitle={infectedLocationsText.pagina_toelichting}
            metadata={{
              datumsText: infectedLocationsText.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [infectedLocationsText.bronnen.rivm],
            }}
            reference={infectedLocationsText.reference}
          />

          <TwoKpiSection>
            <KpiTile
              title={infectedLocationsText.kpi_titel}
              metadata={{
                date: lastValue.date_unix,
                source: infectedLocationsText.bronnen.rivm,
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
              <Text>{infectedLocationsText.kpi_toelichting}</Text>
            </KpiTile>

            <KpiTile
              title={infectedLocationsText.barscale_titel}
              metadata={{
                date: lastValue.date_unix,
                source: infectedLocationsText.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="newly_infected_locations"
                absolute={lastValue.newly_infected_locations}
              />
              <Text>{infectedLocationsText.barscale_toelichting}</Text>
            </KpiTile>
          </TwoKpiSection>

          <ChoroplethTile
            title={infectedLocationsText.map_titel}
            description={infectedLocationsText.map_toelichting}
            metadata={{
              date: lastValue.date_unix,
              source: infectedLocationsText.bronnen.rivm,
            }}
            legend={{
              thresholds:
                regionThresholds.nursing_home.infected_locations_percentage,
              title: infectedLocationsText.chloropleth_legenda.titel,
            }}
          >
            <VrChoropleth
              accessibility={{
                key: 'disability_care_infected_people_choropleth',
              }}
              data={choropleth.vr}
              getLink={reverseRouter.vr.gehandicaptenzorg}
              metricName="disability_care"
              metricProperty="infected_locations_percentage"
              tooltipContent={(
                context: VrProperties & VrCollectionDisabilityCare
              ) => (
                <DisablityInfectedLocationsRegionalTooltip context={context} />
              )}
            />
          </ChoroplethTile>

          <ChartTile
            title={infectedLocationsText.linechart_titel}
            metadata={{
              source: infectedLocationsText.bronnen.rivm,
            }}
            timeframeOptions={['all', '5weeks']}
            description={infectedLocationsText.linechart_description}
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
                    label: infectedLocationsText.linechart_metric_label,
                    color: colors.data.primary,
                  },
                ]}
              />
            )}
          </ChartTile>

          <ContentHeader
            id="sterfte"
            skipLinkAnchor={true}
            title={locationDeaths.titel}
            icon={<CoronaVirus />}
            subtitle={locationDeaths.pagina_toelichting}
            metadata={{
              datumsText: locationDeaths.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [locationDeaths.bronnen.rivm],
            }}
            reference={locationDeaths.reference}
          />

          <TwoKpiSection>
            <KpiTile
              title={locationDeaths.barscale_titel}
              description={locationDeaths.extra_uitleg}
              metadata={{
                date: lastValue.date_unix,
                source: locationDeaths.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="deceased_daily"
                absolute={lastValue.deceased_daily}
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: locationDeaths.bronnen.rivm }}
            title={locationDeaths.linechart_titel}
            timeframeOptions={['all', '5weeks']}
            description={locationDeaths.linechart_description}
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
                      locationDeaths.line_chart_deceased_daily_moving_average,
                    shortLabel:
                      locationDeaths.line_chart_deceased_daily_moving_average_short_label,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'deceased_daily',
                    label: locationDeaths.line_chart_legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedDateStart,
                      end: Infinity,
                      label: locationDeaths.line_chart_legend_inaccurate_label,
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
      </NationalLayout>
    </Layout>
  );
};

export default DisabilityCare;
