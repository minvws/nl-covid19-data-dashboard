import { colors, TimeframeOptionsList } from '@corona-dashboard/common';
import { Test } from '@corona-dashboard/icons';
import { css } from '@styled-system/css';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box } from '~/components/base';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { RadioGroup } from '~/components/radio-group';
import { BoldText, InlineText } from '~/components/typography';
import {
  ChartTile,
  TimeSeriesChart,
  TileList,
  DynamicChoropleth,
  ChoroplethTile,
  Divider,
  InView,
  Markdown,
  PageInformationBlock,
} from '~/components';
import { gmCodesByVrCode } from '~/data';
import { Layout, VrLayout } from '~/domain/layout';
import { GNumberBarChartTile } from '~/domain/tested';
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
  selectVrData,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import {
  replaceComponentsInText,
  replaceVariablesInText,
  useReverseRouter,
} from '~/utils';

import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';

const pageMetrics = ['g_number', 'tested_ggd', 'tested_overall'];

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        textVr: siteText.pages.positiveTestsPage.vr,
        textShared: siteText.pages.positiveTestsPage.shared,
      }),
      locale
    ),
  getLastGeneratedDate,
  selectVrData(
    'difference.tested_ggd__infected_percentage_moving_average',
    'difference.tested_ggd__tested_total_moving_average',
    'difference.tested_overall__infected_moving_average',
    'difference.tested_overall__infected_per_100k_moving_average',
    'g_number',
    'tested_ggd',
    'tested_overall'
  ),
  createGetChoroplethData({
    gm: ({ tested_overall }) => ({ tested_overall }),
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
         'vr',
         ['tested_overall', 'tested_ggd'],
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
    selectedVrData: data,
    choropleth,
    vrName,
    content,
    lastGenerated,
  } = props;

  const { commonTexts, formatNumber, formatDateFromSeconds } = useIntl();

  const reverseRouter = useReverseRouter();
  const router = useRouter();
  const [hasHideArchivedCharts, setHideArchivedCharts] =
    useState<boolean>(false);
  const [selectedGgdGraph, setSelectedGgdGraph] = useState<string>(
    'GGD_infected_percentage_over_time_chart'
  );

  const { textVr, textShared } = pageText;

  const dataOverallLastValue = data.tested_overall.last_value;
  const dataGgdLastValue = data.tested_ggd.last_value;

  const municipalCodes = gmCodesByVrCode[router.query.code as string];
  const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;

  const metadata = {
    ...commonTexts.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(textVr.metadata.title, {
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(textVr.metadata.description, {
      safetyRegionName: vrName,
    }),
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.veiligheidsregio_layout.headings.besmettingen}
            screenReaderCategory={
              commonTexts.sidebar.metrics.positive_tests.title
            }
            title={replaceVariablesInText(textVr.titel, {
              safetyRegion: vrName,
            })}
            icon={<Test />}
            description={textVr.pagina_toelichting}
            metadata={{
              datumsText: textVr.datums,
              dateOrRange: dataOverallLastValue.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textVr.bronnen.rivm],
            }}
            referenceLink={textVr.reference.href}
            articles={content.articles}
            vrNameOrGmName={vrName}
            warning={textVr.warning}
          />

          <ChartTile
            title={textVr.linechart_titel}
            description={replaceVariablesInText(textVr.linechart_toelichting, {
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
              source: textVr.bronnen.rivm,
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
                    label: textShared.labels.infected_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'infected',
                    label: textShared.labels.infected,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
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
                title={textVr.ggd.linechart_percentage_titel}
                description={replaceVariablesInText(
                  textVr.ggd.linechart_percentage_toelichting,
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
                  source: textVr.ggd.bronnen.rivm,
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
                          label: textVr.ggd.linechart_percentage_legend_label,
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
                title={textVr.ggd.linechart_totaltests_titel}
                description={replaceVariablesInText(
                  textVr.ggd.linechart_totaltests_toelichting,
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
                  source: textVr.ggd.bronnen.rivm,
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
                        key: 'confirmed_cases_tested_total_over_time_chart',
                      }}
                      timeframe={timeframe}
                      values={data.tested_ggd.values}
                      seriesConfig={[
                        {
                          type: 'line',
                          metricProperty: 'tested_total_moving_average',
                          color: colors.data.secondary,
                          label:
                            textVr.ggd
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
                            textVr.ggd
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
            <ChoroplethTile
              title={replaceVariablesInText(textVr.map_titel, {
                safetyRegion: vrName,
              })}
              metadata={{
                date: dataOverallLastValue.date_unix,
                source: textVr.bronnen.rivm,
              }}
              description={
                <>
                  <Markdown content={textVr.map_toelichting} />
                  <BoldText variant="body2">
                    {replaceComponentsInText(textVr.map_last_value_text, {
                      infected_per_100k: (
                        <InlineText color="data.primary">{`${formatNumber(
                          dataOverallLastValue.infected_per_100k
                        )}`}</InlineText>
                      ),
                      dateTo: formatDateFromSeconds(
                        dataOverallLastValue.date_unix,
                        'weekday-medium'
                      ),
                      safetyRegion: vrName,
                    })}
                  </BoldText>
                </>
              }
              legend={{
                title: textShared.chloropleth_legenda.titel,
                thresholds: thresholds.vr.infected_per_100k,
              }}
            >
              <DynamicChoropleth
                map="gm"
                accessibility={{
                  key: 'confirmed_cases_infected_people_choropleth',
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
                  selectedCode: selectedMunicipalCode,
                }}
              />
            </ChoroplethTile>
          </InView>

          <Divider />

          <PageInformationBlock
            title={textVr.section_archived.title}
            description={textVr.section_archived.description}
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
      </VrLayout>
    </Layout>
  );
};

export default PositivelyTestedPeople;
