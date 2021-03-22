import { useRouter } from 'next/router';
import { useState } from 'react';
import ExperimenteelIcon from '~/assets/experimenteel.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { RegionControlOption } from '~/components-styled/chart-region-controls';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { WarningTile } from '~/components-styled/warning-tile';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createSewerMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/create-sewer-regional-tooltip';
import { createSewerRegionalTooltip } from '~/components/choropleth/tooltips/region/create-sewer-regional-tooltip';
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
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { useIntl } from '~/intl';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';

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
  const { data, choropleth, content, lastGenerated } = props;

  const text = siteText.rioolwater_metingen;
  const graphDescriptions = siteText.accessibility.grafieken;
  const sewerAverages = data.sewer;
  const router = useRouter();
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

          <LineChartTile
            title={text.linechart_titel}
            timeframeOptions={['all', '5weeks']}
            ariaDescription={graphDescriptions.rioolwater_virusdeeltjes}
            values={sewerAverages.values}
            linesConfig={[
              {
                metricProperty: 'average',
              },
            ]}
            metadata={{
              source: text.bronnen.rivm,
            }}
            valueAnnotation={siteText.waarde_annotaties.riool_normalized}
          />

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
                metricName="sewer"
                metricProperty="average"
                tooltipContent={createSewerMunicipalTooltip(
                  siteText.choropleth_tooltip.sewer_regional,
                  regionThresholds.sewer.average,
                  createSelectMunicipalHandler(router, 'rioolwater')
                )}
                onSelect={createSelectMunicipalHandler(router, 'rioolwater')}
              />
            ) : (
              <SafetyRegionChoropleth
                data={choropleth.vr}
                metricName="sewer"
                metricProperty="average"
                tooltipContent={createSewerRegionalTooltip(
                  siteText.choropleth_tooltip.sewer_regional,
                  regionThresholds.sewer.average,
                  createSelectRegionHandler(router, 'rioolwater')
                )}
                onSelect={createSelectRegionHandler(router, 'rioolwater')}
              />
            )}
          </ChoroplethTile>
        </TileList>
      </NationalLayout>
    </Layout>
  );
};

export default SewerWater;
