import {
  GmCollectionTestedOverall,
  GmProperties,
  VrCollectionTestedOverall,
  VrProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useState } from 'react';
import Afname from '~/assets/afname.svg';
import Getest from '~/assets/test.svg';
import { Anchor } from '~/components/anchor';
import { Box } from '~/components/base';
import { RegionControlOption } from '~/components/chart-region-controls';
import { ChartTile } from '~/components/chart-tile';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { PositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/positive-tested-people-municipal-tooltip';
import { PositiveTestedPeopleRegionalTooltip } from '~/components/choropleth/tooltips/region/positive-tested-people-regional-tooltip';
import { VrChoropleth } from '~/components/choropleth/vr-choropleth';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageBarScale } from '~/components/page-barscale';
import { PageInformationBlock } from '~/components/page-information-block';
import { Spacer } from '~/components/spacer';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { GNumberBarChartTile } from '~/domain/tested/g-number-bar-chart-tile';
import { InfectedPerAgeGroup } from '~/domain/tested/infected-per-age-group';
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
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData('tested_ggd', 'tested_per_age_group', 'g_number'),
  createGetChoroplethData({
    gm: ({ tested_overall }) => ({ tested_overall }),
    vr: ({ tested_overall }) => ({ tested_overall }),
  }),
  createGetContent<{
    main: PageArticlesQueryResult;
    ggd: PageArticlesQueryResult;
    elements: ElementsQueryResult;
  }>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';

    const query = `{
      "main": ${createPageArticlesQuery('positiveTestsPage', locale)},
      "ggd": ${createPageArticlesQuery(
        'positiveTestsPage',
        locale,
        'ggdArticles'
      )},
     "elements": ${createElementsQuery(
       'nl',
       ['tested_overall', 'tested_ggd'],
       locale
     )}
    }`;

    return query;
  })
);

const PositivelyTestedPeople = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, choropleth, content, lastGenerated } = props;
  const { siteText, formatNumber, formatPercentage, formatDateFromSeconds } =
    useIntl();
  const reverseRouter = useReverseRouter();

  const text = siteText.positief_geteste_personen;
  const ggdText = siteText.positief_geteste_personen_ggd;
  const [selectedMap, setSelectedMap] =
    useState<RegionControlOption>('municipal');

  const dataOverallLastValue = data.tested_overall.last_value;
  const dataGgdLastValue = data.tested_ggd.last_value;
  const difference = data.difference;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.besmettingen}
            screenReaderCategory={
              siteText.positief_geteste_personen.titel_sidebar
            }
            title={text.titel}
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
              <KpiValue
                data-cy="infected"
                absolute={dataOverallLastValue.infected}
                difference={difference.tested_overall__infected_moving_average}
                isMovingAverageDifference
              />

              <Box mb={4}>
                <Markdown content={text.kpi_toelichting} />
              </Box>

              <Box>
                <Heading level={4} fontSize={'1.2em'} mb={0}>
                  {replaceComponentsInText(ggdText.summary_text, {
                    percentage: (
                      <span css={css({ color: 'data.primary' })}>
                        {formatPercentage(dataGgdLastValue.infected_percentage)}
                        %
                      </span>
                    ),
                    dateTo: formatDateFromSeconds(
                      dataGgdLastValue.date_unix,
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
                differenceKey="tested_overall__infected_per_100k_moving_average"
                isMovingAverageDifference
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
             * MunicipalityChloropleth or VrChloropleth, that data would
             * make the chart and define the tooltip layout for each, but maybe for
             * now that is a bridge too far. Let's take it one step at a time.
             */}
            {selectedMap === 'municipal' && (
              <MunicipalityChoropleth
                accessibility={{
                  key: 'confirmed_cases_municipal_choropleth',
                }}
                data={choropleth.gm}
                getLink={reverseRouter.gm.positiefGetesteMensen}
                metricName="tested_overall"
                metricProperty="infected_per_100k"
                tooltipContent={(
                  context: GmProperties & GmCollectionTestedOverall
                ) => <PositiveTestedPeopleMunicipalTooltip context={context} />}
              />
            )}
            {selectedMap === 'region' && (
              <VrChoropleth
                accessibility={{
                  key: 'confirmed_cases_region_choropleth',
                }}
                data={choropleth.vr}
                getLink={reverseRouter.vr.positiefGetesteMensen}
                metricName="tested_overall"
                metricProperty="infected_per_100k"
                tooltipContent={(
                  context: VrProperties & VrCollectionTestedOverall
                ) => <PositiveTestedPeopleRegionalTooltip context={context} />}
              />
            )}
          </ChoroplethTile>

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

          <ChartTile
            title={siteText.infected_per_age_group.title}
            description={siteText.infected_per_age_group.description}
            timeframeOptions={['all', '5weeks']}
            metadata={{
              source: text.bronnen.rivm,
            }}
          >
            {(timeframe) => (
              <InfectedPerAgeGroup
                accessibility={{
                  key: 'confirmed_cases_infected_per_age_group_over_time_chart',
                }}
                values={data.tested_per_age_group.values}
                timeframe={timeframe}
              />
            )}
          </ChartTile>

          <GNumberBarChartTile data={data.g_number} />

          <Spacer amount={3} />

          <PageInformationBlock
            title={ggdText.titel}
            id="ggd"
            icon={<Afname />}
            description={ggdText.toelichting}
            metadata={{
              datumsText: ggdText.datums,
              dateOrRange: dataGgdLastValue.date_unix,
              dateOfInsertionUnix: dataGgdLastValue.date_of_insertion_unix,
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
                data-cy="ggd_tested_total"
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
                data-cy="ggd_infected"
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
                values={data.tested_ggd.values}
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
      </NationalLayout>
    </Layout>
  );
};

export default PositivelyTestedPeople;
