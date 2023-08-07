import { colors, NlTestedOverallValue, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { GgdTesten } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { Box } from '~/components/base/box';
import { ChartTile } from '~/components/chart-tile';
import { ChartTileToggleItem } from '~/components/chart-tile-toggle';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { InView } from '~/components/in-view';
import { Markdown } from '~/components/markdown';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { BoldText } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { GNumberBarChartTile } from '~/domain/tested/g-number-bar-chart-tile';
import { InfectedPerAgeGroup } from '~/domain/tested/infected-per-age-group/infected-per-age-group';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectNlData } from '~/static-props/get-data';
import { space } from '~/style/theme';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

const pageMetrics = ['g_number', 'tested_ggd', 'tested_overall', 'tested_per_age_group'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.positive_tests_page.nl,
  textShared: siteText.pages.positive_tests_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData(
    'difference.tested_ggd__infected_percentage_moving_average',
    'difference.tested_ggd__tested_total_moving_average',
    'difference.tested_overall__infected_moving_average',
    'difference.tested_overall__infected_per_100k_moving_average',
    'g_number',
    'tested_ggd',
    'tested_overall',
    'tested_per_age_group'
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
        "parts": ${getPagePartsQuery('positive_tests_page')},
        "elements": ${getElementsQuery('nl', ['tested_overall', 'tested_ggd', 'tested_per_age_group'], locale)}
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
  const { pageText, selectedNlData: data, choropleth, content, lastGenerated } = props;

  const [confirmedCasesInfectedTimeframe, setConfirmedCasesInfectedTimeframe] = useState<TimeframeOption>(TimeframeOption.SIX_MONTHS);

  const [confirmedCasesInfectedPercentageTimeframe, setConfirmedCasesInfectedPercentageTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [confirmedCasesTestedOverTimeTimeframe, setConfirmedCasesTestedOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [confirmedCasesInfectedPerAgeTimeframe, setConfirmedCasesInfectedPerAgeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const { commonTexts, formatNumber, formatDateFromSeconds } = useIntl();
  const reverseRouter = useReverseRouter();

  const { metadataTexts, textNl, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

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

  const dataOverallLastValue = data.tested_overall.last_value;
  const dataGgdLastValue = data.tested_ggd.last_value;

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
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
              dateOrRange: dataOverallLastValue.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textNl.bronnen.rivm],
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
              date: formatDateFromSeconds(dataOverallLastValue.date_unix, 'weekday-long'),
              administered_total: formatNumber(dataOverallLastValue.infected),
              infected_total: formatNumber(dataOverallLastValue.infected_moving_average_rounded),
            })}
            metadata={{
              source: textNl.bronnen.rivm,
            }}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={confirmedCasesInfectedTimeframe}
            onSelectTimeframe={setConfirmedCasesInfectedTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'confirmed_cases_infected_over_time_chart',
              }}
              values={data.tested_overall.values}
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
                  checkIsOutofBounds: (x: NlTestedOverallValue, max: number) => x.infected > max,
                },
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'tested_overall'),
              }}
            />
          </ChartTile>

          <InView rootMargin="400px">
            {selectedGgdGraph === 'GGD_infected_percentage_over_time_chart' && (
              <ChartTile
                timeframeOptions={TimeframeOptionsList}
                title={textNl.ggd.linechart_percentage_titel}
                description={replaceVariablesInText(textNl.ggd.linechart_percentage_toelichting, {
                  date: formatDateFromSeconds(dataGgdLastValue.date_unix, 'weekday-long'),
                  tested_total: formatNumber(dataGgdLastValue.tested_total),
                  infected_total: formatNumber(dataGgdLastValue.infected),
                })}
                metadata={{
                  date: getLastInsertionDateOfPage(data, ['tested_ggd']),
                  source: textNl.ggd.bronnen.rivm,
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
                  values={data.tested_ggd.values}
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
                  date: formatDateFromSeconds(dataGgdLastValue.date_unix, 'weekday-long'),
                  tested_total: formatNumber(dataGgdLastValue.tested_total),
                  infected_total: formatNumber(dataGgdLastValue.infected),
                })}
                metadata={{
                  source: textNl.ggd.bronnen.rivm,
                  date: getLastInsertionDateOfPage(data, ['tested_ggd']),
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
                  values={data.tested_ggd.values}
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
              }}
              onSelectTimeframe={setConfirmedCasesInfectedPerAgeTimeframe}
            >
              <InfectedPerAgeGroup
                accessibility={{
                  key: 'confirmed_cases_infected_per_age_group_over_time_chart',
                }}
                values={data.tested_per_age_group.values}
                timeframe={confirmedCasesInfectedPerAgeTimeframe}
                timelineEvents={getTimelineEvents(content.elements.timeSeries, 'tested_per_age_group')}
                text={textNl}
              />
            </ChartTile>
          </InView>

          <InView rootMargin="400px">
            <ChoroplethTile
              title={textNl.map_titel}
              metadata={{
                date: dataOverallLastValue.date_unix,
                source: textNl.bronnen.rivm,
              }}
              description={
                <>
                  <Markdown content={textNl.map_toelichting} />
                  <Box marginBottom={space[3]}>
                    {replaceComponentsInText(textNl.map_last_value_text, {
                      infected_per_100k: <BoldText>{`${formatNumber(dataOverallLastValue.infected_per_100k)}`}</BoldText>,
                      dateTo: formatDateFromSeconds(dataOverallLastValue.date_unix, 'weekday-long'),
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
                  getLink: reverseRouter.gm.positiefTesten,
                }}
              />
            </ChoroplethTile>
          </InView>

          <InView rootMargin="400px">
            <GNumberBarChartTile data={data.g_number} />
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
