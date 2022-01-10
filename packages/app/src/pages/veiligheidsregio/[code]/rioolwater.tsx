import { RioolwaterMonitoring } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { SewerChart } from '~/domain/sewer/sewer-chart';
import { useIntl } from '~/intl';
import {
  getArticleParts,
  getPagePartsQuery,
} from '~/queries/get-page-parts-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectVrData,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrData('sewer', 'sewer_per_installation', 'difference.sewer__average'),
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
  const { selectedVrData: data, vrName, content, lastGenerated } = props;

  const { siteText } = useIntl();

  const text = siteText.veiligheidsregio_rioolwater_metingen;

  const sewerAverages = data.sewer;

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
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={siteText.veiligheidsregio_layout.headings.vroege_signalen}
            title={replaceVariablesInText(text.titel, {
              safetyRegion: vrName,
            })}
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
            vrNameOrGmName={vrName}
            warning={text.warning}
          />

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
                absolute={data.sewer.last_value.average}
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
            dataPerInstallation={data.sewer_per_installation}
            text={{
              title: text.linechart_titel,
              source: text.bronnen.rivm,
              description: text.linechart_description,
              selectPlaceholder: text.graph_selected_rwzi_placeholder,
              splitLabels: siteText.rioolwater_metingen.split_labels,
              averagesDataLabel: siteText.common.daggemiddelde,
              valueAnnotation: siteText.waarde_annotaties.riool_normalized,
            }}
            vrNameOrGmName={vrName}
            warning={text.warning_chart}
          />
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default SewerWater;
