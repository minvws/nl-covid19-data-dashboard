import { colors } from '@corona-dashboard/common';
import { Elderly } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
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
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectNlData,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlData(
    'difference.elderly_at_home__positive_tested_daily',
    'elderly_at_home'
  ),
  createGetChoroplethData({
    vr: ({ elderly_at_home }) => ({ elderly_at_home }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "parts": ${getPagePartsQuery('elderlyAtHomePage')},
      "elements": ${getElementsQuery('nl', ['elderly_at_home'], locale)}
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

const ElderlyAtHomeNationalPage = (
  props: StaticProps<typeof getStaticProps>
) => {
  const { selectedNlData: data, choropleth, lastGenerated, content } = props;
  const elderlyAtHomeData = data.elderly_at_home;

  const elderlyAtHomeInfectedUnderReportedRange = getBoundaryDateStartUnix(
    elderlyAtHomeData.values,
    4
  );

  const elderlyAtHomeDeceasedUnderReportedRange = getBoundaryDateStartUnix(
    elderlyAtHomeData.values,
    7
  );

  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();

  const text = siteText.thuiswonende_ouderen;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.kwetsbare_groepen}
            screenReaderCategory={
              siteText.sidebar.metrics.elderly_at_home.title
            }
            title={text.section_positive_tested.title}
            icon={<Elderly />}
            description={text.section_positive_tested.description}
            metadata={{
              datumsText: text.section_positive_tested.datums,
              dateOrRange: elderlyAtHomeData.last_value.date_unix,
              dateOfInsertionUnix:
                elderlyAtHomeData.last_value.date_of_insertion_unix,
              dataSources: [text.section_positive_tested.bronnen.rivm],
            }}
            referenceLink={text.section_positive_tested.reference.href}
            articles={content.articles}
          />

          <TwoKpiSection>
            <KpiTile
              title={text.section_positive_tested.kpi_daily_title}
              metadata={{
                date: elderlyAtHomeData.last_value.date_unix,
                source: text.section_positive_tested.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="positive_tested_daily"
                absolute={elderlyAtHomeData.last_value.positive_tested_daily}
                difference={
                  data.difference.elderly_at_home__positive_tested_daily
                }
                isAmount
              />
              <Markdown
                content={text.section_positive_tested.kpi_daily_description}
              />
            </KpiTile>
            <KpiTile
              title={text.section_positive_tested.kpi_daily_per_100k_title}
              metadata={{
                date: elderlyAtHomeData.last_value.date_unix,
                source: text.section_positive_tested.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="positive_tested_daily_per_100k"
                absolute={
                  elderlyAtHomeData.last_value.positive_tested_daily_per_100k
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
                values={elderlyAtHomeData.values}
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
                      start: elderlyAtHomeInfectedUnderReportedRange,
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

          <ChoroplethTile
            title={text.section_positive_tested.choropleth_daily_title}
            description={
              text.section_positive_tested.choropleth_daily_description
            }
            metadata={{
              date: elderlyAtHomeData.last_value.date_unix,
              source: text.section_positive_tested.bronnen.rivm,
            }}
            legend={{
              thresholds: thresholds.vr.positive_tested_daily_per_100k,
              title: text.section_positive_tested.choropleth_daily_legenda,
            }}
          >
            <DynamicChoropleth
              map="vr"
              accessibility={{
                key: 'elderly_at_home_infected_people_choropleth',
              }}
              data={choropleth.vr.elderly_at_home}
              dataConfig={{
                metricName: 'elderly_at_home',
                metricProperty: 'positive_tested_daily_per_100k',
              }}
              dataOptions={{
                getLink: reverseRouter.vr.thuiswonendeOuderen,
              }}
            />
          </ChoroplethTile>

          <Spacer mb={3} />

          <PageInformationBlock
            title={text.section_deceased.title}
            icon={<Elderly />}
            description={text.section_deceased.description}
            metadata={{
              datumsText: text.section_deceased.datums,
              dateOrRange: elderlyAtHomeData.last_value.date_unix,
              dateOfInsertionUnix:
                elderlyAtHomeData.last_value.date_of_insertion_unix,
              dataSources: [text.section_deceased.bronnen.rivm],
            }}
            referenceLink={text.section_deceased.reference.href}
          />

          <TwoKpiSection>
            <KpiTile
              title={text.section_deceased.kpi_daily_title}
              description={text.section_deceased.kpi_daily_description}
              metadata={{
                date: elderlyAtHomeData.last_value.date_unix,
                source: text.section_deceased.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="deceased_daily"
                absolute={elderlyAtHomeData.last_value.deceased_daily}
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
                  key: 'elderly_at_home_confirmed_cases_over_time_chart',
                }}
                timeframe={timeframe}
                values={elderlyAtHomeData.values}
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
      </NlLayout>
    </Layout>
  );
};

export default ElderlyAtHomeNationalPage;
