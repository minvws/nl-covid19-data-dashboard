import { colors } from '@corona-dashboard/common';
import { Vaccinaties as VaccinatieIcon } from '@corona-dashboard/icons';
import { isEmpty } from 'lodash';
import { isDefined } from 'ts-is-present';
import { Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { PieChart } from '~/components/pie-chart';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { selectDeliveryAndAdministrationData } from '~/domain/vaccine/data-selection/select-delivery-and-administration-data';
import { selectVaccineCoverageData } from '~/domain/vaccine/data-selection/select-vaccine-coverage-data';
import { VaccinationsOverTimeTile } from '~/domain/vaccine/vaccinations-over-time-tile';
import { VaccineAdministrationsKpiSection } from '~/domain/vaccine/vaccine-administrations-kpi-section';
import { VaccineCoverageChoroplethPerGm } from '~/domain/vaccine/vaccine-coverage-choropleth-per-gm';
import { VaccineCoveragePerAgeGroup } from '~/domain/vaccine/vaccine-coverage-per-age-group';
import { VaccineCoverageToggleTile } from '~/domain/vaccine/vaccine-coverage-toggle-tile';
import { VaccineDeliveryBarChart } from '~/domain/vaccine/vaccine-delivery-bar-chart';
import { VaccineStockPerSupplierChart } from '~/domain/vaccine/vaccine-stock-per-supplier-chart';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import {
  createElementsQuery,
  ElementsQueryResult,
  getTimelineEvents,
} from '~/queries/create-elements-query';
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
    'vaccine_administered_total',
    'vaccine_coverage_per_age_group',
    'vaccine_coverage',
    'vaccine_delivery_per_supplier',
    'vaccine_stock',
    'vaccine_vaccinated_or_support',
    'vaccine_coverage_per_age_group_estimated',
    'intensive_care_vaccination_status'
  ),
  () => selectDeliveryAndAdministrationData(getNlData().data),
  createGetContent<{
    page: VaccinationPageQuery;
    highlight: PageArticlesQueryResult;
    elements: ElementsQueryResult;
  }>((context) => {
    const { locale } = context;
    return `{
      "page": ${getVaccinePageQuery(locale)},
      "highlight": ${createPageArticlesQuery('vaccinationsPage', locale)},
      "elements": ${createElementsQuery(
        'nl',
        ['vaccine_coverage', 'vaccine_administered'],
        locale
      )}
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

const VaccinationPage = (props: StaticProps<typeof getStaticProps>) => {
  const {
    content,
    choropleth,
    selectedNlData: data,
    lastGenerated,
    deliveryAndAdministration,
  } = props;
  const { siteText, formatNumber, formatDateFromSeconds } = useIntl();

  const text = siteText.vaccinaties;

  const vaccinationChoroplethFeature = useFeature('nlVaccinationChoropleth');
  const vaccineCoverageEstimatedFeature = useFeature(
    'nlVaccineCoverageEstimated'
  );
  const vaccinationPerAgeGroupFeature = useFeature('nlVaccinationPerAgeGroup');

  const vaccineAdministeredGgdFeature = useFeature('nlVaccineAdministeredGgd');
  const vaccineAdministeredHospitalsAndCareInstitutionsFeature = useFeature(
    'nlVaccineAdministeredHospitalsAndCareInstitutions'
  );
  const vaccineAdministeredDoctorsFeature = useFeature(
    'nlVaccineAdministeredDoctors'
  );
  const vaccineAdministeredGgdGhorFeature = useFeature(
    'nlVaccineAdministeredGgdGhor'
  );

  const vaccinationStatusFeature = useFeature('nlVaccinationVaccinationStatus');

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const vaccineCoverageEstimatedLastValue =
    data.vaccine_coverage_per_age_group_estimated.last_value;
  const lastValueVaccinationStatus =
    data.intensive_care_vaccination_status.last_value;

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

          <PageInformationBlock
            title={text.title}
            category={text.category}
            icon={<VaccinatieIcon />}
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
                  lastValueVaccinationStatus.date_start_unix,
                  lastValueVaccinationStatus.date_end_unix,
                ],
                source: {
                  ...text.vaccination_status_chart.source,
                },
              }}
              description={replaceVariablesInText(
                text.vaccination_status_chart.description,
                {
                  amountOfPeople: formatNumber(
                    lastValueVaccinationStatus.total_amount_of_people
                  ),
                  date_start: formatDateFromSeconds(
                    lastValueVaccinationStatus.date_start_unix
                  ),
                  date_end: formatDateFromSeconds(
                    lastValueVaccinationStatus.date_end_unix,
                    'medium'
                  ),
                }
              )}
            >
              <PieChart
                data={lastValueVaccinationStatus}
                dataConfig={[
                  {
                    metricProperty: 'not_vaccinated',
                    color: colors.data.yellow,
                    label: text.vaccination_status_chart.labels.not_vaccinated,
                  },
                  {
                    metricProperty: 'has_one_shot',
                    color: colors.data.partial_vaccination,
                    label: text.vaccination_status_chart.labels.has_one_shot,
                  },
                  {
                    metricProperty: 'fully_vaccinated',
                    color: colors.data.primary,
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
            vaccineAdministeredTotalLastValue={
              data.vaccine_administered_total.last_value
            }
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

          {vaccineAdministeredGgdFeature.isEnabled &&
            vaccineAdministeredHospitalsAndCareInstitutionsFeature.isEnabled &&
            vaccineAdministeredDoctorsFeature.isEnabled &&
            vaccineAdministeredGgdGhorFeature.isEnabled && (
              <VaccineAdministrationsKpiSection data={data} />
            )}

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
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default VaccinationPage;
