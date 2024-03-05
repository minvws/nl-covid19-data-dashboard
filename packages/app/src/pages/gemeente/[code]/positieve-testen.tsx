import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { CollapsibleContent } from '~/components/collapsible/collapsible-content';
import { colors, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { createGetArchivedChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectGmData, selectArchivedGmData } from '~/static-props/get-data';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { DynamicChoropleth } from '~/components/choropleth';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { filterByRegionMunicipalities } from '~/static-props/utils/filter-by-region-municipalities';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getMunicipalityJsonLink } from '~/utils/get-json-links';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { GetStaticPropsContext } from 'next';
import { GgdTesten } from '@corona-dashboard/icons';
import { GmLayout, Layout } from '~/domain/layout';
import { InView } from '~/components/in-view';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Languages, SiteText } from '~/locale';
import { Markdown } from '~/components/markdown';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { replaceComponentsInText, replaceVariablesInText, useReverseRouter } from '~/utils';
import { Text } from '~/components/typography';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useIntl } from '~/intl';
import { useState } from 'react';
import { WarningTile } from '~/components/warning-tile';

export { getStaticPaths } from '~/static-paths/gm';

const selectLokalizeTexts = (siteText: SiteText) => ({
  textGm: siteText.pages.positive_tests_page.gm,
  textShared: siteText.pages.positive_tests_page.shared,
  jsonText: siteText.common.common.metadata.metrics_json_links,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

const pageMetrics = ['tested_overall_archived_20230331'];

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectGmData('code', 'static_values.population_count'),
  selectArchivedGmData('tested_overall_archived_20230331'),
  createGetArchivedChoroplethData({
    gm: ({ tested_overall_archived_20230331 }, context) => ({
      tested_overall_archived_20230331: filterByRegionMunicipalities(tested_overall_archived_20230331, context),
    }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
        "parts": ${getPagePartsQuery('positive_tests_page')},
        "elements": ${getElementsQuery('archived_gm', ['tested_overall_archived_20230331'], locale)}
      }`;
    })(context);
    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'positiveTestsPageArticles'),
        faqs: getFaqParts(content.parts.pageParts, 'positiveTestsPageFAQs'),
        dataExplained: getDataExplainedParts(content.parts.pageParts, 'positiveTestsPageDataExplained'),
        elements: content.elements,
      },
    } as const;
  }
);

function PositivelyTestedPeople(props: StaticProps<typeof getStaticProps>) {
  const { pageText, selectedGmData: data, selectedArchivedGmData: archivedData, archivedChoropleth, municipalityName, content, lastGenerated } = props;
  const [positivelyTestedPeopleTimeframe, setpositivelyTestedPeopleTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);
  const { commonTexts, formatNumber, formatDateFromSeconds } = useIntl();
  const reverseRouter = useReverseRouter();
  const { textGm, textShared, jsonText } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const archivedLastValue = archivedData.tested_overall_archived_20230331.last_value;
  const populationCount = data.static_values.population_count;
  const metadata = {
    ...commonTexts.gemeente_index.metadata,
    title: replaceVariablesInText(textGm.metadata.title, {
      municipalityName,
    }),
    description: replaceVariablesInText(textGm.metadata.description, {
      municipalityName,
    }),
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(archivedData, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout code={data.code} municipalityName={municipalityName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
            title={replaceVariablesInText(textGm.titel, {
              municipality: municipalityName,
            })}
            icon={<GgdTesten aria-hidden="true" />}
            description={textGm.pagina_toelichting}
            metadata={{
              datumsText: textGm.datums,
              dateOrRange: archivedLastValue.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textGm.bronnen.rivm],
              jsonSources: [
                getMunicipalityJsonLink(reverseRouter.json.municipality(data.code), jsonText.metrics_municipality_json.text),
                getMunicipalityJsonLink(reverseRouter.json.archivedMunicipality(data.code), jsonText.metrics_archived_municipality_json.text),
                { href: reverseRouter.json.archivedGmCollection(), text: jsonText.metrics_archived_gm_collection_json.text },
              ],
            }}
            vrNameOrGmName={municipalityName}
            warning={textGm.warning}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          {!!textShared.warning && <WarningTile isFullWidth message={textShared.warning} variant="informational" />}

          <TwoKpiSection>
            <KpiTile
              title={textGm.infected_kpi.title}
              metadata={{
                date: archivedLastValue.date_unix,
                source: textGm.bronnen.rivm,
              }}
            >
              <KpiValue absolute={archivedLastValue.infected_moving_average_rounded} isAmount />
              <Text>
                {replaceComponentsInText(commonTexts.gemeente_index.population_count, {
                  municipalityName,
                  populationCount: <strong>{formatNumber(populationCount)}</strong>,
                })}
              </Text>
              <Markdown content={textGm.infected_kpi.description} />

              <Box spacing={3}>
                <Markdown
                  content={replaceVariablesInText(textGm.infected_kpi.last_value_text, {
                    infected: formatNumber(archivedLastValue.infected),
                    dateTo: formatDateFromSeconds(archivedLastValue.date_unix, 'weekday-long'),
                  })}
                />
                {textGm.infected_kpi.link_cta && <Markdown content={textGm.infected_kpi.link_cta} />}
              </Box>
            </KpiTile>

            <KpiTile
              title={textGm.barscale_titel}
              metadata={{
                date: archivedLastValue.date_unix,
                source: textGm.bronnen.rivm,
              }}
            >
              <KpiValue absolute={archivedLastValue.infected_per_100k_moving_average} isAmount />
              <Text>{textGm.barscale_toelichting}</Text>

              <CollapsibleContent label={commonTexts.gemeente_index.population_count_explanation_title}>
                <Text>
                  {replaceComponentsInText(textGm.population_count_explanation, {
                    municipalityName: <strong>{municipalityName}</strong>,
                    value: <strong>{formatNumber(archivedLastValue.infected_per_100k_moving_average)}</strong>,
                  })}
                </Text>
              </CollapsibleContent>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            title={textGm.linechart_titel}
            description={textGm.linechart_toelichting}
            metadata={{
              source: textGm.bronnen.rivm,
            }}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={positivelyTestedPeopleTimeframe}
            onSelectTimeframe={setpositivelyTestedPeopleTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'confirmed_cases_infected_over_time_chart',
              }}
              values={archivedData.tested_overall_archived_20230331.values}
              timeframe={positivelyTestedPeopleTimeframe}
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
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'tested_overall_archived_20230331'),
              }}
            />
          </ChartTile>

          <InView rootMargin="400px">
            <ChoroplethTile
              title={replaceVariablesInText(textGm.map_titel, {
                municipality: municipalityName,
              })}
              description={
                <>
                  <Markdown content={textGm.map_toelichting} />
                  <Markdown
                    content={replaceVariablesInText(textGm.map_last_value_text, {
                      infected_per_100k: formatNumber(archivedLastValue.infected_per_100k),
                      municipality: municipalityName,
                    })}
                  />
                </>
              }
              legend={{
                thresholds: thresholds.gm.infected_per_100k,
                title: textShared.chloropleth_legenda_titel,
              }}
              metadata={{
                date: archivedLastValue.date_unix,
                source: textGm.bronnen.rivm,
              }}
            >
              <DynamicChoropleth
                map="gm"
                accessibility={{
                  key: 'confirmed_cases_choropleth',
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
                  selectedCode: data.code,
                  highlightSelection: true,
                  getLink: reverseRouter.gm.positieveTesten,
                }}
              />
            </ChoroplethTile>
          </InView>

          {content.faqs && content.faqs.questions?.length > 0 && <PageFaqTile questions={content.faqs.questions} title={content.faqs.sectionTitle} />}

          {content.articles && content.articles.articles?.length > 0 && (
            <InView rootMargin="400px">
              <PageArticlesTile articles={content.articles.articles} title={content.articles.sectionTitle} />
            </InView>
          )}
        </TileList>
      </GmLayout>
    </Layout>
  );
}

export default PositivelyTestedPeople;
