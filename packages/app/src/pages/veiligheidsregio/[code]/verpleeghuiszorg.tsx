import { colors, TimeframeOptionsList } from '@corona-dashboard/common';
import {
  Coronavirus,
  Locatie,
  Verpleeghuiszorg,
} from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { ChartTile } from '~/components/chart-tile';
import { Divider } from '~/components/divider';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { Languages } from '~/locale';
import { useIntl } from '~/intl';
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
  createGetContent,
  getLastGeneratedDate,
  getLokalizeTexts,
  selectVrData,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';

const pageMetrics = ['nursing_home'];

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        textVr: siteText.pages.nursing_home_page.vr,
        textShared: siteText.pages.nursing_home_page.shared,
      }),
      locale
    ),
  getLastGeneratedDate,
  selectVrData(
    'difference.nursing_home__deceased_daily',
    'difference.nursing_home__infected_locations_total',
    'difference.nursing_home__newly_infected_people',
    'nursing_home'
  ),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('nursing_home_page')},
      "elements": ${getElementsQuery('vr', ['nursing_home'], locale)}
     }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(
          content.parts.pageParts,
          'nursingHomePageArticles'
        ),
        elements: content.elements,
      },
    };
  }
);

const NursingHomeCare = (props: StaticProps<typeof getStaticProps>) => {
  const {
    pageText,
    selectedVrData: data,
    vrName,
    lastGenerated,
    content,
  } = props;

  const { commonTexts } = useIntl();

  const { textVr, textShared } = pageText;

  const nursinghomeLastValue = data.nursing_home.last_value;
  const underReportedDateStart = getBoundaryDateStartUnix(
    data.nursing_home.values,
    7
  );

  const metadata = {
    ...commonTexts.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(textVr.besmette_locaties.metadata.title, {
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(
      textVr.besmette_locaties.metadata.description,
      {
        safetyRegionName: vrName,
      }
    ),
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={
              commonTexts.veiligheidsregio_layout.headings.kwetsbare_groepen
            }
            screenReaderCategory={
              commonTexts.sidebar.metrics.nursing_home_care.title
            }
            title={replaceVariablesInText(
              textVr.positief_geteste_personen.titel,
              {
                safetyRegion: vrName,
              }
            )}
            icon={<Verpleeghuiszorg />}
            description={replaceVariablesInText(
              textVr.positief_geteste_personen.pagina_toelichting,
              {
                safetyRegion: vrName,
              }
            )}
            metadata={{
              datumsText: textVr.positief_geteste_personen.datums,
              dateOrRange: nursinghomeLastValue.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textVr.positief_geteste_personen.bronnen.rivm],
            }}
            referenceLink={textVr.positief_geteste_personen.reference.href}
            articles={content.articles}
            vrNameOrGmName={vrName}
            warning={textVr.positief_geteste_personen.warning}
          />

          <TwoKpiSection>
            <KpiTile
              title={textVr.positief_geteste_personen.barscale_titel}
              description={textVr.positief_geteste_personen.extra_uitleg}
              metadata={{
                date: nursinghomeLastValue.date_unix,
                source: textVr.positief_geteste_personen.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="newly_infected_people"
                absolute={nursinghomeLastValue.newly_infected_people}
                difference={data.difference.nursing_home__newly_infected_people}
                isAmount
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: textVr.positief_geteste_personen.bronnen.rivm }}
            title={textVr.positief_geteste_personen.linechart_titel}
            timeframeOptions={TimeframeOptionsList}
            description={textVr.positief_geteste_personen.linechart_description}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'nursing_home_confirmed_cases_over_time_chart',
                }}
                values={data.nursing_home.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'newly_infected_people_moving_average',
                    color: colors.data.primary,
                    label:
                      textVr.positief_geteste_personen
                        .line_chart_legend_trend_moving_average_label,
                    shortLabel:
                      textVr.positief_geteste_personen.tooltip_labels
                        .newly_infected_people_moving_average,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'newly_infected_people',
                    color: colors.data.primary,
                    label:
                      textVr.positief_geteste_personen
                        .line_chart_legend_trend_label,
                    shortLabel:
                      textVr.positief_geteste_personen.tooltip_labels
                        .newly_infected_people,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedDateStart,
                      end: Infinity,
                      label:
                        textVr.positief_geteste_personen
                          .line_chart_legend_inaccurate_label,
                      shortLabel:
                        textVr.positief_geteste_personen.tooltip_labels
                          .inaccurate,
                      cutValuesForMetricProperties: [
                        'newly_infected_people_moving_average',
                      ],
                    },
                  ],
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'nursing_home',
                    'newly_infected_people'
                  ),
                }}
              />
            )}
          </ChartTile>

          <Divider />

          <PageInformationBlock
            id="besmette-locaties"
            title={replaceVariablesInText(textVr.besmette_locaties.titel, {
              safetyRegion: vrName,
            })}
            icon={<Locatie />}
            description={textVr.besmette_locaties.pagina_toelichting}
            metadata={{
              datumsText: textVr.besmette_locaties.datums,
              dateOrRange: nursinghomeLastValue.date_unix,
              dateOfInsertionUnix: nursinghomeLastValue.date_of_insertion_unix,
              dataSources: [textVr.besmette_locaties.bronnen.rivm],
            }}
            referenceLink={textVr.besmette_locaties.reference.href}
          />

          <TwoKpiSection>
            <KpiTile
              title={textVr.besmette_locaties.kpi_titel}
              metadata={{
                date: nursinghomeLastValue.date_unix,
                source: textVr.besmette_locaties.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected_locations_total"
                absolute={nursinghomeLastValue.infected_locations_total}
                percentage={nursinghomeLastValue.infected_locations_percentage}
                difference={
                  data.difference.nursing_home__infected_locations_total
                }
                isAmount
              />
              <Text>{textVr.besmette_locaties.kpi_toelichting}</Text>
            </KpiTile>
            <KpiTile
              title={textVr.besmette_locaties.barscale_titel}
              metadata={{
                date: nursinghomeLastValue.date_unix,
                source: textVr.besmette_locaties.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="newly_infected_locations"
                absolute={nursinghomeLastValue.newly_infected_locations}
              />
              <Text>{textVr.besmette_locaties.barscale_toelichting}</Text>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: textVr.besmette_locaties.bronnen.rivm }}
            title={textVr.besmette_locaties.linechart_titel}
            timeframeOptions={TimeframeOptionsList}
            description={textVr.besmette_locaties.linechart_description}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'nursing_home_infected_locations_over_time_chart',
                }}
                values={data.nursing_home.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'area',
                    metricProperty: 'infected_locations_total',
                    label:
                      textShared.verpleeghuis_besmette_locaties
                        .linechart_tooltip_label,
                    color: colors.data.primary,
                  },
                ]}
              />
            )}
          </ChartTile>

          <Divider />

          <PageInformationBlock
            id="sterfte"
            title={replaceVariablesInText(textVr.titel, {
              safetyRegion: vrName,
            })}
            icon={<Coronavirus />}
            description={textVr.pagina_toelichting}
            metadata={{
              datumsText: textVr.datums,
              dateOrRange: nursinghomeLastValue.date_unix,
              dateOfInsertionUnix: nursinghomeLastValue.date_of_insertion_unix,
              dataSources: [textVr.bronnen.rivm],
            }}
            referenceLink={textVr.reference.href}
          />

          <TwoKpiSection>
            <KpiTile
              title={textVr.barscale_titel}
              description={textVr.extra_uitleg}
              metadata={{
                date: nursinghomeLastValue.date_unix,
                source: textVr.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="deceased_daily"
                absolute={nursinghomeLastValue.deceased_daily}
                difference={data.difference.nursing_home__deceased_daily}
                isAmount
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: textVr.bronnen.rivm }}
            title={textVr.linechart_titel}
            timeframeOptions={TimeframeOptionsList}
            description={textVr.linechart_description}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'nursing_home_deceased_over_time_chart',
                }}
                values={data.nursing_home.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'deceased_daily_moving_average',
                    label: textVr.line_chart_legend_trend_moving_average_label,
                    shortLabel:
                      textVr.tooltip_labels.deceased_daily_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'deceased_daily',
                    label: textVr.line_chart_legend_trend_label,
                    shortLabel: textVr.tooltip_labels.deceased_daily,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedDateStart,
                      end: Infinity,
                      label: textVr.line_chart_legend_inaccurate_label,
                      shortLabel: textVr.tooltip_labels.inaccurate,
                      cutValuesForMetricProperties: [
                        'deceased_daily_moving_average',
                      ],
                    },
                  ],
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'nursing_home',
                    'deceased_daily'
                  ),
                }}
              />
            )}
          </ChartTile>
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default NursingHomeCare;
