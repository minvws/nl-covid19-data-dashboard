import {
  GmCollectionVaccineCoveragePerAgeGroup,
  GmVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { Vaccinaties as VaccinatieIcon } from '@corona-dashboard/icons';
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
import { getVaccineCoverageDisplayValues } from '~/domain/vaccine/logic/get-vaccine-coverage-display-values';
import { ChoroplethTooltip } from '~/domain/vaccine/vaccine-coverage-choropleth-per-gm';
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
        if (!isDefined(vaccine_coverage_per_age_group)) {
          return {
            vaccine_coverage_per_age_group:
              null as unknown as GmCollectionVaccineCoveragePerAgeGroup[],
          };
        }
        const vrCode = isPresent(ctx.params?.code)
          ? vrCodeByGmCode[ctx.params?.code as 'string']
          : undefined;

        /* TODO: Remove this once data is present */
        const coverage = isDefined(vrCode)
          ? vaccine_coverage_per_age_group.filter((el) =>
              gmCodesByVrCode[vrCode].includes(el.gmcode)
            )
          : vaccine_coverage_per_age_group;

        coverage.forEach((c) => {
          const p = Math.floor(Math.random() * 100);

          const label = p >= 90 ? '>=90%' : p <= 10 ? '<=10%' : null;

          c['has_one_shot_percentage'] = p;
          c['has_one_shot_percentage_label'] = label;
        });

        return {
          vaccine_coverage_per_age_group: selectVaccineCoverageData(coverage),
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
      municipalityName: municipalityName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      municipalityName: municipalityName,
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
          <PageInformationBlock
            category={siteText.gemeente_layout.headings.vaccinaties}
            title={replaceVariablesInText(text.informatie_blok.titel, {
              municipalityName: municipalityName,
            })}
            description={text.informatie_blok.beschrijving}
            icon={<VaccinatieIcon />}
            metadata={{
              datumsText: text.informatie_blok.datums,
              dateOrRange: filteredAgeGroup.date_unix,
              dateOfInsertionUnix: filteredAgeGroup.date_of_insertion_unix,
              dataSources: [],
            }}
            pageLinks={content.page.pageLinks}
            referenceLink={text.informatie_blok.reference.href}
            articles={content.highlight.articles}
          />

          <ChoroplethTile
            title={replaceVariablesInText(
              siteText.vaccinaties.gm_choropleth_vaccinatie_graad.title,
              { municipalityName: municipalityName }
            )}
            description={
              <>
                <Text>
                  {replaceVariablesInText(
                    siteText.vaccinaties.gm_choropleth_vaccinatie_graad
                      .description,
                    { municipalityName: municipalityName }
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
            metadata={{
              source: siteText.vaccinaties.vaccination_coverage.bronnen.rivm,
              date: choropleth.gm.vaccine_coverage_per_age_group[0].date_unix,
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
                metricProperty: 'has_one_shot_percentage',
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
                  getValues={getVaccineCoverageDisplayValues}
                />
              )}
            />
          </ChoroplethTile>
        </TileList>
      </GmLayout>
    </Layout>
  );
};

export default VaccinationsGmPage;
