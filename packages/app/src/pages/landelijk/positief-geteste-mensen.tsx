import { colors, NlTestedOverallArchived_20230417Value, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { GgdTesten } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { WarningTile } from '~/components';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { ChartTileToggleItem } from '~/components/chart-tile-toggle';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { InView } from '~/components/in-view';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { BoldText } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { GNumberBarChartTile } from '~/domain/tested/g-number-bar-chart-tile';
import { InfectedPerAgeGroup } from '~/domain/tested/infected-per-age-group/infected-per-age-group';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, selectNlData } from '~/static-props/get-data';
import { space } from '~/style/theme';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

const pageMetrics = ['g_number_archived_20230417', 'tested_ggd_archived_20230417', 'tested_overall_archived_20230417', 'tested_per_age_group_archived_20230417'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.positive_tests_page.nl,
  textShared: siteText.pages.positive_tests_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData(
    'difference.tested_ggd__infected_percentage_moving_average_archived_20230417',
    'difference.tested_ggd__tested_total_moving_average_archived_20230417',
    'difference.tested_overall__infected_moving_average_archived_20230417',
    'difference.tested_overall__infected_per_100k_moving_average_archived_20230417',
    'g_number_archived_20230417',
    'tested_ggd_archived_20230417',
    'tested_overall_archived_20230417',
    'tested_per_age_group_archived_20230417'
  ),
  createGetChoroplethData({
    gm: ({ tested_overall_archived_20230417 }) => ({ tested_overall_archived_20230417 }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
        "parts": ${getPagePartsQuery('positive_tests_page')},
        "elements": ${getElementsQuery('nl', ['tested_overall_archived_20230417', 'tested_ggd_archived_20230417', 'tested_per_age_group_archived_20230417'], locale)}
      }`;
    })(context);
    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'positiveTestsPageArticles'),
        ggdArticles: getArticleParts(content.parts.pageParts, 'positiveTestsGGDArticles'),
        elements: content.elements,
      },
    };
  }
);

function PositivelyTestedPeople(props: StaticProps<typeof getStaticProps>) {
  const { pageText, selectedNlData: data, choropleth, content, lastGenerated } = props;

  const [confirmedCasesInfectedTimeframe, setConfirmedCasesInfectedTimeframe] = useState<TimeframeOption>(TimeframeOption.SIX_MONTHS);

  const [confirmedCasesInfectedPercentageTimeframe, setConfirmedCasesInfectedPercentageTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [confirmedCasesTestedOverTimeTimeframe, setConfirmedCasesTestedOverTimeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const [confirmedCasesInfectedPerAgeTimeframe, setConfirmedCasesInfectedPerAgeTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const { commonTexts, formatNumber, formatDateFromSeconds } = useIntl();

  const reverseRouter = useReverseRouter();

  const { metadataTexts, textNl, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const [selectedGgdGraph, setSelectedGgdGraph] = useState<string>('GGD_infected_percentage_over_time_chart');

  const ggdGraphToggleItems: ChartTileToggleItem[] = [
    {
      label: textNl.ggd.linechart_percentage_toggle_label,
      value: 'GGD_infected_percentage_over_time_chart',
    },
    {
      label: textNl.ggd.linechart_totaltests_toggle_label,
      value: 'GGD_tested_over_time_chart',
    },
  ];

  const dataOverallLastValue = data.tested_overall_archived_20230417.last_value;
  const dataGgdLastValue = data.tested_ggd_archived_20230417.last_value;

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  const hasActiveWarningTile = !!textShared.belangrijk_bericht;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
            screenReaderCategory={commonTexts.sidebar.metrics.positive_tests.title}
            title={textNl.titel}
            icon={<GgdTesten aria-hidden="true" />}
            description={textNl.pagina_toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: dataOverallLastValue.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textNl.bronnen.rivm],
            }}
            referenceLink={textNl.reference.href}
            articles={content.articles}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={textShared.belangrijk_bericht} variant="informational" />}

          <ChartTile
            title={textNl.linechart_titel}
            description={replaceVariablesInText(textNl.linechart_toelichting, {
              date: formatDateFromSeconds(dataOverallLastValue.date_unix, 'weekday-long'),
              administered_total: formatNumber(dataOverallLastValue.infected),
              infected_total: formatNumber(dataOverallLastValue.infected_moving_average_rounded),
            })}
            metadata={{
              source: textNl.bronnen.rivm,
            }}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={confirmedCasesInfectedTimeframe}
            onSelectTimeframe={setConfirmedCasesInfectedTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'confirmed_cases_infected_over_time_chart',
              }}
              values={data.tested_overall_archived_20230417.values}
              timeframe={confirmedCasesInfectedTimeframe}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'infected_moving_average',
                  label: textShared.labels.infected_moving_average,
                  color: colors.primary,
                },
                {
                  type: 'bar',
                  metricProperty: 'infected',
                  label: textShared.labels.infected,
                  color: colors.primary,
                  yAxisExceptionValues: [1644318000],
                },
              ]}
              dataOptions={{
                outOfBoundsConfig: {
                  label: textShared.labels.infected_out_of_bounds,
                  tooltipLabel: textShared.tooltip_labels.annotations,
                  checkIsOutofBounds: (x: NlTestedOverallArchived_20230417Value, max: number) => x.infected > max,
                },
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'tested_overall_archived_20230417'),
              }}
            />
          </ChartTile>

          <InView rootMargin="400px">
            {selectedGgdGraph === 'GGD_infected_percentage_over_time_chart' && (
              <ChartTile
                timeframeOptions={TimeframeOptionsList}
                title={textNl.ggd.linechart_percentage_titel}
                description={replaceVariablesInText(textNl.ggd.linechart_percentage_toelichting, {
                  date: formatDateFromSeconds(dataGgdLastValue.date_unix, 'weekday-long'),
                  tested_total: formatNumber(dataGgdLastValue.tested_total),
                  infected_total: formatNumber(dataGgdLastValue.infected),
                })}
                metadata={{
                  date: getLastInsertionDateOfPage(data, ['tested_ggd_archived_20230417']),
                  source: textNl.ggd.bronnen.rivm,
                }}
                onSelectTimeframe={setConfirmedCasesInfectedPercentageTimeframe}
                toggle={{
                  initialValue: selectedGgdGraph,
                  items: ggdGraphToggleItems,
                  onChange: (value) => setSelectedGgdGraph(value),
                }}
              >
                <TimeSeriesChart
                  accessibility={{
                    key: 'confirmed_cases_infected_percentage_over_time_chart',
                  }}
                  timeframe={confirmedCasesInfectedPercentageTimeframe}
                  values={data.tested_ggd_archived_20230417.values}
                  forceLegend
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty: 'infected_percentage_moving_average',
                      color: colors.primary,
                      label: textNl.ggd.linechart_percentage_legend_label,
                      shortLabel: textShared.tooltip_labels.ggd_infected_percentage_moving_average,
                    },
                  ]}
                  dataOptions={{
                    isPercentage: true,
                  }}
                />
              </ChartTile>
            )}
            {selectedGgdGraph === 'GGD_tested_over_time_chart' && (
              <ChartTile
                timeframeOptions={TimeframeOptionsList}
                title={textNl.ggd.linechart_totaltests_titel}
                description={replaceVariablesInText(textNl.ggd.linechart_totaltests_toelichting, {
                  date: formatDateFromSeconds(dataGgdLastValue.date_unix, 'weekday-long'),
                  tested_total: formatNumber(dataGgdLastValue.tested_total),
                  infected_total: formatNumber(dataGgdLastValue.infected),
                })}
                metadata={{
                  source: textNl.ggd.bronnen.rivm,
                  date: getLastInsertionDateOfPage(data, ['tested_ggd_archived_20230417']),
                }}
                onSelectTimeframe={setConfirmedCasesTestedOverTimeTimeframe}
                toggle={{
                  initialValue: selectedGgdGraph,
                  items: ggdGraphToggleItems,
                  onChange: (value) => setSelectedGgdGraph(value),
                }}
              >
                <TimeSeriesChart
                  accessibility={{
                    key: 'confirmed_cases_tested_over_time_chart',
                  }}
                  timeframe={confirmedCasesTestedOverTimeTimeframe}
                  values={data.tested_ggd_archived_20230417.values}
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty: 'tested_total_moving_average',
                      color: colors.secondary,
                      label: textNl.ggd.linechart_totaltests_legend_label_moving_average,
                      shortLabel: textShared.tooltip_labels.ggd_tested_total_moving_average__renamed,
                    },
                    {
                      type: 'line',
                      metricProperty: 'infected_moving_average',
                      color: colors.primary,
                      label: textNl.ggd.linechart_positivetests_legend_label_moving_average,
                      shortLabel: textShared.tooltip_labels.infected_moving_average,
                    },
                  ]}
                />
              </ChartTile>
            )}
          </InView>

          <InView rootMargin="400px">
            <ChartTile
              title={textShared.infected_per_age_group.title}
              description={textShared.infected_per_age_group.description}
              timeframeOptions={TimeframeOptionsList}
              metadata={{
                source: textNl.bronnen.rivm,
              }}
              onSelectTimeframe={setConfirmedCasesInfectedPerAgeTimeframe}
            >
              <InfectedPerAgeGroup
                accessibility={{
                  key: 'confirmed_cases_infected_per_age_group_over_time_chart',
                }}
                values={data.tested_per_age_group_archived_20230417.values}
                timeframe={confirmedCasesInfectedPerAgeTimeframe}
                timelineEvents={getTimelineEvents(content.elements.timeSeries, 'tested_per_age_group_archived_20230417')}
                text={textShared}
              />
            </ChartTile>
          </InView>

          <InView rootMargin="400px">
            <ChoroplethTile
              data-cy="choropleths"
              title={textNl.map_titel}
              metadata={{
                date: dataOverallLastValue.date_unix,
                source: textNl.bronnen.rivm,
              }}
              description={
                <>
                  <Markdown content={textNl.map_toelichting} />
                  <Box marginBottom={space[3]}>
                    {replaceComponentsInText(textNl.map_last_value_text, {
                      infected_per_100k: <BoldText>{`${formatNumber(dataOverallLastValue.infected_per_100k)}`}</BoldText>,
                      dateTo: formatDateFromSeconds(dataOverallLastValue.date_unix, 'weekday-long'),
                    })}
                  </Box>
                </>
              }
              legend={{
                title: textShared.chloropleth_legenda.titel,
                thresholds: thresholds.gm.infected_per_100k,
              }}
            >
              <DynamicChoropleth
                map="gm"
                accessibility={{
                  key: 'confirmed_cases_municipal_choropleth',
                }}
                data={choropleth.gm.tested_overall_archived_20230417}
                dataConfig={{
                  metricName: 'tested_overall_archived_20230417',
                  metricProperty: 'infected_per_100k',
                  dataFormatters: {
                    infected: formatNumber,
                    infected_per_100k: formatNumber,
                  },
                }}
                dataOptions={{
                  getLink: reverseRouter.gm.positiefGetesteMensen,
                }}
              />
            </ChoroplethTile>
          </InView>

          <InView rootMargin="400px">
            <GNumberBarChartTile data={data.g_number_archived_20230417} />
          </InView>
        </TileList>
      </NlLayout>
    </Layout>
  );
}

export default PositivelyTestedPeople;
