import {
  colors,
  NlHospitalVaccineIncidencePerAgeGroupValue,
  NlIntensiveCareVaccinationStatusValue,
} from '@corona-dashboard/common';
import {
  Arts,
  VaccineBoosterThird as BoosterIcon,
  Vaccinaties as VaccinatieIcon,
  Ziekenhuis,
} from '@corona-dashboard/icons';
import { isEmpty } from 'lodash';
import { GetStaticPropsContext } from 'next';
import dynamic from 'next/dynamic';
import { isDefined } from 'ts-is-present';
import { AgeDemographicProps } from '~/components/age-demographic';
import { Box, Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { Divider } from '~/components/divider';
import { InView } from '~/components/in-view';
import { Metadata } from '~/components/metadata';
import { PageInformationBlock } from '~/components/page-information-block';
import { PieChartProps } from '~/components/pie-chart';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { DUMMY_DATA_BOOSTER_PER_AGE_GROUP } from '~/domain/vaccine/booster_dummy_data';
import { selectDeliveryAndAdministrationData } from '~/domain/vaccine/data-selection/select-delivery-and-administration-data';
import { selectVaccineCoverageData } from '~/domain/vaccine/data-selection/select-vaccine-coverage-data';
import { VaccinationsOverTimeTile } from '~/domain/vaccine/vaccinations-over-time-tile';
import { VaccineAdministrationsKpiSection } from '~/domain/vaccine/vaccine-administrations-kpi-section';
import { VaccineBoosterAdministrationsKpiSection } from '~/domain/vaccine/vaccine-booster-administrations-kpi-section';
import { VaccineBoosterPerAgeGroup } from '~/domain/vaccine/vaccine-booster-per-age-group';
import { VaccinationsBoosterKpiSection } from '~/domain/vaccine/vaccinations-booster-kpi-section';
import { VaccineCoverageChoroplethPerGm } from '~/domain/vaccine/vaccine-coverage-choropleth-per-gm';
import { VaccineCoveragePerAgeGroup } from '~/domain/vaccine/vaccine-coverage-per-age-group';
import { VaccineCoverageToggleTile } from '~/domain/vaccine/vaccine-coverage-toggle-tile';
import { VaccineDeliveryBarChart } from '~/domain/vaccine/vaccine-delivery-bar-chart';
import { VaccineStockPerSupplierChart } from '~/domain/vaccine/vaccine-stock-per-supplier-chart';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
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
  getNlData,
  selectNlData,
} from '~/static-props/get-data';
import {
  ArticleParts,
  LinkParts,
  PagePartQueryResult,
  RichTextParts,
} from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useFormatDateRange } from '~/utils/use-format-date-range';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { useFormatLokalizePercentage } from '~/utils/use-format-lokalize-percentage';

const AgeDemographic = dynamic<
  AgeDemographicProps<NlHospitalVaccineIncidencePerAgeGroupValue>
>(() =>
  import('~/components/age-demographic').then((mod) => mod.AgeDemographic)
);

const PieChart = dynamic<PieChartProps<NlIntensiveCareVaccinationStatusValue>>(
  () => import('~/components/pie-chart').then((mod) => mod.PieChart)
);

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
    'hospital_vaccination_status',
    'hospital_vaccine_incidence_per_age_group',
    'intensive_care_vaccination_status'
  ),
  () => selectDeliveryAndAdministrationData(getNlData().data),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts | LinkParts | RichTextParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      return `{
        "parts": ${getPagePartsQuery('vaccinationsPage')},
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

const VaccinationPage = (props: StaticProps<typeof getStaticProps>) => {
  const {
    content,
    choropleth,
    selectedNlData: data,
    lastGenerated,
    deliveryAndAdministration,
  } = props;
  const { siteText, formatNumber, dataset } = useIntl();

  const { formatPercentageAsNumber } = useFormatLokalizePercentage();

  const text = siteText.vaccinaties;

  const reverseRouter = useReverseRouter();

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
  const vaccinationsIncidencePerAgeGroupFeature = useFeature(
    'nlVaccinationsIncidencePerAgeGroup'
  );
  const vaccinationStatusHospitalFeature = useFeature(
    'nlVaccinationHospitalVaccinationStatus'
  );
  const vaccinationStatusIntensiveCareFeature = useFeature(
    'nlVaccinationIntensiveCareVaccinationStatus'
  );
  const vaccinationBoosterShotsPerAgeGroupFeature = useFeature(
    'nlVaccinationBoosterShotsPerAgeGroup'
  );
  const boosterAndThirdShotAdministeredFeature = useFeature(
    'nlBoosterAndThirdShotAdministered'
  );

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const vaccineCoverageEstimatedLastValue =
    data.vaccine_coverage_per_age_group_estimated.last_value;

  const lastValueIntensiveCareVaccinationStatus =
    data.intensive_care_vaccination_status.last_value;

  const lastValueHositalVaccinationStatus =
    data.hospital_vaccination_status.last_value;

  const [hospitalDateFromText, hospitalDateToText] = useFormatDateRange(
    lastValueHositalVaccinationStatus.date_start_unix,
    lastValueHositalVaccinationStatus.date_end_unix
  );

  const [intensiveCareDateFromText, intensiveCareDateToText] =
    useFormatDateRange(
      lastValueIntensiveCareVaccinationStatus.date_start_unix,
      lastValueIntensiveCareVaccinationStatus.date_end_unix
    );

  const hasActiveWarningTile =
    text.belangrijk_bericht && !isEmpty(text.belangrijk_bericht);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList hasActiveWarningTile={hasActiveWarningTile}>
          {hasActiveWarningTile && (
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
            description={content.pageDescription}
            metadata={{
              datumsText: text.datums,
              dateOrRange: data.vaccine_administered_total.last_value.date_unix,
              dateOfInsertionUnix:
                data.vaccine_administered_total.last_value
                  .date_of_insertion_unix,
              dataSources: [],
            }}
            pageLinks={content.links}
            referenceLink={text.reference.href}
            articles={content.articles}
          />
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
              boostered: formatPercentageAsNumber(
                siteText.nationaal_actueel.mini_trend_tiles.vaccinatiegraad
                  .booster_shots_administered_total
              ),
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
          <VaccineCoveragePerAgeGroup
            title={siteText.vaccinaties.vaccination_coverage.title}
            description={siteText.vaccinaties.vaccination_coverage.toelichting}
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
          {vaccinationsIncidencePerAgeGroupFeature.isEnabled && (
            <ChartTile
              title={
                siteText.vaccinations_incidence_age_demographic_chart.title
              }
              description={
                siteText.vaccinations_incidence_age_demographic_chart
                  .description
              }
            >
              <AgeDemographic
                data={data.hospital_vaccine_incidence_per_age_group}
                accessibility={{
                  key: 'vaccinations_incidence_age_demographic_chart',
                }}
                rightColor="data.primary"
                leftColor="data.yellow"
                leftMetricProperty={'has_one_shot_or_not_vaccinated_per_100k'}
                rightMetricProperty={'fully_vaccinated_per_100k'}
                formatValue={(n) => `${n}`}
                text={
                  siteText.vaccinations_incidence_age_demographic_chart
                    .chart_text
                }
              />
            </ChartTile>
          )}
          {vaccinationStatusHospitalFeature.isEnabled &&
            vaccinationStatusIntensiveCareFeature.isEnabled && (
              <ChartTile
                title={text.vaccination_status_ic_and_hospital_section.title}
                description={replaceVariablesInText(
                  text.vaccination_status_ic_and_hospital_section.description,
                  {
                    hospitalAmount: formatNumber(
                      lastValueHositalVaccinationStatus.total_amount_of_people
                    ),
                    hospitalDateStart: hospitalDateFromText,
                    hospitalDateEnd: hospitalDateToText,
                    intensiveCareAmount: formatNumber(
                      lastValueIntensiveCareVaccinationStatus.total_amount_of_people
                    ),
                    intensiveCareDateStart: intensiveCareDateFromText,
                    intensiveCareDateEnd: intensiveCareDateToText,
                  }
                )}
              >
                <Box display="flex" flexDirection={{ _: 'column', sm: 'row' }}>
                  <Box width="100%" display="flex" flexDirection="column">
                    <PieChart
                      data={lastValueHositalVaccinationStatus}
                      title={
                        text.vaccination_status_ic_and_hospital_section.hospital
                          .title
                      }
                      link={{
                        href: reverseRouter.nl.ziekenhuisopnames(),
                        text: text.vaccination_status_ic_and_hospital_section
                          .hospital.link_text,
                      }}
                      icon={<Ziekenhuis />}
                      verticalLayout
                      dataConfig={[
                        {
                          metricProperty: 'has_one_shot_or_not_vaccinated',
                          color: colors.data.yellow,
                          label:
                            text.vaccination_status_ic_and_hospital_section
                              .hospital.labels.has_one_shot_or_not_vaccinated,
                          tooltipLabel:
                            text.vaccination_status_ic_and_hospital_section
                              .hospital.tooltip_labels
                              .has_one_shot_or_not_vaccinated,
                        },
                        {
                          metricProperty: 'fully_vaccinated',
                          color: colors.data.primary,
                          label:
                            text.vaccination_status_ic_and_hospital_section
                              .hospital.labels.fully_vaccinated,
                          tooltipLabel:
                            text.vaccination_status_ic_and_hospital_section
                              .hospital.tooltip_labels.fully_vaccinated,
                        },
                      ]}
                    />

                    <Box pr={3}>
                      <Metadata
                        date={[
                          lastValueHositalVaccinationStatus.date_start_unix,
                          lastValueHositalVaccinationStatus.date_end_unix,
                        ]}
                        source={{
                          ...text.vaccination_status_ic_and_hospital_section
                            .source,
                        }}
                        isTileFooter
                      />
                    </Box>
                  </Box>

                  <Spacer mb={{ _: 4, sm: 0 }} />

                  <Box width="100%" display="flex" flexDirection="column">
                    <PieChart
                      data={lastValueIntensiveCareVaccinationStatus}
                      verticalLayout
                      title={
                        text.vaccination_status_ic_and_hospital_section
                          .intensive_care.title
                      }
                      link={{
                        href: reverseRouter.nl.intensiveCareOpnames(),
                        text: text.vaccination_status_ic_and_hospital_section
                          .intensive_care.link_text,
                      }}
                      icon={<Arts />}
                      dataConfig={[
                        {
                          metricProperty: 'has_one_shot_or_not_vaccinated',
                          color: colors.data.yellow,
                          label:
                            text.vaccination_status_ic_and_hospital_section
                              .intensive_care.labels
                              .has_one_shot_or_not_vaccinated,
                          tooltipLabel:
                            text.vaccination_status_ic_and_hospital_section
                              .intensive_care.tooltip_labels
                              .has_one_shot_or_not_vaccinated,
                        },
                        {
                          metricProperty: 'fully_vaccinated',
                          color: colors.data.primary,
                          label:
                            text.vaccination_status_ic_and_hospital_section
                              .intensive_care.labels.fully_vaccinated,
                          tooltipLabel:
                            text.vaccination_status_ic_and_hospital_section
                              .intensive_care.tooltip_labels.fully_vaccinated,
                        },
                      ]}
                    />

                    <Box pr={3}>
                      <Metadata
                        date={[
                          lastValueIntensiveCareVaccinationStatus.date_start_unix,
                          lastValueIntensiveCareVaccinationStatus.date_end_unix,
                        ]}
                        source={{
                          ...text.vaccination_status_ic_and_hospital_section
                            .source,
                        }}
                        isTileFooter
                      />
                    </Box>
                  </Box>
                </Box>
              </ChartTile>
            )}

          <VaccineCoverageChoroplethPerGm data={choropleth} />

          <VaccinationsOverTimeTile
            coverageData={data.vaccine_coverage}
            deliveryAndAdministrationData={deliveryAndAdministration}
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
          {boosterAndThirdShotAdministeredFeature.isEnabled && (
            <Box
              pt={40}
              borderTopWidth={2}
              borderColor="silver"
              borderStyle="solid"
            >
              <PageInformationBlock
                icon={<BoosterIcon />}
                title={text.booster_information_block.title}
                description={text.booster_information_block.description}
                metadata={{
                  datumsText: text.booster_information_block.datums,
                  dateOrRange:
                    dataset === 'keys'
                      ? 1638705600
                      : Number(
                          text.four_kpi_section.information_block_date_unix
                        ),
                  dateOfInsertionUnix:
                    dataset === 'keys'
                      ? 1638705600
                      : Number(
                          text.four_kpi_section.information_block_date_unix
                        ),
                  dataSources: [
                    {
                      href: '',
                      text: text.booster_information_block.sources.text,
                      download: '',
                    },
                  ],
                }}
                referenceLink={text.booster_information_block.reference.href}
              />
            </Box>
          )}

          <VaccineBoosterAdministrationsKpiSection
            source={text.vaccination_grade_toggle_tile.source.text}
          />
          <VaccinationsBoosterKpiSection
            dataBoosterShotAdministered={text.data_booster_shot_administered}
            dataBoosterShotPlanned={text.data_booster_shot_planned}
            source={text.vaccination_grade_toggle_tile.source.text}
          />
          <Divider />

          {vaccinationBoosterShotsPerAgeGroupFeature.isEnabled && (
            <>
              <VaccineBoosterPerAgeGroup
                data={DUMMY_DATA_BOOSTER_PER_AGE_GROUP}
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
              />
              <Divider />
            </>
          )}

          <PageInformationBlock
            title={text.section_archived.title}
            description={text.section_archived.description}
          />

          <InView rootMargin="500px">
            <VaccineDeliveryBarChart
              data={data.vaccine_delivery_per_supplier}
            />
          </InView>

          <InView rootMargin="500px">
            <VaccineStockPerSupplierChart values={data.vaccine_stock.values} />
          </InView>

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
            <InView rootMargin="500px">
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
            </InView>
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default VaccinationPage;
