import { TimeframeOption, TimeframeOptionsList, colors } from '@corona-dashboard/common';
import { Coronavirus } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { AgeDemographic } from '~/components/age-demographic';
import { Box } from '~/components/base/box';
import { ChartTile } from '~/components/chart-tile';
import { InView } from '~/components/in-view';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { DeceasedMonitorSection } from '~/domain/deceased';
import { Layout, NlLayout } from '~/domain/layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectNlData, selectArchivedNlData } from '~/static-props/get-data';
import { space } from '~/style/theme';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';

const pageMetrics = ['deceased_cbs', 'deceased_rivm_per_age_group_archived_20221231', 'deceased_rivm_archived_20221231'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.deceased_page.nl,
  textShared: siteText.pages.deceased_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData('deceased_cbs'),
  selectArchivedNlData('deceased_rivm_per_age_group_archived_20221231', 'deceased_rivm_archived_20221231', 'difference.deceased_rivm__covid_daily_archived_20221231'),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('deceased_page')},
      "elements": ${getElementsQuery('nl', ['deceased_rivm_archived_20221231'], locale)}
     }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'deceasedMonitorArticles'),
        faqs: getFaqParts(content.parts.pageParts, 'deceasedPageFAQs'),
        dataExplained: getDataExplainedParts(content.parts.pageParts, 'deceasedPageDataExplained'),
        elements: content.elements,
      },
    };
  }
);

const DeceasedNationalPage = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedNlData: currentData, selectedArchivedNlData: archivedData, lastGenerated, content } = props;

  const [deceasedOverTimeTimeframe, setDeceasedOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);
  const [isArchivedContentShown, setIsArchivedContentShown] = useState<boolean>(false);

  const dataCbs = currentData.deceased_cbs;
  const dataRivm = archivedData.deceased_rivm_archived_20221231;
  const dataDeceasedPerAgeGroup = archivedData.deceased_rivm_per_age_group_archived_20221231;

  const { commonTexts, formatPercentage } = useIntl();
  const { metadataTexts, textNl, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const hasActiveWarningTile = !!textShared.notification.message;

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(archivedData, pageMetrics);

  const lastdeceasedPerAgeGroupInsertionDate = getLastInsertionDateOfPage(archivedData, ['deceased_rivm_per_age_group_archived_20221231']);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.development_of_the_virus.title}
            title={textNl.section_sterftemonitor.title}
            icon={<Coronavirus />}
            description={textNl.section_sterftemonitor.description}
            referenceLink={textNl.section_sterftemonitor.reference.href}
            metadata={{
              datumsText: textNl.section_sterftemonitor.datums,
              dateOrRange: {
                start: dataCbs.last_value.date_start_unix,
                end: dataCbs.last_value.date_end_unix,
              },
              dateOfInsertionUnix: dataCbs.last_value.date_of_insertion_unix,
              dataSources: [textNl.section_sterftemonitor.bronnen.cbs],
            }}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={textShared.notification.message} variant="informational" />}

          <DeceasedMonitorSection data={dataCbs} text={textNl.section_sterftemonitor} showCauseMessage />

          {content.faqs && content.faqs.questions?.length > 0 && <PageFaqTile questions={content.faqs.questions} title={content.faqs.sectionTitle} />}

          {content.articles && content.articles.articles?.length > 0 && (
            <InView rootMargin="400px">
              <PageArticlesTile articles={content.articles.articles} title={content.articles.sectionTitle} />
            </InView>
          )}

          <PageInformationBlock
            title={textNl.section_archived.title}
            description={textNl.section_archived.description}
            isArchivedHidden={isArchivedContentShown}
            onToggleArchived={() => setIsArchivedContentShown(!isArchivedContentShown)}
          />

          {isArchivedContentShown && (
            <Box borderTop={`2px solid ${colors.gray2}`} spacing={5} paddingTop={space[4]}>
              <PageInformationBlock
                title={textNl.section_deceased_rivm.title}
                icon={<Coronavirus aria-hidden="true" />}
                description={textNl.section_deceased_rivm.description}
                referenceLink={textNl.section_deceased_rivm.reference.href}
                metadata={{
                  datumsText: textNl.section_deceased_rivm.datums,
                  dateOrRange: dataRivm.last_value.date_unix,
                  dateOfInsertionUnix: lastInsertionDateOfPage,
                  dataSources: [textNl.section_deceased_rivm.bronnen.rivm],
                }}
              />

              <TwoKpiSection>
                <KpiTile
                  title={textNl.section_deceased_rivm.kpi_covid_daily_title}
                  metadata={{
                    date: dataRivm.last_value.date_unix,
                    source: textNl.section_deceased_rivm.bronnen.rivm,
                  }}
                >
                  <KpiValue absolute={dataRivm.last_value.covid_daily} difference={archivedData.difference.deceased_rivm__covid_daily_archived_20221231} isAmount />
                  <Markdown content={textNl.section_deceased_rivm.kpi_covid_daily_description} />
                </KpiTile>
                <KpiTile
                  title={textNl.section_deceased_rivm.kpi_covid_total_title}
                  metadata={{
                    date: dataRivm.last_value.date_unix,
                    source: textNl.section_deceased_rivm.bronnen.rivm,
                  }}
                >
                  <KpiValue absolute={dataRivm.last_value.covid_total} />
                  <Text>{textNl.section_deceased_rivm.kpi_covid_total_description}</Text>
                </KpiTile>
              </TwoKpiSection>

              <ChartTile
                timeframeOptions={TimeframeOptionsList}
                title={textNl.section_deceased_rivm.line_chart_covid_daily_title}
                description={textNl.section_deceased_rivm.line_chart_covid_daily_description}
                metadata={{
                  source: textNl.section_deceased_rivm.bronnen.rivm,
                }}
                onSelectTimeframe={setDeceasedOverTimeTimeframe}
              >
                <TimeSeriesChart
                  accessibility={{
                    key: 'deceased_over_time_chart',
                  }}
                  values={dataRivm.values}
                  timeframe={deceasedOverTimeTimeframe}
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty: 'covid_daily_moving_average',
                      label: textNl.section_deceased_rivm.line_chart_covid_daily_legend_trend_label_moving_average,
                      shortLabel: textNl.section_deceased_rivm.line_chart_covid_daily_legend_trend_short_label_moving_average,
                      color: colors.primary,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'covid_daily',
                      label: textNl.section_deceased_rivm.line_chart_covid_daily_legend_trend_label,
                      shortLabel: textNl.section_deceased_rivm.line_chart_covid_daily_legend_trend_short_label,
                      color: colors.primary,
                    },
                  ]}
                  dataOptions={{
                    timelineEvents: getTimelineEvents(content.elements.timeSeries, 'deceased_rivm_archived_20221231'),
                  }}
                />
              </ChartTile>

              <ChartTile
                title={textNl.age_groups.title}
                description={textNl.age_groups.description}
                metadata={{
                  date: lastdeceasedPerAgeGroupInsertionDate,
                  source: textNl.age_groups.bronnen.rivm,
                }}
              >
                <AgeDemographic
                  accessibility={{
                    key: 'deceased_per_age_group_over_time_chart',
                  }}
                  data={dataDeceasedPerAgeGroup}
                  rightMetricProperty="covid_percentage"
                  leftMetricProperty="age_group_percentage"
                  rightColor={colors.primary}
                  leftColor={colors.neutral}
                  maxDisplayValue={60}
                  text={textNl.age_groups.graph}
                  formatValue={(a: number) => `${formatPercentage(a * 100)}%`}
                />
              </ChartTile>
            </Box>
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default DeceasedNationalPage;
