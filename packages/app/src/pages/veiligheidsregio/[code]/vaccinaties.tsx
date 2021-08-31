import { useState } from 'react';
import { hasValueAtKey, isPresent } from 'ts-is-present';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { Text } from '~/components/typography';
import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import {
  AgeGroup,
  AgeGroupSelect,
} from '~/domain/vaccine/components/age-group-select';
import { selectVaccineCoverageData } from '~/domain/vaccine/data-selection/select-vaccine-coverage-data';
import { getSecondaryMetric } from '~/domain/vaccine/logic/get-secondary-metric';
import { ChoroplethTooltip } from '~/domain/vaccine/vaccine-coverage-per-municipality';
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
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { VaccinationPageQuery } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = withFeatureNotFoundPage(
  'vrVaccinationPage',

  createGetStaticProps(
    getLastGeneratedDate,
    selectVrPageMetricData(),
    createGetChoroplethData({
      gm: ({ vaccine_coverage_per_age_group }, ctx) => ({
        vaccine_coverage_per_age_group: selectVaccineCoverageData(
          isPresent(ctx.params?.code)
            ? vaccine_coverage_per_age_group.filter((el) =>
                gmCodesByVrCode[ctx.params?.code as string].includes(el.gmcode)
              )
            : vaccine_coverage_per_age_group
        ),
      }),
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

export const VaccinationsVrPage = (
  props: StaticProps<typeof getStaticProps>
) => {
  const {
    vrName,
    selectedVrData: data,
    choropleth,
    lastGenerated,
    content,
  } = props;
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('18+');

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

  const gmCodes = gmCodesByVrCode[data.code];
  const selectedGmCode = gmCodes ? gmCodes[0] : undefined;

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
            kpiValue={9999999}
          />

          <PageInformationBlock
            description={text.informatie_blok.beschrijving}
            metadata={{
              datumsText: text.informatie_blok.datums,
              dateOrRange: 1629798465,
              dateOfInsertionUnix: 1629798465,
              dataSources: [],
            }}
            usefulLinks={content.page.usefulLinks}
            referenceLink={text.informatie_blok.reference.href}
            articles={content.highlight.articles}
          />

          <ChoroplethTile
            title={replaceVariablesInText(
              siteText.vaccinaties.vr_choropleth_vaccinatie_graad.title,
              { veiligheidsRegioNaam: vrName }
            )}
            description={
              <>
                <Text>
                  {replaceVariablesInText(
                    siteText.vaccinaties.vr_choropleth_vaccinatie_graad
                      .description,
                    { veiligheidsRegioNaam: vrName }
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
                selectedCode: selectedGmCode,
                highlightSelection: true,
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
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default VaccinationsVrPage;
