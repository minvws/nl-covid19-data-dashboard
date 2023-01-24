import { TimeframeOption, TimeframeOptionsList, colors } from '@corona-dashboard/common';
import { Coronavirus } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { AgeDemographic, ChartTile, KpiTile, KpiValue, Markdown, PageInformationBlock, TileList, TimeSeriesChart, TwoKpiSection, WarningTile } from '~/components';
import { Text } from '~/components/typography';
import { DeceasedMonitorSection } from '~/domain/deceased';
import { Layout, NlLayout } from '~/domain/layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectNlData } from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';

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
  selectNlData('deceased_cbs', 'deceased_rivm_per_age_group_archived_20221231', 'deceased_rivm_archived_20221231', 'difference.deceased_rivm__covid_daily_archived_20221231'),
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
        mainArticles: getArticleParts(content.parts.pageParts, 'deceasedPageArticles'),
        monitorArticles: getArticleParts(content.parts.pageParts, 'deceasedMonitorArticles'),
        elements: content.elements,
      },
    };
  }
);

const DeceasedNationalPage = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedNlData: data, lastGenerated, content } = props;

  const [deceasedOverTimeTimeframe, setDeceasedOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);
  const [isArchivedContentShown, setIsArchivedContentShown] = useState<boolean>(false);

  const dataCbs = data.deceased_cbs;
  const dataRivm = data.deceased_rivm_archived_20221231;
  const dataDeceasedPerAgeGroup = data.deceased_rivm_per_age_group_archived_20221231;

  const { commonTexts, formatPercentage } = useIntl();
  const { metadataTexts, textNl, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const hasActiveWarningTile = !!textShared.notification.message;

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  const lastdeceasedPerAgeGroupInsertionDate = getLastInsertionDateOfPage(data, ['deceased_rivm_per_age_group_archived_20221231']);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            title={textShared.section_sterftemonitor.title}
            icon={<Coronavirus />}
            description={textShared.section_sterftemonitor.description}
            referenceLink={textShared.section_sterftemonitor.reference.href}
            metadata={{
              datumsText: textShared.section_sterftemonitor.datums,
              dateOrRange: {
                start: dataCbs.last_value.date_start_unix,
                end: dataCbs.last_value.date_end_unix,
              },
              dateOfInsertionUnix: dataCbs.last_value.date_of_insertion_unix,
              dataSources: [textShared.section_sterftemonitor.bronnen.cbs],
            }}
            articles={content.monitorArticles}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={textShared.notification.message} variant="emphasis" />}

          <DeceasedMonitorSection data={dataCbs} text={textShared.section_sterftemonitor} showCauseMessage />

          <PageInformationBlock
            title={textShared.section_archived.title}
            description={textShared.section_archived.description}
            isArchivedHidden={isArchivedContentShown}
            onToggleArchived={() => setIsArchivedContentShown(!isArchivedContentShown)}
          />

          {isArchivedContentShown && (
            <>
              <PageInformationBlock
                category={commonTexts.sidebar.categories.development_of_the_virus.title}
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
                articles={content.mainArticles}
              />

              <TwoKpiSection>
                <KpiTile
                  title={textNl.section_deceased_rivm.kpi_covid_daily_title}
                  metadata={{
                    date: dataRivm.last_value.date_unix,
                    source: textNl.section_deceased_rivm.bronnen.rivm,
                  }}
                >
                  <KpiValue data-cy="covid_daily" absolute={dataRivm.last_value.covid_daily} difference={data.difference.deceased_rivm__covid_daily_archived_20221231} isAmount />
                  <Markdown content={textNl.section_deceased_rivm.kpi_covid_daily_description} />
                </KpiTile>
                <KpiTile
                  title={textNl.section_deceased_rivm.kpi_covid_total_title}
                  metadata={{
                    date: dataRivm.last_value.date_unix,
                    source: textNl.section_deceased_rivm.bronnen.rivm,
                  }}
                >
                  <KpiValue data-cy="covid_total" absolute={dataRivm.last_value.covid_total} />
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
                title={textShared.age_groups.title}
                description={textShared.age_groups.description}
                metadata={{
                  date: lastdeceasedPerAgeGroupInsertionDate,
                  source: textShared.age_groups.bronnen.rivm,
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
                  text={textShared.age_groups.graph}
                  formatValue={(a: number) => `${formatPercentage(a * 100)}%`}
                />
              </ChartTile>
            </>
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default DeceasedNationalPage;
