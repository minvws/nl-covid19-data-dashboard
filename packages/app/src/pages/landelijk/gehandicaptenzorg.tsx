import { colors, TimeframeOptionsList } from '@corona-dashboard/common';
import {
  Coronavirus,
  GehandicaptenZorg,
  Locatie,
} from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { Divider } from '~/components/divider';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import {
  ElementsQueryResult,
  getElementsQuery,
  getTimelineEvents,
} from '~/queries/get-elements-query';
import {
  getArticleParts,
  getPagePartsQuery,
} from '~/queries/get-page-parts-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectNlData,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const pageMetrics = ['disability_care'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  caterogyTexts: {
    category: siteText.common.nationaal_layout.headings.kwetsbare_groepen,
    screenReaderCategory: siteText.common.sidebar.metrics.disabled_care.title,
  },
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.disability_care_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData(
    'difference.disability_care__newly_infected_people',
    'difference.disability_care__infected_locations_total',
    'disability_care'
  ),
  createGetChoroplethData({
    vr: ({ disability_care }) => ({ disability_care }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('disability_care_page')},
      "elements": ${getElementsQuery('nl', ['disability_care'], locale)}
     }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(
          content.parts.pageParts,
          'disabilityCarePageArticles'
        ),
        elements: content.elements,
      },
    };
  }
);

const DisabilityCare = (props: StaticProps<typeof getStaticProps>) => {
  const {
    pageText,
    selectedNlData: data,
    choropleth,
    lastGenerated,
    content,
  } = props;
  const lastValue = data.disability_care.last_value;
  const values = data.disability_care.values;
  const underReportedDateStart = getBoundaryDateStartUnix(values, 7);

  const { commonTexts, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();
  const { caterogyTexts, metadataTexts, textNl } =
    useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...metadataTexts,
    title: textNl.besmette_locaties.metadata.title,
    description: textNl.besmette_locaties.metadata.description,
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={caterogyTexts.category}
            screenReaderCategory={caterogyTexts.screenReaderCategory}
            title={textNl.positief_geteste_personen.titel}
            icon={<GehandicaptenZorg />}
            description={textNl.positief_geteste_personen.pagina_toelichting}
            metadata={{
              datumsText: textNl.positief_geteste_personen.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textNl.positief_geteste_personen.bronnen.rivm],
            }}
            referenceLink={textNl.positief_geteste_personen.reference.href}
            articles={content.articles}
          />

          <TwoKpiSection>
            <KpiTile
              title={textNl.positief_geteste_personen.barscale_titel}
              description={textNl.positief_geteste_personen.extra_uitleg}
              metadata={{
                date: lastValue.date_unix,
                source: textNl.positief_geteste_personen.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="newly_infected_people"
                absolute={lastValue.newly_infected_people}
                difference={
                  data.difference.disability_care__newly_infected_people
                }
                isAmount
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: textNl.positief_geteste_personen.bronnen.rivm }}
            title={textNl.positief_geteste_personen.linechart_titel}
            timeframeOptions={TimeframeOptionsList}
            description={textNl.positief_geteste_personen.linechart_description}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'disability_care_confirmed_cases_over_time_chart',
                }}
                values={values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'newly_infected_people_moving_average',
                    color: colors.data.primary,
                    label:
                      textNl.positief_geteste_personen
                        .line_chart_newly_infected_people_moving_average,
                    shortLabel:
                      textNl.positief_geteste_personen
                        .line_chart_newly_infected_people_moving_average_short_label,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'newly_infected_people',
                    label:
                      textNl.positief_geteste_personen
                        .line_chart_legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedDateStart,
                      end: Infinity,
                      label:
                        textNl.positief_geteste_personen
                          .line_chart_legend_inaccurate_label,
                      shortLabel: commonTexts.common.incomplete,
                      cutValuesForMetricProperties: [
                        'newly_infected_people_moving_average',
                      ],
                    },
                  ],
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'disability_care',
                    'newly_infected_people'
                  ),
                }}
              />
            )}
          </ChartTile>

          <Divider />

          <PageInformationBlock
            id="besmette-locaties"
            title={textNl.besmette_locaties.titel}
            icon={<Locatie />}
            description={textNl.besmette_locaties.pagina_toelichting}
            metadata={{
              datumsText: textNl.besmette_locaties.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [textNl.besmette_locaties.bronnen.rivm],
            }}
            referenceLink={textNl.besmette_locaties.reference.href}
          />

          <TwoKpiSection>
            <KpiTile
              title={textNl.besmette_locaties.kpi_titel}
              metadata={{
                date: lastValue.date_unix,
                source: textNl.besmette_locaties.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_locations_total"
                absolute={lastValue.infected_locations_total}
                percentage={lastValue.infected_locations_percentage}
                difference={
                  data.difference.disability_care__infected_locations_total
                }
                isAmount
              />
              <Text>{textNl.besmette_locaties.kpi_toelichting}</Text>
            </KpiTile>

            <KpiTile
              title={textNl.besmette_locaties.barscale_titel}
              metadata={{
                date: lastValue.date_unix,
                source: textNl.besmette_locaties.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="newly_infected_locations"
                absolute={lastValue.newly_infected_locations}
              />
              <Text>{textNl.besmette_locaties.barscale_toelichting}</Text>
            </KpiTile>
          </TwoKpiSection>

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
              data={choropleth.vr.disability_care}
              dataConfig={{
                metricName: 'disability_care',
                metricProperty: 'infected_locations_percentage',
                dataFormatters: {
                  infected_locations_percentage: formatNumber,
                },
              }}
              dataOptions={{
                getLink: reverseRouter.vr.gehandicaptenzorg,
              }}
            />
          </ChoroplethTile>

          <ChartTile
            title={textNl.besmette_locaties.linechart_titel}
            metadata={{
              source: textNl.besmette_locaties.bronnen.rivm,
            }}
            timeframeOptions={TimeframeOptionsList}
            description={textNl.besmette_locaties.linechart_description}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'disability_care_infected_locations_over_time_chart',
                }}
                values={values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'area',
                    metricProperty: 'infected_locations_total',
                    label: textNl.besmette_locaties.linechart_metric_label,
                    color: colors.data.primary,
                  },
                ]}
              />
            )}
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

          <TwoKpiSection>
            <KpiTile
              title={textNl.oversterfte.barscale_titel}
              description={textNl.oversterfte.extra_uitleg}
              metadata={{
                date: lastValue.date_unix,
                source: textNl.oversterfte.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="deceased_daily"
                absolute={lastValue.deceased_daily}
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: textNl.oversterfte.bronnen.rivm }}
            title={textNl.oversterfte.linechart_titel}
            timeframeOptions={TimeframeOptionsList}
            description={textNl.oversterfte.linechart_description}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'disability_care_deceased_over_time_chart',
                }}
                values={values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'deceased_daily_moving_average',
                    label:
                      textNl.oversterfte
                        .line_chart_deceased_daily_moving_average,
                    shortLabel:
                      textNl.oversterfte
                        .line_chart_deceased_daily_moving_average_short_label,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'deceased_daily',
                    label: textNl.oversterfte.line_chart_legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedDateStart,
                      end: Infinity,
                      label:
                        textNl.oversterfte.line_chart_legend_inaccurate_label,
                      shortLabel: commonTexts.common.incomplete,
                      cutValuesForMetricProperties: [
                        'deceased_daily_moving_average',
                      ],
                    },
                  ],
                }}
              />
            )}
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default DisabilityCare;
