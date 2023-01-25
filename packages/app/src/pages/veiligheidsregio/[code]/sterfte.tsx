import { TimeframeOption, TimeframeOptionsList, colors } from '@corona-dashboard/common';
import { Coronavirus } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { Divider } from '~/components/divider';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { DeceasedMonitorSection } from '~/domain/deceased';
import { Layout, VrLayout } from '~/domain/layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectVrData } from '~/static-props/get-data';
import { space } from '~/style/theme';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceVariablesInText } from '~/utils';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';

const pageMetrics = ['deceased_cbs', 'deceased_rivm_archived_20221231'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  categoryTexts: siteText.common.sidebar.categories.development_of_the_virus.title,
  textVr: siteText.pages.deceased_page.vr,
  textShared: siteText.pages.deceased_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectVrData('deceased_cbs', 'deceased_rivm_archived_20221231', 'difference.deceased_rivm__covid_daily_archived_20221231'),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('deceased_page')},
      "elements": ${getElementsQuery('vr', ['deceased_rivm_archived_20221231'], locale)}
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

const DeceasedRegionalPage = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedVrData: data, vrName, content, lastGenerated } = props;

  const [deceasedMunicipalTimeframe, setDeceasedMunicipalTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);
  const [isArchivedContentShown, setIsArchivedContentShown] = useState<boolean>(false);

  const { deceased_cbs: dataCbs, deceased_rivm_archived_20221231: dataRivm, difference } = data;

  const { commonTexts } = useIntl();
  const { categoryTexts, textVr, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...commonTexts.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(textVr.metadata.title, {
      safetyRegion: vrName,
    }),
    description: replaceVariablesInText(textVr.metadata.description, {
      safetyRegion: vrName,
    }),
  };

  const hasActiveWarningTile = !!textShared.notification.message;

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.development_of_the_virus.title}
            title={textVr.section_sterftemonitor.title}
            icon={<Coronavirus aria-hidden="true" />}
            description={textVr.section_sterftemonitor.description}
            referenceLink={textVr.section_sterftemonitor.reference.href}
            metadata={{
              datumsText: textVr.section_sterftemonitor.datums,
              dateOrRange: {
                start: dataCbs.last_value.date_start_unix,
                end: dataCbs.last_value.date_end_unix,
              },
              dateOfInsertionUnix: dataCbs.last_value.date_of_insertion_unix,
              dataSources: [textVr.section_sterftemonitor.bronnen.cbs],
            }}
            articles={content.monitorArticles}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={textShared.notification.message} variant="informational" />}

          <DeceasedMonitorSection text={textShared.section_sterftemonitor} data={dataCbs} />

          <Divider />

          <PageInformationBlock
            title={textShared.section_archived.title}
            description={textShared.section_archived.description}
            isArchivedHidden={isArchivedContentShown}
            onToggleArchived={() => setIsArchivedContentShown(!isArchivedContentShown)}
          />

          {isArchivedContentShown && (
            <Box borderTop={`2px solid ${colors.gray2}`} spacing={5} paddingTop={space[4]}>
              <PageInformationBlock
                category={categoryTexts}
                title={replaceVariablesInText(textVr.section_deceased_rivm.title, {
                  safetyRegion: vrName,
                })}
                icon={<Coronavirus aria-hidden="true" />}
                description={textVr.section_deceased_rivm.description}
                referenceLink={textVr.section_deceased_rivm.reference.href}
                metadata={{
                  datumsText: textVr.section_deceased_rivm.datums,
                  dateOrRange: dataRivm.last_value.date_unix,
                  dateOfInsertionUnix: lastInsertionDateOfPage,
                  dataSources: [textVr.section_deceased_rivm.bronnen.rivm],
                }}
                articles={content.mainArticles}
                vrNameOrGmName={vrName}
                warning={textVr.warning}
              />

              <TwoKpiSection>
                <KpiTile
                  title={textVr.section_deceased_rivm.kpi_covid_daily_title}
                  metadata={{
                    date: dataRivm.last_value.date_unix,
                    source: textVr.section_deceased_rivm.bronnen.rivm,
                  }}
                >
                  <KpiValue data-cy="covid_daily" absolute={dataRivm.last_value.covid_daily} difference={difference.deceased_rivm__covid_daily_archived_20221231} isAmount />
                  <Markdown content={textVr.section_deceased_rivm.kpi_covid_daily_description} />
                </KpiTile>

                <KpiTile
                  title={textVr.section_deceased_rivm.kpi_covid_total_title}
                  metadata={{
                    date: dataRivm.last_value.date_unix,
                    source: textVr.section_deceased_rivm.bronnen.rivm,
                  }}
                >
                  <KpiValue data-cy="covid_total" absolute={dataRivm.last_value.covid_total} />
                  <Text>{textVr.section_deceased_rivm.kpi_covid_total_description}</Text>
                </KpiTile>
              </TwoKpiSection>

              <ChartTile
                timeframeOptions={TimeframeOptionsList}
                title={textVr.section_deceased_rivm.line_chart_covid_daily_title}
                description={textVr.section_deceased_rivm.line_chart_covid_daily_description}
                metadata={{
                  source: textVr.section_deceased_rivm.bronnen.rivm,
                }}
                onSelectTimeframe={setDeceasedMunicipalTimeframe}
              >
                <TimeSeriesChart
                  accessibility={{
                    key: 'deceased_over_time_chart',
                  }}
                  values={dataRivm.values}
                  timeframe={deceasedMunicipalTimeframe}
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty: 'covid_daily_moving_average',
                      label: textVr.section_deceased_rivm.line_chart_covid_daily_legend_trend_label_moving_average,
                      shortLabel: textVr.section_deceased_rivm.line_chart_covid_daily_legend_trend_short_label_moving_average,
                      color: colors.primary,
                    },
                    {
                      type: 'bar',
                      metricProperty: 'covid_daily',
                      label: textVr.section_deceased_rivm.line_chart_covid_daily_legend_trend_label,
                      shortLabel: textVr.section_deceased_rivm.line_chart_covid_daily_legend_trend_short_label,
                      color: colors.primary,
                    },
                  ]}
                  dataOptions={{
                    timelineEvents: getTimelineEvents(content.elements.timeSeries, 'deceased_rivm_archived_20221231'),
                  }}
                />
              </ChartTile>
            </Box>
          )}
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default DeceasedRegionalPage;
