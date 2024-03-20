import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { BoldText } from '~/components/typography';
import { Box } from '~/components/base/box';
import { ChartTile } from '~/components/chart-tile';
import { ChartTileToggleItem } from '~/components/chart-tile-toggle';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { colors, ArchivedNlTestedOverallValue, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { createGetArchivedChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectArchivedNlData } from '~/static-props/get-data';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { DynamicChoropleth } from '~/components/choropleth';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { GetStaticPropsContext } from 'next';
import { GgdTesten } from '@corona-dashboard/icons';
import { GNumberBarChartTile } from '~/domain/tested/g-number-bar-chart-tile';
import { InfectedPerAgeGroup } from '~/domain/tested/infected-per-age-group/infected-per-age-group';
import { InView } from '~/components/in-view';
import { Languages, SiteText } from '~/locale';
import { Layout } from '~/domain/layout/layout';
import { Markdown } from '~/components/markdown';
import { NlLayout } from '~/domain/layout/nl-layout';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { space } from '~/style/theme';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { useState } from 'react';
import { WarningTile } from '~/components/warning-tile';

const pageMetrics = ['g_number_archived_20220607', 'tested_ggd_archived_20230321', 'tested_overall_archived_20230331', 'tested_per_age_group_archived_20230331'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.positive_tests_page.nl,
  textShared: siteText.pages.positive_tests_page.shared,
  jsonText: siteText.common.common.metadata.metrics_json_links,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectArchivedNlData('g_number_archived_20220607', 'tested_ggd_archived_20230321', 'tested_overall_archived_20230331', 'tested_per_age_group_archived_20230331'),
  createGetArchivedChoroplethData({
    gm: ({ tested_overall_archived_20230331 }) => ({ tested_overall_archived_20230331 }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
        "parts": ${getPagePartsQuery('positive_tests_page')},
        "elements": ${getElementsQuery('archived_nl', ['tested_overall_archived_20230331', 'tested_ggd_archived_20230321', 'tested_per_age_group_archived_20230331'], locale)}
      }`;
    })(context);
    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'positiveTestsPageArticles'),
        faqs: getFaqParts(content.parts.pageParts, 'positiveTestsPageFAQs'),
        dataExplained: getDataExplainedParts(content.parts.pageParts, 'positiveTestsPageDataExplained'),
        elements: content.elements,
      },
    };
  }
);

function PositivelyTestedPeople(props: StaticProps<typeof getStaticProps>) {
  const { pageText, selectedArchivedNlData: data, archivedChoropleth, content, lastGenerated } = props;

  const [confirmedCasesInfectedTimeframe, setConfirmedCasesInfectedTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [confirmedCasesInfectedPercentageTimeframe, setConfirmedCasesInfectedPercentageTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [confirmedCasesTestedOverTimeTimeframe, setConfirmedCasesTestedOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [confirmedCasesInfectedPerAgeTimeframe, setConfirmedCasesInfectedPerAgeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const { commonTexts, formatNumber, formatDateFromSeconds } = useIntl();
  const reverseRouter = useReverseRouter();

  const { metadataTexts, textNl, textShared, jsonText } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const [selectedGgdGraph, setSelectedGgdGraph] = useState<string>('GGD_infected_percentage_over_time_chart');

  const ggdGraphToggleItems: ChartTileToggleItem[] = [
    {
      label: textNl.ggd.linechart_percentage_toggle_label,
      value: 'GGD_infected_percentage_over_time_chart',
    },
    {
      label: textNl.ggd.linechart_totaltests_toggle_label,
      value: 'GGD_tested_over_time_chart',
    },
  ];

  const archivedDataOverallLastValue = data.tested_overall_archived_20230331.last_value;
  const archivedDataGgdLastValue = data.tested_ggd_archived_20230321.last_value;

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const testedOverallTimeInterval = {
    start: data.tested_overall_archived_20230331.values[0].date_unix,
    end: data.tested_overall_archived_20230331.values[data.tested_overall_archived_20230331.values.length - 1].date_unix,
  };

  const testedGgdTimeInterval = {
    start: data.tested_ggd_archived_20230321.values[0].date_unix,
    end: data.tested_ggd_archived_20230321.values[data.tested_ggd_archived_20230321.values.length - 1].date_unix,
  };

  const testedPerAgeGroupTimeInterval = {
    start: data.tested_per_age_group_archived_20230331.values[0].date_unix,
    end: data.tested_per_age_group_archived_20230331.values[data.tested_per_age_group_archived_20230331.values.length - 1].date_unix,
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
            screenReaderCategory={commonTexts.sidebar.metrics.positive_tests.title}
            title={textNl.titel}
            icon={<GgdTesten aria-hidden="true" />}
            description={textNl.pagina_toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: archivedDataOverallLastValue.date_unix,
              dateOfInsertion: lastInsertionDateOfPage,
              dataSources: [textNl.bronnen.rivm],
              jsonSources: [
                { href: reverseRouter.json.archivedNational(), text: jsonText.metrics_archived_national_json.text },
                { href: reverseRouter.json.archivedGmCollection(), text: jsonText.metrics_archived_gm_collection_json.text },
              ],
            }}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          {!!textShared.warning && <WarningTile isFullWidth message={textShared.warning} variant="informational" />}

          <ChartTile
            title={textNl.linechart_titel}
            description={replaceVariablesInText(textNl.linechart_toelichting, {
              date: formatDateFromSeconds(archivedDataOverallLastValue.date_unix, 'weekday-long'),
              administered_total: formatNumber(archivedDataOverallLastValue.infected),
              infected_total: formatNumber(archivedDataOverallLastValue.infected_moving_average_rounded),
            })}
            metadata={{
              source: textNl.bronnen.rivm,
              dateOfInsertion: getLastInsertionDateOfPage(data, ['tested_overall_archived_20230331']),
              timeInterval: testedOverallTimeInterval,
              isArchivedGraph: true,
            }}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={confirmedCasesInfectedTimeframe}
            onSelectTimeframe={setConfirmedCasesInfectedTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'confirmed_cases_infected_over_time_chart',
              }}
              values={data.tested_overall_archived_20230331.values}
              timeframe={confirmedCasesInfectedTimeframe}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'infected_moving_average',
                  label: textShared.labels.infected_moving_average,
                  color: colors.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'infected',
                  label: textShared.labels.infected,
                  color: colors.primary,
                  yAxisExceptionValues: [1644318000],
                },
              ]}
              dataOptions={{
                outOfBoundsConfig: {
                  label: textNl.labels.infected_out_of_bounds,
                  tooltipLabel: textNl.tooltip_labels.annotations,
                  checkIsOutofBounds: (x: ArchivedNlTestedOverallValue, max: number) => x.infected > max,
                },
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'tested_overall_archived_20230331'),
              }}
            />
          </ChartTile>

          <InView rootMargin="400px">
            {selectedGgdGraph === 'GGD_infected_percentage_over_time_chart' && (
              <ChartTile
                timeframeOptions={TimeframeOptionsList}
                title={textNl.ggd.linechart_percentage_titel}
                description={replaceVariablesInText(textNl.ggd.linechart_percentage_toelichting, {
                  date: formatDateFromSeconds(archivedDataGgdLastValue.date_unix, 'weekday-long'),
                  tested_total: formatNumber(archivedDataGgdLastValue.tested_total),
                  infected_total: formatNumber(archivedDataGgdLastValue.infected),
                })}
                metadata={{
                  date: getLastInsertionDateOfPage(data, ['tested_ggd_archived_20230321']),
                  source: textNl.ggd.bronnen.rivm,
                  dateOfInsertion: getLastInsertionDateOfPage(data, ['tested_ggd_archived_20230321']),
                  timeInterval: testedGgdTimeInterval,
                  isArchivedGraph: true,
                }}
                onSelectTimeframe={setConfirmedCasesInfectedPercentageTimeframe}
                toggle={{
                  initialValue: selectedGgdGraph,
                  items: ggdGraphToggleItems,
                  onChange: (value) => setSelectedGgdGraph(value),
                }}
              >
                <TimeSeriesChart
                  accessibility={{
                    key: 'confirmed_cases_infected_percentage_over_time_chart',
                  }}
                  timeframe={confirmedCasesInfectedPercentageTimeframe}
                  values={data.tested_ggd_archived_20230321.values}
                  forceLegend
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty: 'infected_percentage_moving_average',
                      color: colors.primary,
                      label: textNl.ggd.linechart_percentage_legend_label,
                      shortLabel: textNl.tooltip_labels.ggd_infected_percentage_moving_average,
                    },
                  ]}
                />
              </ChartTile>
            )}
            {selectedGgdGraph === 'GGD_tested_over_time_chart' && (
              <ChartTile
                timeframeOptions={TimeframeOptionsList}
                title={textNl.ggd.linechart_totaltests_titel}
                description={replaceVariablesInText(textNl.ggd.linechart_totaltests_toelichting, {
                  date: formatDateFromSeconds(archivedDataGgdLastValue.date_unix, 'weekday-long'),
                  tested_total: formatNumber(archivedDataGgdLastValue.tested_total),
                  infected_total: formatNumber(archivedDataGgdLastValue.infected),
                })}
                metadata={{
                  source: textNl.ggd.bronnen.rivm,
                  date: getLastInsertionDateOfPage(data, ['tested_ggd_archived_20230321']),
                  dateOfInsertion: getLastInsertionDateOfPage(data, ['tested_per_age_group_archived_20230331']),
                  timeInterval: testedGgdTimeInterval,
                }}
                onSelectTimeframe={setConfirmedCasesTestedOverTimeTimeframe}
                toggle={{
                  initialValue: selectedGgdGraph,
                  items: ggdGraphToggleItems,
                  onChange: (value) => setSelectedGgdGraph(value),
                }}
              >
                <TimeSeriesChart
                  accessibility={{
                    key: 'confirmed_cases_tested_over_time_chart',
                  }}
                  timeframe={confirmedCasesTestedOverTimeTimeframe}
                  values={data.tested_ggd_archived_20230321.values}
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty: 'tested_total_moving_average',
                      color: colors.secondary,
                      label: textNl.ggd.linechart_totaltests_legend_label_moving_average,
                      shortLabel: textNl.tooltip_labels.ggd_tested_total_moving_average__renamed,
                    },
                    {
                      type: 'line',
                      metricProperty: 'infected_moving_average',
                      color: colors.primary,
                      label: textNl.ggd.linechart_positivetests_legend_label_moving_average,
                      shortLabel: textNl.tooltip_labels.infected_moving_average,
                    },
                  ]}
                />
              </ChartTile>
            )}
          </InView>

          <InView rootMargin="400px">
            <ChartTile
              title={textNl.infected_per_age_group.title}
              description={textNl.infected_per_age_group.description}
              timeframeOptions={TimeframeOptionsList}
              metadata={{
                source: textNl.bronnen.rivm,
                dateOfInsertion: getLastInsertionDateOfPage(data, ['tested_per_age_group_archived_20230331']),
                timeInterval: testedPerAgeGroupTimeInterval,
              }}
              onSelectTimeframe={setConfirmedCasesInfectedPerAgeTimeframe}
            >
              <InfectedPerAgeGroup
                accessibility={{
                  key: 'confirmed_cases_infected_per_age_group_over_time_chart',
                }}
                values={data.tested_per_age_group_archived_20230331.values}
                timeframe={confirmedCasesInfectedPerAgeTimeframe}
                timelineEvents={getTimelineEvents(content.elements.timeSeries, 'tested_per_age_group_archived_20230331')}
                text={textNl}
              />
            </ChartTile>
          </InView>

          <InView rootMargin="400px">
            <ChoroplethTile
              title={textNl.map_titel}
              metadata={{
                date: archivedDataOverallLastValue.date_unix,
                source: textNl.bronnen.rivm,
              }}
              description={
                <>
                  <Markdown content={textNl.map_toelichting} />
                  <Box marginBottom={space[3]}>
                    {replaceComponentsInText(textNl.map_last_value_text, {
                      infected_per_100k: <BoldText>{`${formatNumber(archivedDataOverallLastValue.infected_per_100k)}`}</BoldText>,
                      dateTo: formatDateFromSeconds(archivedDataOverallLastValue.date_unix, 'weekday-long'),
                    })}
                  </Box>
                </>
              }
              legend={{
                title: textShared.chloropleth_legenda_titel,
                thresholds: thresholds.gm.infected_per_100k,
              }}
            >
              <DynamicChoropleth
                map="gm"
                accessibility={{
                  key: 'confirmed_cases_municipal_choropleth',
                }}
                data={archivedChoropleth.gm.tested_overall_archived_20230331}
                dataConfig={{
                  metricName: 'tested_overall_archived_20230331',
                  metricProperty: 'infected_per_100k',
                  dataFormatters: {
                    infected: formatNumber,
                    infected_per_100k: formatNumber,
                  },
                }}
                dataOptions={{
                  getLink: reverseRouter.gm.positieveTesten,
                }}
              />
            </ChoroplethTile>
          </InView>

          <InView rootMargin="400px">
            <GNumberBarChartTile data={data.g_number_archived_20220607} />
          </InView>

          {content.faqs && content.faqs.questions?.length > 0 && <PageFaqTile questions={content.faqs.questions} title={content.faqs.sectionTitle} />}

          {content.articles && content.articles.articles?.length > 0 && (
            <InView rootMargin="400px">
              <PageArticlesTile articles={content.articles.articles} title={content.articles.sectionTitle} />
            </InView>
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
}

export default PositivelyTestedPeople;
