import { NlVaccineCoverageValue } from '@corona-dashboard/common';
import { Vaccinaties } from '@corona-dashboard/icons';
import { isEmpty } from 'lodash';
import { Box, Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { selectDeliveryAndAdministrationData } from '~/domain/vaccine/data-selection/select-delivery-and-administration-data';
import { selectVaccineCoverageData } from '~/domain/vaccine/data-selection/select-vaccine-coverage-data';
import { MilestonesView } from '~/domain/vaccine/milestones-view';
import { VaccineAdministrationsKpiSection } from '~/domain/vaccine/vaccine-administrations-kpi-section';
import { VaccineCoverageChoroplethPerGm } from '~/domain/vaccine/vaccine-coverage-choropleth-per-gm';
import { VaccineCoveragePerAgeGroup } from '~/domain/vaccine/vaccine-coverage-per-age-group';
import { VaccineDeliveryAndAdministrationsAreaChart } from '~/domain/vaccine/vaccine-delivery-and-administrations-area-chart';
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
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { VaccinationPageQuery } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData(
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
    'vaccine_vaccinated_or_support'
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
    gm: ({ vaccine_coverage_per_age_group }) =>
      selectVaccineCoverageData(vaccine_coverage_per_age_group),
    vr: ({ vaccine_coverage_per_age_group }) =>
      selectVaccineCoverageData(vaccine_coverage_per_age_group),
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

  const vaccinationPerAgeGroupFeature = useFeature('vaccinationPerAgeGroup');

  const { siteText } = useIntl();
  const text = siteText.vaccinaties;
  const { page } = content;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout data={data} lastGenerated={lastGenerated}>
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
            usefulLinks={content.page.usefulLinks}
            referenceLink={text.reference.href}
            articles={content.highlight.articles}
          />

          {data.vaccine_coverage && (
            <ChartTile
              title={text.grafiek_gevaccineerd_door_de_tijd_heen.titel}
              description={
                text.grafiek_gevaccineerd_door_de_tijd_heen.omschrijving
              }
              metadata={{
                source: text.bronnen.rivm,
              }}
            >
              <TimeSeriesChart
                accessibility={{ key: 'vaccine_coverage_over_time_chart' }}
                values={transformToDayTimestamps(data.vaccine_coverage.values)}
                formatTickValue={(x) => `${x / 1_000_000}`}
                dataOptions={{
                  valueAnnotation:
                    text.grafiek_gevaccineerd_door_de_tijd_heen
                      .waarde_annotatie,
                }}
                seriesConfig={[
                  {
                    label:
                      text.grafiek_gevaccineerd_door_de_tijd_heen.label_totaal,
                    shortLabel:
                      text.grafiek_gevaccineerd_door_de_tijd_heen
                        .tooltip_label_totaal,
                    type: 'line',
                    metricProperty: 'partially_or_fully_vaccinated',
                    color: 'black',
                  },
                  {
                    label:
                      text.grafiek_gevaccineerd_door_de_tijd_heen
                        .label_gedeeltelijk,
                    shortLabel:
                      text.grafiek_gevaccineerd_door_de_tijd_heen
                        .tooltip_label_gedeeltelijk,
                    type: 'stacked-area',
                    metricProperty: 'partially_vaccinated',
                    color: colors.data.primary,
                    mixBlendMode: 'multiply',
                    fillOpacity: 1,
                  },
                  {
                    label:
                      text.grafiek_gevaccineerd_door_de_tijd_heen
                        .label_volledig,
                    shortLabel:
                      text.grafiek_gevaccineerd_door_de_tijd_heen
                        .tooltip_label_volledig,
                    type: 'stacked-area',
                    metricProperty: 'fully_vaccinated',
                    color: colors.data.secondary,
                    mixBlendMode: 'multiply',
                    fillOpacity: 1,
                  },
                ]}
              />
            </ChartTile>
          )}

          <VaccineCoverageChoroplethPerGm data={choropleth} />

          {vaccinationPerAgeGroupFeature.isEnabled &&
          data.vaccine_coverage_per_age_group ? (
            <ChartTile
              title={siteText.vaccinaties.vaccination_coverage.title}
              description={
                siteText.vaccinaties.vaccination_coverage.toelichting
              }
              metadata={{
                datumsText: text.datums,
                date: data.vaccine_coverage_per_age_group.values[0].date_unix,
                source: siteText.vaccinaties.vaccination_coverage.bronnen.rivm,
              }}
            >
              <VaccineCoveragePerAgeGroup
                values={data.vaccine_coverage_per_age_group.values}
              />
            </ChartTile>
          ) : null}

          <VaccineDeliveryAndAdministrationsAreaChart
            data={deliveryAndAdministration}
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
            title={text.bereidheid_section.title}
            description={text.bereidheid_section.description}
            referenceLink={text.bereidheid_section.reference.href}
            icon={<Vaccinaties />}
            metadata={{
              datumsText: text.bereidheid_datums,
              dateOrRange:
                data.vaccine_vaccinated_or_support.last_value
                  .date_of_insertion_unix,
              dateOfInsertionUnix:
                data.vaccine_vaccinated_or_support.last_value
                  .date_of_insertion_unix,
              dataSources: [],
            }}
          />

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

          <Spacer pb={3} />

          <PageInformationBlock
            title={text.stock_and_delivery_section.title}
            icon={<Vaccinaties />}
            description={text.stock_and_delivery_section.description}
            referenceLink={text.stock_and_delivery_section.reference.href}
            metadata={{
              datumsText: text.levering_en_voorraad_datums,
              dateOrRange: data.vaccine_stock.last_value.date_unix,
              dateOfInsertionUnix:
                data.vaccine_stock.last_value.date_of_insertion_unix,
              dataSources: [],
            }}
          />

          <VaccineDeliveryBarChart data={data.vaccine_delivery_per_supplier} />

          <VaccineStockPerSupplierChart values={data.vaccine_stock.values} />
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default VaccinationPage;

function transformToDayTimestamps(values: NlVaccineCoverageValue[]) {
  return values.map((x) => ({
    ...x,
    date_unix: x.date_end_unix,
    date_start_unix: undefined,
    date_end_unix: undefined,
  }));
}
