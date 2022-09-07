import { assert, colors } from '@corona-dashboard/common';
import { Vaccinaties as VaccinatieIcon } from '@corona-dashboard/icons';
import { isEmpty } from 'lodash';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { isDefined } from 'ts-is-present';
import {
  ChartTile,
  PageInformationBlock,
  TileList,
  TimeSeriesChart,
  WarningTile,
  Divider,
} from '~/components';
import { Layout, NlLayout } from '~/domain/layout';
import {
  selectAdministrationData,
  selectVaccineCoverageData,
  VaccinationsOverTimeTile,
  VaccineBoosterAdministrationsKpiSection,
  VaccinationsShotKpiSection,
  VaccinationsKpiHeader,
  VaccineCoverageChoroplethPerGm,
  VaccineCoveragePerAgeGroup,
  VaccineCoverageToggleTile,
  VaccineDeliveryBarChart,
  VaccineStockPerSupplierChart,
  BoosterShotCoveragePerAgeGroup,
} from '~/domain/vaccine';
import { VaccinationsPerSupplierOverLastWeekTile } from '~/domain/vaccine/vaccinations-per-supplier-over-last-week-tile';
import { VaccineCampaignsTile } from '~/domain/vaccine/vaccine-campaigns-tile/vaccine-campaigns-tile';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import {
  ElementsQueryResult,
  getElementsQuery,
  getTimelineEvents,
} from '~/queries/get-elements-query';
import {
  getArticleParts,
  getLinkParts,
  getPagePartsQuery,
  getRichTextParts,
} from '~/queries/get-page-parts-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  getLokalizeTexts,
  getNlData,
  selectNlData,
} from '~/static-props/get-data';
import {
  ArticleParts,
  LinkParts,
  PagePartQueryResult,
  RichTextParts,
} from '~/types/cms';
import { replaceVariablesInText, useFormatLokalizePercentage } from '~/utils';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';

const pageMetrics = [
  'vaccine_administered_doctors',
  'vaccine_administered_ggd_ghor',
  'vaccine_administered_ggd',
  'vaccine_administered_hospitals_and_care_institutions',
  'vaccine_administered_planned',
  'vaccine_administered_total',
  'vaccine_coverage_per_age_group',
  'vaccine_coverage_per_age_group_archived',
  'vaccine_coverage',
  'vaccine_delivery_per_supplier',
  'vaccine_stock',
  'vaccine_vaccinated_or_support',
  'vaccine_coverage_per_age_group_estimated',
  'booster_shot_administered',
  'booster_coverage',
  'repeating_shot_administered',
];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.vaccinations_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData(
    'vaccine_administered_doctors',
    'vaccine_administered_hospitals_and_care_institutions',
    'vaccine_administered_planned',
    'vaccine_administered_total',
    'vaccine_administered_last_week',
    'vaccine_coverage_per_age_group',
    'vaccine_coverage_per_age_group_archived',
    'vaccine_coverage',
    'vaccine_delivery_per_supplier',
    'vaccine_stock',
    'vaccine_vaccinated_or_support',
    'vaccine_coverage_per_age_group_estimated',
    'vaccine_campaigns',
    'vaccine_planned',
    'booster_coverage',
    'booster_shot_administered',
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
        "elements": ${getElementsQuery(
          'nl',
          ['vaccine_coverage', 'vaccine_administered'],
          context.locale
        )}
      }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(
          content.parts.pageParts,
          'vaccinationsPageArticles'
        ),
        links: getLinkParts(content.parts.pageParts, 'vaccinationsPageLinks'),
        boosterArticles: getArticleParts(
          content.parts.pageParts,
          'vaccineBoosterArticles'
        ),
        thirdShotArticles: getArticleParts(
          content.parts.pageParts,
          'vaccineThirdShotArticles'
        ),
        boosterLinks: getLinkParts(
          content.parts.pageParts,
          'vaccinationsBoosterPageLinks'
        ),
        thirdShotLinks: getLinkParts(
          content.parts.pageParts,
          'vaccinationsThirdShotPageLinks'
        ),
        pageDescription: getRichTextParts(
          content.parts.pageParts,
          'vaccinationsPageDescription'
        ),
        elements: content.elements,
      },
    };
  },
  createGetChoroplethData({
    gm: ({ vaccine_coverage_per_age_group }) => {
      if (isDefined(vaccine_coverage_per_age_group)) {
        return selectVaccineCoverageData(vaccine_coverage_per_age_group);
      }
      return vaccine_coverage_per_age_group ?? null;
    },
    vr: ({ vaccine_coverage_per_age_group }) => {
      if (isDefined(vaccine_coverage_per_age_group)) {
        return selectVaccineCoverageData(vaccine_coverage_per_age_group);
      }
      return vaccine_coverage_per_age_group ?? null;
    },
  })
);

function VaccinationPage(props: StaticProps<typeof getStaticProps>) {
  const {
    content,
    choropleth,
    selectedNlData: data,
    lastGenerated,
    administrationData,
  } = props;
  const { commonTexts, formatNumber } = useIntl();

  const { metadataTexts, textNl } = useDynamicLokalizeTexts<LokalizeTexts>(
    props.pageText,
    selectLokalizeTexts
  );
  const { formatPercentageAsNumber } = useFormatLokalizePercentage();
  const [hasHideArchivedCharts, setHideArchivedCharts] =
    useState<boolean>(false);

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const vaccineCoverageEstimatedLastValue =
    data.vaccine_coverage_per_age_group_estimated.last_value;

  const boosterShotAdministeredLastValue =
    data.booster_shot_administered.last_value;

  const boosterCoverage18PlusValue = data.booster_coverage.values.find(
    (v) => v.age_group === '18+'
  );
  const boosterCoverage12PlusValue = data.booster_coverage.values.find(
    (v) => v.age_group === '12+'
  );

  assert(
    boosterCoverage18PlusValue,
    `[${VaccinationPage.name}] Missing value for booster_coverage 18+`
  );
  assert(
    boosterCoverage12PlusValue,
    `[${VaccinationPage.name}] Missing value for booster_coverage 12+`
  );

  const repeatingShotAdministeredLastValue =
    data.repeating_shot_administered?.last_value;

  const hasActiveWarningTile =
    textNl.belangrijk_bericht && !isEmpty(textNl.belangrijk_bericht);

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList hasActiveWarningTile={hasActiveWarningTile}>
          {hasActiveWarningTile && (
            <WarningTile
              isFullWidth
              message={textNl.belangrijk_bericht}
              variant="emphasis"
            />
          )}
          <PageInformationBlock
            title={textNl.title}
            category={commonTexts.sidebar.categories.actions_to_take.title}
            icon={<VaccinatieIcon />}
            description={content.pageDescription}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: data.vaccine_administered_total.last_value.date_unix,
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [],
            }}
            pageLinks={content.links}
            referenceLink={textNl.reference.href}
            articles={content.articles}
          />
          <VaccineCoverageToggleTile
            labelTexts={textNl.vaccination_grade_toggle_tile.top_labels}
            title={textNl.vaccination_grade_toggle_tile.title}
            source={textNl.vaccination_grade_toggle_tile.source}
            descriptionFooter={
              textNl.vaccination_grade_toggle_tile.description_footer
            }
            dateUnix={vaccineCoverageEstimatedLastValue.date_unix}
            age18Plus={{
              fully_vaccinated:
                vaccineCoverageEstimatedLastValue.age_18_plus_fully_vaccinated,
              has_one_shot:
                vaccineCoverageEstimatedLastValue.age_18_plus_has_one_shot,
              boostered: formatPercentageAsNumber(
                `${boosterCoverage18PlusValue.percentage}`
              ),
              birthyear:
                vaccineCoverageEstimatedLastValue.age_18_plus_birthyear,
              dateUnixBoostered: boosterCoverage18PlusValue.date_unix,
            }}
            age12Plus={{
              fully_vaccinated:
                vaccineCoverageEstimatedLastValue.age_12_plus_fully_vaccinated,
              has_one_shot:
                vaccineCoverageEstimatedLastValue.age_12_plus_has_one_shot,
              boostered: formatPercentageAsNumber(
                `${boosterCoverage12PlusValue.percentage}`
              ),
              birthyear:
                vaccineCoverageEstimatedLastValue.age_12_plus_birthyear,
              dateUnixBoostered: boosterCoverage12PlusValue.date_unix,
            }}
            numFractionDigits={1}
            age12PlusToggleText={
              textNl.vaccination_grade_toggle_tile.age_12_plus
            }
            age18PlusToggleText={
              textNl.vaccination_grade_toggle_tile.age_18_plus
            }
          />

          <VaccineCampaignsTile
            title={textNl.vaccine_campaigns.title}
            description={replaceVariablesInText(
              textNl.vaccine_campaigns.description,
              {
                vaccinePlanned: formatNumber(data.vaccine_planned.doses),
              }
            )}
            descriptionFooter={textNl.vaccine_campaigns.description_footer}
            headers={textNl.vaccine_campaigns.headers}
            campaigns={data.vaccine_campaigns.vaccine_campaigns}
            campaignDescriptions={textNl.vaccine_campaigns.campaigns}
            metadata={{
              datumsText: textNl.datums,
              date: data.vaccine_campaigns.date_unix,
              source: textNl.vaccine_campaigns.bronnen.rivm,
            }}
          />

          <VaccinationsPerSupplierOverLastWeekTile
            title={textNl.vaccinations_per_supplier_over_last_week.title}
            description={
              textNl.vaccinations_per_supplier_over_last_week.description
            }
            data={data.vaccine_administered_last_week.vaccine_types}
            metadata={{
              source: textNl.bronnen.rivm,
              date: [
                data.vaccine_administered_last_week.date_start_unix,
                data.vaccine_administered_last_week.date_end_unix,
              ],
              obtainedAt:
                data.vaccine_administered_last_week.date_of_insertion_unix,
            }}
          />

          <VaccineCoverageChoroplethPerGm data={choropleth} />
          <BoosterShotCoveragePerAgeGroup
            text={textNl.vaccination_coverage}
            title={textNl.vaccination_coverage.title}
            description={textNl.vaccination_coverage.description}
            sortingOrder={[
              '80+',
              '70-79',
              '60-69',
              '50-59',
              '40-49',
              '30-39',
              '18-29',
              '12-17',
              '5-11',
            ]}
            metadata={{
              datumsText: textNl.datums,
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
            onToggleArchived={() =>
              setHideArchivedCharts(!hasHideArchivedCharts)
            }
          />
          {hasHideArchivedCharts && (
            <>
              <VaccinationsKpiHeader
                text={textNl.repeating_shot_information_block}
                dateUnix={boosterShotAdministeredLastValue.date_unix}
                dateOfInsertionUnix={
                  boosterShotAdministeredLastValue.date_of_insertion_unix
                }
              />

              <VaccinationsShotKpiSection
                text={textNl.repeating_shot_kpi}
                value={
                  repeatingShotAdministeredLastValue.ggd_administered_total
                }
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
                vaccineAdministeredPlannedLastValue={
                  data.vaccine_administered_planned.last_value
                }
                timelineEvents={{
                  coverage: getTimelineEvents(
                    content.elements.timeSeries,
                    'vaccine_coverage'
                  ),
                  deliveryAndAdministration: getTimelineEvents(
                    content.elements.timeSeries,
                    'vaccine_administered'
                  ),
                }}
              />

              <VaccinationsKpiHeader
                text={textNl.booster_information_block}
                dateUnix={boosterShotAdministeredLastValue.date_unix}
                dateOfInsertionUnix={
                  boosterShotAdministeredLastValue.date_of_insertion_unix
                }
              />

              <VaccineBoosterAdministrationsKpiSection
                text={textNl.booster_kpi}
                totalBoosterShots={
                  boosterShotAdministeredLastValue.administered_total
                }
                metadateBoosterShots={{
                  datumsText: textNl.booster_kpi.datums,
                  date: boosterShotAdministeredLastValue.date_unix,
                  source: {
                    href: textNl.booster_kpi.sources.href,
                    text: textNl.booster_kpi.sources.text,
                  },
                }}
                boosterGgdValue={
                  boosterShotAdministeredLastValue.ggd_administered_total
                }
                metadateBoosterGgd={{
                  datumsText: textNl.booster_kpi.datums,
                  date: boosterShotAdministeredLastValue.date_unix,
                  source: {
                    href: textNl.booster_kpi.sources.href,
                    text: textNl.booster_kpi.sources.text,
                  },
                }}
                boosterEstimatedValue={
                  boosterShotAdministeredLastValue.others_administered_total
                }
                metadateBoosterEstimated={{
                  datumsText: textNl.booster_kpi.datums,
                  date: boosterShotAdministeredLastValue.date_unix,
                  source: {
                    href: textNl.booster_kpi.sources.href,
                    text: textNl.booster_kpi.sources.text,
                  },
                }}
              />

              <VaccineCoveragePerAgeGroup
                text={textNl.vaccination_coverage}
                title={textNl.archived.vaccination_coverage.title}
                description={textNl.archived.vaccination_coverage.description}
                sortingOrder={[
                  '81+',
                  '71-80',
                  '61-70',
                  '51-60',
                  '41-50',
                  '31-40',
                  '18-30',
                  '12-17',
                  '5-11',
                ]}
                metadata={{
                  datumsText: textNl.datums,
                  date: data.vaccine_coverage_per_age_group_archived.values[0]
                    .date_unix,
                  source: textNl.vaccination_coverage.bronnen.rivm,
                }}
                values={data.vaccine_coverage_per_age_group_archived.values}
              />

              <VaccineDeliveryBarChart
                data={data.vaccine_delivery_per_supplier}
                text={textNl}
              />

              <VaccineStockPerSupplierChart
                values={data.vaccine_stock.values}
                text={textNl}
              />

              <ChartTile
                title={textNl.grafiek_draagvlak.titel}
                description={textNl.grafiek_draagvlak.omschrijving}
                metadata={{
                  datumsText: textNl.grafiek_draagvlak.metadata_tekst,
                  date: [
                    data.vaccine_vaccinated_or_support.last_value
                      .date_start_unix,
                    data.vaccine_vaccinated_or_support.last_value.date_end_unix,
                  ],
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
                      label: replaceVariablesInText(
                        textNl.grafiek_draagvlak.leeftijd_jaar,
                        { ageGroup: '70+' }
                      ),
                      color: colors.data.multiseries.magenta,
                    },
                    {
                      type: 'line',
                      metricProperty: 'percentage_55_69',
                      label: replaceVariablesInText(
                        textNl.grafiek_draagvlak.leeftijd_jaar,
                        { ageGroup: '55 - 69' }
                      ),
                      color: colors.data.multiseries.orange,
                    },
                    {
                      type: 'line',
                      metricProperty: 'percentage_40_54',
                      label: replaceVariablesInText(
                        textNl.grafiek_draagvlak.leeftijd_jaar,
                        { ageGroup: '40 - 54' }
                      ),
                      color: colors.data.multiseries.turquoise,
                    },
                    {
                      type: 'line',
                      metricProperty: 'percentage_25_39',
                      label: replaceVariablesInText(
                        textNl.grafiek_draagvlak.leeftijd_jaar,
                        { ageGroup: '25 - 39' }
                      ),
                      color: colors.data.multiseries.yellow,
                    },
                    {
                      type: 'line',
                      metricProperty: 'percentage_16_24',
                      label: replaceVariablesInText(
                        textNl.grafiek_draagvlak.leeftijd_jaar,
                        { ageGroup: '16 - 24' }
                      ),
                      color: colors.data.multiseries.cyan,
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
