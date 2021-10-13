import { Experimenteel, RioolwaterMonitoring } from '@corona-dashboard/icons';
import { useState } from 'react';
import { RegionControlOption } from '~/components/chart-region-controls';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { SewerChart } from '~/domain/sewer/sewer-chart';
import { useIntl } from '~/intl';
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
  selectNlData,
} from '~/static-props/get-data';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlData('sewer', 'difference.sewer__average'),
  createGetChoroplethData({
    vr: ({ sewer }) => ({ sewer }),
    gm: ({ sewer }) => ({ sewer }),
  }),
  createGetContent<PageArticlesQueryResult>((context) => {
    const { locale } = context;
    return createPageArticlesQuery('sewerPage', locale);
  })
);

const SewerWater = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const { selectedNlData: data, choropleth, content, lastGenerated } = props;

  const text = siteText.rioolwater_metingen;

  const sewerAverages = data.sewer;
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.vroege_signalen}
            screenReaderCategory={
              siteText.sidebar.metrics.sewage_measurement.title
            }
            title={text.titel}
            icon={<RioolwaterMonitoring />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: sewerAverages.last_value.date_unix,
              dateOfInsertionUnix:
                sewerAverages.last_value.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
            }}
            referenceLink={text.reference.href}
            articles={content.articles}
          />

          <WarningTile message={text.warning_method} icon={Experimenteel} />

          <TwoKpiSection>
            <KpiTile
              title={text.barscale_titel}
              description={text.extra_uitleg}
              metadata={{
                date: sewerAverages.last_value.date_unix,
                source: text.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="average"
                absolute={sewerAverages.last_value.average}
                valueAnnotation={siteText.waarde_annotaties.riool_normalized}
                difference={data.difference.sewer__average}
                isAmount
              />
            </KpiTile>

            <KpiTile
              title={text.tile_explanation_title}
              description={text.tile_explanation_description}
            />
          </TwoKpiSection>

          <SewerChart
            accessibility={{ key: 'sewer_per_installation_over_time_chart' }}
            dataAverages={data.sewer}
            text={{
              title: text.linechart_titel,
              source: text.bronnen.rivm,
              description: text.linechart_description,
              splitLabels: siteText.rioolwater_metingen.split_labels,
              averagesDataLabel: siteText.common.daggemiddelde,
              valueAnnotation: siteText.waarde_annotaties.riool_normalized,
            }}
          />

          <ChoroplethTile
            title={text.map_titel}
            description={text.map_toelichting}
            metadata={{
              date:
                selectedMap === 'gm'
                  ? [
                      choropleth.gm.sewer[0].date_start_unix,
                      choropleth.gm.sewer[0].date_end_unix,
                    ]
                  : choropleth.vr.sewer[0].date_unix,
              source: text.bronnen.rivm,
            }}
            onChartRegionChange={setSelectedMap}
            chartRegion={selectedMap}
            valueAnnotation={siteText.waarde_annotaties.riool_normalized}
            legend={{
              title: text.legenda_titel,
              thresholds: thresholds.vr.average,
            }}
          >
            {selectedMap === 'gm' && (
              <DynamicChoropleth
                renderTarget="canvas"
                map="gm"
                accessibility={{
                  key: 'sewer_municipal_choropleth',
                }}
                data={choropleth.gm.sewer}
                dataConfig={{
                  metricName: 'sewer',
                  metricProperty: 'average',
                }}
                dataOptions={{
                  getLink: reverseRouter.gm.rioolwater,
                }}
              />
            )}

            {selectedMap === 'vr' && (
              <DynamicChoropleth
                renderTarget="canvas"
                map="vr"
                accessibility={{
                  key: 'sewer_region_choropleth',
                }}
                data={choropleth.vr.sewer}
                dataConfig={{
                  metricName: 'sewer',
                  metricProperty: 'average',
                }}
                dataOptions={{
                  getLink: reverseRouter.vr.rioolwater,
                }}
              />
            )}
          </ChoroplethTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default SewerWater;
