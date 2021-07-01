import ExperimenteelIcon from '~/assets/experimenteel.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ChartTile } from '~/components/chart-tile';
import { ContentHeader } from '~/components/content-header';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { SewerChart } from '~/components/sewer-chart';
import { NewSewerChart } from '~/components/sewer-chart/new-sewer-chart';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
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
  selectVrPageMetricData('sewer_per_installation', 'sewer'),
  createGetContent<{
    articles?: ArticleSummary[];
  }>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('sewerPage', locale);
  })
);

const SewerWater = (props: StaticProps<typeof getStaticProps>) => {
  const {
    selectedVrData: data,
    safetyRegionName,
    content,
    lastGenerated,
  } = props;

  const { siteText } = useIntl();
  const sewerSplitAreaChart = useFeature('sewerSplitAreaChart');

  const text = siteText.veiligheidsregio_rioolwater_metingen;

  const sewerAverages = data.sewer;

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
            category={siteText.veiligheidsregio_layout.headings.vroege_signalen}
            title={replaceVariablesInText(text.titel, {
              safetyRegion: safetyRegionName,
            })}
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

          {sewerSplitAreaChart.isEnabled ? (
            <NewSewerChart
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
          ) : (
            <ChartTile
              title={text.linechart_titel}
              metadata={{ source: text.bronnen.rivm }}
              timeframeOptions={['all', '5weeks']}
              description={text.linechart_description}
            >
              {(timeframe) => (
                <SewerChart
                  data={data}
                  timeframe={timeframe}
                  valueAnnotation={siteText.waarde_annotaties.riool_normalized}
                  text={{
                    select_station_placeholder:
                      text.graph_selected_rwzi_placeholder,
                    average_label_text: text.graph_average_label_text,
                    secondary_label_text: text.graph_secondary_label_text,
                    daily_label_text: text.graph_daily_label_text_rwzi,
                    range_description: text.graph_range_description,
                    display_outliers: text.display_outliers,
                    hide_outliers: text.hide_outliers,
                  }}
                />
              )}
            </ChartTile>
          )}
        </TileList>
      </SafetyRegionLayout>
    </Layout>
  );
};

export default SewerWater;
