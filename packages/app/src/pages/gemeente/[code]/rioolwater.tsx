import ExperimenteelIcon from '~/assets/experimenteel.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ChartTile } from '~/components/chart-tile';
import { ContentHeader } from '~/components/content-header';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { SewerChart } from '~/components/sewer-chart';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { MunicipalityLayout } from '~/domain/layout/municipality-layout';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectGmPageMetricData,
} from '~/static-props/get-data';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { CollapsibleContent } from '~/components/collapsible';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectGmPageMetricData('sewer_per_installation', 'sewer', 'population_count'),
  createGetContent<{
    articles?: ArticleSummary[];
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('sewerPage', locale);
  })
);

const SewerWater = (props: StaticProps<typeof getStaticProps>) => {
  const {
    selectedGmData: data,
    municipalityName,
    content,
    lastGenerated,
  } = props;
  const { siteText } = useIntl();

  const text = siteText.gemeente_rioolwater_metingen;

  const sewerAverages = data.sewer;
  const populationCount = data.population_count;

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
              <Text>
                {replaceComponentsInText(
                  siteText.gemeente_index.population_count,
                  {
                    municipalityName: municipalityName,
                    populationCount: <strong>{populationCount}</strong>,
                  }
                )}
              </Text>

              <Text>{text.extra_uitleg}</Text>

              <CollapsibleContent
                label={
                  siteText.gemeente_index.population_count_explanation_title
                }
              >
                <Text>
                  {replaceComponentsInText(text.population_count_explanation, {
                    municipalityName: <strong>{municipalityName}</strong>,
                    value: <strong>{sewerAverages.last_value.average}</strong>,
                  })}
                </Text>
              </CollapsibleContent>
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
        </TileList>
      </MunicipalityLayout>
    </Layout>
  );
};

export default SewerWater;
