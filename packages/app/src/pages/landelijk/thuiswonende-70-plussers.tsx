import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { ChartTile } from '~/components/chart-tile';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { colors } from '@corona-dashboard/common';
import { createGetArchivedChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectArchivedNlData } from '~/static-props/get-data';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { Divider } from '~/components/divider';
import { DynamicChoropleth } from '~/components/choropleth';
import { Elderly } from '@corona-dashboard/icons';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { GetStaticPropsContext } from 'next';
import { InView } from '~/components/in-view';
import { Languages, SiteText } from '~/locale';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils';
import { WarningTile } from '~/components/warning-tile';

const pageMetrics = ['elderly_at_home_archived_20230126'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.elderly_at_home_page.nl,
  jsonText: siteText.common.common.metadata.metrics_json_links,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectArchivedNlData('elderly_at_home_archived_20230126'),
  createGetArchivedChoroplethData({
    vr: ({ elderly_at_home_archived_20230126 }) => ({ elderly_at_home_archived_20230126 }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('elderly_at_home_page')},
      "elements": ${getElementsQuery('nl', ['elderly_at_home_archived_20230126'], locale)}
     }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'elderlyAtHomePageArticles'),
        faqs: getFaqParts(content.parts.pageParts, 'elderlyAtHomePageFAQs'),
        dataExplained: getDataExplainedParts(content.parts.pageParts, 'elderlyAtHomePageDataExplained'),
        elements: content.elements,
      },
    };
  }
);

function ElderlyAtHomeNationalPage(props: StaticProps<typeof getStaticProps>) {
  const reverseRouter = useReverseRouter();
  const { pageText, selectedArchivedNlData: data, archivedChoropleth, lastGenerated, content } = props;

  const elderlyAtHomeData = data.elderly_at_home_archived_20230126;

  const elderlyAtHomeInfectedUnderReportedRange = getBoundaryDateStartUnix(elderlyAtHomeData.values, 4);

  const elderlyAtHomeDeceasedUnderReportedRange = getBoundaryDateStartUnix(elderlyAtHomeData.values, 7);

  const { commonTexts, formatNumber } = useIntl();
  const { metadataTexts, textNl, jsonText } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const metadataTimeframePeriod = { start: elderlyAtHomeData.values[0].date_unix, end: elderlyAtHomeData.values[elderlyAtHomeData.values.length - 1].date_unix };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  const hasActiveWarningTile = !!textNl.belangrijk_bericht;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
            screenReaderCategory={commonTexts.sidebar.metrics.elderly_at_home.title}
            title={textNl.section_positive_tested.title}
            icon={<Elderly aria-hidden="true" />}
            description={textNl.section_positive_tested.description}
            metadata={{
              datumsText: textNl.section_positive_tested.datums,
              dateOrRange: elderlyAtHomeData.last_value.date_unix,
              dateOfInsertion: lastInsertionDateOfPage,
              dataSources: [textNl.section_positive_tested.bronnen.rivm],
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

          {hasActiveWarningTile && <WarningTile isFullWidth message={textNl.belangrijk_bericht} variant="informational" />}

          <ChartTile
            title={textNl.section_positive_tested.line_chart_daily_title}
            metadata={{ source: textNl.section_positive_tested.bronnen.rivm, dateOfInsertion: lastInsertionDateOfPage, timeframePeriod: metadataTimeframePeriod, isArchived: true }}
            description={textNl.section_positive_tested.line_chart_daily_description}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'elderly_at_home_confirmed_cases_over_time_chart',
              }}
              values={elderlyAtHomeData.values}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'positive_tested_daily_moving_average',
                  label: textNl.section_positive_tested.line_chart_positive_tested_daily_moving_average,
                  shortLabel: textNl.section_positive_tested.line_chart_positive_tested_daily_moving_average_short_label,
                  color: colors.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'positive_tested_daily',
                  label: textNl.section_positive_tested.line_chart_legend_trend_label,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: elderlyAtHomeInfectedUnderReportedRange,
                    end: Infinity,
                    label: textNl.section_deceased.line_chart_legend_inaccurate_label,
                    shortLabel: commonTexts.common.incomplete,
                    cutValuesForMetricProperties: ['positive_tested_daily_moving_average'],
                  },
                ],
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'elderly_at_home_archived_20230126', 'positive_tested_daily'),
              }}
            />
          </ChartTile>
          <ChoroplethTile
            title={textNl.section_positive_tested.choropleth_daily_title}
            description={textNl.section_positive_tested.choropleth_daily_description}
            metadata={{
              timeframePeriod: elderlyAtHomeData.last_value.date_unix,
              dateOfInsertion: elderlyAtHomeData.last_value.date_of_insertion_unix,
              source: textNl.section_positive_tested.bronnen.rivm,
              isTimeframePeriodKpi: true,
              isArchived: true,
            }}
            legend={{
              thresholds: thresholds.vr.positive_tested_daily_per_100k,
              title: textNl.section_positive_tested.choropleth_daily_legenda,
            }}
          >
            <DynamicChoropleth
              map="vr"
              accessibility={{
                key: 'elderly_at_home_infected_people_choropleth',
              }}
              data={archivedChoropleth.vr.elderly_at_home_archived_20230126}
              dataConfig={{
                metricName: 'elderly_at_home_archived_20230126',
                metricProperty: 'positive_tested_daily_per_100k',
                dataFormatters: {
                  positive_tested_daily_per_100k: formatNumber,
                },
              }}
            />
          </ChoroplethTile>
          <Divider />
          <PageInformationBlock
            title={textNl.section_deceased.title}
            icon={<Elderly />}
            description={textNl.section_deceased.description}
            metadata={{
              datumsText: textNl.section_deceased.datums,
              dateOrRange: elderlyAtHomeData.last_value.date_unix,
              dateOfInsertion: elderlyAtHomeData.last_value.date_of_insertion_unix,
              dataSources: [textNl.section_deceased.bronnen.rivm],
            }}
            referenceLink={textNl.section_deceased.reference.href}
          />
          <ChartTile
            title={textNl.section_deceased.line_chart_daily_title}
            metadata={{ source: textNl.section_positive_tested.bronnen.rivm, dateOfInsertion: lastInsertionDateOfPage, timeframePeriod: metadataTimeframePeriod, isArchived: true }}
            description={textNl.section_deceased.line_chart_daily_description}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'elderly_at_home_confirmed_cases_over_time_chart',
              }}
              values={elderlyAtHomeData.values}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'deceased_daily_moving_average',
                  label: textNl.section_deceased.line_chart_deceased_daily_moving_average,
                  shortLabel: textNl.section_deceased.line_chart_deceased_daily_moving_average_short_label,
                  color: colors.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'deceased_daily',
                  label: textNl.section_deceased.line_chart_legend_trend_label,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: elderlyAtHomeDeceasedUnderReportedRange,
                    end: Infinity,
                    label: textNl.section_deceased.line_chart_legend_inaccurate_label,
                    shortLabel: commonTexts.common.incomplete,
                    cutValuesForMetricProperties: ['deceased_daily_moving_average'],
                  },
                ],
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'elderly_at_home_archived_20230126', 'deceased_daily'),
              }}
            />
          </ChartTile>

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

export default ElderlyAtHomeNationalPage;
