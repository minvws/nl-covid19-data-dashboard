import { GmVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import { useState } from 'react';
import { hasValueAtKey, isDefined, isPresent } from 'ts-is-present';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { Text } from '~/components/typography';
import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';
import { vrCodeByGmCode } from '~/data/vr-code-by-gm-code';
import { GmLayout } from '~/domain/layout/gm-layout';
import { Layout } from '~/domain/layout/layout';
import {
  AgeGroup,
  AgeGroupSelect,
} from '~/domain/vaccine/components/age-group-select';
import { selectVaccineCoverageData } from '~/domain/vaccine/data-selection/select-vaccine-coverage-data';
import { getSecondaryMetric } from '~/domain/vaccine/logic/get-secondary-metric';
import { ChoroplethTooltip } from '~/domain/vaccine/vaccine-coverage-per-gm';
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
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectGmPageMetricData,
} from '~/static-props/get-data';
import { VaccinationPageQuery } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = withFeatureNotFoundPage(
  'gmVaccinationPage',
  createGetStaticProps(
    getLastGeneratedDate,
    selectGmPageMetricData(
      'difference',
      'code',
      'vaccine_coverage_per_age_group'
    ),
    createGetChoroplethData({
      gm: ({ vaccine_coverage_per_age_group }, ctx) => {
        const vrCode = isPresent(ctx.params?.code)
          ? vrCodeByGmCode[ctx.params?.code as 'string']
          : undefined;
        return {
          vaccine_coverage_per_age_group: selectVaccineCoverageData(
            isDefined(vrCode)
              ? vaccine_coverage_per_age_group.filter((el) =>
                  gmCodesByVrCode[vrCode].includes(el.gmcode)
                )
              : vaccine_coverage_per_age_group
          ),
        };
      },
    }),
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
    choropleth,
    sideBarData,
    municipalityName,
    selectedGmData: { difference, code, vaccine_coverage_per_age_group },
    content,
    lastGenerated,
  } = props;
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('18+');

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
            data={filteredAgeGroup}
          />

          <ChoroplethTile
            title={replaceVariablesInText(
              siteText.vaccinaties.gm_choropleth_vaccinatie_graad.title,
              { gemeenteNaam: municipalityName }
            )}
            description={
              <>
                <Text>
                  {replaceVariablesInText(
                    siteText.vaccinaties.gm_choropleth_vaccinatie_graad
                      .description,
                    { gemeenteNaam: municipalityName }
                  )}
                </Text>

                <AgeGroupSelect onChange={setSelectedAgeGroup} />
              </>
            }
            legend={{
              thresholds: thresholds.gm.fully_vaccinated_percentage,
              title:
                siteText.vaccinaties.vr_choropleth_vaccinatie_graad
                  .legend_title,
            }}
          >
            <DynamicChoropleth
              renderTarget="canvas"
              accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
              map="gm"
              data={choropleth.gm.vaccine_coverage_per_age_group.filter(
                hasValueAtKey('age_group_range', selectedAgeGroup)
              )}
              dataConfig={{
                metricName: 'vaccine_coverage_per_age_group',
                metricProperty: 'fully_vaccinated_percentage',
              }}
              dataOptions={{
                getLink: reverseRouter.gm.vaccinaties,
                highlightSelection: true,
                selectedCode: code,
                tooltipVariables: {
                  age_group: siteText.vaccinaties.age_groups[selectedAgeGroup],
                },
              }}
              formatTooltip={(context) => (
                <ChoroplethTooltip
                  data={context}
                  getSecondaryMetric={getSecondaryMetric}
                />
              )}
            />
          </ChoroplethTile>

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
