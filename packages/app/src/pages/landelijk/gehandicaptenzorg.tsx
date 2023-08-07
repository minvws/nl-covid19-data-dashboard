import { colors, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { Coronavirus, Gehandicaptenzorg, Location } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { Divider } from '~/components/divider';
import { InView } from '~/components/in-view';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectArchivedNlData } from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';

const pageMetrics = ['disability_care'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  categoryTexts: {
    category: siteText.common.sidebar.categories.consequences_for_healthcare.title,
    screenReaderCategory: siteText.common.sidebar.metrics.disabled_care.title,
  },
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.disability_care_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectArchivedNlData('disability_care_archived_20230126'),
  createGetChoroplethData({
    vr: ({ disability_care_archived_20230126 }) => ({ disability_care_archived_20230126 }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('disability_care_page')},
      "elements": ${getElementsQuery('nl', ['disability_care_archived_20230126'], locale)}
     }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'disabilityCarePageArticles'),
        faqs: getFaqParts(content.parts.pageParts, 'disabilityCarePageFAQs'),
        dataExplained: getDataExplainedParts(content.parts.pageParts, 'disabilityCarePageDataExplained'),
        elements: content.elements,
      },
    };
  }
);

function DisabilityCare(props: StaticProps<typeof getStaticProps>) {
  const { pageText, selectedArchivedNlData: data, choropleth, lastGenerated, content } = props;

  const [disabilityCareConfirmedCasesTimeframe, setDisabilityCareConfirmedCasesTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);
  const [disabilityCareInfectedLocationsTimeframe, setDisabilityCareInfectedLocationsTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);
  const [disabilityCareDeceasedTimeframe, setDisabilityCareDeceasedTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const lastValue = data.disability_care_archived_20230126.last_value;
  const values = data.disability_care_archived_20230126.values;
  const underReportedDateStart = getBoundaryDateStartUnix(values, 7);

  const { commonTexts, formatNumber } = useIntl();
  const { categoryTexts, metadataTexts, textNl } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const metadata = {
    ...metadataTexts,
    title: textNl.besmette_locaties.metadata.title,
    description: textNl.besmette_locaties.metadata.description,
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);
  const hasActiveWarningTile = !!textNl.belangrijk_bericht;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
            screenReaderCategory={categoryTexts.screenReaderCategory}
            title={textNl.positief_geteste_personen.titel}
            icon={<Gehandicaptenzorg aria-hidden="true" />}
            description={textNl.positief_geteste_personen.pagina_toelichting}
            metadata={{
              datumsText: textNl.positief_geteste_personen.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textNl.positief_geteste_personen.bronnen.rivm],
            }}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={textNl.belangrijk_bericht} variant="informational" />}

          <ChartTile
            metadata={{ source: textNl.positief_geteste_personen.bronnen.rivm }}
            title={textNl.positief_geteste_personen.linechart_titel}
            timeframeOptions={TimeframeOptionsList}
            description={textNl.positief_geteste_personen.linechart_description}
            onSelectTimeframe={setDisabilityCareConfirmedCasesTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'disability_care_confirmed_cases_over_time_chart',
              }}
              values={values}
              timeframe={disabilityCareConfirmedCasesTimeframe}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'newly_infected_people_moving_average',
                  color: colors.primary,
                  label: textNl.positief_geteste_personen.line_chart_newly_infected_people_moving_average,
                  shortLabel: textNl.positief_geteste_personen.line_chart_newly_infected_people_moving_average_short_label,
                },
                {
                  type: 'bar',
                  metricProperty: 'newly_infected_people',
                  label: textNl.positief_geteste_personen.line_chart_legend_trend_label,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: underReportedDateStart,
                    end: Infinity,
                    label: textNl.positief_geteste_personen.line_chart_legend_inaccurate_label,
                    shortLabel: commonTexts.common.incomplete,
                    cutValuesForMetricProperties: ['newly_infected_people_moving_average'],
                  },
                ],
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'disability_care_archived_20230126', 'newly_infected_people'),
              }}
            />
          </ChartTile>

          <Divider />

          <PageInformationBlock
            id="besmette-locaties"
            title={textNl.besmette_locaties.titel}
            icon={<Location />}
            description={textNl.besmette_locaties.pagina_toelichting}
            metadata={{
              datumsText: textNl.besmette_locaties.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [textNl.besmette_locaties.bronnen.rivm],
            }}
            referenceLink={textNl.besmette_locaties.reference.href}
          />

          <ChoroplethTile
            title={textNl.besmette_locaties.map_titel}
            description={textNl.besmette_locaties.map_toelichting}
            metadata={{
              date: lastValue.date_unix,
              source: textNl.besmette_locaties.bronnen.rivm,
            }}
            legend={{
              thresholds: thresholds.vr.infected_locations_percentage,
              title: textNl.besmette_locaties.chloropleth_legenda.titel,
            }}
          >
            <DynamicChoropleth
              map="vr"
              accessibility={{
                key: 'disability_care_infected_people_choropleth',
              }}
              data={choropleth.vr.disability_care_archived_20230126}
              dataConfig={{
                metricName: 'disability_care_archived_20230126',
                metricProperty: 'infected_locations_percentage',
                dataFormatters: {
                  infected_locations_percentage: formatNumber,
                },
              }}
            />
          </ChoroplethTile>

          <ChartTile
            title={textNl.besmette_locaties.charts.linechart_title}
            metadata={{
              source: textNl.besmette_locaties.bronnen.rivm,
            }}
            timeframeOptions={TimeframeOptionsList}
            description={textNl.besmette_locaties.charts.linechart_description}
            onSelectTimeframe={setDisabilityCareInfectedLocationsTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'disability_care_infected_locations_over_time_chart',
              }}
              values={values}
              timeframe={disabilityCareInfectedLocationsTimeframe}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'infected_locations_total',
                  label: textNl.besmette_locaties.charts.linechart_legend_label,
                  shortLabel: textNl.besmette_locaties.charts.linechart_tooltip_label,
                  color: colors.primary,
                },
              ]}
              forceLegend
            />
          </ChartTile>

          <Divider />

          <PageInformationBlock
            id="sterfte"
            title={textNl.oversterfte.titel}
            icon={<Coronavirus />}
            description={textNl.oversterfte.pagina_toelichting}
            metadata={{
              datumsText: textNl.oversterfte.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [textNl.oversterfte.bronnen.rivm],
            }}
            referenceLink={textNl.oversterfte.reference.href}
          />

          <ChartTile
            metadata={{ source: textNl.oversterfte.bronnen.rivm }}
            title={textNl.oversterfte.linechart_titel}
            timeframeOptions={TimeframeOptionsList}
            description={textNl.oversterfte.linechart_description}
            onSelectTimeframe={setDisabilityCareDeceasedTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'disability_care_deceased_over_time_chart',
              }}
              values={values}
              timeframe={disabilityCareDeceasedTimeframe}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'deceased_daily_moving_average',
                  label: textNl.oversterfte.line_chart_deceased_daily_moving_average,
                  shortLabel: textNl.oversterfte.line_chart_deceased_daily_moving_average_short_label,
                  color: colors.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'deceased_daily',
                  label: textNl.oversterfte.line_chart_legend_trend_label,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                timespanAnnotations: [
                  {
                    start: underReportedDateStart,
                    end: Infinity,
                    label: textNl.oversterfte.line_chart_legend_inaccurate_label,
                    shortLabel: commonTexts.common.incomplete,
                    cutValuesForMetricProperties: ['deceased_daily_moving_average'],
                  },
                ],
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

export default DisabilityCare;
