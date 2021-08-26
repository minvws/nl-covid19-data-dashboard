import { GmVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { GmLayout } from '~/domain/layout/gm-layout';
import { Layout } from '~/domain/layout/layout';
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
  selectGmPageMetricData,
} from '~/static-props/get-data';
import { VaccinationPageQuery } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = withFeatureNotFoundPage(
  'gmVaccinationPage',
  createGetStaticProps(
    getLastGeneratedDate,
    selectGmPageMetricData(
      'difference',
      'code',
      'vaccine_coverage_per_age_group'
    ),
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

export const VaccinationsGmPage = (
  props: StaticProps<typeof getStaticProps>
) => {
  const {
    sideBarData,
    municipalityName,
    selectedGmData: { difference, code, vaccine_coverage_per_age_group },
    content,
    lastGenerated,
  } = props;
  const { siteText } = useIntl();

  const text = siteText.gemeente_vaccinaties;

  const metadata = {
    ...siteText.gemeente_vaccinaties.metadata,
    title: replaceVariablesInText(text.metadata.title, {
      gemeenteNaam: municipalityName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      gemeenteNaam: municipalityName,
    }),
  };

  /**
   * Filter out only the the 18 plus value to show in the sidebar
   */
  const filteredAgeGroup = vaccine_coverage_per_age_group.values.filter(
    (item) => item.age_group_range === '18+'
  )[0] as GmVaccineCoveragePerAgeGroupValue;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout
        data={sideBarData}
        code={code}
        difference={difference}
        municipalityName={municipalityName}
        lastGenerated={lastGenerated}
      >
        <TileList>
          <VaccinePageIntroductionVrGm
            title={replaceVariablesInText(text.introductie_sectie.titel, {
              gemeenteNaam: municipalityName,
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
      </GmLayout>
    </Layout>
  );
};

export default VaccinationsGmPage;
