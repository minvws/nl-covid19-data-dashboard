import {
  colors,
  NlTestedOverallValue,
  TimeframeOptionsList,
} from '@corona-dashboard/common';
import { Test } from '@corona-dashboard/icons';
import { css } from '@styled-system/css';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { Box } from '~/components/base';
import { RadioGroup } from '~/components/radio-group';
import { BoldText } from '~/components/typography';
import { RegionControlOption } from '~/components/chart-region-controls';
import {
  TimeSeriesChart,
  TileList,
  PageInformationBlock,
  ChartTile,
  DynamicChoropleth,
  ChoroplethTile,
  Divider,
  InView,
  Markdown,
} from '~/components';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { Layout, NlLayout } from '~/domain/layout';
import { GNumberBarChartTile, InfectedPerAgeGroup } from '~/domain/tested';
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
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectNlData,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import {
  replaceComponentsInText,
  replaceVariablesInText,
  useReverseRouter,
} from '~/utils';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';

const pageMetrics = [
  'g_number',
  'tested_ggd',
  'tested_ggd_archived',
  'tested_overall',
  'tested_per_age_group',
];

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        metadataTexts: siteText.pages.topicalPage.nl.nationaal_metadata,
        textNl: siteText.pages.positiveTestsPage.nl,
        textShared: siteText.pages.positiveTestsPage.shared,
      }),
      locale
    ),
  getLastGeneratedDate,
  selectNlData(
    'difference.tested_ggd__infected_percentage_moving_average',
    'difference.tested_ggd__tested_total_moving_average',
    'difference.tested_overall__infected_moving_average',
    'difference.tested_overall__infected_per_100k_moving_average',
    'g_number',
    'tested_ggd',
    'tested_ggd_archived',
    'tested_overall',
    'tested_per_age_group'
  ),
  createGetChoroplethData({
    gm: ({ tested_overall }) => ({ tested_overall }),
    vr: ({ tested_overall }) => ({ tested_overall }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
       "parts": ${getPagePartsQuery('positiveTestsPage')},
       "elements": ${getElementsQuery(
         'nl',
         ['tested_overall', 'tested_ggd', 'tested_per_age_group'],
         locale
       )}
      }`;
    })(context);
    return {
      content: {
        articles: getArticleParts(
          content.parts.pageParts,
          'positiveTestsPageArticles'
        ),
        ggdArticles: getArticleParts(
          content.parts.pageParts,
          'positiveTestsGGDArticles'
        ),
        elements: content.elements,
      },
    };
  }
);

const GgdGraphToggle = ({
  selectedGgdGraph,
  onChange,
}: {
  selectedGgdGraph: string;
  onChange: (value: string) => void;
}) => {
  return (
    <Box css={css({ '& div': { justifyContent: 'flex-start' } })} mb={3}>
      <RadioGroup
        value={selectedGgdGraph}
        onChange={onChange}
        items={[
          {
            label: 'Percentage positieve GGD-testen',
            value: 'GGD_infected_percentage_over_time_chart',
          },
          {
            label: 'Aantal GGD-testen',
            value: 'GGD_tested_over_time_chart',
          },
        ]}
      />
    </Box>
  );
};

const PositivelyTestedPeople = (props: StaticProps<typeof getStaticProps>) => {
  const {
    pageText,
    selectedNlData: data,
    choropleth,
    content,
    lastGenerated,
  } = props;

  const { commonTexts, formatNumber, formatDateFromSeconds } = useIntl();
  const reverseRouter = useReverseRouter();
  const [hasHideArchivedCharts, setHideArchivedCharts] =
    useState<boolean>(false);

  const { metadataTexts, textNl, textShared } = pageText;

  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');
  const [selectedGgdGraph, setSelectedGgdGraph] = useState<string>(
    'GGD_infected_percentage_over_time_chart'
  );

  const dataOverallLastValue = data.tested_overall.last_value;
  const dataGgdLastValue = data.tested_ggd.last_value;

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.nationaal_layout.headings.besmettingen}
            screenReaderCategory={
              commonTexts.sidebar.metrics.positive_tests.title
            }
            title={textNl.titel}
            icon={<Test />}
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

          <ChartTile
            title={textNl.linechart_titel}
            description={replaceVariablesInText(textNl.linechart_toelichting, {
              date: formatDateFromSeconds(
                dataOverallLastValue.date_unix,
                'weekday-medium'
              ),
              administered_total: formatNumber(dataOverallLastValue.infected),
              infected_total: formatNumber(
                dataOverallLastValue.infected_moving_average_rounded
              ),
            })}
            metadata={{
              source: textNl.bronnen.rivm,
            }}
            timeframeOptions={TimeframeOptionsList}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'confirmed_cases_infected_over_time_chart',
                }}
                values={data.tested_overall.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'infected_moving_average',
                    label: textShared.tooltip_labels.infected_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'infected',
                    label: textShared.tooltip_labels.infected,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  forcedMaximumValue: 150000,
                  outOfBoundsConfig: {
                    label: textShared.tooltip_labels.infected_out_of_bounds,
                    tooltipLabel: textShared.tooltip_labels.annotations,
                    checkIsOutofBounds: (
                      x: NlTestedOverallValue,
                      max: number
                    ) => x.infected > max,
                  },
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'tested_overall'
                  ),
                }}
              />
            )}
          </ChartTile>

          <InView rootMargin="400px">
            {selectedGgdGraph === 'GGD_infected_percentage_over_time_chart' && (
              <ChartTile
                timeframeOptions={TimeframeOptionsList}
                title={textNl.ggd.linechart_percentage_titel}
                description={replaceVariablesInText(
                  textNl.ggd.linechart_percentage_toelichting,
                  {
                    date: formatDateFromSeconds(
                      dataGgdLastValue.date_unix,
                      'weekday-medium'
                    ),
                    tested_total: formatNumber(dataGgdLastValue.tested_total),
                    infected_total: formatNumber(dataGgdLastValue.infected),
                  }
                )}
                metadata={{
                  date: getLastInsertionDateOfPage(data, ['tested_ggd']),
                  source: textNl.ggd.bronnen.rivm,
                }}
              >
                {(timeframe) => (
                  <>
                    <GgdGraphToggle
                      selectedGgdGraph={selectedGgdGraph}
                      onChange={(value) => setSelectedGgdGraph(value)}
                    />
                    <TimeSeriesChart
                      accessibility={{
                        key: 'confirmed_cases_infected_percentage_over_time_chart',
                      }}
                      timeframe={timeframe}
                      values={data.tested_ggd.values}
                      forceLegend
                      seriesConfig={[
                        {
                          type: 'line',
                          metricProperty: 'infected_percentage_moving_average',
                          color: colors.data.primary,
                          label: textNl.ggd.linechart_percentage_legend_label,
                          shortLabel:
                            textShared.tooltip_labels
                              .ggd_infected_percentage_moving_average,
                        },
                      ]}
                      dataOptions={{
                        isPercentage: true,
                      }}
                    />
                  </>
                )}
              </ChartTile>
            )}
            {selectedGgdGraph === 'GGD_tested_over_time_chart' && (
              <ChartTile
                timeframeOptions={TimeframeOptionsList}
                title={textNl.ggd.linechart_totaltests_titel}
                description={replaceVariablesInText(
                  textNl.ggd.linechart_totaltests_toelichting,
                  {
                    date: formatDateFromSeconds(
                      dataGgdLastValue.date_unix,
                      'weekday-medium'
                    ),
                    tested_total: formatNumber(dataGgdLastValue.tested_total),
                    infected_total: formatNumber(dataGgdLastValue.infected),
                  }
                )}
                metadata={{
                  source: textNl.ggd.bronnen.rivm,
                  date: getLastInsertionDateOfPage(data, ['tested_ggd']),
                }}
              >
                {(timeframe) => (
                  <>
                    <GgdGraphToggle
                      selectedGgdGraph={selectedGgdGraph}
                      onChange={(value) => setSelectedGgdGraph(value)}
                    />
                    <TimeSeriesChart
                      accessibility={{
                        key: 'confirmed_cases_tested_over_time_chart',
                      }}
                      timeframe={timeframe}
                      values={data.tested_ggd.values}
                      seriesConfig={[
                        {
                          type: 'line',
                          metricProperty: 'tested_total_moving_average',
                          color: colors.data.secondary,
                          label:
                            textNl.ggd
                              .linechart_totaltests_legend_label_moving_average,
                          shortLabel:
                            textShared.tooltip_labels
                              .ggd_tested_total_moving_average,
                        },
                        {
                          type: 'line',
                          metricProperty: 'infected_moving_average',
                          color: colors.data.primary,
                          label:
                            textNl.ggd
                              .linechart_positivetests_legend_label_moving_average,
                          shortLabel:
                            textShared.tooltip_labels.infected_moving_average,
                        },
                      ]}
                    />
                  </>
                )}
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
            >
              {(timeframe) => (
                <InfectedPerAgeGroup
                  accessibility={{
                    key: 'confirmed_cases_infected_per_age_group_over_time_chart',
                  }}
                  values={data.tested_per_age_group.values}
                  timeframe={timeframe}
                  timelineEvents={getTimelineEvents(
                    content.elements.timeSeries,
                    'tested_per_age_group'
                  )}
                  text={textShared}
                />
              )}
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
                  {replaceComponentsInText(textNl.map_last_value_text, {
                    infected_per_100k: (
                      <BoldText>{`${formatNumber(
                        dataOverallLastValue.infected_per_100k
                      )}`}</BoldText>
                    ),
                    dateTo: formatDateFromSeconds(
                      dataOverallLastValue.date_unix,
                      'weekday-medium'
                    ),
                  })}
                </>
              }
              onChartRegionChange={setSelectedMap}
              chartRegion={selectedMap}
              legend={{
                title: textShared.chloropleth_legenda.titel,
                thresholds: thresholds.vr.infected_per_100k,
              }}
            >
              {/**
               * It's probably a good idea to abstract this even further, so that
               * the switching of charts, and the state involved, are all handled by
               * the component. The page does not have to be bothered with this.
               *
               * Ideally the ChoroplethTile would receive some props with the data
               * it needs to render either Choropleth without it caring about
               * MunicipalityChloropleth or VrChloropleth, that data would
               * make the chart and define the tooltip layout for each, but maybe for
               * now that is a bridge too far. Let's take it one step at a time.
               */}
              {selectedMap === 'gm' && (
                <DynamicChoropleth
                  map="gm"
                  accessibility={{
                    key: 'confirmed_cases_municipal_choropleth',
                  }}
                  data={choropleth.gm.tested_overall}
                  dataConfig={{
                    metricName: 'tested_overall',
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
              )}
              {selectedMap === 'vr' && (
                <DynamicChoropleth
                  map="vr"
                  accessibility={{
                    key: 'confirmed_cases_region_choropleth',
                  }}
                  data={choropleth.vr.tested_overall}
                  dataConfig={{
                    metricName: 'tested_overall',
                    metricProperty: 'infected_per_100k',
                    dataFormatters: {
                      infected: formatNumber,
                      infected_per_100k: formatNumber,
                    },
                  }}
                  dataOptions={{
                    getLink: reverseRouter.vr.positiefGetesteMensen,
                  }}
                />
              )}
            </ChoroplethTile>
          </InView>

          <Divider />

          <PageInformationBlock
            title={textNl.section_archived.title}
            description={textNl.section_archived.description}
            isArchivedHidden={hasHideArchivedCharts}
            onToggleArchived={() =>
              setHideArchivedCharts(!hasHideArchivedCharts)
            }
          />

          {hasHideArchivedCharts && (
            <InView rootMargin="400px">
              <GNumberBarChartTile data={data.g_number} />
            </InView>
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default PositivelyTestedPeople;
