import { useMemo } from 'react';
import ExperimenteelIcon from '~/assets/experimenteel.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { BarChart } from '~/components-styled/bar-chart/bar-chart';
import {
  ChartTile,
  ChartTileWithTimeframe,
} from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { SEOHead } from '~/components-styled/seo-head';
import { SewerChart } from '~/components-styled/sewer-chart';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { WarningTile } from '~/components-styled/warning-tile';
import { FCWithLayout } from '~/domain/layout/layout';
import { getMunicipalityLayout } from '~/domain/layout/municipality-layout';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getGmData,
  getLastGeneratedDate,
  getText,
} from '~/static-props/get-data';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { getSewerWaterBarChartData } from '~/utils/sewer-water/municipality-sewer-water.util';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getGmData,
  getText,
  createGetContent<{
    articles?: ArticleSummary[];
  }>(createPageArticlesQuery('sewerPage'))
);

const SewerWater: FCWithLayout<typeof getStaticProps> = (props) => {
  const { data, municipalityName, content, text: siteText } = props;

  const text = siteText.gemeente_rioolwater_metingen;
  const graphDescriptions = siteText.accessibility.grafieken;

  const { barChartData } = useMemo(() => {
    return {
      barChartData: getSewerWaterBarChartData(data),
    };
  }, [data]);

  const sewerAverages = data.sewer;

  if (!sewerAverages) {
    /**
     * It is possible that there is no sewer data available for this GM. Then
     * this page should never be linked because the sidebar item is then
     * disabled.
     */
    return null;
  }

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          municipalityName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          municipalityName,
        })}
      />
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

        <ChartTileWithTimeframe
          title={text.linechart_titel}
          metadata={{ source: text.bronnen.rivm }}
          timeframeOptions={['all', '5weeks']}
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
        </ChartTileWithTimeframe>

        {barChartData && (
          <ChartTile
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
          </ChartTile>
        )}
      </TileList>
    </>
  );
};

SewerWater.getLayout = getMunicipalityLayout();

export default SewerWater;
