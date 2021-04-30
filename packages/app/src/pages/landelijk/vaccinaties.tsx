import VaccinatiesIcon from '~/assets/vaccinaties.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { ContentHeader } from '~/components/content-header';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { MilestonesView } from '~/domain/vaccine/milestones-view';
import { VaccineAdministrationsKpiSection } from '~/domain/vaccine/vaccine-administrations-kpi-section';
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

const DAY_IN_SECONDS = 24 * 60 * 60;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData(
    'vaccine_stock',
    'vaccine_delivery_per_supplier',
    'vaccine_support',
    'vaccine_administered_total',
    'vaccine_administered_planned',
    'vaccine_administered_rate_moving_average',
    'vaccine_administered',
    'vaccine_delivery',
    'vaccine_delivery_estimate',
    'vaccine_administered_estimate',
    'vaccine_administered_ggd',
    'vaccine_administered_hospitals_and_care_institutions',
    'vaccine_administered_doctors',
    'vaccine_administered_ggd_ghor',
    'vaccine_coverage'
  ),
  createGetContent<{
    page: VaccinationPageQuery;
    highlight: {
      articles?: ArticleSummary[];
    };
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return `{
      "page": ${getVaccinePageQuery()},
      "highlight": ${createPageArticlesQuery('vaccinationsPage', locale)}
    }`;
  })
);

const VaccinationPage = (props: StaticProps<typeof getStaticProps>) => {
  const { content, selectedNlData: data, lastGenerated } = props;

  const stockFeature = useFeature('vaccineStockPerSupplier');
  const vaccineCimsFeature = useFeature('vaccineCimsData');

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
      <NationalLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          <VaccinePageIntroduction
            data={data}
            pageInfo={page.pageInfo}
            pageLinks={page.pageLinks}
            pageLinksTitle={page.linksTitle}
          />

          <ArticleStrip articles={content.highlight.articles} />

          <VaccineAdministrationsKpiSection data={data} />

          <VaccineDeliveryAndAdministrationsAreaChart data={data} />

          {vaccineCimsFeature.isEnabled && data.vaccine_coverage && (
            <ChartTile
              title={text.grafiek_gevaccineerde_mensen.titel}
              description={text.grafiek_gevaccineerde_mensen.omschrijving}
              metadata={{
                date: data.vaccine_coverage.last_value.date_of_report_unix,
                source: text.bronnen.rivm,
              }}
            >
              <Box spacing={3}>
                <TimeSeriesChart
                  tooltipTitle={text.grafiek_gevaccineerde_mensen.titel}
                  values={data.vaccine_coverage.values}
                  formatTickValue={(x) => `${x / 1_000_000}`}
                  dataOptions={{
                    valueAnnotation: siteText.waarde_annotaties.x_miljoen,
                    timespanAnnotations: [
                      {
                        start:
                          data.vaccine_coverage.last_value.date_unix -
                          DAY_IN_SECONDS * 5,
                        end: data.vaccine_coverage.last_value.date_unix,
                        label:
                          text.grafiek_gevaccineerde_mensen.label_annotatie,
                        shortLabel:
                          text.grafiek_gevaccineerde_mensen
                            .tooltip_label_annotatie,
                      },
                    ],
                  }}
                  seriesConfig={[
                    {
                      metricProperty: 'partially_or_fully_vaccinated',
                      type: 'line',
                      label:
                        text.grafiek_gevaccineerde_mensen.label_geprikte_mensen,
                      shortLabel:
                        text.grafiek_gevaccineerde_mensen
                          .tooltip_label_geprikte_mensen,
                      color: 'black',
                      strokeWidth: 3,
                    },
                    {
                      metricProperty: 'partially_vaccinated',
                      type: 'stacked-area',
                      label:
                        text.grafiek_gevaccineerde_mensen
                          .label_gedeeltelijk_gevaccineerd,
                      shortLabel:
                        text.grafiek_gevaccineerde_mensen
                          .tooltip_label_gedeeltelijk_gevaccineerd,
                      color: colors.data.multiseries.cyan,
                      fillOpacity: 1,
                    },
                    {
                      metricProperty: 'fully_vaccinated',
                      type: 'stacked-area',
                      label:
                        text.grafiek_gevaccineerde_mensen
                          .label_volledig_gevaccineerd,
                      shortLabel:
                        text.grafiek_gevaccineerde_mensen
                          .tooltip_label_volledig_gevaccineerd,
                      color: colors.data.multiseries.cyan_dark,
                      fillOpacity: 1,
                    },
                  ]}
                />
                {text.grafiek_gevaccineerde_mensen.extra_bericht && (
                  <Markdown
                    content={text.grafiek_gevaccineerde_mensen.extra_bericht}
                  />
                )}
              </Box>
            </ChartTile>
          )}

          {data.vaccine_delivery_per_supplier ? (
            <VaccineDeliveryBarChart
              data={data.vaccine_delivery_per_supplier}
            />
          ) : null}

          <MilestonesView
            title={page.title}
            description={page.description}
            milestones={page.milestones}
            expectedMilestones={page.expectedMilestones}
          />

          <ContentHeader
            title={text.bereidheid_section.title}
            subtitle={text.bereidheid_section.description}
            reference={text.bereidheid_section.reference}
            icon={scaledVaccineIcon}
            metadata={{
              datumsText: text.bereidheid_datums,
              dateOrRange:
                data.vaccine_support.last_value.date_of_insertion_unix,
              dateOfInsertionUnix:
                data.vaccine_support.last_value.date_of_insertion_unix,
              dataSources: [],
            }}
          />

          <ChartTile
            title={text.grafiek_draagvlak.titel}
            description={text.grafiek_draagvlak.omschrijving}
            metadata={{
              datumsText: siteText.vaccinaties.grafiek_draagvlak.metadata_tekst,
              date: [
                data.vaccine_support.last_value.date_start_unix,
                data.vaccine_support.last_value.date_end_unix,
              ],
            }}
          >
            <section>
              <KpiValue
                percentage={data.vaccine_support.last_value.percentage_average}
              />
              <Text mt={0}>{text.grafiek_draagvlak.kpi_omschrijving}</Text>
            </section>

            <TimeSeriesChart
              tooltipTitle={text.grafiek_draagvlak.titel}
              ariaLabelledBy="chart_vaccine_support"
              values={data.vaccine_support.values}
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

          {stockFeature.isEnabled && (
            <VaccineStockPerSupplierChart values={data.vaccine_stock.values} />
          )}
        </TileList>
      </NationalLayout>
    </Layout>
  );
};

export default VaccinationPage;
