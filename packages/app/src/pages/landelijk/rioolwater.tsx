import {
  MunicipalityProperties,
  MunicipalSewerValue,
  RegionalSewerValue,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { useState } from 'react';
import ExperimenteelIcon from '~/assets/experimenteel.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { RegionControlOption } from '~/components-styled/chart-region-controls';
import { ChartTile } from '~/components-styled/chart-tile';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TileList } from '~/components-styled/tile-list';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { WarningTile } from '~/components-styled/warning-tile';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { SewerMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/sewer-municipal-tooltip';
import { SewerRegionalTooltip } from '~/components/choropleth/tooltips/region/sewer-regional-tooltip';
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
    vr: ({ sewer }) => ({ sewer }),
    gm: ({ sewer }) => ({ sewer }),
  }),
  createGetContent<{
    articles?: ArticleSummary[];
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('sewerPage', locale);
  })
);

const SewerWater = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const { data, choropleth, content, lastGenerated } = props;

  const text = siteText.rioolwater_metingen;

  const sewerAverages = data.sewer;
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>(
    'municipal'
  );

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
                data-cy="sewer_average"
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

          <ChartTile
            timeframeOptions={['all', '5weeks']}
            title={text.linechart_titel}
            metadata={{
              source: text.bronnen.rivm,
            }}
          >
            {(timeframe) => (
              <TimeSeriesChart
                values={sewerAverages.values}
                timeframe={timeframe}
                seriesConfig={[
                  {
                    type: 'area',
                    metricProperty: 'average',
                    label: siteText.waarde_annotaties.riool_normalized,
                    color: colors.data.primary,
                  },
                ]}
                dataOptions={{
                  valueAnnotation: siteText.waarde_annotaties.riool_normalized,
                }}
              />
            )}
          </ChartTile>

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
            legend={{
              title: text.legenda_titel,
              thresholds: regionThresholds.sewer.average,
            }}
          >
            {selectedMap === 'municipal' ? (
              <MunicipalityChoropleth
                data={choropleth.gm}
                getLink={reverseRouter.gm.rioolwater}
                metricName="sewer"
                metricProperty="average"
                tooltipContent={(
                  context: MunicipalityProperties & MunicipalSewerValue
                ) => <SewerMunicipalTooltip context={context} />}
              />
            ) : (
              <SafetyRegionChoropleth
                data={choropleth.vr}
                getLink={reverseRouter.vr.rioolwater}
                metricName="sewer"
                metricProperty="average"
                tooltipContent={(
                  context: SafetyRegionProperties & RegionalSewerValue
                ) => <SewerRegionalTooltip context={context} />}
              />
            )}
          </ChoroplethTile>
        </TileList>
      </NationalLayout>
    </Layout>
  );
};

export default SewerWater;
