import {
  GmCollectionTestedOverall,
  GmGeoProperties,
} from '@corona-dashboard/common';
import Afname from '~/assets/afname.svg';
import Getest from '~/assets/test.svg';
import { Box, Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { GmChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { vrThresholds } from '~/components/choropleth/logic';
import { GmPositiveTestedPeopleTooltip } from '~/components/choropleth/tooltips';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageBarScale } from '~/components/page-barscale';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Anchor, InlineText, Text } from '~/components/typography';
import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { GNumberBarChartTile } from '~/domain/tested/g-number-bar-chart-tile';
import { useIntl } from '~/intl';
import {
  createElementsQuery,
  ElementsQueryResult,
  getTimelineEvents,
} from '~/queries/create-elements-query';
import {
  createPageArticlesQuery,
  PageArticlesQueryResult,
} from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrPageMetricData('tested_ggd', 'g_number'),
  createGetChoroplethData({
    gm: ({ tested_overall }) => ({ tested_overall }),
  }),
  createGetContent<{
    main: PageArticlesQueryResult;
    ggd: PageArticlesQueryResult;
    elements: ElementsQueryResult;
  }>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return `{
      "main": ${createPageArticlesQuery('positiveTestsPage', locale)},
      "ggd": ${createPageArticlesQuery(
        'positiveTestsPage',
        locale,
        'ggdArticles'
      )},
      "elements": ${createElementsQuery(
        'vr',
        ['tested_overall', 'tested_ggd'],
        locale
      )}
    }`;
  })
);

const PositivelyTestedPeople = (props: StaticProps<typeof getStaticProps>) => {
  const {
    selectedVrData: data,
    choropleth,
    vrName,
    content,
    lastGenerated,
  } = props;

  const { siteText, formatNumber, formatPercentage } = useIntl();

  const reverseRouter = useReverseRouter();

  const text = siteText.veiligheidsregio_positief_geteste_personen;
  const ggdText = siteText.veiligheidsregio_positief_geteste_personen_ggd;

  const dataOverallLastValue = data.tested_overall.last_value;
  const dataGgdLastValue = data.tested_ggd.last_value;
  const dataGgdValues = data.tested_ggd.values;
  const difference = data.difference;

  const municipalCodes = gmCodesByVrCode[data.code];
  const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(text.metadata.title, {
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      safetyRegionName: vrName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout data={data} vrName={vrName} lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            category={siteText.veiligheidsregio_layout.headings.besmettingen}
            screenReaderCategory={
              siteText.positief_geteste_personen.titel_sidebar
            }
            title={replaceVariablesInText(text.titel, {
              safetyRegion: vrName,
            })}
            icon={<Getest />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: dataOverallLastValue.date_unix,
              dateOfInsertionUnix: dataOverallLastValue.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
            }}
            referenceLink={text.reference.href}
            articles={content.main.articles}
          />

          <TwoKpiSection>
            <KpiTile
              title={text.kpi_titel}
              metadata={{
                date: dataOverallLastValue.date_unix,
                source: text.bronnen.rivm,
              }}
            >
              <Box spacing={3}>
                <KpiValue
                  data-cy="infected"
                  absolute={Math.round(dataOverallLastValue.infected)}
                  difference={
                    data.difference.tested_overall__infected_moving_average
                  }
                  isMovingAverageDifference
                />

                <Markdown content={text.kpi_toelichting} />

                <Box>
                  <Text variant="body2" fontWeight="bold">
                    {replaceComponentsInText(ggdText.summary_title, {
                      percentage: (
                        <InlineText color="data.primary">{`${formatPercentage(
                          dataGgdLastValue.infected_percentage
                        )}%`}</InlineText>
                      ),
                    })}
                  </Text>
                  <Anchor underline="hover" href="#ggd">
                    {ggdText.summary_link_cta}
                  </Anchor>
                </Box>
              </Box>
            </KpiTile>

            <KpiTile
              title={text.barscale_titel}
              metadata={{
                date: dataOverallLastValue.date_unix,
                source: text.bronnen.rivm,
              }}
            >
              <PageBarScale
                data={data}
                scope="vr"
                metricName="tested_overall"
                metricProperty="infected_per_100k"
                localeTextKey="veiligheidsregio_positief_geteste_personen"
                differenceKey="tested_overall__infected_per_100k_moving_average"
                isMovingAverageDifference
              />
              <Text>{text.barscale_toelichting}</Text>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            title={text.linechart_titel}
            description={text.linechart_toelichting}
            metadata={{
              source: text.bronnen.rivm,
            }}
            timeframeOptions={['all', '5weeks']}
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
                    metricProperty: 'infected_per_100k_moving_average',
                    label:
                      siteText.positief_geteste_personen.tooltip_labels
                        .infected_per_100k_moving_average,
                    color: colors.data.primary,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'infected_per_100k',
                    label:
                      siteText.positief_geteste_personen.tooltip_labels
                        .infected_per_100k,
                    color: colors.data.primary,
                  },
                  {
                    type: 'invisible',
                    metricProperty: 'infected',
                    label: siteText.common.totaal,
                  },
                ]}
                dataOptions={{
                  benchmark: {
                    value: 7,
                    label: siteText.common.signaalwaarde,
                  },
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'tested_overall'
                  ),
                }}
              />
            )}
          </ChartTile>

          <ChoroplethTile
            title={replaceVariablesInText(text.map_titel, {
              safetyRegion: vrName,
            })}
            metadata={{
              date: dataOverallLastValue.date_unix,
              source: text.bronnen.rivm,
            }}
            description={text.map_toelichting}
            legend={{
              title:
                siteText.positief_geteste_personen.chloropleth_legenda.titel,
              thresholds: vrThresholds.tested_overall.infected_per_100k,
            }}
          >
            <GmChoropleth
              accessibility={{
                key: 'confirmed_cases_infected_people_choropleth',
              }}
              selectedCode={selectedMunicipalCode}
              highlightSelection={false}
              data={choropleth.gm}
              getLink={reverseRouter.gm.positiefGetesteMensen}
              metricName="tested_overall"
              metricProperty="infected_per_100k"
              tooltipContent={(
                context: GmGeoProperties & GmCollectionTestedOverall
              ) => <GmPositiveTestedPeopleTooltip context={context} />}
            />
          </ChoroplethTile>

          <GNumberBarChartTile data={data.g_number} />

          <Spacer mb={3} />

          <PageInformationBlock
            id="ggd"
            title={replaceVariablesInText(ggdText.titel, {
              safetyRegion: vrName,
            })}
            icon={<Afname />}
            description={ggdText.toelichting}
            metadata={{
              datumsText: ggdText.datums,
              dateOfInsertionUnix: dataGgdLastValue.date_of_insertion_unix,
              dateOrRange: dataGgdLastValue.date_unix,
              dataSources: [ggdText.bronnen.rivm],
            }}
            referenceLink={text.reference.href}
            articles={content.ggd.articles}
          />

          <TwoKpiSection>
            <KpiTile
              title={ggdText.totaal_getest_week_titel}
              metadata={{
                date: dataGgdLastValue.date_unix,
                source: ggdText.bronnen.rivm,
              }}
            >
              <KpiValue
                absolute={dataGgdLastValue.tested_total}
                difference={difference.tested_ggd__tested_total_moving_average}
                isMovingAverageDifference
              />
              <Text>{ggdText.totaal_getest_week_uitleg}</Text>
            </KpiTile>
            <KpiTile
              title={ggdText.positief_getest_week_titel}
              metadata={{
                date: dataGgdLastValue.date_unix,
                source: ggdText.bronnen.rivm,
              }}
            >
              <KpiValue
                percentage={dataGgdLastValue.infected_percentage}
                difference={
                  difference.tested_ggd__infected_percentage_moving_average
                }
                isMovingAverageDifference
              />
              <Text>{ggdText.positief_getest_week_uitleg}</Text>
              <Text fontWeight="bold">
                {replaceComponentsInText(
                  ggdText.positief_getest_getest_week_uitleg,
                  {
                    numerator: (
                      <InlineText color="data.primary">
                        {formatNumber(dataGgdLastValue.infected)}
                      </InlineText>
                    ),
                    denominator: (
                      <InlineText color="data.primary">
                        {formatNumber(dataGgdLastValue.tested_total)}
                      </InlineText>
                    ),
                  }
                )}
              </Text>
            </KpiTile>
          </TwoKpiSection>

          <ChartTile
            timeframeOptions={['all', '5weeks']}
            title={ggdText.linechart_percentage_titel}
            description={ggdText.linechart_percentage_toelichting}
            metadata={{
              source: ggdText.bronnen.rivm,
            }}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'confirmed_cases_infected_percentage_over_time_chart',
                }}
                timeframe={timeframe}
                values={dataGgdValues}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'infected_percentage_moving_average',
                    color: colors.data.primary,
                    label:
                      siteText.positief_geteste_personen.tooltip_labels
                        .infected_percentage_moving_average,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'infected_percentage',
                    color: colors.data.primary,
                    label:
                      siteText.positief_geteste_personen.tooltip_labels
                        .infected_percentage,
                  },
                ]}
                dataOptions={{
                  isPercentage: true,
                  timelineEvents: getTimelineEvents(
                    content.elements.timeSeries,
                    'tested_ggd'
                  ),
                }}
              />
            )}
          </ChartTile>

          <ChartTile
            timeframeOptions={['all', '5weeks']}
            title={ggdText.linechart_totaltests_titel}
            description={ggdText.linechart_totaltests_toelichting}
            metadata={{
              source: ggdText.bronnen.rivm,
            }}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'confirmed_cases_tested_total_over_time_chart',
                }}
                timeframe={timeframe}
                values={dataGgdValues}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'tested_total_moving_average',
                    color: colors.data.secondary,
                    label:
                      ggdText.linechart_totaltests_legend_label_moving_average,
                    shortLabel:
                      siteText.positief_geteste_personen.tooltip_labels
                        .tested_total_moving_average,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'tested_total',
                    color: colors.data.secondary,
                    label: ggdText.linechart_totaltests_legend_label,
                    shortLabel:
                      siteText.positief_geteste_personen.tooltip_labels
                        .tested_total,
                  },
                  {
                    type: 'line',
                    metricProperty: 'infected_moving_average',
                    color: colors.data.primary,
                    label:
                      ggdText.linechart_positivetests_legend_label_moving_average,
                    shortLabel:
                      siteText.positief_geteste_personen.tooltip_labels
                        .infected_moving_average,
                  },
                  {
                    type: 'bar',
                    metricProperty: 'infected',
                    color: colors.data.primary,
                    label: ggdText.linechart_positivetests_legend_label,
                    shortLabel:
                      siteText.positief_geteste_personen.tooltip_labels
                        .infected,
                  },
                  {
                    type: 'invisible',
                    metricProperty: 'infected_percentage',
                    label:
                      siteText.positief_geteste_personen.tooltip_labels
                        .infected_percentage,
                    isPercentage: true,
                  },
                ]}
              />
            )}
          </ChartTile>
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default PositivelyTestedPeople;
