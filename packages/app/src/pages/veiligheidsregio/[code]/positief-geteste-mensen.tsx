import { colors, TimeframeOption } from '@corona-dashboard/common';
import { GgdTesten, Test } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box } from '~/components/base';
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
import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { GNumberBarChartTile } from '~/domain/tested/g-number-bar-chart-tile';
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
  selectVrData,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        textVr: siteText.pages.positiveTestsPage.vr,
        textShared: siteText.pages.positiveTestsPage.shared,
      }),
      locale
    ),
  getLastGeneratedDate,
  selectVrData(
    'difference.tested_ggd__infected_percentage_moving_average',
    'difference.tested_ggd__tested_total_moving_average',
    'difference.tested_overall__infected_moving_average',
    'difference.tested_overall__infected_per_100k_moving_average',
    'g_number',
    'tested_ggd',
    'tested_ggd_archived',
    'tested_overall'
  ),
  createGetChoroplethData({
    gm: ({ tested_overall }) => ({ tested_overall }),
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
         'vr',
         ['tested_overall', 'tested_ggd'],
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
    selectedVrData: data,
    choropleth,
    vrName,
    content,
    lastGenerated,
  } = props;

  const { siteText, formatNumber, formatPercentage, formatDateFromSeconds } =
    useIntl();

  const reverseRouter = useReverseRouter();
  const router = useRouter();
  const [hasHideArchivedCharts, setHideArchivedCharts] =
    useState<boolean>(false);

  const { textVr, textShared } = pageText;

  const dataOverallLastValue = data.tested_overall.last_value;
  const dataGgdLastValue = data.tested_ggd.last_value;

  const municipalCodes = gmCodesByVrCode[router.query.code as string];
  const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(textVr.metadata.title, {
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(textVr.metadata.description, {
      safetyRegionName: vrName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={siteText.veiligheidsregio_layout.headings.besmettingen}
            screenReaderCategory={siteText.sidebar.metrics.positive_tests.title}
            title={replaceVariablesInText(textVr.titel, {
              safetyRegion: vrName,
            })}
            icon={<Test />}
            description={textVr.pagina_toelichting}
            metadata={{
              datumsText: textVr.datums,
              dateOrRange: dataOverallLastValue.date_unix,
              dateOfInsertionUnix: dataOverallLastValue.date_of_insertion_unix,
              dataSources: [textVr.bronnen.rivm],
            }}
            referenceLink={textVr.reference.href}
            articles={content.articles}
            vrNameOrGmName={vrName}
            warning={textVr.warning}
          />

          <TwoKpiSection>
            <KpiTile
              title={textVr.infected_kpi.title}
              metadata={{
                date: dataOverallLastValue.date_unix,
                source: textVr.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_moving_average"
                absolute={dataOverallLastValue.infected_moving_average_rounded}
                isAmount
              />

              <Markdown content={textVr.infected_kpi.description} />

              <Box spacing={3}>
                <Text variant="body2" fontWeight="bold">
                  {replaceComponentsInText(
                    textVr.infected_kpi.last_value_text,
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
                </Text>
                {textVr.infected_kpi.link_cta && (
                  <Markdown content={textVr.infected_kpi.link_cta} />
                )}
              </Box>
            </KpiTile>

            <KpiTile
              title={textVr.percentage_kpi.title}
              metadata={{
                date: dataGgdLastValue.date_unix,
                source: textVr.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_percentage_moving_average"
                percentage={dataGgdLastValue.infected_percentage_moving_average}
                isAmount
              />

              <Markdown content={textVr.percentage_kpi.description} />

              <Box spacing={3}>
                <Text variant="body2" fontWeight="bold">
                  {replaceComponentsInText(
                    textVr.percentage_kpi.last_value_text,
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
                {textVr.percentage_kpi.link_cta && (
                  <Markdown content={textVr.percentage_kpi.link_cta} />
                )}
              </Box>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            title={textVr.linechart_titel}
            description={textVr.linechart_toelichting}
            metadata={{
              source: textVr.bronnen.rivm,
            }}
            timeframeOptions={[TimeframeOption.ALL, TimeframeOption.FIVE_WEEKS]}
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
              title={replaceVariablesInText(textVr.map_titel, {
                safetyRegion: vrName,
              })}
              metadata={{
                date: dataOverallLastValue.date_unix,
                source: textVr.bronnen.rivm,
              }}
              description={
                <>
                  <Markdown content={textVr.map_toelichting} />
                  <Text variant="body2" fontWeight="bold">
                    {replaceComponentsInText(textVr.map_last_value_text, {
                      infected_per_100k: (
                        <InlineText color="data.primary">{`${formatNumber(
                          dataOverallLastValue.infected_per_100k
                        )}`}</InlineText>
                      ),
                      dateTo: formatDateFromSeconds(
                        dataOverallLastValue.date_unix,
                        'weekday-medium'
                      ),
                      safetyRegion: vrName,
                    })}
                  </Text>
                </>
              }
              legend={{
                title: textShared.chloropleth_legenda.titel,
                thresholds: thresholds.vr.infected_per_100k,
              }}
            >
              <DynamicChoropleth
                map="gm"
                accessibility={{
                  key: 'confirmed_cases_infected_people_choropleth',
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
                  selectedCode: selectedMunicipalCode,
                }}
              />
            </ChoroplethTile>
          </InView>

          <InView rootMargin="400px">
            <GNumberBarChartTile data={data.g_number} />
          </InView>

          <Divider />

          <PageInformationBlock
            id="ggd"
            title={replaceVariablesInText(textVr.ggd.titel, {
              safetyRegion: vrName,
            })}
            icon={<GgdTesten />}
            description={textVr.ggd.toelichting}
            metadata={{
              datumsText: textVr.ggd.datums,
              dateOfInsertionUnix: dataGgdLastValue.date_of_insertion_unix,
              dateOrRange: dataGgdLastValue.date_unix,
              dataSources: [textVr.ggd.bronnen.rivm],
            }}
            referenceLink={textVr.reference.href}
            articles={content.ggdArticles}
          />

          <TwoKpiSection>
            <KpiTile
              title={textVr.ggd.tests_kpi.title}
              metadata={{
                date: dataGgdLastValue.date_unix,
                source: textVr.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="tested_total_moving_average"
                absolute={dataGgdLastValue.tested_total_moving_average_rounded}
                isAmount
              />

              <Markdown content={textVr.ggd.tests_kpi.description} />

              <Text variant="body2" fontWeight="bold">
                {replaceComponentsInText(textVr.ggd.tests_kpi.last_value_text, {
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
              title={textVr.ggd.percentage_kpi.title}
              metadata={{
                date: dataGgdLastValue.date_unix,
                source: textVr.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_percentage_moving_average"
                percentage={dataGgdLastValue.infected_percentage_moving_average}
                isAmount
              />

              <Markdown content={textVr.ggd.percentage_kpi.description} />

              <Text variant="body2" fontWeight="bold">
                {replaceComponentsInText(
                  textVr.ggd.percentage_kpi.last_value_text,
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
              timeframeOptions={[
                TimeframeOption.ALL,
                TimeframeOption.FIVE_WEEKS,
              ]}
              title={textVr.ggd.linechart_totaltests_titel}
              description={textVr.ggd.linechart_totaltests_toelichting}
              metadata={{
                source: textVr.ggd.bronnen.rivm,
              }}
            >
              {(timeframe) => (
                <TimeSeriesChart
                  accessibility={{
                    key: 'confirmed_cases_tested_total_over_time_chart',
                  }}
                  timeframe={timeframe}
                  values={data.tested_ggd.values}
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty: 'tested_total_moving_average',
                      color: colors.data.secondary,
                      label:
                        textVr.ggd
                          .linechart_totaltests_legend_label_moving_average,
                      shortLabel:
                        textShared.tooltip_labels
                          .ggd_tested_total_moving_average,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'tested_total',
                      color: colors.data.secondary,
                      label: textVr.ggd.linechart_totaltests_legend_label,
                      shortLabel: textShared.tooltip_labels.ggd_tested_total,
                    },
                    {
                      type: 'line',
                      metricProperty: 'infected_moving_average',
                      color: colors.data.primary,
                      label:
                        textVr.ggd
                          .linechart_positivetests_legend_label_moving_average,
                      shortLabel:
                        textShared.tooltip_labels.infected_moving_average,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'infected',
                      color: colors.data.primary,
                      label: textVr.ggd.linechart_positivetests_legend_label,
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
            title={textVr.section_archived.title}
            description={textVr.section_archived.description}
            isArchivedHidden={hasHideArchivedCharts}
            onToggleArchived={() =>
              setHideArchivedCharts(!hasHideArchivedCharts)
            }
          />

          {hasHideArchivedCharts && (
            <InView rootMargin="400px">
              <ChartTile
                title={textVr.ggd.linechart_percentage_titel}
                description={textVr.ggd.linechart_percentage_toelichting}
                metadata={{
                  source: textVr.ggd.bronnen.rivm,
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
      </VrLayout>
    </Layout>
  );
};

export default PositivelyTestedPeople;
