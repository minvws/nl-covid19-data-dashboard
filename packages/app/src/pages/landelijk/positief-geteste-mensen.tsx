import { colors, NlTestedOverallValue } from '@corona-dashboard/common';
import { GgdTesten, Test } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { Box } from '~/components/base';
import { RegionControlOption } from '~/components/chart-region-controls';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { Divider } from '~/components/divider';
import { InView } from '~/components/in-view';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { InlineText, Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { GNumberBarChartTile } from '~/domain/tested/g-number-bar-chart-tile';
import { InfectedPerAgeGroup } from '~/domain/tested/infected-per-age-group';
import { useIntl } from '~/intl';
import {
  ElementsQueryResult,
  getElementsQuery,
  getTimelineEvents,
} from '~/queries/get-elements-query';
import {
  getArticleParts,
  getPagePartsQuery,
} from '~/queries/get-page-parts-query';
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
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlData(
    'difference.tested_ggd__infected_percentage_moving_average',
    'difference.tested_ggd__tested_total_moving_average',
    'difference.tested_overall__infected_moving_average',
    'difference.tested_overall__infected_per_100k_moving_average',
    'g_number',
    'tested_ggd',
    'tested_ggd_archived',
    'tested_overall',
    'tested_per_age_group'
  ),
  createGetChoroplethData({
    gm: ({ tested_overall }) => ({ tested_overall }),
    vr: ({ tested_overall }) => ({ tested_overall }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
       "parts": ${getPagePartsQuery('positiveTestsPage')},
       "elements": ${getElementsQuery(
         'nl',
         ['tested_overall', 'tested_ggd', 'tested_per_age_group'],
         locale
       )}
      }`;
    })(context);
    return {
      content: {
        articles: getArticleParts(
          content.parts.pageParts,
          'positiveTestsPageArticles'
        ),
        ggdArticles: getArticleParts(
          content.parts.pageParts,
          'positiveTestsGGDArticles'
        ),
        elements: content.elements,
      },
    };
  }
);

const PositivelyTestedPeople = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, choropleth, content, lastGenerated } = props;

  const { siteText, formatNumber, formatPercentage, formatDateFromSeconds } =
    useIntl();
  const reverseRouter = useReverseRouter();
  const [hasHideArchivedCharts, setHideArchivedCharts] =
    useState<boolean>(false);

  const text = siteText.positief_geteste_personen;
  const ggdText = siteText.positief_geteste_personen_ggd;
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');

  const dataOverallLastValue = data.tested_overall.last_value;
  const dataGgdLastValue = data.tested_ggd.last_value;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.besmettingen}
            screenReaderCategory={siteText.sidebar.metrics.positive_tests.title}
            title={text.titel}
            icon={<Test />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: dataOverallLastValue.date_unix,
              dateOfInsertionUnix: dataOverallLastValue.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
            }}
            referenceLink={text.reference.href}
            articles={content.articles}
          />

          <TwoKpiSection>
            <KpiTile
              title={text.infected_kpi.title}
              metadata={{
                date: dataOverallLastValue.date_unix,
                source: text.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_moving_average"
                absolute={dataOverallLastValue.infected_moving_average_rounded}
                isAmount
              />

              <Markdown content={text.infected_kpi.description} />

              <Box spacing={3}>
                <Text variant="body2" fontWeight="bold">
                  {replaceComponentsInText(text.infected_kpi.last_value_text, {
                    infected: (
                      <InlineText color="data.primary">{`${formatNumber(
                        dataOverallLastValue.infected
                      )}`}</InlineText>
                    ),
                    dateTo: formatDateFromSeconds(
                      dataOverallLastValue.date_unix,
                      'weekday-medium'
                    ),
                  })}
                </Text>
                {text.infected_kpi.link_cta && (
                  <Markdown content={text.infected_kpi.link_cta} />
                )}
              </Box>
            </KpiTile>

            <KpiTile
              title={text.percentage_kpi.title}
              metadata={{
                date: dataGgdLastValue.date_unix,
                source: text.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_percentage_moving_average"
                percentage={dataGgdLastValue.infected_percentage_moving_average}
                isAmount
              />

              <Markdown content={text.percentage_kpi.description} />

              <Box spacing={3}>
                <Text variant="body2" fontWeight="bold">
                  {replaceComponentsInText(
                    text.percentage_kpi.last_value_text,
                    {
                      percentage: (
                        <InlineText color="data.primary">{`${formatPercentage(
                          dataGgdLastValue.infected_percentage
                        )}%`}</InlineText>
                      ),
                      dateTo: formatDateFromSeconds(
                        dataGgdLastValue.date_unix,
                        'weekday-medium'
                      ),
                    }
                  )}
                </Text>
                {text.percentage_kpi.link_cta && (
                  <Markdown content={text.percentage_kpi.link_cta} />
                )}
              </Box>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            title={text.linechart_titel}
            description={text.linechart_toelichting}
            metadata={{
              source: text.bronnen.rivm,
            }}
            timeframeOptions={['all', '5weeks']}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'confirmed_cases_infected_over_time_chart',
                }}
                values={data.tested_overall.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'infected_moving_average',
                    label:
                      siteText.positief_geteste_personen.tooltip_labels
                        .infected_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'infected',
                    label:
                      siteText.positief_geteste_personen.tooltip_labels
                        .infected,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  forcedMaximumValue: 150000,
                  outOfBoundsConfig: {
                    label:
                      siteText.positief_geteste_personen.tooltip_labels
                        .infected_out_of_bounds,
                    tooltipLabel:
                      siteText.positief_geteste_personen.tooltip_labels
                        .annotations,
                    checkIsOutofBounds: (
                      x: NlTestedOverallValue,
                      max: number
                    ) => x.infected > max,
                  },
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'tested_overall'
                  ),
                }}
              />
            )}
          </ChartTile>

          <InView rootMargin="400px">
            <ChoroplethTile
              data-cy="choropleths"
              title={text.map_titel}
              metadata={{
                date: dataOverallLastValue.date_unix,
                source: text.bronnen.rivm,
              }}
              description={
                <>
                  <Markdown content={text.map_toelichting} />
                  <Text variant="body2" fontWeight="bold">
                    {replaceComponentsInText(text.map_last_value_text, {
                      infected_per_100k: (
                        <InlineText color="data.primary">{`${formatNumber(
                          dataOverallLastValue.infected_per_100k
                        )}`}</InlineText>
                      ),
                      dateTo: formatDateFromSeconds(
                        dataOverallLastValue.date_unix,
                        'weekday-medium'
                      ),
                    })}
                  </Text>
                </>
              }
              onChartRegionChange={setSelectedMap}
              chartRegion={selectedMap}
              legend={{
                title: text.chloropleth_legenda.titel,
                thresholds: thresholds.vr.infected_per_100k,
              }}
            >
              {/**
               * It's probably a good idea to abstract this even further, so that
               * the switching of charts, and the state involved, are all handled by
               * the component. The page does not have to be bothered with this.
               *
               * Ideally the ChoroplethTile would receive some props with the data
               * it needs to render either Choropleth without it caring about
               * MunicipalityChloropleth or VrChloropleth, that data would
               * make the chart and define the tooltip layout for each, but maybe for
               * now that is a bridge too far. Let's take it one step at a time.
               */}
              {selectedMap === 'gm' && (
                <DynamicChoropleth
                  map="gm"
                  accessibility={{
                    key: 'confirmed_cases_municipal_choropleth',
                  }}
                  data={choropleth.gm.tested_overall}
                  dataConfig={{
                    metricName: 'tested_overall',
                    metricProperty: 'infected_per_100k',
                    dataFormatters: {
                      infected: formatNumber,
                      infected_per_100k: formatNumber,
                    },
                  }}
                  dataOptions={{
                    getLink: reverseRouter.gm.positiefGetesteMensen,
                  }}
                />
              )}
              {selectedMap === 'vr' && (
                <DynamicChoropleth
                  map="vr"
                  accessibility={{
                    key: 'confirmed_cases_region_choropleth',
                  }}
                  data={choropleth.vr.tested_overall}
                  dataConfig={{
                    metricName: 'tested_overall',
                    metricProperty: 'infected_per_100k',
                    dataFormatters: {
                      infected: formatNumber,
                      infected_per_100k: formatNumber,
                    },
                  }}
                  dataOptions={{
                    getLink: reverseRouter.vr.positiefGetesteMensen,
                  }}
                />
              )}
            </ChoroplethTile>
          </InView>

          <InView rootMargin="400px">
            <ChartTile
              title={siteText.infected_per_age_group.title}
              description={siteText.infected_per_age_group.description}
              timeframeOptions={['all', '5weeks']}
              metadata={{
                source: text.bronnen.rivm,
              }}
            >
              {(timeframe) => (
                <InfectedPerAgeGroup
                  accessibility={{
                    key: 'confirmed_cases_infected_per_age_group_over_time_chart',
                  }}
                  values={data.tested_per_age_group.values}
                  timeframe={timeframe}
                  timelineEvents={getTimelineEvents(
                    content.elements.timeSeries,
                    'tested_per_age_group'
                  )}
                />
              )}
            </ChartTile>
          </InView>

          <InView rootMargin="400px">
            <GNumberBarChartTile data={data.g_number} />
          </InView>
          <Divider />

          <PageInformationBlock
            title={ggdText.titel}
            id="ggd"
            icon={<GgdTesten />}
            description={ggdText.toelichting}
            metadata={{
              datumsText: ggdText.datums,
              dateOrRange: dataGgdLastValue.date_unix,
              dateOfInsertionUnix: dataGgdLastValue.date_of_insertion_unix,
              dataSources: [ggdText.bronnen.rivm],
            }}
            referenceLink={ggdText.reference_href}
            articles={content.ggdArticles}
          />

          <TwoKpiSection>
            <KpiTile
              title={ggdText.tests_kpi.title}
              metadata={{
                date: dataGgdLastValue.date_unix,
                source: text.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="tested_total_moving_average"
                absolute={dataGgdLastValue.tested_total_moving_average_rounded}
                isAmount
              />

              <Markdown content={ggdText.tests_kpi.description} />

              <Text variant="body2" fontWeight="bold">
                {replaceComponentsInText(ggdText.tests_kpi.last_value_text, {
                  tested_total: (
                    <InlineText color="data.primary">{`${formatNumber(
                      dataGgdLastValue.tested_total
                    )}`}</InlineText>
                  ),
                  dateTo: formatDateFromSeconds(
                    dataGgdLastValue.date_unix,
                    'weekday-medium'
                  ),
                })}
              </Text>
            </KpiTile>

            <KpiTile
              title={ggdText.percentage_kpi.title}
              metadata={{
                date: dataGgdLastValue.date_unix,
                source: text.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_percentage_moving_average"
                percentage={dataGgdLastValue.infected_percentage_moving_average}
                isAmount
              />

              <Markdown content={ggdText.percentage_kpi.description} />

              <Text variant="body2" fontWeight="bold">
                {replaceComponentsInText(
                  ggdText.percentage_kpi.last_value_text,
                  {
                    infected_moving_average: (
                      <InlineText color="data.primary">{`${formatNumber(
                        dataGgdLastValue.infected_moving_average,
                        0
                      )}`}</InlineText>
                    ),
                    tested_total_moving_average: (
                      <InlineText color="data.primary">{`${formatNumber(
                        dataGgdLastValue.tested_total_moving_average,
                        0
                      )}`}</InlineText>
                    ),
                    dateTo: formatDateFromSeconds(
                      dataGgdLastValue.date_unix,
                      'weekday-medium'
                    ),
                  }
                )}
              </Text>
            </KpiTile>
          </TwoKpiSection>

          <InView rootMargin="400px">
            <ChartTile
              timeframeOptions={['all', '5weeks']}
              title={ggdText.linechart_totaltests_titel}
              description={ggdText.linechart_totaltests_toelichting}
              metadata={{
                source: ggdText.bronnen.rivm,
              }}
            >
              {(timeframe) => (
                <TimeSeriesChart
                  accessibility={{
                    key: 'confirmed_cases_tested_over_time_chart',
                  }}
                  timeframe={timeframe}
                  values={data.tested_ggd.values}
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty: 'tested_total_moving_average',
                      color: colors.data.secondary,
                      label:
                        ggdText.linechart_totaltests_legend_label_moving_average,
                      shortLabel:
                        siteText.positief_geteste_personen.tooltip_labels
                          .ggd_tested_total_moving_average,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'tested_total',
                      color: colors.data.secondary,
                      label: ggdText.linechart_totaltests_legend_label,
                      shortLabel:
                        siteText.positief_geteste_personen.tooltip_labels
                          .ggd_tested_total,
                    },
                    {
                      type: 'line',
                      metricProperty: 'infected_moving_average',
                      color: colors.data.primary,
                      label:
                        ggdText.linechart_positivetests_legend_label_moving_average,
                      shortLabel:
                        siteText.positief_geteste_personen.tooltip_labels
                          .infected_moving_average,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'infected',
                      color: colors.data.primary,
                      label: ggdText.linechart_positivetests_legend_label,
                      shortLabel:
                        siteText.positief_geteste_personen.tooltip_labels
                          .infected,
                    },
                    {
                      type: 'invisible',
                      metricProperty: 'infected_percentage',
                      label:
                        siteText.positief_geteste_personen.tooltip_labels
                          .ggd_infected_percentage,
                      isPercentage: true,
                    },
                  ]}
                />
              )}
            </ChartTile>
          </InView>

          <Divider />

          <PageInformationBlock
            title={text.section_archived.title}
            description={text.section_archived.description}
            isArchivedHidden={hasHideArchivedCharts}
            onToggleArchived={() =>
              setHideArchivedCharts(!hasHideArchivedCharts)
            }
          />

          {hasHideArchivedCharts && (
            <InView rootMargin="400px">
              <ChartTile
                title={ggdText.linechart_percentage_titel}
                description={ggdText.linechart_percentage_toelichting}
                metadata={{
                  source: ggdText.bronnen.rivm,
                }}
              >
                <TimeSeriesChart
                  accessibility={{
                    key: 'confirmed_cases_infected_percentage_over_time_chart',
                  }}
                  values={data.tested_ggd_archived.values}
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty: 'infected_percentage_moving_average',
                      color: colors.data.primary,
                      label:
                        siteText.positief_geteste_personen.tooltip_labels
                          .ggd_infected_percentage_moving_average,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'infected_percentage',
                      color: colors.data.primary,
                      label:
                        siteText.positief_geteste_personen.tooltip_labels
                          .ggd_infected_percentage,
                    },
                  ]}
                  dataOptions={{
                    isPercentage: true,
                    timelineEvents: getTimelineEvents(
                      content.elements.timeSeries,
                      'tested_ggd'
                    ),
                  }}
                />
              </ChartTile>
            </InView>
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default PositivelyTestedPeople;
