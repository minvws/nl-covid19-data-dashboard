import {
  MunicipalitiesTestedOverall,
  MunicipalityProperties,
} from '@corona-dashboard/common';
import Afname from '~/assets/afname.svg';
import Getest from '~/assets/test.svg';
import { Anchor } from '~/components/anchor';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { PositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/positive-tested-people-municipal-tooltip';
import { ContentHeader } from '~/components/content-header';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageBarScale } from '~/components/page-barscale';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text } from '~/components/typography';
import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { GNumberBarChartTile } from '~/domain/tested/g-number-bar-chart-tile';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectDefaultVrData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectDefaultVrData('tested_ggd_average', 'tested_ggd_daily', 'g_number'),
  createGetChoroplethData({
    gm: ({ tested_overall }) => ({ tested_overall }),
  }),
  createGetContent<{
    articles?: ArticleSummary[];
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('positiveTestsPage', locale);
  })
);

const PositivelyTestedPeople = (props: StaticProps<typeof getStaticProps>) => {
  const {
    selectedVrData: data,
    choropleth,
    safetyRegionName,
    content,
    lastGenerated,
  } = props;

  const { siteText, formatNumber, formatPercentage } = useIntl();

  const reverseRouter = useReverseRouter();

  const text = siteText.veiligheidsregio_positief_geteste_personen;
  const ggdText = siteText.veiligheidsregio_positief_geteste_personen_ggd;

  const dataOverallLastValue = data.tested_overall.last_value;
  const dataGgdAverageLastValue = data.tested_ggd_average.last_value;
  const dataGgdDailyValues = data.tested_ggd_daily.values;

  const municipalCodes = gmCodesByVrCode[data.code];
  const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(text.metadata.title, {
      safetyRegionName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      safetyRegionName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <SafetyRegionLayout
        data={data}
        safetyRegionName={safetyRegionName}
        lastGenerated={lastGenerated}
      >
        <TileList>
          <ContentHeader
            category={siteText.veiligheidsregio_layout.headings.besmettingen}
            screenReaderCategory={
              siteText.positief_geteste_personen.titel_sidebar
            }
            title={replaceVariablesInText(text.titel, {
              safetyRegion: safetyRegionName,
            })}
            icon={<Getest />}
            subtitle={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: dataOverallLastValue.date_unix,
              dateOfInsertionUnix: dataOverallLastValue.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
            }}
            reference={text.reference}
          />

          <ArticleStrip articles={content.articles} />

          <TwoKpiSection>
            <KpiTile
              title={text.kpi_titel}
              metadata={{
                date: dataOverallLastValue.date_unix,
                source: text.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="infected"
                absolute={Math.round(dataOverallLastValue.infected)}
                difference={data.difference.tested_overall__infected}
              />
              <Markdown content={text.kpi_toelichting} />

              <Box>
                <Heading level={4} fontSize={'1.2em'} mt={'1.5em'} mb={0}>
                  {replaceComponentsInText(ggdText.summary_title, {
                    percentage: (
                      <InlineText color="data.primary">{`${formatPercentage(
                        dataGgdAverageLastValue.infected_percentage
                      )}%`}</InlineText>
                    ),
                  })}
                </Heading>
                <Text mt={0} lineHeight={1}>
                  <Anchor name="ggd" text={ggdText.summary_link_cta} />
                </Text>
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
                differenceKey="tested_overall__infected_per_100k"
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
            timeframeOptions={['all', '5weeks', 'week']}
          >
            {(timeframe) => (
              <TimeSeriesChart
                values={data.tested_overall.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'area',
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
                }}
              />
            )}
          </ChartTile>

          <ChoroplethTile
            title={replaceVariablesInText(text.map_titel, {
              safetyRegion: safetyRegionName,
            })}
            metadata={{
              date: dataOverallLastValue.date_unix,
              source: text.bronnen.rivm,
            }}
            description={text.map_toelichting}
            legend={{
              title:
                siteText.positief_geteste_personen.chloropleth_legenda.titel,
              thresholds: regionThresholds.tested_overall.infected_per_100k,
            }}
          >
            <MunicipalityChoropleth
              selectedCode={selectedMunicipalCode}
              highlightSelection={false}
              data={choropleth.gm}
              getLink={reverseRouter.gm.positiefGetesteMensen}
              metricName="tested_overall"
              metricProperty="infected_per_100k"
              tooltipContent={(
                context: MunicipalityProperties & MunicipalitiesTestedOverall
              ) => <PositiveTestedPeopleMunicipalTooltip context={context} />}
            />
          </ChoroplethTile>

          <GNumberBarChartTile data={data.g_number} />

          <ContentHeader
            id="ggd"
            title={replaceVariablesInText(ggdText.titel, {
              safetyRegion: safetyRegionName,
            })}
            skipLinkAnchor={true}
            icon={<Afname />}
            subtitle={ggdText.toelichting}
            metadata={{
              datumsText: ggdText.datums,
              dateOfInsertionUnix:
                dataGgdAverageLastValue.date_of_insertion_unix,
              dateOrRange: {
                start: dataGgdAverageLastValue.date_start_unix,
                end: dataGgdAverageLastValue.date_end_unix,
              },
              dataSources: [ggdText.bronnen.rivm],
            }}
            reference={text.reference}
          />

          <TwoKpiSection>
            <KpiTile
              title={ggdText.totaal_getest_week_titel}
              metadata={{
                date: [
                  dataGgdAverageLastValue.date_start_unix,
                  dataGgdAverageLastValue.date_end_unix,
                ],
                source: ggdText.bronnen.rivm,
              }}
            >
              <KpiValue
                absolute={dataGgdAverageLastValue.tested_total}
                difference={data.difference.tested_ggd_average__tested_total}
              />
              <Text>{ggdText.totaal_getest_week_uitleg}</Text>
            </KpiTile>
            <KpiTile
              title={ggdText.positief_getest_week_titel}
              metadata={{
                date: dataGgdAverageLastValue.date_end_unix,
                source: ggdText.bronnen.rivm,
              }}
            >
              <KpiValue
                percentage={dataGgdAverageLastValue.infected_percentage}
                difference={
                  data.difference.tested_ggd_average__infected_percentage
                }
              />
              <Text>{ggdText.positief_getest_week_uitleg}</Text>
              <Text fontWeight="bold">
                {replaceComponentsInText(
                  ggdText.positief_getest_getest_week_uitleg,
                  {
                    numerator: (
                      <InlineText color="data.primary">
                        {formatNumber(dataGgdAverageLastValue.infected)}
                      </InlineText>
                    ),
                    denominator: (
                      <InlineText color="data.primary">
                        {formatNumber(dataGgdAverageLastValue.tested_total)}
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
                timeframe={timeframe}
                values={dataGgdDailyValues}
                seriesConfig={[
                  {
                    type: 'area',
                    metricProperty: 'infected_percentage',
                    color: colors.data.primary,
                    label:
                      siteText.positief_geteste_personen.tooltip_labels
                        .infected_percentage,
                  },
                ]}
                dataOptions={{ isPercentage: true }}
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
                timeframe={timeframe}
                values={dataGgdDailyValues}
                seriesConfig={[
                  {
                    type: 'line',
                    metricProperty: 'tested_total',
                    color: colors.data.secondary,
                    label: ggdText.linechart_totaltests_legend_label,
                    shortLabel:
                      siteText.positief_geteste_personen.tooltip_labels
                        .tested_total,
                  },
                  {
                    type: 'line',
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
      </SafetyRegionLayout>
    </Layout>
  );
};

export default PositivelyTestedPeople;
