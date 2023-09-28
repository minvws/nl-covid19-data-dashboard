import { colors, ArchivedGmCollectionVaccineCoveragePerAgeGroup } from '@corona-dashboard/common';
import { Vaccinaties as VaccinatieIcon } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { InView } from '~/components/in-view';
import { BorderedKpiSection } from '~/components/kpi/bordered-kpi-section';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { PageInformationBlock } from '~/components/page-information-block/page-information-block';
import { TileList } from '~/components/tile-list';
import { gmCodesByVrCode, vrCodeByGmCode } from '~/data';
import { emptyCoverageData } from '~/data/gm/vaccinations/empty-coverage-data';
import { GmLayout, Layout } from '~/domain/layout';
import { VaccineCoveragePerAgeGroup, VaccineCoverageToggleTile } from '~/domain/vaccine';
import { VaccineCoverageChoropleth } from '~/domain/vaccine/vaccine-coverage-choropleth';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { getArticleParts, getDataExplainedParts, getFaqParts, getLinkParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectGmData, selectArchivedGmData, createGetArchivedChoroplethData } from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import { assert, replaceVariablesInText, useFormatLokalizePercentage, useReverseRouter } from '~/utils';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { WarningTile } from '~/components/warning-tile';

const pageMetrics = ['vaccine_coverage_per_age_group', 'vaccine_coverage_per_age_group_archived', 'booster_coverage_archived_20220904'];

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
  selectGmData('code'),
  selectArchivedGmData(
    'vaccine_coverage_per_age_group_archived_20220622',
    'vaccine_coverage_per_age_group_archived_20220908',
    'booster_coverage_archived_20220904',
    'vaccine_coverage_per_age_group_archived_20231004'
  ),
  createGetArchivedChoroplethData({
    gm: ({ vaccine_coverage_per_age_group_choropleth_archived_20231004 }, ctx) => {
      if (!isDefined(vaccine_coverage_per_age_group_choropleth_archived_20231004)) {
        return {
          vaccine_coverage_per_age_group_choropleth_archived_202310xx: null as unknown as ArchivedGmCollectionVaccineCoveragePerAgeGroup[],
        };
      }
      const vrCode = isPresent(ctx.params?.code) ? vrCodeByGmCode[ctx.params?.code as 'string'] : undefined;

      return {
        vaccine_coverage_per_age_group_choropleth_archived_202310xx: isDefined(vrCode)
          ? vaccine_coverage_per_age_group_choropleth_archived_20231004.filter((vaccineCoveragePerAgeGroup) => gmCodesByVrCode[vrCode].includes(vaccineCoveragePerAgeGroup.gmcode))
          : vaccine_coverage_per_age_group_choropleth_archived_20231004,
      };
    },
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<PagePartQueryResult<ArticleParts | LinkParts>>(() => getPagePartsQuery('vaccinations_page'))(context);

    return {
      content: {
        articles: getArticleParts(content.pageParts, 'vaccinationsPageArticles'),
        faqs: getFaqParts(content.pageParts, 'vaccinationsPageFAQs'),
        dataExplained: getDataExplainedParts(content.pageParts, 'vaccinationsPageDataExplained'),
        links: getLinkParts(content.pageParts, 'vaccinationsPageLinks'),
      },
    };
  }
);

export const VaccinationsGmPage = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, archivedChoropleth, municipalityName, selectedGmData: currentData, selectedArchivedGmData: archivedData, content, lastGenerated } = props;
  const { commonTexts } = useIntl();
  const { formatPercentageAsNumber } = useFormatLokalizePercentage();
  const [hasHideArchivedCharts, setHideArchivedCharts] = useState<boolean>(false);
  const reverseRouter = useReverseRouter();
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

  const filteredVaccination = {
    primarySeries: archivedData.vaccine_coverage_per_age_group_archived_20231004.values.find((item) => item.vaccination_type === 'primary_series'),
    autumn2022: archivedData.vaccine_coverage_per_age_group_archived_20231004.values.find((item) => item.vaccination_type === 'autumn_2022'),
  };

  assert(filteredVaccination.primarySeries, `[${VaccinationsGmPage.name}] Could not find data for the vaccine coverage per age group for the primary series`);
  assert(filteredVaccination.autumn2022, `[${VaccinationsGmPage.name}] Could not find data for the vaccine coverage per age group for the autumn 2022 series`);

  const boosterCoverage18PlusArchivedValue =
    archivedData.booster_coverage_archived_20220904?.values?.find((v) => v.age_group === '18+') || emptyCoverageData.booster_coverage_archived_20220904.values[1];
  const boosterCoverage12PlusArchivedValue =
    archivedData.booster_coverage_archived_20220904?.values?.find((v) => v.age_group === '12+') || emptyCoverageData.booster_coverage_archived_20220904.values[0];

  const filteredArchivedAgeGroup18Plus =
    archivedData.vaccine_coverage_per_age_group_archived_20220908.values.find((x) => x.age_group_range === '18+') ||
    emptyCoverageData.vaccine_coverage_per_age_group_archived_20220908.values[0];
  const filteredArchivedAgeGroup12Plus =
    archivedData.vaccine_coverage_per_age_group_archived_20220908.values.find((x) => x.age_group_range === '12+') ||
    emptyCoverageData.vaccine_coverage_per_age_group_archived_20220908.values[1];

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(currentData, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout code={currentData.code} municipalityName={municipalityName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.actions_to_take.title}
            title={replaceVariablesInText(textGm.vaccination_coverage.top_level_information_block.title, {
              municipalityName: municipalityName,
            })}
            description={textGm.vaccination_coverage.top_level_information_block.description}
            icon={<VaccinatieIcon aria-hidden="true" />}
            metadata={{
              datumsText: textGm.vaccination_coverage.top_level_information_block.dates,
              dateOrRange: filteredVaccination.primarySeries.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textShared.bronnen.rivm],
            }}
            pageLinks={content.links}
            vrNameOrGmName={municipalityName}
            warning={textGm.warning}
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          {!!textShared.warning && <WarningTile isFullWidth message={textShared.warning} variant="informational" />}

          <BorderedKpiSection
            title={textShared.vaccination_grade_tile.fully_vaccinated_labels.title}
            description={textShared.vaccination_grade_tile.fully_vaccinated_labels.description}
            source={textShared.vaccination_grade_tile.fully_vaccinated_labels.source}
            tilesData={[
              {
                value: filteredVaccination.primarySeries.vaccinated_percentage_18_plus,
                isPercentage: true,
                birthyear: filteredVaccination.primarySeries.birthyear_range_18_plus,
                title: textShared.vaccination_grade_tile.age_group_labels.age_18_plus,
                description: textShared.vaccination_grade_tile.fully_vaccinated_labels.description_18_plus,
                bar: {
                  value: filteredVaccination.primarySeries.vaccinated_percentage_18_plus || 0,
                  color: colors.scale.blueDetailed[3],
                },
              },
              {
                value: filteredVaccination.primarySeries.vaccinated_percentage_12_plus,
                isPercentage: true,
                birthyear: filteredVaccination.primarySeries.birthyear_range_12_plus,
                title: textShared.vaccination_grade_tile.age_group_labels.age_12_plus,
                description: textShared.vaccination_grade_tile.fully_vaccinated_labels.description_12_plus,
                bar: {
                  value: filteredVaccination.primarySeries.vaccinated_percentage_12_plus || 0,
                  color: colors.scale.blueDetailed[3],
                },
              },
            ]}
            dateOrRange={filteredVaccination.primarySeries.date_unix}
          />
          <VaccineCoverageChoropleth
            data={archivedChoropleth.gm.vaccine_coverage_per_age_group_choropleth_archived_202310xx}
            dataOptions={{ getLink: reverseRouter.gm.vaccinaties, selectedCode: currentData.code, isPercentage: true }}
            text={{
              title: replaceVariablesInText(commonTexts.choropleth.choropleth_vaccination_coverage.gm.title, { municipalityName: municipalityName }),
              description: replaceVariablesInText(commonTexts.choropleth.choropleth_vaccination_coverage.gm.description, { municipalityName: municipalityName }),
              vaccinationKindLabel: commonTexts.choropleth.vaccination_coverage.shared.dropdown_label_vaccination_coverage_kind_select,
              ageGroupLabel: commonTexts.choropleth.vaccination_coverage.shared.dropdown_label_age_group_select,
            }}
            isPrimarySeries
          />

          {content.faqs && content.faqs.questions?.length > 0 && <PageFaqTile questions={content.faqs.questions} title={content.faqs.sectionTitle} />}

          {content.articles && content.articles.articles?.length > 0 && (
            <InView rootMargin="400px">
              <PageArticlesTile articles={content.articles.articles} title={content.articles.sectionTitle} />
            </InView>
          )}

          <PageInformationBlock
            title={textNl.section_archived.title}
            description={textNl.section_archived.description}
            isArchivedHidden={hasHideArchivedCharts}
            onToggleArchived={() => setHideArchivedCharts(!hasHideArchivedCharts)}
          />

          {hasHideArchivedCharts && (
            <>
              {filteredVaccination.autumn2022.birthyear_range_60_plus && (
                <BorderedKpiSection
                  title={textShared.vaccination_grade_tile.autumn_labels.title}
                  description={textShared.vaccination_grade_tile.autumn_labels.description}
                  source={textShared.vaccination_grade_tile.autumn_labels.source}
                  tilesData={[
                    {
                      value: filteredVaccination.autumn2022.vaccinated_percentage_60_plus,
                      isPercentage: true,
                      birthyear: filteredVaccination.autumn2022.birthyear_range_60_plus,
                      title: textShared.vaccination_grade_tile.age_group_labels.age_60_plus,
                      description: textShared.vaccination_grade_tile.autumn_labels.description_60_plus,
                      bar: {
                        value: filteredVaccination.autumn2022.vaccinated_percentage_60_plus || 0,
                        color: colors.scale.blueDetailed[8],
                      },
                    },
                    {
                      value: filteredVaccination.autumn2022.vaccinated_percentage_12_plus,
                      isPercentage: true,
                      birthyear: filteredVaccination.autumn2022.birthyear_range_12_plus,
                      title: textShared.vaccination_grade_tile.age_group_labels.age_12_plus,
                      description: textShared.vaccination_grade_tile.autumn_labels.description_12_plus,
                      bar: {
                        value: filteredVaccination.autumn2022.vaccinated_percentage_12_plus || 0,
                        color: colors.scale.blueDetailed[8],
                      },
                    },
                  ]}
                  dateOrRange={filteredVaccination.autumn2022.date_unix}
                />
              )}
              <VaccineCoverageChoropleth
                data={archivedChoropleth.gm.vaccine_coverage_per_age_group_choropleth_archived_202310xx}
                dataOptions={{ getLink: reverseRouter.gm.vaccinaties, selectedCode: currentData.code, isPercentage: true }}
                text={{
                  title: replaceVariablesInText(commonTexts.choropleth.choropleth_vaccination_coverage.gm.archived.title, { municipalityName: municipalityName }),
                  description: replaceVariablesInText(commonTexts.choropleth.choropleth_vaccination_coverage.gm.archived.description, { municipalityName: municipalityName }),
                  vaccinationKindLabel: commonTexts.choropleth.vaccination_coverage.shared.dropdown_label_vaccination_coverage_kind_select,
                  ageGroupLabel: commonTexts.choropleth.vaccination_coverage.shared.dropdown_label_age_group_select,
                }}
              />
              <VaccineCoverageToggleTile
                title={textGm.vaccination_grade_toggle_tile.title}
                source={textGm.vaccination_grade_toggle_tile.source}
                dateUnix={filteredArchivedAgeGroup18Plus.date_unix}
                age18Plus={{
                  fully_vaccinated: filteredArchivedAgeGroup18Plus.fully_vaccinated_percentage,
                  has_one_shot: filteredArchivedAgeGroup18Plus.has_one_shot_percentage,
                  birthyear: filteredArchivedAgeGroup18Plus.birthyear_range,
                  fully_vaccinated_label: filteredArchivedAgeGroup18Plus.fully_vaccinated_percentage_label,
                  has_one_shot_label: filteredArchivedAgeGroup18Plus.has_one_shot_percentage_label,
                  boostered: formatPercentageAsNumber(`${boosterCoverage18PlusArchivedValue?.percentage}`),
                  boostered_label: boosterCoverage18PlusArchivedValue?.percentage_label,
                  dateUnixBoostered: boosterCoverage18PlusArchivedValue?.date_unix,
                }}
                age12Plus={{
                  fully_vaccinated: filteredArchivedAgeGroup12Plus.fully_vaccinated_percentage,
                  has_one_shot: filteredArchivedAgeGroup12Plus.has_one_shot_percentage,
                  birthyear: filteredArchivedAgeGroup12Plus.birthyear_range,
                  fully_vaccinated_label: filteredArchivedAgeGroup12Plus.fully_vaccinated_percentage_label,
                  has_one_shot_label: filteredArchivedAgeGroup12Plus.has_one_shot_percentage_label,
                  boostered: formatPercentageAsNumber(`${boosterCoverage12PlusArchivedValue?.percentage}`),
                  boostered_label: boosterCoverage12PlusArchivedValue?.percentage_label,
                  dateUnixBoostered: boosterCoverage12PlusArchivedValue?.date_unix,
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
                  date: archivedData.vaccine_coverage_per_age_group_archived_20220622.values.length
                    ? archivedData.vaccine_coverage_per_age_group_archived_20220622.values[0].date_unix
                    : undefined,
                  source: textGm.vaccination_coverage.bronnen.rivm,
                }}
                values={archivedData.vaccine_coverage_per_age_group_archived_20220622.values}
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
