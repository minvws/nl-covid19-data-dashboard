import { colors, GmCollectionVaccineCoveragePerAgeGroup } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Vaccinaties as VaccinatieIcon } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { hasValueAtKey, isDefined, isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { DynamicChoropleth, ChoroplethTile, Markdown, PageInformationBlock, TileList, Divider } from '~/components';
import { thresholds } from '~/components/choropleth/logic';
import { gmCodesByVrCode, vrCodeByGmCode } from '~/data';
import { Layout, GmLayout } from '~/domain/layout';
import { Languages, SiteText } from '~/locale';
import { BoldText } from '~/components/typography';
import { matchingAgeGroups } from '~/domain/vaccine/common';
import { AgeGroup, AgeGroupSelect } from '~/domain/vaccine/components/age-group-select';
import { VaccinationCoverageKindSelect, CoverageKindProperty } from '~/domain/vaccine/components/vaccination-coverage-kind-select';
import { selectVaccineCoverageData, VaccineCoverageToggleTile, ChoroplethTooltip, VaccineCoveragePerAgeGroup, VaccineCoverageTile } from '~/domain/vaccine';
import { useIntl } from '~/intl';
import { getArticleParts, getLinkParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetChoroplethData, createGetContent, getLastGeneratedDate, selectGmData, getLokalizeTexts } from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import { assert, replaceVariablesInText, useReverseRouter, useFormatLokalizePercentage } from '~/utils';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useFeature } from '~/lib/features';

const pageMetrics = ['vaccine_coverage_per_age_group', 'vaccine_coverage_per_age_group_archived', 'booster_coverage'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  textGm: siteText.pages.vaccinations_page.gm,
  textNl: siteText.pages.vaccinations_page.nl,
  textShared: siteText.pages.vaccinations_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectGmData('code', 'vaccine_coverage_per_age_group', 'vaccine_coverage_per_age_group_archived', 'vaccine_coverage_per_age_group_archived_20220908', 'booster_coverage'),
  createGetChoroplethData({
    gm: ({ vaccine_coverage_per_age_group }, ctx) => {
      if (!isDefined(vaccine_coverage_per_age_group)) {
        return {
          vaccine_coverage_per_age_group: null as unknown as GmCollectionVaccineCoveragePerAgeGroup[],
        };
      }
      const vrCode = isPresent(ctx.params?.code) ? vrCodeByGmCode[ctx.params?.code as 'string'] : undefined;

      return {
        vaccine_coverage_per_age_group: selectVaccineCoverageData(
          isDefined(vrCode) ? vaccine_coverage_per_age_group.filter((el) => gmCodesByVrCode[vrCode].includes(el.gmcode)) : vaccine_coverage_per_age_group
        ),
      };
    },
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<PagePartQueryResult<ArticleParts | LinkParts>>(() => getPagePartsQuery('vaccinations_page'))(context);

    return {
      content: {
        articles: getArticleParts(content.pageParts, 'vaccinationsPageArticles'),
        links: getLinkParts(content.pageParts, 'vaccinationsPageLinks'),
      },
    };
  }
);

export const VaccinationsGmPage = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, choropleth, municipalityName, selectedGmData: data, content, lastGenerated } = props;
  const { commonTexts } = useIntl();
  const reverseRouter = useReverseRouter();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('18+');
  const [selectedCoverageKind, setSelectedCoverageKind] = useState<CoverageKindProperty>('fully_vaccinated_percentage');
  const { formatPercentageAsNumber } = useFormatLokalizePercentage();
  const [hasHideArchivedCharts, setHideArchivedCharts] = useState<boolean>(false);

  const { textGm, textNl, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...textGm.metadata,
    title: replaceVariablesInText(textGm.metadata.title, {
      municipalityName: municipalityName,
    }),
    description: replaceVariablesInText(textGm.metadata.description, {
      municipalityName: municipalityName,
    }),
  };

  const vaccinationsCoverageFeature = useFeature('vaccinationsCoverage');

  /**
   * When changing between coverage kinds where the selected age group isn't available,
   * the other coverage kind set the non-matching age group to a default one.
   */
  const setSelectedCoverageKindAndAge = (coverageKind: CoverageKindProperty) => {
    if (coverageKind === selectedCoverageKind) return;
    if (selectedAgeGroup !== '12+') {
      setSelectedAgeGroup(selectedAgeGroup === '18+' ? '60+' : '18+');
    }
    setSelectedCoverageKind(coverageKind);
  };

  /**
   * Filter out only the the 12+ and 18+ for the toggle component.
   */
  const filteredAgeGroup60Plus = data.vaccine_coverage_per_age_group.values.find((x) => x.age_group_range === '60+');

  const filteredAgeGroup18Plus = data.vaccine_coverage_per_age_group.values.find((x) => x.age_group_range === '18+');

  const filteredAgeGroup12Plus = data.vaccine_coverage_per_age_group.values.find((x) => x.age_group_range === '12+');

  /**
   * Archived - Filter out only the the 12+ and 18+ for the toggle component.
   */
  const filteredArchivedAgeGroup18Plus = data.vaccine_coverage_per_age_group_archived_20220908.values.find((x) => x.age_group_range === '18+');

  const filteredArchivedAgeGroup12Plus = data.vaccine_coverage_per_age_group_archived_20220908.values.find((x) => x.age_group_range === '12+');

  const boosterCoverage18PlusValue = data.booster_coverage?.values?.find((v) => v.age_group === '18+');
  const boosterCoverage12PlusValue = data.booster_coverage?.values?.find((v) => v.age_group === '12+');

  assert(filteredAgeGroup60Plus, `[${VaccinationsGmPage.name}] Could not find data for the vaccine coverage per age group for the age 60+`);

  assert(filteredAgeGroup18Plus, `[${VaccinationsGmPage.name}] Could not find data for the vaccine coverage per age group for the age 18+`);

  assert(filteredAgeGroup12Plus, `[${VaccinationsGmPage.name}] Could not find data for the vaccine coverage per age group for the age 12+`);

  assert(filteredArchivedAgeGroup18Plus, `[${VaccinationsGmPage.name}] Could not find data for the archived vaccine coverage per age group for the age 18+`);

  assert(filteredArchivedAgeGroup12Plus, `[${VaccinationsGmPage.name}] Could not find data for the archived vaccine coverage per age group for the age 12+`);

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);
  const choroplethData: GmCollectionVaccineCoveragePerAgeGroup[] = choropleth.gm.vaccine_coverage_per_age_group.filter(hasValueAtKey('age_group_range', selectedAgeGroup));

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout code={data.code} municipalityName={municipalityName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.actions_to_take.title}
            title={replaceVariablesInText(textGm.vaccination_coverage.top_level_information_block.title, {
              municipalityName: municipalityName,
            })}
            description={textGm.vaccination_coverage.top_level_information_block.description}
            icon={<VaccinatieIcon />}
            metadata={{
              datumsText: textGm.vaccination_coverage.top_level_information_block.dates,
              dateOrRange: filteredAgeGroup18Plus.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [],
            }}
            pageLinks={content.links}
            referenceLink={textGm.vaccination_coverage.top_level_information_block.reference.href}
            articles={content.articles}
            vrNameOrGmName={municipalityName}
            warning={textGm.warning}
          />
          {vaccinationsCoverageFeature.isEnabled && (
            <>
              <VaccineCoverageTile
                title={textShared.vaccination_grade_tile.autumn_labels.title}
                description={textShared.vaccination_grade_tile.autumn_labels.description}
                source={textShared.vaccination_grade_tile.autumn_labels.source}
                descriptionFooter={textShared.vaccination_grade_tile.autumn_labels.description_footer}
                coverageData={[
                  {
                    value: filteredAgeGroup60Plus.autumn_2022_vaccinated_percentage,
                    birthyear: filteredAgeGroup60Plus.birthyear_range,
                    title: textShared.vaccination_grade_tile.age_group_labels.age_60_plus,
                    description: textShared.vaccination_grade_tile.autumn_labels.description_60_plus,
                    bar: {
                      value: filteredAgeGroup60Plus.autumn_2022_vaccinated_percentage || 0,
                      color: colors.scale.blueDetailed[8],
                    },
                  },
                  {
                    value: filteredAgeGroup12Plus.autumn_2022_vaccinated_percentage,
                    birthyear: filteredAgeGroup12Plus.birthyear_range,
                    title: textShared.vaccination_grade_tile.age_group_labels.age_12_plus,
                    description: textShared.vaccination_grade_tile.autumn_labels.description_12_plus,
                    bar: {
                      value: filteredAgeGroup12Plus.autumn_2022_vaccinated_percentage || 0,
                      color: colors.scale.blueDetailed[8],
                    },
                  },
                ]}
                dateUnix={filteredArchivedAgeGroup12Plus.date_unix}
              />
              <VaccineCoverageTile
                title={textShared.vaccination_grade_tile.fully_vaccinated_labels.title}
                description={textShared.vaccination_grade_tile.fully_vaccinated_labels.description}
                source={textShared.vaccination_grade_tile.fully_vaccinated_labels.source}
                descriptionFooter={textShared.vaccination_grade_tile.fully_vaccinated_labels.description_footer}
                coverageData={[
                  {
                    value: filteredAgeGroup18Plus.fully_vaccinated_percentage,
                    birthyear: filteredAgeGroup18Plus.birthyear_range,
                    title: textShared.vaccination_grade_tile.age_group_labels.age_18_plus,
                    description: textShared.vaccination_grade_tile.fully_vaccinated_labels.description_18_plus,
                    bar: {
                      value: filteredAgeGroup18Plus.fully_vaccinated_percentage || 0,
                      color: colors.scale.blueDetailed[3],
                    },
                  },
                  {
                    value: filteredAgeGroup12Plus.fully_vaccinated_percentage,
                    birthyear: filteredAgeGroup12Plus.birthyear_range,
                    title: textShared.vaccination_grade_tile.age_group_labels.age_12_plus,
                    description: textShared.vaccination_grade_tile.fully_vaccinated_labels.description_12_plus,
                    bar: {
                      value: filteredAgeGroup12Plus.fully_vaccinated_percentage || 0,
                      color: colors.scale.blueDetailed[3],
                    },
                  },
                ]}
                dateUnix={filteredAgeGroup12Plus.date_unix}
              />
            </>
          )}

          <ChoroplethTile
            title={replaceVariablesInText(commonTexts.choropleth.choropleth_vaccination_coverage.gm.title, { municipalityName: municipalityName })}
            description={
              <>
                <Markdown content={replaceVariablesInText(commonTexts.choropleth.choropleth_vaccination_coverage.gm.description, { municipalityName: municipalityName })} />

                <Box display="flex" flexDirection="row" justifyContent="flex-start" spacingHorizontal={2} as={'fieldset'}>
                  <BoldText
                    as="legend"
                    css={css({
                      flexBasis: '100%',
                      mb: 2,
                    })}
                  >
                    {commonTexts.choropleth.vaccination_coverage.shared.dropdowns_title}
                  </BoldText>

                  <Box display="flex" width="100%" spacingHorizontal={{ xs: 2 }} flexWrap="wrap" flexDirection={{ _: 'column', xs: 'row' }}>
                    <Box flex="1">
                      <VaccinationCoverageKindSelect onChange={setSelectedCoverageKindAndAge} initialValue={selectedCoverageKind} />
                    </Box>
                    <Box flex="1">
                      <Box maxWidth="20rem">
                        <AgeGroupSelect onChange={setSelectedAgeGroup} initialValue={selectedAgeGroup} shownAgeGroups={matchingAgeGroups[selectedCoverageKind]} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </>
            }
            legend={{
              thresholds: thresholds.gm.fully_vaccinated_percentage,
              title: commonTexts.choropleth.choropleth_vaccination_coverage.shared.legend_title,
            }}
            metadata={{
              source: commonTexts.choropleth.vaccination_coverage.shared.bronnen.rivm,
              date: choropleth.gm.vaccine_coverage_per_age_group[0].date_unix,
            }}
            hasPadding
          >
            <DynamicChoropleth
              accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
              map="gm"
              data={choroplethData}
              dataConfig={{
                metricName: 'vaccine_coverage_per_age_group',
                metricProperty: selectedCoverageKind,
              }}
              dataOptions={{
                getLink: reverseRouter.gm.vaccinaties,
                highlightSelection: true,
                selectedCode: data.code,
                tooltipVariables: {
                  age_group: commonTexts.common.age_groups[selectedAgeGroup],
                },
              }}
              formatTooltip={(context) => (
                <ChoroplethTooltip
                  data={context}
                  mapData={choropleth.gm.vaccine_coverage_per_age_group.filter((singleGm) => singleGm.gmcode === context.code)}
                  ageGroups={matchingAgeGroups[selectedCoverageKind]}
                  selectedCoverageKind={selectedCoverageKind}
                />
              )}
            />
          </ChoroplethTile>
          <Divider />
          <PageInformationBlock
            title={textNl.section_archived.title}
            description={textNl.section_archived.description}
            isArchivedHidden={hasHideArchivedCharts}
            onToggleArchived={() => setHideArchivedCharts(!hasHideArchivedCharts)}
          />
          {hasHideArchivedCharts && (
            <>
              <VaccineCoverageToggleTile
                title={textGm.vaccination_grade_toggle_tile.title}
                source={textGm.vaccination_grade_toggle_tile.source}
                descriptionFooter={textGm.vaccination_grade_toggle_tile.description_footer}
                dateUnix={filteredArchivedAgeGroup18Plus.date_unix}
                age18Plus={{
                  fully_vaccinated: filteredArchivedAgeGroup18Plus.fully_vaccinated_percentage,
                  has_one_shot: filteredArchivedAgeGroup18Plus.has_one_shot_percentage,
                  birthyear: filteredArchivedAgeGroup18Plus.birthyear_range,
                  fully_vaccinated_label: filteredArchivedAgeGroup18Plus.fully_vaccinated_percentage_label,
                  has_one_shot_label: filteredArchivedAgeGroup18Plus.has_one_shot_percentage_label,
                  boostered: formatPercentageAsNumber(`${boosterCoverage18PlusValue?.percentage}`),
                  boostered_label: boosterCoverage18PlusValue?.percentage_label,
                  dateUnixBoostered: boosterCoverage18PlusValue?.date_unix,
                }}
                age12Plus={{
                  fully_vaccinated: filteredArchivedAgeGroup12Plus.fully_vaccinated_percentage,
                  has_one_shot: filteredArchivedAgeGroup12Plus.has_one_shot_percentage,
                  birthyear: filteredArchivedAgeGroup12Plus.birthyear_range,
                  fully_vaccinated_label: filteredArchivedAgeGroup12Plus.fully_vaccinated_percentage_label,
                  has_one_shot_label: filteredArchivedAgeGroup12Plus.has_one_shot_percentage_label,
                  boostered: formatPercentageAsNumber(`${boosterCoverage12PlusValue?.percentage}`),
                  boostered_label: boosterCoverage12PlusValue?.percentage_label,
                  dateUnixBoostered: boosterCoverage12PlusValue?.date_unix,
                }}
                age12PlusToggleText={textGm.vaccination_grade_toggle_tile.age_12_plus}
                age18PlusToggleText={textGm.vaccination_grade_toggle_tile.age_18_plus}
                labelTexts={textNl.vaccination_grade_toggle_tile.top_labels}
              />
              <VaccineCoveragePerAgeGroup
                title={textGm.vaccination_coverage.title}
                description={textGm.vaccination_coverage.description}
                sortingOrder={['18+', '12+']}
                metadata={{
                  date: data.vaccine_coverage_per_age_group_archived.values[0].date_unix,
                  source: textGm.vaccination_coverage.bronnen.rivm,
                }}
                values={data.vaccine_coverage_per_age_group_archived.values}
                text={textNl}
              />
            </>
          )}
        </TileList>
      </GmLayout>
    </Layout>
  );
};

export default VaccinationsGmPage;
