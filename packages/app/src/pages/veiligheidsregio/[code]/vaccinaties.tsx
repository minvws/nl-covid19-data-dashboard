import { GmCollectionVaccineCoveragePerAgeGroup } from '@corona-dashboard/common';
import { Vaccinaties as VaccinatieIcon } from '@corona-dashboard/icons';
import { useState } from 'react';
import { hasValueAtKey, isDefined, isPresent } from 'ts-is-present';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import {
  AgeGroup,
  AgeGroupSelect,
} from '~/domain/vaccine/components/age-group-select';
import { selectVaccineCoverageData } from '~/domain/vaccine/data-selection/select-vaccine-coverage-data';
import { getVaccineCoverageDisplayValues } from '~/domain/vaccine/logic/get-vaccine-coverage-display-values';
import { ChoroplethTooltip } from '~/domain/vaccine/vaccine-coverage-choropleth-per-gm';
import { VaccineCoveragePerAgeGroup } from '~/domain/vaccine/vaccine-coverage-per-age-group';
import { VaccineCoverageToggleTile } from '~/domain/vaccine/vaccine-coverage-toggle-tile';
import { useIntl } from '~/intl';
import { useFeature, withFeatureNotFoundPage } from '~/lib/features';
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
import { assert } from '~/utils/assert';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = withFeatureNotFoundPage(
  'vrVaccinationPage',

  createGetStaticProps(
    getLastGeneratedDate,
    selectVrPageMetricData(),
    createGetChoroplethData({
      gm: ({ vaccine_coverage_per_age_group }, ctx) => {
        if (!isDefined(vaccine_coverage_per_age_group)) {
          return {
            vaccine_coverage_per_age_group:
              null as unknown as GmCollectionVaccineCoveragePerAgeGroup[],
          };
        }

        return {
          vaccine_coverage_per_age_group: selectVaccineCoverageData(
            isPresent(ctx.params?.code)
              ? vaccine_coverage_per_age_group.filter((el) =>
                  gmCodesByVrCode[ctx.params?.code as string].includes(
                    el.gmcode
                  )
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
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      safetyRegionName: vrName,
    }),
  };

  const vaccineCoverageEstimatedFeature = useFeature(
    'vrVaccineCoverageEstimated'
  );
  const vaccinationPerAgeGroupFeature = useFeature('vrVaccinationPerAgeGroup');

  const gmCodes = gmCodesByVrCode[data.code];
  const selectedGmCode = gmCodes ? gmCodes[0] : undefined;

  /**
   * Filter out only the the 12+ and 18+ for the toggle component.
   */
  const filteredAgeGroup18Plus =
    data.vaccine_coverage_per_age_group.values.find(
      (item) => item.age_group_range === '18+'
    );

  const filteredAgeGroup12Plus =
    data.vaccine_coverage_per_age_group.values.find(
      (item) => item.age_group_range === '12+'
    );

  assert(
    filteredAgeGroup18Plus,
    'Could not find data for the vaccine coverage per age group for the age 18+'
  );

  assert(
    filteredAgeGroup12Plus,
    'Could not find data for the vaccine coverage per age group for the age 12+'
  );

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout data={data} vrName={vrName} lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            category={siteText.veiligheidsregio_layout.headings.vaccinaties}
            title={replaceVariablesInText(text.informatie_blok.titel, {
              safetyRegionName: vrName,
            })}
            description={text.informatie_blok.beschrijving}
            icon={<VaccinatieIcon />}
            metadata={{
              datumsText: text.informatie_blok.datums,
              dateOrRange: filteredAgeGroup18Plus.date_unix,
              dateOfInsertionUnix:
                filteredAgeGroup18Plus.date_of_insertion_unix,
              dataSources: [],
            }}
            pageLinks={content.page.pageLinks}
            referenceLink={text.informatie_blok.reference.href}
            articles={content.highlight.articles}
          />

          {vaccineCoverageEstimatedFeature.isEnabled && (
            <VaccineCoverageToggleTile
              title={text.vaccination_grade_toggle_tile.title}
              source={text.vaccination_grade_toggle_tile.source}
              descriptionFooter={
                text.vaccination_grade_toggle_tile.description_footer
              }
              dateUnix={filteredAgeGroup18Plus.date_unix}
              age18Plus={{
                fully_vaccinated:
                  filteredAgeGroup18Plus.fully_vaccinated_percentage,
                has_one_shot: filteredAgeGroup18Plus.has_one_shot_percentage,
                birthyear: filteredAgeGroup18Plus.birthyear_range,
                label_fully_vaccinated:
                  filteredAgeGroup18Plus.fully_vaccinated_percentage_label,
                label_has_one_shot:
                  filteredAgeGroup18Plus.has_one_shot_percentage_label,
              }}
              age12Plus={{
                fully_vaccinated:
                  filteredAgeGroup12Plus.fully_vaccinated_percentage,
                has_one_shot: filteredAgeGroup12Plus.has_one_shot_percentage,
                birthyear: filteredAgeGroup12Plus.birthyear_range,
                label_fully_vaccinated:
                  filteredAgeGroup12Plus.fully_vaccinated_percentage_label,
                label_has_one_shot:
                  filteredAgeGroup12Plus.has_one_shot_percentage_label,
              }}
            />
          )}

          {vaccinationPerAgeGroupFeature.isEnabled && (
            <VaccineCoveragePerAgeGroup
              title={text.vaccination_coverage.title}
              description={text.vaccination_coverage.description}
              sortingOrder={['18+', '12-17', '12+']}
              metadata={{
                date: data.vaccine_coverage_per_age_group.values[0].date_unix,
                source: text.vaccination_coverage.bronnen.rivm,
              }}
              values={data.vaccine_coverage_per_age_group.values}
            />
          )}

          <ChoroplethTile
            title={replaceVariablesInText(
              siteText.vaccinaties.vr_choropleth_vaccinatie_graad.title,
              { safetyRegionName: vrName }
            )}
            description={
              <>
                <Markdown
                  content={replaceVariablesInText(
                    siteText.vaccinaties.vr_choropleth_vaccinatie_graad
                      .description,
                    { safetyRegionName: vrName }
                  )}
                />

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
                selectedCode: selectedGmCode,
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
      </VrLayout>
    </Layout>
  );
};

export default VaccinationsVrPage;
