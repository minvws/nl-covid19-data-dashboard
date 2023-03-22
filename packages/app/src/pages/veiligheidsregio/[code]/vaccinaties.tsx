import { colors } from '@corona-dashboard/common';
import { Vaccinaties as VaccinatieIcon } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { TileList, PageInformationBlock, Divider } from '~/components';
import { gmCodesByVrCode } from '~/data';
import { Layout, VrLayout } from '~/domain/layout';
import { VaccineCoveragePerAgeGroup, VaccineCoverageToggleTile, VaccineCoverageTile } from '~/domain/vaccine';
import { AgeDataType } from '~/domain/vaccine/vaccine-coverage-tile/vaccine-coverage-tile';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { getArticleParts, getLinkParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetChoroplethData, createGetContent, getLastGeneratedDate, selectVrData, getLokalizeTexts } from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';
import { assert, replaceVariablesInText, useReverseRouter, useFormatLokalizePercentage } from '~/utils';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { VaccineCoverageChoroplethVrAndGm } from '~/domain/vaccine/vaccine-coverage-choropleth_vr_and_gm';

const pageMetrics = ['vaccine_coverage_per_age_group', 'vaccine_coverage_per_age_group_archived', 'booster_coverage_archived_20220904'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  textNl: siteText.pages.vaccinations_page.nl,
  textVr: siteText.pages.vaccinations_page.vr,
  textShared: siteText.pages.vaccinations_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

type ParsedCoverageData = {
  autumn2022: [AgeDataType, AgeDataType];
  primarySeries: [AgeDataType, AgeDataType];
};

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectVrData(
    'vaccine_coverage_per_age_group',
    'vaccine_coverage_per_age_group_archived',
    'vaccine_coverage_per_age_group_archived_20220908',
    'booster_coverage_archived_20220904'
  ),
  createGetChoroplethData({
    gm: ({ vaccine_coverage_per_age_group }, ctx) => {
      if (!isDefined(vaccine_coverage_per_age_group)) {
        return {
          vaccine_coverage_per_age_group: [],
        };
      }
      return {
        vaccine_coverage_per_age_group: isPresent(ctx.params?.code)
          ? vaccine_coverage_per_age_group.filter((vaccineCoveragePerAgeGroup) => gmCodesByVrCode[ctx.params?.code as string].includes(vaccineCoveragePerAgeGroup.gmcode))
          : vaccine_coverage_per_age_group,
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

export const VaccinationsVrPage = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, vrName, selectedVrData: data, choropleth, lastGenerated, content } = props;
  const { commonTexts } = useIntl();
  const reverseRouter = useReverseRouter();
  const router = useRouter();
  const { formatPercentageAsNumber } = useFormatLokalizePercentage();
  const [hasHideArchivedCharts, setHideArchivedCharts] = useState<boolean>(false);

  const { textNl, textVr, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

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

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  const filteredVaccination = {
    primarySeries: data.vaccine_coverage_per_age_group.values.find((item) => item.vaccination_type === 'primary_series'),
    autumn2022: data.vaccine_coverage_per_age_group.values.find((item) => item.vaccination_type === 'autumn_2022'),
  };

  assert(filteredVaccination.primarySeries, `[${VaccinationsVrPage.name}] Could not find data for the vaccine coverage per age group for the primary series`);
  assert(filteredVaccination.autumn2022, `[${VaccinationsVrPage.name}] Could not find data for the vaccine coverage per age group for the autumn 2022 series`);

  const boosterCoverage18PlusArchivedValue = data.booster_coverage_archived_20220904.values.find((v) => v.age_group === '18+');
  const boosterCoverage12PlusArchivedValue = data.booster_coverage_archived_20220904.values.find((v) => v.age_group === '12+');

  const filteredAgeGroup18PlusArchived = data.vaccine_coverage_per_age_group_archived_20220908.values.find((item) => item.age_group_range === '18+');
  const filteredAgeGroup12PlusArchived = data.vaccine_coverage_per_age_group_archived_20220908.values.find((item) => item.age_group_range === '12+');

  assert(filteredAgeGroup18PlusArchived, `[${VaccinationsVrPage.name}] Could not find archived data for the vaccine coverage per age group for the age 18+`);
  assert(filteredAgeGroup12PlusArchived, `[${VaccinationsVrPage.name}] Could not find archived data for the vaccine coverage per age group for the age 12+`);

  const parsedVaccineCoverageData: ParsedCoverageData = {
    autumn2022: [
      {
        value: filteredVaccination.autumn2022.vaccinated_percentage_60_plus,
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
        birthyear: filteredVaccination.autumn2022.birthyear_range_12_plus,
        title: textShared.vaccination_grade_tile.age_group_labels.age_12_plus,
        description: textShared.vaccination_grade_tile.autumn_labels.description_12_plus,
        bar: {
          value: filteredVaccination.autumn2022.vaccinated_percentage_12_plus || 0,
          color: colors.scale.blueDetailed[8],
        },
      },
    ],
    primarySeries: [
      {
        value: filteredVaccination.primarySeries.vaccinated_percentage_18_plus,
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
        birthyear: filteredVaccination.primarySeries.birthyear_range_12_plus,
        title: textShared.vaccination_grade_tile.age_group_labels.age_12_plus,
        description: textShared.vaccination_grade_tile.fully_vaccinated_labels.description_12_plus,
        bar: {
          value: filteredVaccination.primarySeries.vaccinated_percentage_12_plus || 0,
          color: colors.scale.blueDetailed[3],
        },
      },
    ],
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.actions_to_take.title}
            title={replaceVariablesInText(textVr.vaccination_coverage.top_level_information_block.title, {
              safetyRegionName: vrName,
            })}
            description={textVr.vaccination_coverage.top_level_information_block.description}
            icon={<VaccinatieIcon aria-hidden="true" />}
            metadata={{
              datumsText: textVr.vaccination_coverage.top_level_information_block.dates,
              dateOrRange: filteredVaccination.primarySeries.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [],
            }}
            pageLinks={content.links}
            referenceLink={textVr.vaccination_coverage.top_level_information_block.reference.href}
            articles={content.articles}
            vrNameOrGmName={vrName}
            warning={textVr.warning}
          />
          {filteredVaccination.autumn2022.birthyear_range_60_plus && (
            <VaccineCoverageTile
              title={textShared.vaccination_grade_tile.autumn_labels.title}
              description={textShared.vaccination_grade_tile.autumn_labels.description}
              source={textShared.vaccination_grade_tile.autumn_labels.source}
              descriptionFooter={textShared.vaccination_grade_tile.autumn_labels.description_footer}
              coverageData={parsedVaccineCoverageData.autumn2022}
              dateUnix={filteredVaccination.autumn2022.date_unix}
            />
          )}

          <VaccineCoverageTile
            title={textShared.vaccination_grade_tile.fully_vaccinated_labels.title}
            description={textShared.vaccination_grade_tile.fully_vaccinated_labels.description}
            source={textShared.vaccination_grade_tile.fully_vaccinated_labels.source}
            descriptionFooter={textShared.vaccination_grade_tile.fully_vaccinated_labels.description_footer}
            coverageData={parsedVaccineCoverageData.primarySeries}
            dateUnix={filteredVaccination.primarySeries.date_unix}
          />
          <VaccineCoverageChoroplethVrAndGm
            data={choropleth.gm.vaccine_coverage_per_age_group}
            vrOrGmOptions={{
              dataOptions: {
                getLink: reverseRouter.gm.vaccinaties,
                selectedCode: selectedGmCode,
                isPercentage: true,
              },
              text: {
                title: replaceVariablesInText(commonTexts.choropleth.vaccination_coverage.vr.title, { safetyRegionName: vrName }),
                description: replaceVariablesInText(commonTexts.choropleth.vaccination_coverage.vr.description, { safetyRegionName: vrName }),
              },
            }}
          />
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
                title={textVr.vaccination_grade_toggle_tile.title}
                source={textVr.vaccination_grade_toggle_tile.source}
                descriptionFooter={textVr.vaccination_grade_toggle_tile.description_footer}
                dateUnix={filteredAgeGroup18PlusArchived.date_unix}
                age18Plus={{
                  fully_vaccinated: filteredAgeGroup18PlusArchived.fully_vaccinated_percentage,
                  has_one_shot: filteredAgeGroup18PlusArchived.has_one_shot_percentage,
                  birthyear: filteredAgeGroup18PlusArchived.birthyear_range,
                  fully_vaccinated_label: filteredAgeGroup18PlusArchived.fully_vaccinated_percentage_label,
                  has_one_shot_label: filteredAgeGroup18PlusArchived.has_one_shot_percentage_label,
                  boostered: formatPercentageAsNumber(`${boosterCoverage18PlusArchivedValue?.percentage}`),
                  boostered_label: boosterCoverage18PlusArchivedValue?.percentage_label,
                  dateUnixBoostered: boosterCoverage18PlusArchivedValue?.date_unix,
                }}
                age12Plus={{
                  fully_vaccinated: filteredAgeGroup12PlusArchived.fully_vaccinated_percentage,
                  has_one_shot: filteredAgeGroup12PlusArchived.has_one_shot_percentage,
                  birthyear: filteredAgeGroup12PlusArchived.birthyear_range,
                  fully_vaccinated_label: filteredAgeGroup12PlusArchived.fully_vaccinated_percentage_label,
                  has_one_shot_label: filteredAgeGroup12PlusArchived.has_one_shot_percentage_label,
                  boostered: formatPercentageAsNumber(`${boosterCoverage12PlusArchivedValue?.percentage}`),
                  boostered_label: boosterCoverage12PlusArchivedValue?.percentage_label,
                  dateUnixBoostered: boosterCoverage12PlusArchivedValue?.date_unix,
                }}
                age12PlusToggleText={textVr.vaccination_grade_toggle_tile.age_12_plus}
                age18PlusToggleText={textVr.vaccination_grade_toggle_tile.age_18_plus}
                labelTexts={textNl.vaccination_grade_toggle_tile.top_labels}
              />
              <VaccineCoveragePerAgeGroup
                title={commonTexts.choropleth.vaccination_coverage.vr.title}
                description={commonTexts.choropleth.vaccination_coverage.vr.description}
                sortingOrder={['18+', '12+']}
                metadata={{
                  date: data.vaccine_coverage_per_age_group_archived.values[0].date_unix,
                  source: commonTexts.choropleth.vaccination_coverage.vr.bronnen.rivm,
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
