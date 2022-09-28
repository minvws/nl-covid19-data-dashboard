import {
  colors,
  GmCollectionVaccineCoveragePerAgeGroup,
} from '@corona-dashboard/common';
import { Vaccinaties as VaccinatieIcon } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { hasValueAtKey, isDefined, isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { thresholds } from '~/components/choropleth/logic';
import {
  TileList,
  PageInformationBlock,
  Markdown,
  ChoroplethTile,
  DynamicChoropleth,
  Divider,
} from '~/components';
import { gmCodesByVrCode } from '~/data';
import { Layout, VrLayout } from '~/domain/layout';
import {
  AgeGroup,
  AgeGroupSelect,
} from '~/domain/vaccine/components/age-group-select';
import {
  selectVaccineCoverageData,
  ChoroplethTooltip,
  VaccineCoveragePerAgeGroup,
  VaccineCoverageToggleTile,
  VaccineCoverageTile,
} from '~/domain/vaccine';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import {
  getArticleParts,
  getLinkParts,
  getPagePartsQuery,
} from '~/queries/get-page-parts-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectVrData,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import {
  assert,
  replaceVariablesInText,
  useReverseRouter,
  useFormatLokalizePercentage,
} from '~/utils';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useFeature } from '~/lib/features';

const pageMetrics = [
  'vaccine_coverage_per_age_group',
  'vaccine_coverage_per_age_group_archived',
  'booster_coverage',
];

const selectLokalizeTexts = (siteText: SiteText) => ({
  textNl: siteText.pages.vaccinations_page.nl,
  textVr: siteText.pages.vaccinations_page.vr,
  textShared: siteText.pages.vaccinations_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectVrData(
    'vaccine_coverage_per_age_group',
    'vaccine_coverage_per_age_group_archived',
    'vaccine_coverage_per_age_group_archived_20220908',
    'booster_coverage'
  ),
  createGetChoroplethData({
    gm: ({ vaccine_coverage_per_age_group }, ctx) => {
      if (!isDefined(vaccine_coverage_per_age_group)) {
        return {
          vaccine_coverage_per_age_group: [],
        };
      }
      return {
        vaccine_coverage_per_age_group: selectVaccineCoverageData(
          isPresent(ctx.params?.code)
            ? vaccine_coverage_per_age_group.filter((el) =>
                gmCodesByVrCode[ctx.params?.code as string].includes(el.gmcode)
              )
            : vaccine_coverage_per_age_group
        ),
      };
    },
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<
      PagePartQueryResult<ArticleParts | LinkParts>
    >(() => getPagePartsQuery('vaccinations_page'))(context);

    return {
      content: {
        articles: getArticleParts(
          content.pageParts,
          'vaccinationsPageArticles'
        ),
        links: getLinkParts(content.pageParts, 'vaccinationsPageLinks'),
      },
    };
  }
);

export const VaccinationsVrPage = (
  props: StaticProps<typeof getStaticProps>
) => {
  const {
    pageText,
    vrName,
    selectedVrData: data,
    choropleth,
    lastGenerated,
    content,
  } = props;
  const { commonTexts } = useIntl();
  const reverseRouter = useReverseRouter();
  const router = useRouter();
  const { formatPercentageAsNumber } = useFormatLokalizePercentage();
  const [hasHideArchivedCharts, setHideArchivedCharts] =
    useState<boolean>(false);

  const vaccinationsCoverageFeature = useFeature('vaccinationsCoverage');

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('18+');

  const { textNl, textVr, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(
    pageText,
    selectLokalizeTexts
  );

  const metadata = {
    ...textVr.metadata,
    title: replaceVariablesInText(textVr.metadata.title, {
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(textVr.metadata.description, {
      safetyRegionName: vrName,
    }),
  };

  const gmCodes = gmCodesByVrCode[router.query.code as string];
  const selectedGmCode = gmCodes ? gmCodes[0] : undefined;

  /**
   * Filter out only the the 12+ and 18+ for the toggle component.
   */
  const filteredAgeGroup60Plus =
    data.vaccine_coverage_per_age_group.values.find(
      (item) => item.age_group_range === '60+'
    );

  const filteredAgeGroup18Plus =
    data.vaccine_coverage_per_age_group.values.find(
      (item) => item.age_group_range === '18+'
    );

  const filteredAgeGroup12Plus =
    data.vaccine_coverage_per_age_group.values.find(
      (item) => item.age_group_range === '12+'
    );

  /**
   * Archived -  Filter out only the the 12+ and 18+ for the toggle component.
   */
  const filteredAgeGroup18PlusArchived =
    data.vaccine_coverage_per_age_group_archived_20220908.values.find(
      (item) => item.age_group_range === '18+'
    );

  const filteredAgeGroup12PlusArchived =
    data.vaccine_coverage_per_age_group_archived_20220908.values.find(
      (item) => item.age_group_range === '12+'
    );

  const boosterCoverage18PlusValue = data.booster_coverage.values.find(
    (v) => v.age_group === '18+'
  );
  const boosterCoverage12PlusValue = data.booster_coverage.values.find(
    (v) => v.age_group === '12+'
  );

  assert(
    filteredAgeGroup60Plus,
    `[${VaccinationsVrPage.name}] Could not find data for the vaccine coverage per age group for the age 18+`
  );

  assert(
    filteredAgeGroup18Plus,
    `[${VaccinationsVrPage.name}] Could not find data for the vaccine coverage per age group for the age 18+`
  );

  assert(
    filteredAgeGroup12Plus,
    `[${VaccinationsVrPage.name}] Could not find data for the vaccine coverage per age group for the age 12+`
  );

  assert(
    filteredAgeGroup18PlusArchived,
    `[${VaccinationsVrPage.name}] Could not find archived data for the vaccine coverage per age group for the age 18+`
  );

  assert(
    filteredAgeGroup12PlusArchived,
    `[${VaccinationsVrPage.name}] Could not find archived data for the vaccine coverage per age group for the age 12+`
  );

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);
  const choroplethData: GmCollectionVaccineCoveragePerAgeGroup[] =
    choropleth.gm.vaccine_coverage_per_age_group.filter(
      hasValueAtKey('age_group_range', selectedAgeGroup)
    );

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.actions_to_take.title}
            title={replaceVariablesInText(textVr.information_block.title, {
              safetyRegionName: vrName,
            })}
            description={textVr.information_block.description}
            icon={<VaccinatieIcon />}
            metadata={{
              datumsText: textVr.information_block.dates,
              dateOrRange: filteredAgeGroup18Plus.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [],
            }}
            pageLinks={content.links}
            referenceLink={textVr.information_block.reference.href}
            articles={content.articles}
            vrNameOrGmName={vrName}
            warning={textVr.warning}
          />

          {vaccinationsCoverageFeature.isEnabled && (
            <>
              <VaccineCoverageTile
                title={textShared.vaccination_grade_tile.autumn_labels.title}
                description={
                  textShared.vaccination_grade_tile.autumn_labels.description
                }
                source={textShared.vaccination_grade_tile.autumn_labels.source}
                descriptionFooter={
                  textShared.vaccination_grade_tile.autumn_labels
                    .description_footer
                }
                coverageData={[
                  {
                    value:
                      filteredAgeGroup60Plus.autumn_2022_vaccinated_percentage,
                    birthyear: filteredAgeGroup60Plus.birthyear_range,
                    title:
                      textShared.vaccination_grade_tile.age_group_labels
                        .age_60_plus,
                    description:
                      textShared.vaccination_grade_tile.autumn_labels
                        .description_60_plus,
                    bar: {
                      value:
                        filteredAgeGroup60Plus.autumn_2022_vaccinated_percentage ||
                        0,
                      color: colors.data.scale.blueDetailed[8],
                    },
                  },
                  {
                    value:
                      filteredAgeGroup12Plus.autumn_2022_vaccinated_percentage,
                    birthyear: filteredAgeGroup12Plus.birthyear_range,
                    title:
                      textShared.vaccination_grade_tile.age_group_labels
                        .age_12_plus,
                    description:
                      textShared.vaccination_grade_tile.autumn_labels
                        .description_12_plus,
                    bar: {
                      value:
                        filteredAgeGroup12Plus.autumn_2022_vaccinated_percentage ||
                        0,
                      color: colors.data.scale.blueDetailed[8],
                    },
                  },
                ]}
                dateUnix={filteredAgeGroup12Plus.date_unix}
              />
              <VaccineCoverageTile
                title={
                  textShared.vaccination_grade_tile.fully_vaccinated_labels
                    .title
                }
                description={
                  textShared.vaccination_grade_tile.fully_vaccinated_labels
                    .description
                }
                source={
                  textShared.vaccination_grade_tile.fully_vaccinated_labels
                    .source
                }
                descriptionFooter={
                  textShared.vaccination_grade_tile.fully_vaccinated_labels
                    .description_footer
                }
                coverageData={[
                  {
                    value: filteredAgeGroup18Plus.fully_vaccinated_percentage,
                    birthyear: filteredAgeGroup18Plus.birthyear_range,
                    title:
                      textShared.vaccination_grade_tile.age_group_labels
                        .age_18_plus,
                    description:
                      textShared.vaccination_grade_tile.fully_vaccinated_labels
                        .description_18_plus,
                    bar: {
                      value:
                        filteredAgeGroup18Plus.fully_vaccinated_percentage || 0,
                      color: colors.data.scale.blueDetailed[3],
                    },
                  },
                  {
                    value: filteredAgeGroup12Plus.fully_vaccinated_percentage,
                    birthyear: filteredAgeGroup12Plus.birthyear_range,
                    title:
                      textShared.vaccination_grade_tile.age_group_labels
                        .age_12_plus,
                    description:
                      textShared.vaccination_grade_tile.fully_vaccinated_labels
                        .description_12_plus,
                    bar: {
                      value:
                        filteredAgeGroup12Plus.fully_vaccinated_percentage || 0,
                      color: colors.data.scale.blueDetailed[3],
                    },
                  },
                ]}
                dateUnix={filteredAgeGroup12Plus.date_unix}
              />
            </>
          )}

          <ChoroplethTile
            title={replaceVariablesInText(
              commonTexts.choropleth.vaccination_coverage.vr.title,
              { safetyRegionName: vrName }
            )}
            description={
              <>
                <Markdown
                  content={replaceVariablesInText(
                    commonTexts.choropleth.vaccination_coverage.vr.description,
                    { safetyRegionName: vrName }
                  )}
                />
                <Box maxWidth="20rem">
                  <AgeGroupSelect
                    onChange={setSelectedAgeGroup}
                    initialValue={selectedAgeGroup}
                    shownAgeGroups={['12+', '18+']}
                  />
                </Box>
              </>
            }
            legend={{
              thresholds: thresholds.gm.fully_vaccinated_percentage,
              title:
                commonTexts.choropleth.choropleth_vaccination_coverage.shared
                  .legend_title,
            }}
            metadata={{
              source:
                commonTexts.choropleth.vaccination_coverage.shared.bronnen.rivm,
              date: choropleth.gm.vaccine_coverage_per_age_group[0].date_unix,
            }}
          >
            <DynamicChoropleth
              accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
              map="gm"
              data={choroplethData}
              dataConfig={{
                metricName: 'vaccine_coverage_per_age_group',
                metricProperty: 'fully_vaccinated_percentage',
              }}
              dataOptions={{
                getLink: reverseRouter.gm.vaccinaties,
                selectedCode: selectedGmCode,
                tooltipVariables: {
                  age_group: commonTexts.common.age_groups[selectedAgeGroup],
                },
              }}
              formatTooltip={(context) => (
                <ChoroplethTooltip
                  data={context}
                  mapData={choropleth.gm.vaccine_coverage_per_age_group.filter(
                    (singleGm) => singleGm.gmcode === context.code
                  )}
                  ageGroups={['12+', '18+']}
                  selectedCoverageKind={'fully_vaccinated_percentage'}
                />
              )}
            />
          </ChoroplethTile>
          <Divider />
          <PageInformationBlock
            title={textNl.section_archived.title}
            description={textNl.section_archived.description}
            isArchivedHidden={hasHideArchivedCharts}
            onToggleArchived={() =>
              setHideArchivedCharts(!hasHideArchivedCharts)
            }
          />
          {hasHideArchivedCharts && (
            <>
              <VaccineCoverageToggleTile
                title={textVr.vaccination_grade_toggle_tile.title}
                source={textVr.vaccination_grade_toggle_tile.source}
                descriptionFooter={
                  textVr.vaccination_grade_toggle_tile.description_footer
                }
                dateUnix={filteredAgeGroup18PlusArchived.date_unix}
                age18Plus={{
                  fully_vaccinated:
                    filteredAgeGroup18PlusArchived.fully_vaccinated_percentage,
                  has_one_shot:
                    filteredAgeGroup18PlusArchived.has_one_shot_percentage,
                  birthyear: filteredAgeGroup18PlusArchived.birthyear_range,
                  fully_vaccinated_label:
                    filteredAgeGroup18PlusArchived.fully_vaccinated_percentage_label,
                  has_one_shot_label:
                    filteredAgeGroup18PlusArchived.has_one_shot_percentage_label,
                  boostered: formatPercentageAsNumber(
                    `${boosterCoverage18PlusValue?.percentage}`
                  ),
                  boostered_label: boosterCoverage18PlusValue?.percentage_label,
                  dateUnixBoostered: boosterCoverage18PlusValue?.date_unix,
                }}
                age12Plus={{
                  fully_vaccinated:
                    filteredAgeGroup12PlusArchived.fully_vaccinated_percentage,
                  has_one_shot:
                    filteredAgeGroup12PlusArchived.has_one_shot_percentage,
                  birthyear: filteredAgeGroup12PlusArchived.birthyear_range,
                  fully_vaccinated_label:
                    filteredAgeGroup12PlusArchived.fully_vaccinated_percentage_label,
                  has_one_shot_label:
                    filteredAgeGroup12PlusArchived.has_one_shot_percentage_label,
                  boostered: formatPercentageAsNumber(
                    `${boosterCoverage12PlusValue?.percentage}`
                  ),
                  boostered_label: boosterCoverage12PlusValue?.percentage_label,
                  dateUnixBoostered: boosterCoverage12PlusValue?.date_unix,
                }}
                age12PlusToggleText={
                  textVr.vaccination_grade_toggle_tile.age_12_plus
                }
                age18PlusToggleText={
                  textVr.vaccination_grade_toggle_tile.age_18_plus
                }
                labelTexts={textNl.vaccination_grade_toggle_tile.top_labels}
              />
              <VaccineCoveragePerAgeGroup
                title={commonTexts.choropleth.vaccination_coverage.vr.title}
                description={
                  commonTexts.choropleth.vaccination_coverage.vr.description
                }
                sortingOrder={['18+', '12+']}
                metadata={{
                  date: data.vaccine_coverage_per_age_group_archived.values[0]
                    .date_unix,
                  source:
                    commonTexts.choropleth.vaccination_coverage.vr.bronnen.rivm,
                }}
                values={data.vaccine_coverage_per_age_group_archived.values}
                text={textNl}
              />
            </>
          )}
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default VaccinationsVrPage;
