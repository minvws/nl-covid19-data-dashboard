import {
  GmProperties,
  GmSewerValue,
  VrProperties,
  VrSewerValue,
} from '@corona-dashboard/common';
import { useState } from 'react';
import ExperimenteelIcon from '~/assets/experimenteel.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { RegionControlOption } from '~/components/chart-region-controls';
import { ChartTile } from '~/components/chart-tile';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { SewerMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/sewer-municipal-tooltip';
import { SewerRegionalTooltip } from '~/components/choropleth/tooltips/region/sewer-regional-tooltip';
import { ContentHeader } from '~/components/content-header';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { NewSewerChart } from '~/components/sewer-chart/new-sewer-chart';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
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
  selectNlPageMetricData(),
  createGetChoroplethData({
    vr: ({ sewer }) => ({ sewer }),
    gm: ({ sewer }) => ({ sewer }),
  }),
  createGetContent<{
    articles?: ArticleSummary[];
  }>((context) => {
    const { locale } = context;
    return createPageArticlesQuery('sewerPage', locale ?? 'nl');
  })
);

const SewerWater = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const { selectedNlData: data, choropleth, content, lastGenerated } = props;

  const text = siteText.rioolwater_metingen;

  const sewerAverages = data.sewer;
  const [selectedMap, setSelectedMap] =
    useState<RegionControlOption>('municipal');

  const sewerSplitAreaChart = useFeature('sewerSplitAreaChart');

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
            category={siteText.nationaal_layout.headings.vroege_signalen}
            screenReaderCategory={siteText.rioolwater_metingen.titel_sidebar}
            title={text.titel}
            icon={<RioolwaterMonitoring />}
            subtitle={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: {
                start: sewerAverages.last_value.date_start_unix,
                end: sewerAverages.last_value.date_end_unix,
              },
              dateOfInsertionUnix:
                sewerAverages.last_value.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
            }}
            reference={text.reference}
          />

          <WarningTile message={text.warning_method} icon={ExperimenteelIcon} />

          <ArticleStrip articles={content.articles} />

          <TwoKpiSection>
            <KpiTile
              title={text.barscale_titel}
              description={text.extra_uitleg}
              metadata={{
                date: [
                  sewerAverages.last_value.date_start_unix,
                  sewerAverages.last_value.date_end_unix,
                ],
                source: text.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="average"
                absolute={sewerAverages.last_value.average}
                valueAnnotation={siteText.waarde_annotaties.riool_normalized}
                difference={data.difference.sewer__average}
              />
            </KpiTile>

            <KpiTile
              title={text.total_measurements_title}
              description={text.total_measurements_description}
              metadata={{
                date: [
                  sewerAverages.last_value.date_start_unix,
                  sewerAverages.last_value.date_end_unix,
                ],
                source: text.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="total_number_of_samples"
                absolute={sewerAverages.last_value.total_number_of_samples}
              />
              <Text>
                {replaceComponentsInText(text.total_measurements_locations, {
                  sampled_installation_count: (
                    <strong>
                      {sewerAverages.last_value.sampled_installation_count}
                    </strong>
                  ),
                  total_installation_count: (
                    <strong>
                      {sewerAverages.last_value.total_installation_count}
                    </strong>
                  ),
                })}
              </Text>
            </KpiTile>
          </TwoKpiSection>

          {sewerSplitAreaChart.isEnabled ? (
            <NewSewerChart
              accessibility={{ key: 'sewer_per_installation_over_time_chart' }}
              dataAverages={data.sewer}
              text={{
                title: text.linechart_titel,
                source: text.bronnen.rivm,
                description: text.linechart_description,
                splitLabels: siteText.rioolwater_metingen.split_labels,
                averagesDataLabel: siteText.common.weekgemiddelde,
                valueAnnotation: siteText.waarde_annotaties.riool_normalized,
              }}
            />
          ) : (
            <ChartTile
              timeframeOptions={['all', '5weeks']}
              title={text.linechart_titel}
              metadata={{
                source: text.bronnen.rivm,
              }}
              description={text.linechart_description}
            >
              {(timeframe) => (
                <TimeSeriesChart
                  accessibility={{
                    key: 'sewer_particles_over_time',
                  }}
                  values={sewerAverages.values}
                  timeframe={timeframe}
                  seriesConfig={[
                    {
                      type: 'area',
                      metricProperty: 'average',
                      label: text.linechart_particle_trend_label,
                      color: colors.data.primary,
                    },
                  ]}
                  dataOptions={{
                    valueAnnotation:
                      siteText.waarde_annotaties.riool_normalized,
                  }}
                />
              )}
            </ChartTile>
          )}

          <ChoroplethTile
            title={text.map_titel}
            description={text.map_toelichting}
            metadata={{
              date: [
                sewerAverages.last_value.date_start_unix,
                sewerAverages.last_value.date_end_unix,
              ],
              source: text.bronnen.rivm,
            }}
            onChartRegionChange={setSelectedMap}
            chartRegion={selectedMap}
            valueAnnotation={siteText.waarde_annotaties.riool_normalized}
            legend={{
              title: text.legenda_titel,
              thresholds: regionThresholds.sewer.average,
            }}
          >
            {selectedMap === 'municipal' ? (
              <MunicipalityChoropleth
                accessibility={{
                  key: 'sewer_municipal_choropleth',
                }}
                data={choropleth.gm}
                getLink={reverseRouter.gm.rioolwater}
                metricName="sewer"
                metricProperty="average"
                tooltipContent={(context: GmProperties & GmSewerValue) => (
                  <SewerMunicipalTooltip context={context} />
                )}
              />
            ) : (
              <SafetyRegionChoropleth
                accessibility={{
                  key: 'sewer_region_choropleth',
                }}
                data={choropleth.vr}
                getLink={reverseRouter.vr.rioolwater}
                metricName="sewer"
                metricProperty="average"
                tooltipContent={(context: VrProperties & VrSewerValue) => (
                  <SewerRegionalTooltip context={context} />
                )}
              />
            )}
          </ChoroplethTile>
        </TileList>
      </NationalLayout>
    </Layout>
  );
};

export default SewerWater;
