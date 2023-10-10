import { TimeframeOption, TimeframeOptionsList, colors } from '@corona-dashboard/common';
import { Coronavirus } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { ChartTile } from '~/components/chart-tile';
import { InView } from '~/components/in-view';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { WarningTile } from '~/components/warning-tile';
import { GmLayout, Layout } from '~/domain/layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectArchivedGmData } from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceVariablesInText } from '~/utils';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';

const pageMetrics = ['deceased_rivm_archived_20221231'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  textGm: siteText.pages.deceased_page.gm,
  textShared: siteText.pages.deceased_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectArchivedGmData('difference.deceased_rivm__covid_daily_archived_20221231', 'deceased_rivm_archived_20221231', 'code'),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('deceased_page')},
      "elements": ${getElementsQuery('gm', ['deceased_rivm_archived_20221231'], locale)}
     }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'deceasedPageArticles'),
        faqs: getFaqParts(content.parts.pageParts, 'deceasedPageFAQs'),
        dataExplained: getDataExplainedParts(content.parts.pageParts, 'deceasedPageDataExplained'),
        elements: content.elements,
      },
    };
  }
);

const DeceasedMunicipalPage = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, municipalityName, selectedArchivedGmData: data, content, lastGenerated } = props;

  const [deceasedMunicipalTimeframe, setDeceasedMunicipalTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const { commonTexts } = useIntl();
  const { textGm } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...commonTexts.gemeente_index.metadata,
    title: replaceVariablesInText(textGm.metadata.title, {
      municipalityName,
    }),
    description: replaceVariablesInText(textGm.metadata.description, {
      municipalityName,
    }),
  };

  const hasActiveWarningTile = !!textGm.notification.message;

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout code={data.code} municipalityName={municipalityName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
            title={replaceVariablesInText(textGm.section_deceased_rivm.title, {
              municipalityName,
            })}
            icon={<Coronavirus aria-hidden="true" />}
            description={textGm.section_deceased_rivm.description}
            referenceLink={textGm.section_deceased_rivm.reference.href}
            metadata={{
              datumsText: textGm.section_deceased_rivm.datums,
              dateOrRange: data.deceased_rivm_archived_20221231.last_value.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textGm.section_deceased_rivm.bronnen.rivm],
            }}
            vrNameOrGmName={municipalityName}
            warning={textGm.warning}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={textGm.notification.message} variant="informational" />}

          <TwoKpiSection>
            <KpiTile
              title={textGm.section_deceased_rivm.kpi_covid_daily_title}
              metadata={{
                date: data.deceased_rivm_archived_20221231.last_value.date_unix,
                source: textGm.section_deceased_rivm.bronnen.rivm,
              }}
              description={textGm.section_deceased_rivm.kpi_covid_daily_description}
            >
              <KpiValue absolute={data.deceased_rivm_archived_20221231.last_value.covid_daily} difference={data.difference.deceased_rivm__covid_daily_archived_20221231} isAmount />
            </KpiTile>

            <KpiTile
              title={textGm.section_deceased_rivm.kpi_covid_total_title}
              metadata={{
                date: data.deceased_rivm_archived_20221231.last_value.date_unix,
                source: textGm.section_deceased_rivm.bronnen.rivm,
              }}
              description={textGm.section_deceased_rivm.kpi_covid_total_description}
            >
              <KpiValue absolute={data.deceased_rivm_archived_20221231.last_value.covid_total} />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            timeframeOptions={TimeframeOptionsList}
            title={textGm.section_deceased_rivm.line_chart_covid_daily_title}
            description={textGm.section_deceased_rivm.line_chart_covid_daily_description}
            metadata={{ source: textGm.section_deceased_rivm.bronnen.rivm }}
            onSelectTimeframe={setDeceasedMunicipalTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'deceased_over_time_chart',
              }}
              values={data.deceased_rivm_archived_20221231.values}
              timeframe={deceasedMunicipalTimeframe}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'covid_daily_moving_average',
                  label: textGm.section_deceased_rivm.line_chart_covid_daily_legend_trend_label_moving_average,
                  shortLabel: textGm.section_deceased_rivm.line_chart_covid_daily_legend_trend_short_label_moving_average,
                  color: colors.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'covid_daily',
                  label: textGm.section_deceased_rivm.line_chart_covid_daily_legend_trend_label,
                  shortLabel: textGm.section_deceased_rivm.line_chart_covid_daily_legend_trend_short_label,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'deceased_rivm_archived_20221231'),
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
      </GmLayout>
    </Layout>
  );
};

export default DeceasedMunicipalPage;
