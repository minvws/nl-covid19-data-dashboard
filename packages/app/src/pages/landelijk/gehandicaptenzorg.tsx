import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { ChartTile } from '~/components/chart-tile';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { colors } from '@corona-dashboard/common';
import { Coronavirus, Gehandicaptenzorg, Location } from '@corona-dashboard/icons';
import { createGetArchivedChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectArchivedNlData } from '~/static-props/get-data';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { Divider } from '~/components/divider';
import { DynamicChoropleth } from '~/components/choropleth';
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

const pageMetrics = ['disability_care_archived_20230126'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  categoryTexts: {
    category: siteText.common.sidebar.categories.consequences_for_healthcare.title,
    screenReaderCategory: siteText.common.sidebar.metrics.disabled_care.title,
  },
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.disability_care_page.nl,
  jsonText: siteText.common.common.metadata.metrics_json_links,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectArchivedNlData('disability_care_archived_20230126'),
  createGetArchivedChoroplethData({
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
      "elements": ${getElementsQuery('archived_nl', ['disability_care_archived_20230126'], locale)}
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
  const { pageText, selectedArchivedNlData: data, archivedChoropleth, lastGenerated, content } = props;

  const reverseRouter = useReverseRouter();

  const lastValue = data.disability_care_archived_20230126.last_value;
  const values = data.disability_care_archived_20230126.values;
  const underReportedDateStart = getBoundaryDateStartUnix(values, 7);

  const { commonTexts, formatNumber } = useIntl();
  const { categoryTexts, metadataTexts, textNl, jsonText } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const metadata = {
    ...metadataTexts,
    title: textNl.besmette_locaties.metadata.title,
    description: textNl.besmette_locaties.metadata.description,
  };

  // All timeseries charts use the same set of data, thus the inteval is equal
  const metadataTimeframePeriod = {
    start: data.disability_care_archived_20230126.values[0].date_unix,
    end: data.disability_care_archived_20230126.values[data.disability_care_archived_20230126.values.length - 1].date_unix,
  };

  // This date can be used for all timeseries charts metadata components since the pageMetrics value only contains one metric
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
              dateOfInsertion: lastInsertionDateOfPage,
              dataSources: [textNl.positief_geteste_personen.bronnen.rivm],
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
            metadata={{
              source: textNl.positief_geteste_personen.bronnen.rivm,
              dateOfInsertion: lastInsertionDateOfPage,
              timeframePeriod: metadataTimeframePeriod,
              isArchived: true,
            }}
            title={textNl.positief_geteste_personen.linechart_titel}
            description={textNl.positief_geteste_personen.linechart_description}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'disability_care_confirmed_cases_over_time_chart',
              }}
              values={values}
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
              dateOfInsertion: lastValue.date_of_insertion_unix,
              dataSources: [textNl.besmette_locaties.bronnen.rivm],
            }}
            referenceLink={textNl.besmette_locaties.reference.href}
          />

          <ChoroplethTile
            title={textNl.besmette_locaties.map_titel}
            description={textNl.besmette_locaties.map_toelichting}
            metadata={{
              timeframePeriod: lastValue.date_unix,
              dateOfInsertion: lastValue.date_of_insertion_unix,
              source: textNl.besmette_locaties.bronnen.rivm,
              isTimeframePeriodKpi: true,
              isArchived: true,
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
              data={archivedChoropleth.vr.disability_care_archived_20230126}
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
              dateOfInsertion: lastInsertionDateOfPage,
              timeframePeriod: metadataTimeframePeriod,
              isArchived: true,
            }}
            description={textNl.besmette_locaties.charts.linechart_description}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'disability_care_infected_locations_over_time_chart',
              }}
              values={values}
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
              dateOfInsertion: lastValue.date_of_insertion_unix,
              dataSources: [textNl.oversterfte.bronnen.rivm],
            }}
            referenceLink={textNl.oversterfte.reference.href}
          />

          <ChartTile
            metadata={{
              source: textNl.oversterfte.bronnen.rivm,
              timeframePeriod: { start: values[0].date_unix, end: values[values.length - 1].date_unix },
              dateOfInsertion: values[values.length - 1].date_of_insertion_unix,
              isArchived: true,
            }}
            title={textNl.oversterfte.linechart_titel}
            description={textNl.oversterfte.linechart_description}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'disability_care_deceased_over_time_chart',
              }}
              values={values}
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
