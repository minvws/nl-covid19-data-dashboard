import ExperimenteelIcon from '~/assets/experimenteel.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { BarChart } from '~/components-styled/bar-chart/bar-chart';
import { ChartTile, NewChartTile } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { SewerChart } from '~/components-styled/sewer-chart';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { WarningTile } from '~/components-styled/warning-tile';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { useIntl } from '~/intl';
import {
  createGetContent,
  getGmData,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useSewerWaterBarChartData } from '~/utils/sewer-water/municipality-sewer-water.util';
import { MunicipalityLayout } from '~/domain/layout/municipality-layout';
import { Layout } from '~/domain/layout/layout';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getGmData,
  createGetContent<{
    articles?: ArticleSummary[];
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('sewerPage', locale);
  })
);

const SewerWater = (props: StaticProps<typeof getStaticProps>) => {
  const { data, municipalityName, content, lastGenerated } = props;
  const { siteText } = useIntl();

  const text = siteText.gemeente_rioolwater_metingen;
  const graphDescriptions = siteText.accessibility.grafieken;

  const barChartData = useSewerWaterBarChartData(data);

  const sewerAverages = data.sewer;

  if (!sewerAverages) {
    /**
     * It is possible that there is no sewer data available for this GM. Then
     * this page should never be linked because the sidebar item is then
     * disabled.
     */
    return null;
  }

  const metadata = {
    ...siteText.gemeente_index.metadata,
    title: replaceVariablesInText(text.metadata.title, {
      municipalityName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      municipalityName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <MunicipalityLayout
        data={data}
        municipalityName={municipalityName}
        lastGenerated={lastGenerated}
      >
        <TileList>
          <ContentHeader
            category={siteText.gemeente_layout.headings.vroege_signalen}
            title={replaceVariablesInText(text.titel, {
              municipality: municipalityName,
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
                data-cy="barscale_value"
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

          <NewChartTile
            title={text.linechart_titel}
            metadata={{ source: text.bronnen.rivm }}
            timeframeOptions={['all', '5weeks']}
            hasExtraToggle
          >
            <SewerChart
              data={data}
              timeframe={'all'}
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
          </NewChartTile>

          {barChartData && (
            <NewChartTile
              title={replaceVariablesInText(text.bar_chart_title, {
                municipality: municipalityName,
              })}
              ariaDescription={graphDescriptions.rioolwater_meetwaarde}
              metadata={{
                date: [
                  sewerAverages.last_value.date_start_unix,
                  sewerAverages.last_value.date_end_unix,
                ],
                source: text.bronnen.rivm,
              }}
            >
              <BarChart
                values={barChartData.values}
                xAxisTitle={text.bar_chart_axis_title}
                accessibilityDescription={
                  text.bar_chart_accessibility_description
                }
              />
            </NewChartTile>
          )}
        </TileList>
      </MunicipalityLayout>
    </Layout>
  );
};

export default SewerWater;
