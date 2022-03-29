import { colors, TimeframeOption } from '@corona-dashboard/common';
import {
  Coronavirus,
  GehandicaptenZorg,
  Locatie,
} from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { ChartTile } from '~/components/chart-tile';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { useIntl } from '~/intl';
import { Languages } from '~/locale';
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
  selectVrData,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        textVr: siteText.pages.disabilityCarePage.vr,
      }),
      locale
    ),
  getLastGeneratedDate,
  selectVrData(
    'disability_care',
    'difference.disability_care__infected_locations_total',
    'difference.disability_care__newly_infected_people'
  ),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('disabilityCarePage')},
      "elements": ${getElementsQuery('vr', ['disability_care'], locale)}
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
    selectedVrData: data,
    vrName,
    lastGenerated,
    content,
  } = props;

  const { commonTexts } = useIntl();
  const { textVr } = pageText;

  const lastValue = data.disability_care.last_value;
  const values = data.disability_care.values;
  const underReportedDateStart = getBoundaryDateStartUnix(values, 7);

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
            icon={<GehandicaptenZorg />}
            description={replaceVariablesInText(
              textVr.positief_geteste_personen.pagina_toelichting,
              {
                safetyRegion: vrName,
              }
            )}
            metadata={{
              datumsText: textVr.positief_geteste_personen.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [textVr.positief_geteste_personen.bronnen.rivm],
            }}
            referenceLink={textVr.positief_geteste_personen.reference.href}
            articles={content.articles}
            vrNameOrGmName={vrName}
            warning={textVr.besmette_locaties.warning}
          />

          <TwoKpiSection>
            <KpiTile
              title={textVr.positief_geteste_personen.barscale_titel}
              description={textVr.positief_geteste_personen.extra_uitleg}
              metadata={{
                date: lastValue.date_unix,
                source: textVr.positief_geteste_personen.bronnen.rivm,
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
            metadata={{ source: textVr.positief_geteste_personen.bronnen.rivm }}
            title={textVr.positief_geteste_personen.linechart_titel}
            timeframeOptions={[TimeframeOption.ALL, TimeframeOption.FIVE_WEEKS]}
            description={textVr.positief_geteste_personen.linechart_description}
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
                    label:
                      textVr.positief_geteste_personen
                        .line_chart_newly_infected_people_moving_average,
                    shortLabel:
                      textVr.positief_geteste_personen
                        .line_chart_newly_infected_people_moving_average_short_label,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'newly_infected_people',
                    label:
                      textVr.positief_geteste_personen
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
                        textVr.positief_geteste_personen
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

          <PageInformationBlock
            id="besmette-locaties"
            title={replaceVariablesInText(textVr.besmette_locaties.titel, {
              safetyRegion: vrName,
            })}
            icon={<Locatie />}
            description={textVr.besmette_locaties.pagina_toelichting}
            metadata={{
              datumsText: textVr.besmette_locaties.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [textVr.besmette_locaties.bronnen.rivm],
            }}
            referenceLink={textVr.besmette_locaties.reference.href}
          />

          <TwoKpiSection>
            <KpiTile
              title={textVr.besmette_locaties.kpi_titel}
              metadata={{
                date: lastValue.date_unix,
                source: textVr.besmette_locaties.bronnen.rivm,
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
              <Text>{textVr.besmette_locaties.kpi_toelichting}</Text>
            </KpiTile>
            <KpiTile
              title={textVr.besmette_locaties.barscale_titel}
              metadata={{
                date: lastValue.date_unix,
                source: textVr.besmette_locaties.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="newly_infected_locations"
                absolute={lastValue.newly_infected_locations}
              />
              <Text>{textVr.besmette_locaties.barscale_toelichting}</Text>
            </KpiTile>
          </TwoKpiSection>

          {lastValue.infected_locations_total !== undefined && (
            <ChartTile
              title={textVr.besmette_locaties.linechart_titel}
              metadata={{
                source: textVr.besmette_locaties.bronnen.rivm,
              }}
              timeframeOptions={[
                TimeframeOption.ALL,
                TimeframeOption.FIVE_WEEKS,
              ]}
              description={textVr.besmette_locaties.linechart_description}
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
                      label: textVr.besmette_locaties.linechart_metric_label,
                      color: colors.data.primary,
                    },
                  ]}
                />
              )}
            </ChartTile>
          )}

          <PageInformationBlock
            id="sterfte"
            title={replaceVariablesInText(textVr.oversterfte.titel, {
              safetyRegion: vrName,
            })}
            icon={<Coronavirus />}
            description={textVr.oversterfte.pagina_toelichting}
            metadata={{
              datumsText: textVr.oversterfte.datums,
              dateOrRange: lastValue.date_unix,
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [textVr.oversterfte.bronnen.rivm],
            }}
            referenceLink={textVr.oversterfte.reference.href}
          />

          <TwoKpiSection>
            <KpiTile
              title={textVr.oversterfte.barscale_titel}
              description={textVr.oversterfte.extra_uitleg}
              metadata={{
                date: lastValue.date_unix,
                source: textVr.oversterfte.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="deceased_daily"
                absolute={lastValue.deceased_daily}
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            metadata={{ source: textVr.oversterfte.bronnen.rivm }}
            title={textVr.oversterfte.linechart_titel}
            timeframeOptions={[TimeframeOption.ALL, TimeframeOption.FIVE_WEEKS]}
            description={textVr.oversterfte.linechart_description}
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
                      textVr.oversterfte
                        .line_chart_deceased_daily_moving_average,
                    shortLabel:
                      textVr.oversterfte
                        .line_chart_deceased_daily_moving_average_short_label,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'deceased_daily',
                    label: textVr.oversterfte.line_chart_legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: underReportedDateStart,
                      end: Infinity,
                      label:
                        textVr.oversterfte.line_chart_legend_inaccurate_label,
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
      </VrLayout>
    </Layout>
  );
};

export default DisabilityCare;
