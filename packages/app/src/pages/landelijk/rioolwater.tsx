import { Experimenteel, RioolwaterMonitoring } from '@corona-dashboard/icons';
import { isEmpty } from 'lodash';
import { GetStaticPropsContext } from 'next';
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
import { Languages } from '~/locale';
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
import { useReverseRouter } from '~/utils/use-reverse-router';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';

const pageMetrics = ['sewer'];

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        caterogyTexts: {
          category: siteText.common.nationaal_layout.headings.vroege_signalen,
          screenReaderCategory:
            siteText.common.sidebar.metrics.sewage_measurement.title,
        },
        metadataTexts: siteText.pages.topicalPage.nl.nationaal_metadata,
        textNl: siteText.pages.sewerPage.nl,
        textShared: siteText.pages.sewerPage.shared,
      }),
      locale
    ),
  getLastGeneratedDate,
  selectNlData('sewer', 'difference.sewer__average'),
  createGetChoroplethData({
    vr: ({ sewer }) => ({ sewer }),
    gm: ({ sewer }) => ({ sewer }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<
      PagePartQueryResult<ArticleParts>
    >(() => getPagePartsQuery('sewerPage'))(context);

    return {
      content: {
        articles: getArticleParts(content.pageParts, 'sewerPageArticles'),
      },
    };
  }
);

const SewerWater = (props: StaticProps<typeof getStaticProps>) => {
  const { commonTexts, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();
  const {
    pageText,
    selectedNlData: data,
    choropleth,
    content,
    lastGenerated,
  } = props;

  const { caterogyTexts, metadataTexts, textNl, textShared } = pageText;
  const sewerAverages = data.sewer;
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');

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
            category={caterogyTexts.category}
            screenReaderCategory={caterogyTexts.screenReaderCategory}
            title={textNl.titel}
            icon={<RioolwaterMonitoring />}
            description={textNl.pagina_toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: sewerAverages.last_value.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textNl.bronnen.rivm],
            }}
            referenceLink={textNl.reference.href}
            articles={content.articles}
          />

          {!isEmpty(textNl.warning_method) && (
            <WarningTile message={textNl.warning_method} icon={Experimenteel} />
          )}

          <TwoKpiSection>
            <KpiTile
              title={textNl.barscale_titel}
              description={textNl.extra_uitleg}
              metadata={{
                date: sewerAverages.last_value.date_unix,
                source: textNl.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="average"
                absolute={sewerAverages.last_value.average}
                valueAnnotation={commonTexts.waarde_annotaties.riool_normalized}
                difference={data.difference.sewer__average}
                isAmount
              />
            </KpiTile>

            <KpiTile
              title={textNl.tile_explanation_title}
              description={textNl.tile_explanation_description}
            />
          </TwoKpiSection>

          <SewerChart
            accessibility={{ key: 'sewer_per_installation_over_time_chart' }}
            dataAverages={data.sewer}
            text={{
              title: textNl.linechart_titel,
              source: textNl.bronnen.rivm,
              description: textNl.linechart_description,
              selectPlaceholder: textNl.graph_selected_rwzi_placeholder,
              splitLabels: textShared.split_labels,
              averagesDataLabel: commonTexts.common.daggemiddelde,
              valueAnnotation: commonTexts.waarde_annotaties.riool_normalized,
            }}
          />

          <ChoroplethTile
            title={textNl.map_titel}
            description={textNl.map_toelichting}
            metadata={{
              date:
                selectedMap === 'gm'
                  ? [
                      choropleth.gm.sewer[0].date_start_unix,
                      choropleth.gm.sewer[0].date_end_unix,
                    ]
                  : choropleth.vr.sewer[0].date_unix,
              source: textNl.bronnen.rivm,
            }}
            onChartRegionChange={setSelectedMap}
            chartRegion={selectedMap}
            valueAnnotation={commonTexts.waarde_annotaties.riool_normalized}
            legend={{
              title: textNl.legenda_titel,
              thresholds: thresholds.vr.average,
            }}
          >
            {selectedMap === 'gm' && (
              <DynamicChoropleth
                map="gm"
                accessibility={{
                  key: 'sewer_municipal_choropleth',
                }}
                data={choropleth.gm.sewer}
                dataConfig={{
                  metricName: 'sewer',
                  metricProperty: 'average',
                  dataFormatters: {
                    average: formatNumber,
                  },
                }}
                dataOptions={{
                  getLink: reverseRouter.gm.rioolwater,
                }}
              />
            )}

            {selectedMap === 'vr' && (
              <DynamicChoropleth
                map="vr"
                accessibility={{
                  key: 'sewer_region_choropleth',
                }}
                data={choropleth.vr.sewer}
                dataConfig={{
                  metricName: 'sewer',
                  metricProperty: 'average',
                  dataFormatters: {
                    average: formatNumber,
                  },
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
