import { colors } from '@corona-dashboard/common';
import { Elderly } from '@corona-dashboard/icons';
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
  selectVrData,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrData(
    'elderly_at_home',
    'difference.elderly_at_home__positive_tested_daily'
  ),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('elderlyAtHomePage')},
      "elements": ${getElementsQuery('vr', ['elderly_at_home'], locale)}
     }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(
          content.parts.pageParts,
          'elderlyAtHomePageArticles'
        ),
        elements: content.elements,
      },
    };
  }
);

const ElderlyAtHomeRegionalPage = (
  props: StaticProps<typeof getStaticProps>
) => {
  const { vrName, selectedVrData: data, lastGenerated, content } = props;
  const { elderly_at_home, difference } = data;

  const { siteText } = useIntl();

  const text = siteText.veiligheidsregio_thuiswonende_ouderen;

  const elderlyAtHomeUnderReportedRange = getBoundaryDateStartUnix(
    elderly_at_home.values,
    4
  );

  const elderlyAtHomeDeceasedUnderReportedRange = getBoundaryDateStartUnix(
    elderly_at_home.values,
    7
  );

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(text.metadata.title, {
      safetyRegion: vrName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      safetyRegion: vrName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={
              siteText.veiligheidsregio_layout.headings.kwetsbare_groepen
            }
            screenReaderCategory={
              siteText.sidebar.metrics.elderly_at_home.title
            }
            title={replaceVariablesInText(text.section_positive_tested.title, {
              safetyRegion: vrName,
            })}
            icon={<Elderly />}
            description={replaceVariablesInText(
              text.section_positive_tested.description,
              {
                safetyRegion: vrName,
              }
            )}
            metadata={{
              datumsText: text.section_positive_tested.datums,
              dateOrRange: elderly_at_home.last_value.date_unix,
              dateOfInsertionUnix:
                elderly_at_home.last_value.date_of_insertion_unix,
              dataSources: [text.section_positive_tested.bronnen.rivm],
            }}
            referenceLink={text.section_positive_tested.reference.href}
            articles={content.articles}
            vrNameOrGmName={vrName}
            warning={text.warning}
          />

          <TwoKpiSection>
            <KpiTile
              title={text.section_positive_tested.kpi_daily_title}
              metadata={{
                date: elderly_at_home.last_value.date_unix,
                source: text.section_positive_tested.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="positive_tested_daily"
                absolute={elderly_at_home.last_value.positive_tested_daily}
                difference={difference.elderly_at_home__positive_tested_daily}
                isAmount
              />
              <Text>{text.section_positive_tested.kpi_daily_description}</Text>
            </KpiTile>
            <KpiTile
              title={text.section_positive_tested.kpi_daily_per_100k_title}
              metadata={{
                date: elderly_at_home.last_value.date_unix,
                source: text.section_positive_tested.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="positive_tested_daily_per_100k"
                absolute={
                  elderly_at_home.last_value.positive_tested_daily_per_100k
                }
              />
              <Text>
                {text.section_positive_tested.kpi_daily_per_100k_description}
              </Text>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            timeframeOptions={['all', '5weeks']}
            title={text.section_positive_tested.line_chart_daily_title}
            metadata={{ source: text.section_positive_tested.bronnen.rivm }}
            description={
              text.section_positive_tested.line_chart_daily_description
            }
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'elderly_at_home_confirmed_cases_over_time_chart',
                }}
                timeframe={timeframe}
                values={elderly_at_home.values}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'positive_tested_daily_moving_average',
                    label:
                      text.section_positive_tested
                        .line_chart_positive_tested_daily_moving_average,
                    shortLabel:
                      text.section_positive_tested
                        .line_chart_positive_tested_daily_moving_average_short_label,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'positive_tested_daily',
                    label:
                      text.section_positive_tested
                        .line_chart_legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: elderlyAtHomeUnderReportedRange,
                      end: Infinity,
                      label:
                        text.section_deceased
                          .line_chart_legend_inaccurate_label,
                      shortLabel: siteText.common.incomplete,
                      cutValuesForMetricProperties: [
                        'positive_tested_daily_moving_average',
                      ],
                    },
                  ],
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'elderly_at_home',
                    'positive_tested_daily'
                  ),
                }}
              />
            )}
          </ChartTile>

          <Divider />

          <PageInformationBlock
            title={replaceVariablesInText(text.section_deceased.title, {
              safetyRegion: vrName,
            })}
            icon={<Elderly />}
            description={replaceVariablesInText(
              text.section_deceased.description,
              {
                safetyRegion: vrName,
              }
            )}
            metadata={{
              datumsText: text.section_deceased.datums,
              dateOrRange: elderly_at_home.last_value.date_unix,
              dateOfInsertionUnix:
                elderly_at_home.last_value.date_of_insertion_unix,
              dataSources: [text.section_deceased.bronnen.rivm],
            }}
            referenceLink={text.section_deceased.reference.href}
          />

          <TwoKpiSection>
            <KpiTile
              title={text.section_deceased.kpi_daily_title}
              description={text.section_deceased.kpi_daily_description}
              metadata={{
                date: elderly_at_home.last_value.date_unix,
                source: text.section_deceased.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="deceased_daily"
                absolute={elderly_at_home.last_value.deceased_daily}
              />
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            timeframeOptions={['all', '5weeks']}
            title={text.section_deceased.line_chart_daily_title}
            metadata={{ source: text.section_positive_tested.bronnen.rivm }}
            description={text.section_deceased.line_chart_daily_description}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'elderly_at_home_deceased_over_time_chart',
                }}
                timeframe={timeframe}
                values={elderly_at_home.values}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'deceased_daily_moving_average',
                    label:
                      text.section_deceased
                        .line_chart_deceased_daily_moving_average,
                    shortLabel:
                      text.section_deceased
                        .line_chart_deceased_daily_moving_average_short_label,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'deceased_daily',
                    label: text.section_deceased.line_chart_legend_trend_label,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  timespanAnnotations: [
                    {
                      start: elderlyAtHomeDeceasedUnderReportedRange,
                      end: Infinity,
                      label:
                        text.section_deceased
                          .line_chart_legend_inaccurate_label,
                      shortLabel: siteText.common.incomplete,
                      cutValuesForMetricProperties: [
                        'deceased_daily_moving_average',
                      ],
                    },
                  ],
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'elderly_at_home',
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

export default ElderlyAtHomeRegionalPage;
