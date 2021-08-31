import { Experimenteel, RioolwaterMonitoring } from '@corona-dashboard/icons';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
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
  createGetContent,
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  (context) => {
    const data = selectVrPageMetricData('sewer_per_installation')(context);
    data.selectedVrData.sewer.values = data.selectedVrData.sewer.values.map(
      (x) => ({
        ...x,
        average: Math.round(x.average),
      })
    );
    data.selectedVrData.sewer.last_value = {
      ...data.selectedVrData.sewer.last_value,
      average: Math.round(data.selectedVrData.sewer.last_value.average),
    };
    data.selectedVrData.difference.sewer__average.difference = Math.round(
      data.selectedVrData.difference.sewer__average.difference
    );

    data.selectedVrData.sewer_per_installation.values.forEach((x) => {
      x.values = x.values.map((x) => ({
        ...x,
        rna_normalized: Math.round(x.rna_normalized),
      }));
    });

    return data;
  },
  createGetContent<PageArticlesQueryResult>((context) => {
    const { locale } = context;
    return createPageArticlesQuery('sewerPage', locale);
  })
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
      <VrLayout data={data} vrName={vrName} lastGenerated={lastGenerated}>
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
              dateOrRange: {
                start: sewerAverages.last_value.date_start_unix,
                end: sewerAverages.last_value.date_end_unix,
              },
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
                date: [
                  sewerAverages.last_value.date_start_unix,
                  sewerAverages.last_value.date_end_unix,
                ],
                source: text.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="average"
                absolute={data.sewer.last_value.average}
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
              averagesDataLabel: siteText.common.weekgemiddelde,
              valueAnnotation: siteText.waarde_annotaties.riool_normalized,
            }}
          />
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default SewerWater;
