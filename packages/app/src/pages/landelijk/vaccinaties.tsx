import { css } from '@styled-system/css';
import { useState } from 'react';
import styled from 'styled-components';
import VaccinatiesIcon from '~/assets/vaccinaties.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { ChartTile } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Markdown } from '~/components-styled/markdown';
import { RadioGroup } from '~/components-styled/radio-group';
import { TileList } from '~/components-styled/tile-list';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { InlineText, Text } from '~/components-styled/typography';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import {
  MilestonesView,
  MilestoneViewProps,
} from '~/domain/vaccine/milestones-view';
import { VaccineDeliveryAreaChart } from '~/domain/vaccine/vaccine-delivery-area-chart';
import { VaccineDeliveryBarChart } from '~/domain/vaccine/vaccine-delivery-bar-chart';
import { VaccinePageIntroduction } from '~/domain/vaccine/vaccine-page-introduction';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { getVaccineMilestonesQuery } from '~/queries/vaccine-milestones-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getNlData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const scaledVaccineIcon = (
  <Box p={2}>
    <VaccinatiesIcon />
  </Box>
);

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  createGetContent<{
    milestones: MilestoneViewProps;
    highlight: {
      articles?: ArticleSummary[];
    };
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return `{
      "milestones": ${getVaccineMilestonesQuery()},
      "highlight": ${createPageArticlesQuery('vaccinationsPage', locale)}
    }`;
  })
);

const VaccinationPage = (props: StaticProps<typeof getStaticProps>) => {
  const { content, data, lastGenerated } = props;

  const { siteText, formatNumber } = useIntl();

  const text = siteText.vaccinaties;
  const [selectedTab, setSelectedTab] = useState(
    text.gezette_prikken.tab_first.title
  );

  const { milestones } = content;

  const additions = text.expected_page_additions.additions.filter(
    (x) => x.trim().length
  );

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          <VaccinePageIntroduction data={data} text={text} />

          <ArticleStrip articles={content.highlight.articles} />

          <TwoKpiSection>
            <KpiTile
              title={text.gezette_prikken.title}
              metadata={{
                date:
                  data.vaccine_administered_total.last_value
                    .date_of_insertion_unix,
                source: text.bronnen.all_left,
              }}
            >
              <Box
                css={css({ '& div': { justifyContent: 'flex-start' } })}
                mb={3}
              >
                <RadioGroup
                  value={selectedTab}
                  onChange={(value) => setSelectedTab(value)}
                  items={[
                    {
                      label: text.gezette_prikken.tab_first.title,
                      value: text.gezette_prikken.tab_first.title,
                    },
                    {
                      label: text.gezette_prikken.tab_second.title,
                      value: text.gezette_prikken.tab_second.title,
                    },
                  ]}
                />
              </Box>
              {selectedTab == text.gezette_prikken.tab_first.title && (
                <>
                  <KpiValue
                    absolute={
                      data.vaccine_administered_total.last_value.estimated
                    }
                  />
                  <Box
                    display="flex"
                    flexDirection={{ _: 'column', lg: 'row' }}
                  >
                    <Box flex={{ lg: '1 1 50%' }} mb={3}>
                      <Markdown
                        content={text.gezette_prikken.tab_first.description}
                      />
                    </Box>
                    <Box flex={{ lg: '1 1 50%' }} ml={{ lg: 4 }}>
                      <VaccineAdministeredItem
                        value={
                          data.vaccine_administered_ggd.last_value.estimated
                        }
                        description={text.gezette_prikken.estimated.ggd}
                        date={
                          data.vaccine_administered_ggd.last_value.date_unix
                        }
                        isReported
                      />

                      <VaccineAdministeredItem
                        value={
                          data.vaccine_administered_hospitals.last_value
                            .estimated
                        }
                        description={text.gezette_prikken.estimated.hospitals}
                        date={
                          data.vaccine_administered_hospitals.last_value
                            .date_unix
                        }
                        isReported
                      />

                      <VaccineAdministeredItem
                        value={
                          data.vaccine_administered_care_institutions.last_value
                            .estimated
                        }
                        description={
                          text.gezette_prikken.estimated.care_institutions
                        }
                        date={
                          data.vaccine_administered_care_institutions.last_value
                            .date_unix
                        }
                      />

                      <VaccineAdministeredItem
                        value={
                          data.vaccine_administered_doctors.last_value.estimated
                        }
                        description={text.gezette_prikken.estimated.doctors}
                        date={
                          data.vaccine_administered_doctors.last_value.date_unix
                        }
                      />
                    </Box>
                  </Box>
                </>
              )}
              {selectedTab == text.gezette_prikken.tab_second.title && (
                <>
                  <KpiValue
                    absolute={
                      data.vaccine_administered_total.last_value.reported
                    }
                  />
                  <Box
                    display="flex"
                    flexDirection={{ _: 'column', lg: 'row' }}
                  >
                    <Box flex={{ lg: '1 1 50%' }}>
                      <Markdown
                        content={text.gezette_prikken.tab_second.description}
                      />
                    </Box>
                    <Box flex={{ lg: '1 1 50%' }} ml={{ lg: 4 }}>
                      <VaccineAdministeredItem
                        value={
                          data.vaccine_administered_ggd_ghor.last_value.reported
                        }
                        description={text.gezette_prikken.reported.ggd_ghor}
                        date={
                          data.vaccine_administered_ggd_ghor.last_value
                            .date_unix
                        }
                        isReported
                      />

                      <VaccineAdministeredItem
                        value={
                          data.vaccine_administered_lnaz.last_value.reported
                        }
                        description={text.gezette_prikken.reported.lnaz}
                        date={
                          data.vaccine_administered_lnaz.last_value.date_unix
                        }
                        isReported
                      />
                    </Box>
                  </Box>
                </>
              )}
            </KpiTile>
          </TwoKpiSection>

          <MilestonesView
            title={milestones.title}
            description={milestones.description}
            milestones={milestones.milestones}
            expectedMilestones={milestones.expectedMilestones}
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
            ariaDescription={
              siteText.accessibility.grafieken.vaccinatie_draagvlak
            }
            metadata={{
              date: data.vaccine_support.last_value.date_of_insertion_unix,
              source: text.bronnen.rivm,
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

          <TwoKpiSection>
            <KpiTile
              title={text.stock.title}
              metadata={{
                date: data.vaccine_stock.last_value.date_of_insertion_unix,
                source: text.bronnen.stock,
              }}
            >
              <Box as="ul" p={0}>
                <Box
                  as="li"
                  display="flex"
                  flexDirection="row"
                  alignItems="stretch"
                >
                  <Box flex={0.2}>
                    <InlineText>{text.stock.columns.product_name}</InlineText>
                  </Box>
                  <Box flex={0.4} display="flex" justifyContent="flex-end">
                    <InlineText>{text.stock.columns.available}</InlineText>
                  </Box>
                  <Box flex={0.4} display="flex" justifyContent="flex-end">
                    <InlineText>{text.stock.columns.not_available}</InlineText>
                  </Box>
                </Box>
                <VaccineStockRow
                  color={colors.data.vaccines.bio_n_tech_pfizer}
                  productName="BioNTech/Pfizer"
                  total={formatNumber(
                    data.vaccine_stock.last_value.bio_n_tech_pfizer_available
                  )}
                  readyForDelivery={formatNumber(
                    data.vaccine_stock.last_value
                      .bio_n_tech_pfizer_not_available
                  )}
                />
                <VaccineStockRow
                  color={colors.data.vaccines.moderna}
                  productName="Moderna"
                  total={formatNumber(
                    data.vaccine_stock.last_value.moderna_available
                  )}
                  readyForDelivery={formatNumber(
                    data.vaccine_stock.last_value.moderna_not_available
                  )}
                />
                <VaccineStockRow
                  color={colors.data.vaccines.astra_zeneca}
                  productName="AstraZeneca"
                  total={formatNumber(
                    data.vaccine_stock.last_value.astra_zeneca_available
                  )}
                  readyForDelivery={formatNumber(
                    data.vaccine_stock.last_value.astra_zeneca_not_available
                  )}
                />
              </Box>
              <Text>{text.stock.description}</Text>
            </KpiTile>

            <KpiTile
              title={replaceVariablesInText(
                text.delivery_estimate_time_span.title,
                {
                  weeks:
                    data.vaccine_delivery_estimate_time_span.last_value
                      .time_span_weeks,
                }
              )}
              metadata={{
                date:
                  data.vaccine_delivery_estimate_time_span.last_value
                    .date_of_insertion_unix,
                source: text.bronnen.delivery_estimate_time_span,
              }}
            >
              <KpiValue
                absolute={
                  data.vaccine_delivery_estimate_time_span.last_value.doses
                }
              />
              <Text mb={4}>
                {replaceVariablesInText(
                  text.delivery_estimate_time_span.description,
                  {
                    weeks:
                      data.vaccine_delivery_estimate_time_span.last_value
                        .time_span_weeks,
                  }
                )}
              </Text>
            </KpiTile>
          </TwoKpiSection>

          <VaccineDeliveryBarChart data={data.vaccine_delivery_per_supplier} />

          <VaccineDeliveryAreaChart data={data} />

          {(text.expected_page_additions.description ||
            additions.length > 0) && (
            <KpiTile title={text.expected_page_additions.title}>
              {text.expected_page_additions.description && (
                <Text>{text.expected_page_additions.description}</Text>
              )}
              {additions.length > 0 && (
                <ul>
                  {additions.map((addition) => (
                    <li key={addition}>
                      <InlineText>{addition}</InlineText>
                    </li>
                  ))}
                </ul>
              )}
            </KpiTile>
          )}
        </TileList>
      </NationalLayout>
    </Layout>
  );
};

export default VaccinationPage;

interface VaccineAdministeredProps {
  value: number;
  date: number;
  description: string;
  isReported?: boolean;
}

function VaccineAdministeredItem(props: VaccineAdministeredProps) {
  const { value, date, description, isReported } = props;

  const { siteText, formatNumber, formatDateFromSeconds } = useIntl();

  return (
    <Text fontWeight="bold">
      <InlineText css={css({ color: 'data.primary' })}>
        {formatNumber(value)}
      </InlineText>{' '}
      {description}
      <br />
      <InlineText fontWeight="normal" fontSize={1} color="annotation">
        {replaceVariablesInText(
          isReported
            ? siteText.vaccinaties.gezette_prikken.reported_until
            : siteText.vaccinaties.gezette_prikken.estimated_until,
          {
            reportedDate: formatDateFromSeconds(date, 'weekday-medium'),
          }
        )}
      </InlineText>
    </Text>
  );
}

const ColorIndicator = styled.span<{
  color?: string;
}>`
  content: '';
  display: ${(x) => (x.color ? 'inline-block' : 'none')};
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: ${(x) => x.color || 'black'};
  margin-right: 0.5em;
  flex-shrink: 0;
`;

type VaccineStockRowProps = {
  color: string;
  productName: string;
  total: string;
  readyForDelivery: string;
};

function VaccineStockRow(props: VaccineStockRowProps) {
  const { color, productName, total, readyForDelivery } = props;
  return (
    <Box as="li" display="flex" flexDirection="row" alignItems="stretch">
      <Box flex={0.2} display="flex" alignItems="center">
        <ColorIndicator color={color} />
        <InlineText color={color} fontWeight="bold">
          {productName}:
        </InlineText>
      </Box>
      <Box flex={0.4} display="flex" justifyContent="flex-end">
        <strong>{total}</strong>
      </Box>
      <Box flex={0.4} display="flex" justifyContent="flex-end">
        <strong>{readyForDelivery}</strong>
      </Box>
    </Box>
  );
}
