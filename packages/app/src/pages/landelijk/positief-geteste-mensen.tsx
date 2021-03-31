import {
  MunicipalitiesTestedOverall,
  MunicipalityProperties,
  RegionsTestedOverall,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useState } from 'react';
import Afname from '~/assets/afname.svg';
import Getest from '~/assets/test.svg';
import { Anchor } from '~/components-styled/anchor';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { RegionControlOption } from '~/components-styled/chart-region-controls';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Markdown } from '~/components-styled/markdown';
import { PageBarScale } from '~/components-styled/page-barscale';
import { TileList } from '~/components-styled/tile-list';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { GNumberBarChartTile } from '~/domain/tested/g-number-bar-chart-tile';
import { PositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/positive-tested-people-municipal-tooltip';
import { PositiveTestedPeopleRegionalTooltip } from '~/components/choropleth/tooltips/region/positive-tested-people-regional-tooltip';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
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
  getNlData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  createGetChoroplethData({
    gm: ({ tested_overall }) => ({ tested_overall }),
    vr: ({ tested_overall }) => ({ tested_overall }),
  }),
  createGetContent<{
    articles?: ArticleSummary[];
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('positiveTestsPage', locale);
  })
);

const PositivelyTestedPeople = (props: StaticProps<typeof getStaticProps>) => {
  const { data, choropleth, content, lastGenerated } = props;
  const {
    siteText,
    formatNumber,
    formatPercentage,
    formatDateFromSeconds,
  } = useIntl();
  const reverseRouter = useReverseRouter();

  const text = siteText.positief_geteste_personen;
  const ggdText = siteText.positief_geteste_personen_ggd;
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>(
    'municipal'
  );

  const dataOverallLastValue = data.tested_overall.last_value;
  const dataGgdAverageLastValue = data.tested_ggd_average.last_value;
  const dataGgdDailyValues = data.tested_ggd_daily.values;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          <ContentHeader
            category={siteText.nationaal_layout.headings.besmettingen}
            screenReaderCategory={
              siteText.positief_geteste_personen.titel_sidebar
            }
            title={text.titel}
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
                absolute={dataOverallLastValue.infected}
                difference={data.difference.tested_overall__infected}
              />

              <Box mb={4}>
                <Markdown content={text.kpi_toelichting} />
              </Box>

              <Box>
                <Heading level={4} fontSize={'1.2em'} mb={0}>
                  {replaceComponentsInText(ggdText.summary_text, {
                    percentage: (
                      <span css={css({ color: 'data.primary' })}>
                        {formatPercentage(
                          dataGgdAverageLastValue.infected_percentage
                        )}
                        %
                      </span>
                    ),
                    dateFrom: formatDateFromSeconds(
                      dataGgdAverageLastValue.date_start_unix,
                      'weekday-medium'
                    ),
                    dateTo: formatDateFromSeconds(
                      dataGgdAverageLastValue.date_end_unix,
                      'weekday-medium'
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
              data-cy="infected_per_100k"
              metadata={{
                date: dataOverallLastValue.date_unix,
                source: text.bronnen.rivm,
              }}
            >
              <PageBarScale
                data={data}
                scope="nl"
                metricName="tested_overall"
                metricProperty="infected_per_100k"
                localeTextKey="positief_geteste_personen"
                differenceKey="tested_overall__infected_per_100k"
              />

              <Text>{text.barscale_toelichting}</Text>
            </KpiTile>
          </TwoKpiSection>

          <ChoroplethTile
            data-cy="choropleths"
            title={text.map_titel}
            metadata={{
              date: dataOverallLastValue.date_unix,
              source: text.bronnen.rivm,
            }}
            description={text.map_toelichting}
            onChartRegionChange={setSelectedMap}
            chartRegion={selectedMap}
            legend={{
              title: text.chloropleth_legenda.titel,
              thresholds: regionThresholds.tested_overall.infected_per_100k,
            }}
          >
            {/**
             * It's probably a good idea to abstract this even further, so that
             * the switching of charts, and the state involved, are all handled by
             * the component. The page does not have to be bothered with this.
             *
             * Ideally the ChoroplethTile would receive some props with the data
             * it needs to render either Choropleth without it caring about
             * MunicipalityChloropleth or SafetyRegionChloropleth, that data would
             * make the chart and define the tooltip layout for each, but maybe for
             * now that is a bridge too far. Let's take it one step at a time.
             */}
            {selectedMap === 'municipal' && (
              <MunicipalityChoropleth
                data={choropleth.gm}
                getLink={reverseRouter.gm.positiefGetesteMensen}
                metricName="tested_overall"
                metricProperty="infected_per_100k"
                tooltipContent={(
                  context: MunicipalityProperties & MunicipalitiesTestedOverall
                ) => <PositiveTestedPeopleMunicipalTooltip context={context} />}
              />
            )}
            {selectedMap === 'region' && (
              <SafetyRegionChoropleth
                data={choropleth.vr}
                getLink={reverseRouter.vr.positiefGetesteMensen}
                metricName="tested_overall"
                metricProperty="infected_per_100k"
                tooltipContent={(
                  context: SafetyRegionProperties & RegionsTestedOverall
                ) => <PositiveTestedPeopleRegionalTooltip context={context} />}
              />
            )}
          </ChoroplethTile>

          <ChartTileWithTimeframe
            title={text.linechart_titel}
            description={text.linechart_toelichting}
            metadata={{
              source: text.bronnen.rivm,
            }}
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
          </ChartTileWithTimeframe>

          {/* 
          @TODO re-enable after UX changes
          <ChartTileWithTimeframe
            title={siteText.infected_per_age_group.title}
            description={siteText.infected_per_age_group.description}
            metadata={{
              source: text.bronnen.rivm,
            }}
          >
            {(timeframe) => (
              <InfectedPerAgeGroup
                values={data.tested_per_age_group.values}
                timeframe={timeframe}
              />
            )}
          </ChartTileWithTimeframe> */}

          <GNumberBarChartTile data={data.g_number} />

          <ContentHeader
            title={ggdText.titel}
            skipLinkAnchor={true}
            id="ggd"
            icon={<Afname />}
            subtitle={ggdText.toelichting}
            metadata={{
              datumsText: ggdText.datums,
              dateOrRange: {
                start: dataGgdAverageLastValue.date_start_unix,
                end: dataGgdAverageLastValue.date_end_unix,
              },
              dateOfInsertionUnix:
                dataGgdAverageLastValue.date_of_insertion_unix,
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
                data-cy="ggd_tested_total"
                absolute={dataGgdAverageLastValue.tested_total}
                difference={data.difference.tested_ggd_average__tested_total}
              />
              <Text>{ggdText.totaal_getest_week_uitleg}</Text>
            </KpiTile>
            <KpiTile
              title={ggdText.positief_getest_week_titel}
              metadata={{
                date: [
                  dataGgdAverageLastValue.date_start_unix,
                  dataGgdAverageLastValue.date_end_unix,
                ],
                source: ggdText.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="ggd_infected"
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

          <ChartTileWithTimeframe
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
          </ChartTileWithTimeframe>

          <ChartTileWithTimeframe
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
          </ChartTileWithTimeframe>
        </TileList>
      </NationalLayout>
    </Layout>
  );
};

export default PositivelyTestedPeople;
