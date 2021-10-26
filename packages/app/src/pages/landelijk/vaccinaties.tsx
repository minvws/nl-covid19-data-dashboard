import { colors, WEEK_IN_SECONDS } from '@corona-dashboard/common';
import { isEmpty } from 'lodash';
import { isDefined } from 'ts-is-present';
import { Box, Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { PieChart } from '~/components/pie-chart';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { selectDeliveryAndAdministrationData } from '~/domain/vaccine/data-selection/select-delivery-and-administration-data';
import { selectVaccineCoverageData } from '~/domain/vaccine/data-selection/select-vaccine-coverage-data';
import { MilestonesView } from '~/domain/vaccine/milestones-view';
import { VaccinationsOverTimeTile } from '~/domain/vaccine/vaccinations-over-time-tile';
import { VaccineAdministrationsKpiSection } from '~/domain/vaccine/vaccine-administrations-kpi-section';
import { VaccineCoverageChoroplethPerGm } from '~/domain/vaccine/vaccine-coverage-choropleth-per-gm';
import { VaccineCoveragePerAgeGroup } from '~/domain/vaccine/vaccine-coverage-per-age-group';
import { VaccineCoverageToggleTile } from '~/domain/vaccine/vaccine-coverage-toggle-tile';
import { VaccineDeliveryBarChart } from '~/domain/vaccine/vaccine-delivery-bar-chart';
import { VaccinePageIntroductionNl } from '~/domain/vaccine/vaccine-page-introduction-nl';
import { VaccineStockPerSupplierChart } from '~/domain/vaccine/vaccine-stock-per-supplier-chart';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
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
  getNlData,
  selectNlData,
} from '~/static-props/get-data';
import { VaccinationPageQuery } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlData(
    'vaccine_administered_doctors',
    'vaccine_administered_ggd_ghor',
    'vaccine_administered_ggd',
    'vaccine_administered_hospitals_and_care_institutions',
    'vaccine_administered_planned',
    'vaccine_administered_rate_moving_average',
    'vaccine_administered_total',
    'vaccine_coverage_per_age_group',
    'vaccine_coverage',
    'vaccine_delivery_per_supplier',
    'vaccine_stock',
    'vaccine_vaccinated_or_support',
    'vaccine_coverage_per_age_group_estimated'
  ),
  () => selectDeliveryAndAdministrationData(getNlData().data),
  createGetContent<{
    page: VaccinationPageQuery;
    highlight: PageArticlesQueryResult;
  }>((context) => {
    const { locale } = context;
    return `{
      "page": ${getVaccinePageQuery(locale)},
      "highlight": ${createPageArticlesQuery('vaccinationsPage', locale)}
    }`;
  }),
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

/**
 * @TODO: remove dummy data
 */

const DummyDataVaccinationStatus = {
  total_amount_of_people: 1369,
  fully_vaccinated: 340,
  fully_vaccinated_percentage: 24.8,
  has_one_shot: 31,
  has_one_shot_percentage: 2.2,
  not_vaccinated: 998,
  not_vaccinated_percentage: 72.8,
  date_start_unix: 1634726341 - WEEK_IN_SECONDS,
  date_end_unix: 1634726341,
  date_of_insertion_unix: 1634726341,
};

interface NlHospitalVaccinationStatusValue {
  total_amount_of_people: number;
  fully_vaccinated: number;
  fully_vaccinated_percentage: number;
  has_one_shot: number;
  has_one_shot_percentage: number;
  not_vaccinated: number;
  not_vaccinated_percentage: number;
  date_start_unix: number;
  date_end_unix: number;
  date_of_insertion_unix: number;
}

const VaccinationPage = (props: StaticProps<typeof getStaticProps>) => {
  const {
    content,
    choropleth,
    selectedNlData: data,
    lastGenerated,
    deliveryAndAdministration,
  } = props;

  const vaccinationChoroplethFeature = useFeature('nlVaccinationChoropleth');
  const vaccineCoverageEstimatedFeature = useFeature(
    'nlVaccineCoverageEstimated'
  );
  const vaccinationPerAgeGroupFeature = useFeature('nlVaccinationPerAgeGroup');

  const vaccinationStatusFeature = useFeature('nlVaccinationVaccinationStatus');

  const { siteText, formatNumber, formatDateFromSeconds } = useIntl();
  const text = siteText.vaccinaties;
  const { page } = content;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const vaccineCoverageEstimatedLastValue =
    data.vaccine_coverage_per_age_group_estimated.last_value;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          {text.belangrijk_bericht && !isEmpty(text.belangrijk_bericht) && (
            <WarningTile
              isFullWidth
              message={text.belangrijk_bericht}
              variant="emphasis"
            />
          )}
          <VaccinePageIntroductionNl data={data} />
          <PageInformationBlock
            description={content.page.pageDescription}
            metadata={{
              datumsText: text.datums,
              dateOrRange: data.vaccine_administered_total.last_value.date_unix,
              dateOfInsertionUnix:
                data.vaccine_administered_total.last_value
                  .date_of_insertion_unix,
              dataSources: [],
            }}
            pageLinks={content.page.pageLinks}
            referenceLink={text.reference.href}
            articles={content.highlight.articles}
          />
          {vaccineCoverageEstimatedFeature.isEnabled && (
            <VaccineCoverageToggleTile
              title={text.vaccination_grade_toggle_tile.title}
              source={text.vaccination_grade_toggle_tile.source}
              descriptionFooter={
                text.vaccination_grade_toggle_tile.description_footer
              }
              dateUnix={vaccineCoverageEstimatedLastValue.date_unix}
              age18Plus={{
                fully_vaccinated:
                  vaccineCoverageEstimatedLastValue.age_18_plus_fully_vaccinated,
                has_one_shot:
                  vaccineCoverageEstimatedLastValue.age_18_plus_has_one_shot,
                birthyear:
                  vaccineCoverageEstimatedLastValue.age_18_plus_birthyear,
              }}
              age12Plus={{
                fully_vaccinated:
                  vaccineCoverageEstimatedLastValue.age_12_plus_fully_vaccinated,
                has_one_shot:
                  vaccineCoverageEstimatedLastValue.age_12_plus_has_one_shot,
                birthyear:
                  vaccineCoverageEstimatedLastValue.age_12_plus_birthyear,
              }}
              numFractionDigits={1}
            />
          )}
          {vaccinationPerAgeGroupFeature.isEnabled && (
            <VaccineCoveragePerAgeGroup
              title={siteText.vaccinaties.vaccination_coverage.title}
              description={
                siteText.vaccinaties.vaccination_coverage.toelichting
              }
              sortingOrder={[
                '81+',
                '71-80',
                '61-70',
                '51-60',
                '41-50',
                '31-40',
                '18-30',
                '12-17',
              ]}
              metadata={{
                datumsText: text.datums,
                date: data.vaccine_coverage_per_age_group.values[0].date_unix,
                source: siteText.vaccinaties.vaccination_coverage.bronnen.rivm,
              }}
              values={data.vaccine_coverage_per_age_group.values}
            />
          )}

          {vaccinationStatusFeature.isEnabled && (
            <ChartTile
              title={text.vaccination_status_chart.title}
              metadata={{
                isTileFooter: true,
                date: [
                  DummyDataVaccinationStatus.date_start_unix,
                  DummyDataVaccinationStatus.date_end_unix,
                ],
                source: {
                  ...text.vaccination_status_chart.source,
                },
              }}
              description={replaceVariablesInText(
                text.vaccination_status_chart.description,
                {
                  amountOfPeople: formatNumber(
                    DummyDataVaccinationStatus.total_amount_of_people
                  ),
                  date_start: formatDateFromSeconds(
                    DummyDataVaccinationStatus.date_start_unix
                  ),
                  date_end: formatDateFromSeconds(
                    DummyDataVaccinationStatus.date_end_unix,
                    'medium'
                  ),
                }
              )}
            >
              <PieChart
                data={
                  DummyDataVaccinationStatus as NlHospitalVaccinationStatusValue
                }
                dataConfig={[
                  {
                    metricProperty: 'not_vaccinated',
                    color: colors.data.yellow,
                    label: text.vaccination_status_chart.labels.not_vaccinated,
                  },
                  {
                    metricProperty: 'has_one_shot',
                    color: colors.data.cyan,
                    label: text.vaccination_status_chart.labels.has_one_shot,
                  },
                  {
                    metricProperty: 'fully_vaccinated',
                    color: colors.data.multiseries.cyan_dark,
                    label:
                      text.vaccination_status_chart.labels.fully_vaccinated,
                  },
                ]}
              />
            </ChartTile>
          )}

          {vaccinationChoroplethFeature.isEnabled && (
            <VaccineCoverageChoroplethPerGm data={choropleth} />
          )}

          <VaccinationsOverTimeTile
            coverageData={data.vaccine_coverage}
            deliveryAndAdministrationData={deliveryAndAdministration}
          />
          <MilestonesView
            title={page.title}
            description={page.description}
            milestones={page.milestones}
            expectedMilestones={page.expectedMilestones}
          />

          <VaccineAdministrationsKpiSection data={data} />

          <Spacer pb={3} />

          <PageInformationBlock
            title={text.section_archived.title}
            description={text.section_archived.description}
          />

          <VaccineDeliveryBarChart data={data.vaccine_delivery_per_supplier} />

          <VaccineStockPerSupplierChart values={data.vaccine_stock.values} />

          <ChartTile
            title={text.grafiek_draagvlak.titel}
            description={text.grafiek_draagvlak.omschrijving}
            metadata={{
              datumsText: siteText.vaccinaties.grafiek_draagvlak.metadata_tekst,
              date: [
                data.vaccine_vaccinated_or_support.last_value.date_start_unix,
                data.vaccine_vaccinated_or_support.last_value.date_end_unix,
              ],
            }}
          >
            <Box spacing={3}>
              <section>
                <KpiValue
                  percentage={
                    data.vaccine_vaccinated_or_support.last_value
                      .percentage_average
                  }
                />
                <Text>{text.grafiek_draagvlak.kpi_omschrijving}</Text>
              </section>

              <TimeSeriesChart
                accessibility={{
                  key: 'vaccines_support_over_time_chart',
                }}
                tooltipTitle={text.grafiek_draagvlak.titel}
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
                      text.grafiek_draagvlak.leeftijd_jaar,
                      { ageGroup: '70+' }
                    ),
                    color: colors.data.multiseries.magenta,
                  },
                  {
                    type: 'line',
                    metricProperty: 'percentage_55_69',
                    label: replaceVariablesInText(
                      text.grafiek_draagvlak.leeftijd_jaar,
                      { ageGroup: '55 - 69' }
                    ),
                    color: colors.data.multiseries.orange,
                  },
                  {
                    type: 'line',
                    metricProperty: 'percentage_40_54',
                    label: replaceVariablesInText(
                      text.grafiek_draagvlak.leeftijd_jaar,
                      { ageGroup: '40 - 54' }
                    ),
                    color: colors.data.multiseries.turquoise,
                  },
                  {
                    type: 'line',
                    metricProperty: 'percentage_25_39',
                    label: replaceVariablesInText(
                      text.grafiek_draagvlak.leeftijd_jaar,
                      { ageGroup: '25 - 39' }
                    ),
                    color: colors.data.multiseries.yellow,
                  },
                  {
                    type: 'line',
                    metricProperty: 'percentage_16_24',
                    label: replaceVariablesInText(
                      text.grafiek_draagvlak.leeftijd_jaar,
                      { ageGroup: '16 - 24' }
                    ),
                    color: colors.data.multiseries.cyan,
                  },
                  {
                    type: 'invisible',
                    metricProperty: 'percentage_average',
                    label: siteText.common.totaal,
                    isPercentage: true,
                  },
                ]}
              />
            </Box>
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default VaccinationPage;
