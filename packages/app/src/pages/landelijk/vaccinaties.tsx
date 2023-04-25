import { assert, colors } from '@corona-dashboard/common';
import { Vaccinaties as VaccinatieIcon } from '@corona-dashboard/icons';
import { isEmpty } from 'lodash';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { ChartTile, PageInformationBlock, TileList, TimeSeriesChart, WarningTile, Divider } from '~/components';
import { Layout, NlLayout } from '~/domain/layout';
import { useReverseRouter } from '~/utils/use-reverse-router';
import {
  selectAdministrationData,
  VaccinationsOverTimeTile,
  VaccineBoosterAdministrationsKpiSection,
  VaccinationsShotKpiSection,
  VaccinationsKpiHeader,
  VaccineCoverageChoropleth,
  VaccineCoveragePerAgeGroup,
  VaccineCoverageToggleTile,
  VaccineDeliveryBarChart,
  VaccineStockPerSupplierChart,
  BoosterShotCoveragePerAgeGroup,
  Autumn2022ShotCoveragePerAgeGroup,
} from '~/domain/vaccine';
import { VaccinationsPerSupplierOverLastWeekTile } from '~/domain/vaccine/vaccinations-per-supplier-over-last-week-tile';
import { VaccineCampaignsTile } from '~/domain/vaccine/vaccine-campaigns-tile/vaccine-campaigns-tile';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getLinkParts, getPagePartsQuery, getRichTextParts } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetChoroplethData, createGetContent, getLastGeneratedDate, getLokalizeTexts, getNlData, selectNlData } from '~/static-props/get-data';
import { ArticleParts, LinkParts, PagePartQueryResult, RichTextParts } from '~/types/cms';
import { replaceVariablesInText, useFormatLokalizePercentage } from '~/utils';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { BorderedKpiSection } from '~/components/kpi/bordered-kpi-section';

const pageMetrics = [
  'vaccine_administered_doctors',
  'vaccine_administered_hospitals_and_care_institutions',
  'vaccine_administered_planned',
  'vaccine_administered_total',
  'vaccine_administered_last_week',
  'vaccine_coverage_per_age_group',
  'vaccine_coverage',
  'vaccine_delivery_per_supplier',
  'vaccine_stock',
  'vaccine_vaccinated_or_support',
  'vaccine_coverage_per_age_group_estimated_fully_vaccinated',
  'vaccine_coverage_per_age_group_estimated_autumn_2022',
  'vaccine_campaigns',
  'vaccine_planned_archived_20220908',
  'booster_coverage_archived_20220904',
  'booster_shot_administered_archived_20220904',
  'repeating_shot_administered',
];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.vaccinations_page.nl,
  textShared: siteText.pages.vaccinations_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData(
    'vaccine_administered_doctors',
    'vaccine_administered_hospitals_and_care_institutions',
    'vaccine_administered_planned',
    'vaccine_administered_total',
    'vaccine_administered_last_week',
    'vaccine_coverage_per_age_group',
    'vaccine_coverage_per_age_group_archived_20220908',
    'vaccine_coverage_per_age_group_archived',
    'vaccine_coverage',
    'vaccine_delivery_per_supplier',
    'vaccine_stock',
    'vaccine_vaccinated_or_support',
    'vaccine_coverage_per_age_group_estimated_archived_20220908',
    'vaccine_coverage_per_age_group_estimated_fully_vaccinated',
    'vaccine_coverage_per_age_group_estimated_autumn_2022',
    'vaccine_campaigns',
    'vaccine_campaigns_archived_20220908',
    'vaccine_planned_archived_20220908',
    'booster_coverage_archived_20220904',
    'booster_shot_administered_archived_20220904',
    'repeating_shot_administered'
  ),
  () => selectAdministrationData(getNlData().data.vaccine_administered),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts | LinkParts | RichTextParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      return `{
        "parts": ${getPagePartsQuery('vaccinations_page')},
        "elements": ${getElementsQuery('nl', ['vaccine_coverage', 'vaccine_administered'], context.locale)}
      }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'vaccinationsPageArticles'),
        links: getLinkParts(content.parts.pageParts, 'vaccinationsPageLinks'),
        boosterArticles: getArticleParts(content.parts.pageParts, 'vaccineBoosterArticles'),
        thirdShotArticles: getArticleParts(content.parts.pageParts, 'vaccineThirdShotArticles'),
        boosterLinks: getLinkParts(content.parts.pageParts, 'vaccinationsBoosterPageLinks'),
        thirdShotLinks: getLinkParts(content.parts.pageParts, 'vaccinationsThirdShotPageLinks'),
        pageDescription: getRichTextParts(content.parts.pageParts, 'vaccinationsPageDescription'),
        elements: content.elements,
      },
    };
  },
  createGetChoroplethData({
    gm: ({ vaccine_coverage_per_age_group }) => vaccine_coverage_per_age_group ?? null,
    vr: ({ vaccine_coverage_per_age_group }) => vaccine_coverage_per_age_group ?? null,
  })
);

function VaccinationPage(props: StaticProps<typeof getStaticProps>) {
  const { content, choropleth, selectedNlData: data, lastGenerated, administrationData } = props;
  const { commonTexts, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();

  const { metadataTexts, textNl, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(props.pageText, selectLokalizeTexts);
  const { formatPercentageAsNumber } = useFormatLokalizePercentage();
  const [hasHideArchivedCharts, setHideArchivedCharts] = useState<boolean>(false);

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const vaccineCoverageEstimatedFullyVaccinated = data.vaccine_coverage_per_age_group_estimated_fully_vaccinated.last_value;
  const vaccineCoverageEstimatedAutumn2022 = data.vaccine_coverage_per_age_group_estimated_autumn_2022.last_value;

  const vaccineCoverageEstimatedArchivedLastValue = data.vaccine_coverage_per_age_group_estimated_archived_20220908.last_value;

  const boosterShotAdministeredArchivedLastValue = data.booster_shot_administered_archived_20220904.last_value;

  const boosterCoverage18PlusArchivedValue = data.booster_coverage_archived_20220904.values.find((v) => v.age_group === '18+');
  const boosterCoverage12PlusArchivedValue = data.booster_coverage_archived_20220904.values.find((v) => v.age_group === '12+');

  assert(boosterCoverage18PlusArchivedValue, `[${VaccinationPage.name}] Missing value for booster_coverage 18+`);
  assert(boosterCoverage12PlusArchivedValue, `[${VaccinationPage.name}] Missing value for booster_coverage 12+`);

  const repeatingShotAdministeredLastValue = data.repeating_shot_administered?.last_value;

  const hasActiveWarningTile = textNl.belangrijk_bericht && !isEmpty(textNl.belangrijk_bericht);

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  const variables = {
    regio: commonTexts.choropleth.choropleth_vaccination_coverage.shared.gm,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList hasActiveWarningTile={hasActiveWarningTile}>
          {hasActiveWarningTile && <WarningTile isFullWidth message={textNl.belangrijk_bericht} variant="emphasis" />}
          <PageInformationBlock
            title={textNl.information_block.title}
            category={commonTexts.sidebar.categories.actions_to_take.title}
            icon={<VaccinatieIcon aria-hidden="true" />}
            description={textNl.information_block.description}
            metadata={{
              datumsText: textNl.dates,
              dateOrRange: data.vaccine_administered_total.last_value.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textShared.bronnen.rivm],
            }}
            pageLinks={content.links}
            referenceLink={textNl.information_block.reference.href}
            articles={content.articles}
          />
          <BorderedKpiSection
            title={textShared.vaccination_grade_tile.autumn_labels.title}
            description={textShared.vaccination_grade_tile.autumn_labels.description}
            source={textShared.vaccination_grade_tile.autumn_labels.source}
            tilesData={[
              {
                value: vaccineCoverageEstimatedAutumn2022.age_60_plus_vaccinated,
                birthyear: vaccineCoverageEstimatedAutumn2022.age_60_plus_birthyear,
                title: textShared.vaccination_grade_tile.age_group_labels.age_60_plus,
                description: textShared.vaccination_grade_tile.autumn_labels.description_60_plus,
                bar: {
                  value: vaccineCoverageEstimatedAutumn2022.age_60_plus_vaccinated,
                  color: colors.scale.blueDetailed[8],
                },
              },
              {
                value: vaccineCoverageEstimatedAutumn2022.age_12_plus_vaccinated,
                birthyear: vaccineCoverageEstimatedAutumn2022.age_12_plus_birthyear,
                title: textShared.vaccination_grade_tile.age_group_labels.age_12_plus,
                description: textShared.vaccination_grade_tile.autumn_labels.description_12_plus,
                bar: {
                  value: vaccineCoverageEstimatedAutumn2022.age_12_plus_vaccinated,
                  color: colors.scale.blueDetailed[8],
                },
              },
            ]}
            dateUnix={vaccineCoverageEstimatedAutumn2022.date_unix}
          />
          <BorderedKpiSection
            title={textShared.vaccination_grade_tile.fully_vaccinated_labels.title}
            description={textShared.vaccination_grade_tile.fully_vaccinated_labels.description}
            source={textShared.vaccination_grade_tile.fully_vaccinated_labels.source}
            tilesData={[
              {
                value: vaccineCoverageEstimatedFullyVaccinated.age_18_plus_vaccinated,
                birthyear: vaccineCoverageEstimatedFullyVaccinated.age_18_plus_birthyear,
                title: textShared.vaccination_grade_tile.age_group_labels.age_18_plus,
                description: textShared.vaccination_grade_tile.fully_vaccinated_labels.description_18_plus,
                bar: {
                  value: vaccineCoverageEstimatedFullyVaccinated.age_18_plus_vaccinated,
                  color: colors.scale.blueDetailed[3],
                },
              },
              {
                value: vaccineCoverageEstimatedFullyVaccinated.age_12_plus_vaccinated,
                birthyear: vaccineCoverageEstimatedFullyVaccinated.age_12_plus_birthyear,
                title: textShared.vaccination_grade_tile.age_group_labels.age_12_plus,
                description: textShared.vaccination_grade_tile.fully_vaccinated_labels.description_12_plus,
                bar: {
                  value: vaccineCoverageEstimatedFullyVaccinated.age_12_plus_vaccinated,
                  color: colors.scale.blueDetailed[3],
                },
              },
            ]}
            dateUnix={vaccineCoverageEstimatedFullyVaccinated.date_unix}
          />

          <VaccineCampaignsTile
            title={textNl.vaccine_campaigns.title}
            description={textNl.vaccine_campaigns.description}
            descriptionFooter={textNl.vaccine_campaigns.description_footer}
            headers={textNl.vaccine_campaigns.headers}
            campaigns={data.vaccine_campaigns.vaccine_campaigns}
            campaignDescriptions={textNl.vaccine_campaigns.campaigns}
            metadata={{
              datumsText: textNl.dates,
              date: data.vaccine_campaigns.date_unix,
              source: textNl.vaccine_campaigns.bronnen.rivm,
            }}
          />

          <VaccinationsPerSupplierOverLastWeekTile
            title={textNl.vaccinations_per_supplier_over_last_week.title}
            description={textNl.vaccinations_per_supplier_over_last_week.description}
            data={data.vaccine_administered_last_week.vaccine_types}
            metadata={{
              source: textShared.bronnen.rivm,
              date: [data.vaccine_administered_last_week.date_start_unix, data.vaccine_administered_last_week.date_end_unix],
              obtainedAt: data.vaccine_administered_last_week.date_of_insertion_unix,
            }}
          />

          <VaccineCoverageChoropleth
            data={choropleth.gm}
            dataOptions={{ getLink: (gmcode) => reverseRouter.gm.vaccinaties(gmcode), isPercentage: true }}
            text={{
              title: replaceVariablesInText(commonTexts.choropleth.choropleth_vaccination_coverage.nl.title, variables),
              description: replaceVariablesInText(commonTexts.choropleth.choropleth_vaccination_coverage.nl.description, variables),
              vaccinationKindLabel: commonTexts.choropleth.vaccination_coverage.shared.dropdown_label_vaccination_coverage_kind_select,
              ageGroupLabel: commonTexts.choropleth.vaccination_coverage.shared.dropdown_label_age_group_select,
            }}
          />
          <Autumn2022ShotCoveragePerAgeGroup
            text={textNl.vaccination_coverage}
            title={textNl.vaccination_coverage.title}
            description={textNl.vaccination_coverage.description_autumn_2022_shot}
            sortingOrder={['80+', '70-79', '60-69', '50-59', '40-49', '30-39', '18-29', '12-17', '5-11']}
            metadata={{
              datumsText: textNl.dates,
              date: data.vaccine_coverage_per_age_group.values[0].date_unix,
              source: textNl.vaccination_coverage.bronnen.rivm,
            }}
            values={data.vaccine_coverage_per_age_group.values}
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
              <BoosterShotCoveragePerAgeGroup
                text={textNl}
                title={textNl.vaccination_coverage.title}
                description={textNl.archived.vaccination_coverage.top_level_description_booster_shot}
                sortingOrder={['80+', '70-79', '60-69', '50-59', '40-49', '30-39', '18-29', '12-17', '5-11']}
                metadata={{
                  datumsText: textNl.datums,
                  date: data.vaccine_coverage_per_age_group_archived_20220908.values[0].date_unix,
                  source: textNl.vaccination_coverage.bronnen.rivm,
                }}
                values={data.vaccine_coverage_per_age_group_archived_20220908.values}
              />
              <VaccineCoverageToggleTile
                labelTexts={textNl.vaccination_grade_toggle_tile.top_labels}
                title={textNl.vaccination_grade_toggle_tile.title}
                source={textNl.vaccination_grade_toggle_tile.source}
                dateUnix={vaccineCoverageEstimatedArchivedLastValue.date_unix}
                age18Plus={{
                  fully_vaccinated: vaccineCoverageEstimatedArchivedLastValue.age_18_plus_fully_vaccinated,
                  has_one_shot: vaccineCoverageEstimatedArchivedLastValue.age_18_plus_has_one_shot,
                  boostered: formatPercentageAsNumber(`${boosterCoverage18PlusArchivedValue.percentage}`),
                  birthyear: vaccineCoverageEstimatedArchivedLastValue.age_18_plus_birthyear,
                  dateUnixBoostered: boosterCoverage18PlusArchivedValue.date_unix,
                }}
                age12Plus={{
                  fully_vaccinated: vaccineCoverageEstimatedArchivedLastValue.age_12_plus_fully_vaccinated,
                  has_one_shot: vaccineCoverageEstimatedArchivedLastValue.age_12_plus_has_one_shot,
                  boostered: formatPercentageAsNumber(`${boosterCoverage12PlusArchivedValue.percentage}`),
                  birthyear: vaccineCoverageEstimatedArchivedLastValue.age_12_plus_birthyear,
                  dateUnixBoostered: boosterCoverage12PlusArchivedValue.date_unix,
                }}
                numFractionDigits={1}
                age12PlusToggleText={textNl.vaccination_grade_toggle_tile.age_12_plus}
                age18PlusToggleText={textNl.vaccination_grade_toggle_tile.age_18_plus}
              />
              <VaccineCampaignsTile
                title={textNl.vaccine_campaigns.title}
                description={replaceVariablesInText(textNl.vaccine_campaigns.description_archived, {
                  vaccinePlanned: formatNumber(data.vaccine_planned_archived_20220908.doses),
                })}
                descriptionFooter={textNl.vaccine_campaigns.description_footer}
                headers={textNl.vaccine_campaigns.headers}
                campaigns={data.vaccine_campaigns_archived_20220908.vaccine_campaigns}
                campaignDescriptions={textNl.vaccine_campaigns.campaigns}
                metadata={{
                  datumsText: textNl.dates,
                  date: data.vaccine_campaigns_archived_20220908.date_unix,
                  source: textNl.vaccine_campaigns.bronnen.rivm,
                }}
              />
              <VaccinationsKpiHeader
                text={textNl.repeating_shot_information_block}
                dateUnix={boosterShotAdministeredArchivedLastValue.date_unix}
                dateOfInsertionUnix={boosterShotAdministeredArchivedLastValue.date_of_insertion_unix}
              />

              <VaccinationsShotKpiSection
                text={textNl.repeating_shot_kpi}
                value={repeatingShotAdministeredLastValue.ggd_administered_total}
                metadata={{
                  datumsText: textNl.repeating_shot_kpi.datums,
                  date: repeatingShotAdministeredLastValue.date_unix,
                  source: {
                    href: textNl.repeating_shot_kpi.sources.href,
                    text: textNl.repeating_shot_kpi.sources.text,
                  },
                }}
              />

              <VaccinationsOverTimeTile
                text={textNl}
                coverageData={data.vaccine_coverage}
                administrationData={administrationData}
                vaccineAdministeredPlannedLastValue={data.vaccine_administered_planned.last_value}
                timelineEvents={{
                  coverage: getTimelineEvents(content.elements.timeSeries, 'vaccine_coverage'),
                  deliveryAndAdministration: getTimelineEvents(content.elements.timeSeries, 'vaccine_administered'),
                }}
              />

              <VaccinationsKpiHeader
                text={textNl.booster_information_block}
                dateUnix={boosterShotAdministeredArchivedLastValue.date_unix}
                dateOfInsertionUnix={boosterShotAdministeredArchivedLastValue.date_of_insertion_unix}
              />

              <VaccineBoosterAdministrationsKpiSection
                text={textNl.booster_kpi}
                totalBoosterShots={boosterShotAdministeredArchivedLastValue.administered_total}
                metadateBoosterShots={{
                  datumsText: textNl.booster_kpi.datums,
                  date: boosterShotAdministeredArchivedLastValue.date_unix,
                  source: {
                    href: textNl.booster_kpi.sources.href,
                    text: textNl.booster_kpi.sources.text,
                  },
                }}
                boosterGgdValue={boosterShotAdministeredArchivedLastValue.ggd_administered_total}
                metadateBoosterGgd={{
                  datumsText: textNl.booster_kpi.datums,
                  date: boosterShotAdministeredArchivedLastValue.date_unix,
                  source: {
                    href: textNl.booster_kpi.sources.href,
                    text: textNl.booster_kpi.sources.text,
                  },
                }}
                boosterEstimatedValue={boosterShotAdministeredArchivedLastValue.others_administered_total}
                metadateBoosterEstimated={{
                  datumsText: textNl.booster_kpi.datums,
                  date: boosterShotAdministeredArchivedLastValue.date_unix,
                  source: {
                    href: textNl.booster_kpi.sources.href,
                    text: textNl.booster_kpi.sources.text,
                  },
                }}
              />

              <VaccineCoveragePerAgeGroup
                text={textNl}
                title={textNl.archived.vaccination_coverage.title}
                description={textNl.archived.vaccination_coverage.description}
                sortingOrder={['81+', '71-80', '61-70', '51-60', '41-50', '31-40', '18-30', '12-17', '5-11']}
                metadata={{
                  datumsText: textNl.dates,
                  date: data.vaccine_coverage_per_age_group_archived.values[0].date_unix,
                  source: textNl.vaccination_coverage.bronnen.rivm,
                }}
                values={data.vaccine_coverage_per_age_group_archived.values}
              />

              <VaccineDeliveryBarChart data={data.vaccine_delivery_per_supplier} text={textNl} />

              <VaccineStockPerSupplierChart values={data.vaccine_stock.values} text={textNl} />

              <ChartTile
                title={textNl.grafiek_draagvlak.titel}
                description={textNl.grafiek_draagvlak.omschrijving}
                metadata={{
                  datumsText: textNl.grafiek_draagvlak.metadata_tekst,
                  date: [data.vaccine_vaccinated_or_support.last_value.date_start_unix, data.vaccine_vaccinated_or_support.last_value.date_end_unix],
                }}
              >
                <TimeSeriesChart
                  accessibility={{
                    key: 'vaccines_support_over_time_chart',
                  }}
                  tooltipTitle={textNl.grafiek_draagvlak.titel}
                  values={data.vaccine_vaccinated_or_support.values}
                  numGridLines={20}
                  tickValues={[0, 25, 50, 75, 100]}
                  dataOptions={{
                    isPercentage: true,
                    forcedMaximumValue: 100,
                  }}
                  seriesConfig={[
                    {
                      type: 'line',
                      metricProperty: 'percentage_70_plus',
                      label: replaceVariablesInText(textNl.grafiek_draagvlak.leeftijd_jaar, { ageGroup: '70+' }),
                      color: colors.magenta1,
                    },
                    {
                      type: 'line',
                      metricProperty: 'percentage_55_69',
                      label: replaceVariablesInText(textNl.grafiek_draagvlak.leeftijd_jaar, { ageGroup: '55 - 69' }),
                      color: colors.orange1,
                    },
                    {
                      type: 'line',
                      metricProperty: 'percentage_40_54',
                      label: replaceVariablesInText(textNl.grafiek_draagvlak.leeftijd_jaar, { ageGroup: '40 - 54' }),
                      color: colors.green2,
                    },
                    {
                      type: 'line',
                      metricProperty: 'percentage_25_39',
                      label: replaceVariablesInText(textNl.grafiek_draagvlak.leeftijd_jaar, { ageGroup: '25 - 39' }),
                      color: colors.yellow3,
                    },
                    {
                      type: 'line',
                      metricProperty: 'percentage_16_24',
                      label: replaceVariablesInText(textNl.grafiek_draagvlak.leeftijd_jaar, { ageGroup: '16 - 24' }),
                      color: colors.blue6,
                    },
                    {
                      type: 'invisible',
                      metricProperty: 'percentage_average',
                      label: commonTexts.common.totaal,
                      isPercentage: true,
                    },
                  ]}
                />
              </ChartTile>
            </>
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
}

export default VaccinationPage;
