import {
  colors,
  NlTestedOverallValue,
  TimeframeOptionsList,
} from '@corona-dashboard/common';
import { GgdTesten, Test } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { Box } from '~/components/base';
import { InlineText, BoldText } from '~/components/typography';
import { RegionControlOption } from '~/components/chart-region-controls';
import {
  TwoKpiSection,
  TimeSeriesChart,
  TileList,
  PageInformationBlock,
  ChartTile,
  DynamicChoropleth,
  ChoroplethTile,
  Divider,
  InView,
  KpiTile,
  KpiValue,
  Markdown,
} from '~/components';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { Layout, NlLayout } from '~/domain/layout';
import { GNumberBarChartTile, InfectedPerAgeGroup } from '~/domain/tested';
import { useIntl } from '~/intl';
import { Languages } from '~/locale';
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
  getLokalizeTexts,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceComponentsInText, useReverseRouter } from '~/utils';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        metadataTexts: siteText.pages.topicalPage.nl.nationaal_metadata,
        textNl: siteText.pages.positiveTestsPage.nl,
        textShared: siteText.pages.positiveTestsPage.shared,
      }),
      locale
    ),
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
  const {
    pageText,
    selectedNlData: data,
    choropleth,
    content,
    lastGenerated,
  } = props;

  const { commonTexts, formatNumber, formatPercentage, formatDateFromSeconds } =
    useIntl();
  const reverseRouter = useReverseRouter();
  const [hasHideArchivedCharts, setHideArchivedCharts] =
    useState<boolean>(false);

  const { metadataTexts, textNl, textShared } = pageText;

  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');

  const dataOverallLastValue = data.tested_overall.last_value;
  const dataGgdLastValue = data.tested_ggd.last_value;

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.nationaal_layout.headings.besmettingen}
            screenReaderCategory={
              commonTexts.sidebar.metrics.positive_tests.title
            }
            title={textNl.titel}
            icon={<Test />}
            description={textNl.pagina_toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: dataOverallLastValue.date_unix,
              dateOfInsertionUnix: dataOverallLastValue.date_of_insertion_unix,
              dataSources: [textNl.bronnen.rivm],
            }}
            referenceLink={textNl.reference.href}
            articles={content.articles}
          />

          <TwoKpiSection>
            <KpiTile
              title={textNl.infected_kpi.title}
              metadata={{
                date: dataOverallLastValue.date_unix,
                source: textNl.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_moving_average"
                absolute={dataOverallLastValue.infected_moving_average_rounded}
                isAmount
              />

              <Markdown content={textNl.infected_kpi.description} />

              <Box spacing={3}>
                <BoldText variant="body2">
                  {replaceComponentsInText(
                    textNl.infected_kpi.last_value_text,
                    {
                      infected: (
                        <InlineText color="data.primary">{`${formatNumber(
                          dataOverallLastValue.infected
                        )}`}</InlineText>
                      ),
                      dateTo: formatDateFromSeconds(
                        dataOverallLastValue.date_unix,
                        'weekday-medium'
                      ),
                    }
                  )}
                </BoldText>
                {textNl.infected_kpi.link_cta && (
                  <Markdown content={textNl.infected_kpi.link_cta} />
                )}
              </Box>
            </KpiTile>

            <KpiTile
              title={textNl.percentage_kpi.title}
              metadata={{
                date: dataGgdLastValue.date_unix,
                source: textNl.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_percentage_moving_average"
                percentage={dataGgdLastValue.infected_percentage_moving_average}
                isAmount
              />

              <Markdown content={textNl.percentage_kpi.description} />

              <Box spacing={3}>
                <BoldText variant="body2">
                  {replaceComponentsInText(
                    textNl.percentage_kpi.last_value_text,
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
                </BoldText>
                {textNl.percentage_kpi.link_cta && (
                  <Markdown content={textNl.percentage_kpi.link_cta} />
                )}
              </Box>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            title={textNl.linechart_titel}
            description={textNl.linechart_toelichting}
            metadata={{
              source: textNl.bronnen.rivm,
            }}
            timeframeOptions={TimeframeOptionsList}
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
                    label: textShared.tooltip_labels.infected_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'infected',
                    label: textShared.tooltip_labels.infected,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  forcedMaximumValue: 150000,
                  outOfBoundsConfig: {
                    label: textShared.tooltip_labels.infected_out_of_bounds,
                    tooltipLabel: textShared.tooltip_labels.annotations,
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
              title={textNl.map_titel}
              metadata={{
                date: dataOverallLastValue.date_unix,
                source: textNl.bronnen.rivm,
              }}
              description={
                <>
                  <Markdown content={textNl.map_toelichting} />
                  <BoldText variant="body2">
                    {replaceComponentsInText(textNl.map_last_value_text, {
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
                  </BoldText>
                </>
              }
              onChartRegionChange={setSelectedMap}
              chartRegion={selectedMap}
              legend={{
                title: textShared.chloropleth_legenda.titel,
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
              title={textShared.infected_per_age_group.title}
              description={textShared.infected_per_age_group.description}
              timeframeOptions={TimeframeOptionsList}
              metadata={{
                source: textNl.bronnen.rivm,
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
                  text={textShared}
                />
              )}
            </ChartTile>
          </InView>

          <InView rootMargin="400px">
            <GNumberBarChartTile data={data.g_number} />
          </InView>
          <Divider />

          <PageInformationBlock
            title={textNl.ggd.titel}
            id="ggd"
            icon={<GgdTesten />}
            description={textNl.ggd.toelichting}
            metadata={{
              datumsText: textNl.ggd.datums,
              dateOrRange: dataGgdLastValue.date_unix,
              dateOfInsertionUnix: dataGgdLastValue.date_of_insertion_unix,
              dataSources: [textNl.ggd.bronnen.rivm],
            }}
            referenceLink={textNl.ggd.reference_href}
            articles={content.ggdArticles}
          />

          <TwoKpiSection>
            <KpiTile
              title={textNl.ggd.tests_kpi.title}
              metadata={{
                date: dataGgdLastValue.date_unix,
                source: textNl.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="tested_total_moving_average"
                absolute={dataGgdLastValue.tested_total_moving_average_rounded}
                isAmount
              />

              <Markdown content={textNl.ggd.tests_kpi.description} />

              <BoldText variant="body2">
                {replaceComponentsInText(textNl.ggd.tests_kpi.last_value_text, {
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
              </BoldText>
            </KpiTile>

            <KpiTile
              title={textNl.ggd.percentage_kpi.title}
              metadata={{
                date: dataGgdLastValue.date_unix,
                source: textNl.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_percentage_moving_average"
                percentage={dataGgdLastValue.infected_percentage_moving_average}
                isAmount
              />

              <Markdown content={textNl.ggd.percentage_kpi.description} />

              <BoldText variant="body2">
                {replaceComponentsInText(
                  textNl.ggd.percentage_kpi.last_value_text,
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
              </BoldText>
            </KpiTile>
          </TwoKpiSection>

          <InView rootMargin="400px">
            <ChartTile
              timeframeOptions={TimeframeOptionsList}
              title={textNl.ggd.linechart_totaltests_titel}
              description={textNl.ggd.linechart_totaltests_toelichting}
              metadata={{
                source: textNl.ggd.bronnen.rivm,
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
                        textNl.ggd
                          .linechart_totaltests_legend_label_moving_average,
                      shortLabel:
                        textShared.tooltip_labels
                          .ggd_tested_total_moving_average,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'tested_total',
                      color: colors.data.secondary,
                      label: textNl.ggd.linechart_totaltests_legend_label,
                      shortLabel: textShared.tooltip_labels.ggd_tested_total,
                    },
                    {
                      type: 'line',
                      metricProperty: 'infected_moving_average',
                      color: colors.data.primary,
                      label:
                        textNl.ggd
                          .linechart_positivetests_legend_label_moving_average,
                      shortLabel:
                        textShared.tooltip_labels.infected_moving_average,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'infected',
                      color: colors.data.primary,
                      label: textNl.ggd.linechart_positivetests_legend_label,
                      shortLabel: textShared.tooltip_labels.infected,
                    },
                    {
                      type: 'invisible',
                      metricProperty: 'infected_percentage',
                      label: textShared.tooltip_labels.ggd_infected_percentage,
                      isPercentage: true,
                    },
                  ]}
                />
              )}
            </ChartTile>
          </InView>

          <Divider />

          <PageInformationBlock
            title={textNl.section_archived.title}
            description={textNl.section_archived.description}
            isArchivedHidden={hasHideArchivedCharts}
            onToggleArchived={() =>
              setHideArchivedCharts(!hasHideArchivedCharts)
            }
          />

          {hasHideArchivedCharts && (
            <InView rootMargin="400px">
              <ChartTile
                title={textNl.ggd.linechart_percentage_titel}
                description={textNl.ggd.linechart_percentage_toelichting}
                metadata={{
                  source: textNl.ggd.bronnen.rivm,
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
                        textShared.tooltip_labels
                          .ggd_infected_percentage_moving_average,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'infected_percentage',
                      color: colors.data.primary,
                      label: textShared.tooltip_labels.ggd_infected_percentage,
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
