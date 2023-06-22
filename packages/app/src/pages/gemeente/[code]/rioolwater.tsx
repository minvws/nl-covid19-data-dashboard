import { NlSewer } from '@corona-dashboard/common';
import { Experimenteel, Rioolvirus } from '@corona-dashboard/icons';
import { isEmpty } from 'lodash';
import { GetStaticPropsContext } from 'next';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { GmLayout } from '~/domain/layout/gm-layout';
import { Layout } from '~/domain/layout/layout';
import { SewerChart } from '~/domain/sewer/sewer-chart';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { getArticleParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, selectGmData, getLokalizeTexts } from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const pageMetrics = ['sewer_per_installation', 'sewer'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  textGm: siteText.pages.sewer_page.gm,
  textShared: siteText.pages.sewer_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectGmData('difference.sewer__average', 'sewer_per_installation', 'sewer_installation_measurement', 'static_values.population_count_connected_to_rwzis', 'sewer', 'code'),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<PagePartQueryResult<ArticleParts>>(() => getPagePartsQuery('sewer_page'))(context);

    return {
      content: {
        articles: getArticleParts(content.pageParts, 'sewerPageArticles'),
      },
    };
  }
);

const SewerWater = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedGmData: data, municipalityName, content, lastGenerated } = props;

  const { commonTexts, formatNumber } = useIntl();
  const { textGm, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const sewerAverages = data.sewer;
  const sewerInstallationMeasurement = data.sewer_installation_measurement;
  const populationCountConnectedToRwzis = data.static_values.population_count_connected_to_rwzis;

  if (!sewerAverages) {
    /**
     * It is possible that there is no sewer data available for this GM. Then
     * this page should never be linked because the sidebar item is then
     * disabled.
     */
    return null;
  }

  const metadata = {
    ...commonTexts.gemeente_index.metadata,
    title: replaceVariablesInText(textGm.metadata.title, {
      municipalityName,
    }),
    description: replaceVariablesInText(textGm.metadata.description, {
      municipalityName,
    }),
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout code={data.code} municipalityName={municipalityName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.development_of_the_virus.title}
            title={replaceVariablesInText(textGm.titel, {
              municipality: municipalityName,
            })}
            icon={<Rioolvirus aria-hidden="true" />}
            description={textGm.pagina_toelichting}
            metadata={{
              datumsText: textGm.datums,
              dateOrRange: {
                start: sewerAverages.last_value.date_start_unix,
                end: sewerAverages.last_value.date_end_unix,
              },
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textGm.bronnen.rivm],
            }}
            referenceLink={textGm.reference.href}
            articles={content.articles}
            vrNameOrGmName={municipalityName}
            warning={textGm.warning}
          />

          {!isEmpty(textGm.warning_method) && <WarningTile message={textGm.warning_method} icon={Experimenteel} />}

          <TwoKpiSection>
            <KpiTile
              title={textGm.barscale_titel}
              metadata={{
                date: [sewerAverages.last_value.date_start_unix, sewerAverages.last_value.date_end_unix],
                source: textGm.bronnen.rivm,
              }}
            >
              <KpiValue
                absolute={sewerAverages.last_value.average}
                valueAnnotation={commonTexts.waarde_annotaties.riool_normalized}
                difference={data.difference.sewer__average}
                isAmount
              />
              <Text>
                {replaceComponentsInText(commonTexts.gemeente_index.population_count, {
                  municipalityName: municipalityName,
                  populationCountConnectedToRwzis: <strong>{formatNumber(populationCountConnectedToRwzis)}</strong>,
                })}
              </Text>

              <Markdown content={textGm.extra_uitleg} />
            </KpiTile>

            <KpiTile
              title={textGm.total_measurements_title}
              description={textGm.total_measurements_description}
              metadata={{
                date: [sewerInstallationMeasurement.date_start_unix, sewerInstallationMeasurement.date_end_unix],
                source: textGm.bronnen.rivm,
              }}
            >
              <KpiValue absolute={sewerInstallationMeasurement.total_number_of_samples} />
              <Text>
                {replaceComponentsInText(textGm.total_measurements_locations, {
                  sampled_installation_count: <strong>{sewerInstallationMeasurement.sampled_installation_count}</strong>,
                  total_installation_count: <strong>{sewerInstallationMeasurement.total_installation_count}</strong>,
                })}
              </Text>
            </KpiTile>
          </TwoKpiSection>

          <SewerChart
            accessibility={{ key: 'sewer_per_installation_over_time_chart' }}
            dataAverages={data.sewer as unknown as NlSewer}
            dataPerInstallation={data.sewer_per_installation}
            text={{
              title: textGm.linechart_titel,
              source: textGm.bronnen.rivm,
              description: textGm.linechart_description,
              selectPlaceholder: textGm.graph_selected_rwzi_placeholder,
              splitLabels: textShared.split_labels,
              averagesLegendLabel: commonTexts.common.charts.averages_legend_label,
              averagesTooltipLabel: commonTexts.common.charts.weekly_averages_label,
              valueAnnotation: commonTexts.waarde_annotaties.riool_normalized,
              rwziSelectDropdown: textGm.linechart_select,
              rwziLabel: textGm.RWZI_label,
            }}
            vrNameOrGmName={municipalityName}
            incompleteDatesAndTexts={textGm.zeewolde_incomplete_manualy_override}
            warning={textGm.warning_chart}
          />
        </TileList>
      </GmLayout>
    </Layout>
  );
};

export default SewerWater;
