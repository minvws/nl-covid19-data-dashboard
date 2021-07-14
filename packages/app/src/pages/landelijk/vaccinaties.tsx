import {
  NlVaccineCoveragePerAgeGroupValue,
  NlVaccineCoverageValue,
} from '@corona-dashboard/common';
import { isEmpty } from 'lodash';
import VaccinatiesIcon from '~/assets/vaccinaties.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { ContentHeader } from '~/components/content-header';
import { KpiValue } from '~/components/kpi-value';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { Heading, Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { selectDeliveryAndAdministrationData } from '~/domain/vaccine/data-selection/select-delivery-and-administration-data';
import { MilestonesView } from '~/domain/vaccine/milestones-view';
import { VaccineAdministrationsKpiSection } from '~/domain/vaccine/vaccine-administrations-kpi-section';
import { VaccineCoveragePerAgeGroup } from '~/domain/vaccine/vaccine-coverage-per-age-group';
import { VaccineDeliveryAndAdministrationsAreaChart } from '~/domain/vaccine/vaccine-delivery-and-administrations-area-chart';
import { VaccineDeliveryBarChart } from '~/domain/vaccine/vaccine-delivery-bar-chart';
import { VaccinePageIntroduction } from '~/domain/vaccine/vaccine-page-introduction';
import { VaccineStockPerSupplierChart } from '~/domain/vaccine/vaccine-stock-per-supplier-chart';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { getVaccinePageQuery } from '~/queries/vaccine-page-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getNlData,
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { VaccinationPageQuery } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

const scaledVaccineIcon = (
  <Box p={2}>
    <VaccinatiesIcon />
  </Box>
);

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData(
    'vaccine_stock',
    'vaccine_delivery_per_supplier',
    'vaccine_vaccinated_or_support',
    'vaccine_administered_total',
    'vaccine_administered_planned',
    'vaccine_administered_rate_moving_average',
    'vaccine_administered_ggd',
    'vaccine_administered_hospitals_and_care_institutions',
    'vaccine_administered_doctors',
    'vaccine_administered_ggd_ghor',
    'vaccine_coverage'
  ),
  () => selectDeliveryAndAdministrationData(getNlData().data),
  createGetContent<{
    page: VaccinationPageQuery;
    highlight: {
      articles?: ArticleSummary[];
    };
  }>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return `{
      "page": ${getVaccinePageQuery()},
      "highlight": ${createPageArticlesQuery('vaccinationsPage', locale)}
    }`;
  })
);

const VaccinationPage = (props: StaticProps<typeof getStaticProps>) => {
  const {
    content,
    selectedNlData: data,
    lastGenerated,
    deliveryAndAdministration,
  } = props;

  const vaccinationPerAgeGroupFeature = useFeature('vaccinationPerAgegroup');

  const { siteText } = useIntl();

  const text = siteText.vaccinaties;

  const { page } = content;

  // TODO: put this back this when data is available
  //const {vaccine_coverage_per_age_group} = data;
  const vaccine_coverage_per_age_group = mockCoverageData();

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          {text.belangrijk_bericht && !isEmpty(text.belangrijk_bericht) && (
            <WarningTile
              isFullWidth
              message={text.belangrijk_bericht}
              variant="emphasis"
            />
          )}

          <VaccinePageIntroduction
            data={data}
            pageInfo={page.pageInfo}
            pageLinks={page.pageLinks}
            pageLinksTitle={page.linksTitle}
          />

          <ArticleStrip articles={content.highlight.articles} />

          {data.vaccine_coverage && (
            <ChartTile
              title={text.grafiek_gevaccineerd_door_de_tijd_heen.titel}
              description={
                text.grafiek_gevaccineerd_door_de_tijd_heen.omschrijving
              }
              metadata={{
                date: data.vaccine_coverage.last_value.date_of_insertion_unix,
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
                    fillOpacity: 1,
                  },
                ]}
              />
            </ChartTile>
          )}

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

          {vaccinationPerAgeGroupFeature.isEnabled ? (
            <Tile>
              <Heading level={2}>
                {siteText.vaccinaties.vaccination_coverage.title}
              </Heading>
              <Text>
                {siteText.vaccinaties.vaccination_coverage.toelichting}
              </Text>
              <VaccineCoveragePerAgeGroup
                values={vaccine_coverage_per_age_group.values}
              />
            </Tile>
          ) : null}

          <ContentHeader
            title={text.bereidheid_section.title}
            subtitle={text.bereidheid_section.description}
            reference={text.bereidheid_section.reference}
            icon={scaledVaccineIcon}
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
            <section>
              <KpiValue
                percentage={
                  data.vaccine_vaccinated_or_support.last_value
                    .percentage_average
                }
              />
              <Text mt={0}>{text.grafiek_draagvlak.kpi_omschrijving}</Text>
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
          </ChartTile>

          <ContentHeader
            title={text.stock_and_delivery_section.title}
            icon={scaledVaccineIcon}
            subtitle={text.stock_and_delivery_section.description}
            reference={text.stock_and_delivery_section.reference}
            metadata={{
              datumsText: text.datums,
              dateOrRange: data.vaccine_stock.last_value.date_unix,
              dateOfInsertionUnix:
                data.vaccine_stock.last_value.date_of_insertion_unix,
              dataSources: [],
            }}
          />

          <VaccineDeliveryBarChart data={data.vaccine_delivery_per_supplier} />

          <VaccineStockPerSupplierChart values={data.vaccine_stock.values} />
        </TileList>
      </NationalLayout>
    </Layout>
  );
};

export default VaccinationPage;

// @TODO re-enable when data is available
//
// const ColorIndicator = styled.span<{
//   color?: string;
// }>`
//   content: '';
//   display: ${(x) => (x.color ? 'inline-block' : 'none')};
//   height: 8px;
//   width: 8px;
//   border-radius: 50%;
//   background: ${(x) => x.color || 'black'};
//   margin-right: 0.5em;
//   flex-shrink: 0;
// `;

// TODO: remove this when data is available
function mockCoverageData(): { values: NlVaccineCoveragePerAgeGroupValue[] } {
  const values = [
    'total',
    '18-29',
    '30-39',
    '40-49',
    '50-59',
    '60-69',
    '70-79',
    '80+',
  ]
    .map(createCoverageRow)
    .reverse();

  values[2].fully_vaccinated = 0;
  values[2].fully_vaccinated_percentage = 0;

  return { values };

  function createCoverageRow(
    ageGroup: string
  ): NlVaccineCoveragePerAgeGroupValue {
    const ageGroupTotal = Math.floor(Math.random() * 17000000) + 1000000;
    const fullyVaccinated = Math.floor(Math.random() * ageGroupTotal) + 1;
    const partiallyVaccinated = Math.floor(Math.random() * ageGroupTotal) + 1;

    return {
      age_group_range: ageGroup,
      age_group_percentage: Math.floor(Math.random() * 100) + 1,
      age_group_total: ageGroupTotal,
      fully_vaccinated: fullyVaccinated,
      partially_vaccinated: partiallyVaccinated,
      fully_vaccinated_percentage: (fullyVaccinated / ageGroupTotal) * 100,
      partially_vaccinated_percentage:
        (partiallyVaccinated / ageGroupTotal) * 100,
      partially_or_fully_vaccinated_percentage: 0,
      date_of_insertion_unix: 1616544000,
      date_of_report_unix: 1616544000,
      date_unix: 1616544000,
    };
  }
}

function transformToDayTimestamps(values: NlVaccineCoverageValue[]) {
  return values.map((x) => ({
    ...x,
    date_unix: x.date_end_unix,
    date_start_unix: undefined,
    date_end_unix: undefined,
  }));
}
