import { Rioolvirus } from '@corona-dashboard/icons';
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
import { Languages, SiteText } from '~/locale';
import { getArticleParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, selectVrData, getLokalizeTexts } from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const pageMetrics = ['sewer', 'sewer_per_installation'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  textVr: siteText.pages.sewer_page.vr,
  textShared: siteText.pages.sewer_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectVrData('sewer', 'sewer_per_installation', 'difference.sewer__average'),
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
  const { pageText, selectedVrData: data, vrName, content, lastGenerated } = props;

  const { commonTexts } = useIntl();
  const { textVr, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const sewerAverages = data.sewer;

  const metadata = {
    ...commonTexts.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(textVr.metadata.title, {
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(textVr.metadata.description, {
      safetyRegionName: vrName,
    }),
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.development_of_the_virus.title}
            title={replaceVariablesInText(textVr.titel, {
              safetyRegion: vrName,
            })}
            icon={<Rioolvirus aria-hidden="true" />}
            description={textVr.pagina_toelichting}
            metadata={{
              datumsText: textVr.datums,
              dateOrRange: sewerAverages.last_value.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textVr.bronnen.rivm],
            }}
            referenceLink={textVr.reference.href}
            articles={content.articles}
            vrNameOrGmName={vrName}
            warning={textVr.warning}
          />

          <TwoKpiSection>
            <KpiTile
              title={textVr.barscale_titel}
              description={textVr.extra_uitleg}
              metadata={{
                date: sewerAverages.last_value.date_unix,
                source: textVr.bronnen.rivm,
              }}
            >
              <KpiValue
                data-cy="average"
                absolute={data.sewer.last_value.average}
                valueAnnotation={commonTexts.waarde_annotaties.riool_normalized}
                difference={data.difference.sewer__average}
                isAmount
              />
            </KpiTile>

            <KpiTile title={textVr.tile_explanation_title} description={textVr.tile_explanation_description} />
          </TwoKpiSection>

          <SewerChart
            accessibility={{ key: 'sewer_per_installation_over_time_chart' }}
            dataAverages={data.sewer}
            dataPerInstallation={data.sewer_per_installation}
            text={{
              title: textVr.linechart_titel,
              source: textVr.bronnen.rivm,
              description: textVr.linechart_description,
              selectPlaceholder: textVr.graph_selected_rwzi_placeholder,
              splitLabels: textShared.split_labels,
              averagesLegendLabel: commonTexts.common.charts.averages_legend_label,
              averagesTooltipLabel: commonTexts.common.charts.daily_averages_label,
              valueAnnotation: commonTexts.waarde_annotaties.riool_normalized,
            }}
            vrNameOrGmName={vrName}
            incompleteDatesAndTexts={textShared.zeewolde_incomplete_manualy_override}
            warning={textVr.warning_chart}
          />
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default SewerWater;
