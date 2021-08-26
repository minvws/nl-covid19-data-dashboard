import { VrVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { VaccinePageIntroductionVrGm } from '~/domain/vaccine/vaccine-page-introduction-vr-gm';
import { useIntl } from '~/intl';
import { withFeatureNotFoundPage } from '~/lib/features';
import {
  createPageArticlesQuery,
  PageArticlesQueryResult,
} from '~/queries/create-page-articles-query';
import { getVaccinePageQuery } from '~/queries/vaccine-page-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { VaccinationPageQuery } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = withFeatureNotFoundPage(
  'vrVaccinationPage',
  createGetStaticProps(
    getLastGeneratedDate,
    selectVrPageMetricData(),
    createGetContent<{
      page: VaccinationPageQuery;
      highlight: PageArticlesQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
      "page": ${getVaccinePageQuery(locale)},
      "highlight": ${createPageArticlesQuery('vaccinationsPage', locale)}
    }`;
    })
  )
);

export const VaccinationsVrPage = (
  props: StaticProps<typeof getStaticProps>
) => {
  const { vrName, selectedVrData: data, lastGenerated, content } = props;
  const { siteText } = useIntl();

  const text = siteText.veiligheidsregio_vaccinaties;

  const metadata = {
    ...siteText.veiligheidsregio_vaccinaties.metadata,
    title: replaceVariablesInText(text.metadata.title, {
      veiligheidsRegioNaam: vrName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      veiligheidsRegioNaam: vrName,
    }),
  };

  /**
   * Filter out only the the 18 plus value to show in the sidebar
   */
  const filteredAgeGroup = data.vaccine_coverage_per_age_group.values.filter(
    (item) => item.age_group_range === '18+'
  )[0] as VrVaccineCoveragePerAgeGroupValue;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout data={data} vrName={vrName} lastGenerated={lastGenerated}>
        <TileList>
          <VaccinePageIntroductionVrGm
            title={replaceVariablesInText(text.introductie_sectie.titel, {
              veiligheidsRegioNaam: vrName,
            })}
            description={text.introductie_sectie.beschrijving}
            kpiTitle={text.introductie_sectie.kpi_titel}
            kpiValue={filteredAgeGroup.fully_vaccinated_percentage}
          />

          <PageInformationBlock
            description={text.informatie_blok.beschrijving}
            metadata={{
              datumsText: text.informatie_blok.datums,
              dateOrRange: filteredAgeGroup.date_unix,
              dateOfInsertionUnix: filteredAgeGroup.date_of_insertion_unix,
              dataSources: [],
            }}
            usefulLinks={content.page.usefulLinks}
            referenceLink={text.informatie_blok.reference.href}
            articles={content.highlight.articles}
          />
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default VaccinationsVrPage;
