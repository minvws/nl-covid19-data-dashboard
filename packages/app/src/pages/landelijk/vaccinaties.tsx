import {
  NlVaccineAdministeredEstimateValue,
  NlVaccineAdministeredValue,
  NlVaccineDeliveryEstimateValue,
  NlVaccineDeliveryValue,
} from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ParentSize } from '@visx/responsive';
import { Fragment, useState } from 'react';
import styled from 'styled-components';
import VaccinatieIcon from '~/assets/vaccinaties.svg';
import { AreaChart } from '~/components-styled/area-chart';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box, Spacer } from '~/components-styled/base';
import { ChartTile } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Legenda } from '~/components-styled/legenda';
import { MultiLineChart } from '~/components-styled/multi-line-chart';
import { RadioGroup } from '~/components-styled/radio-group';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import { VisuallyHidden } from '~/components-styled/visually-hidden';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import { createDeliveryTooltipFormatter } from '~/domain/vaccines/create-delivery-tooltip-formatter';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getNlData,
  getText,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  getText,
  createGetContent<{
    articles?: ArticleSummary[];
  }>(createPageArticlesQuery('vaccinationsPage'))
);

const VaccinationPage: FCWithLayout<typeof getStaticProps> = ({
  text: siteText,
  content,
  data,
}) => {
  const text = siteText.vaccinaties;
  const [selectedTab, setSelectedTab] = useState(
    text.data.kpi_total.first_tab_title
  );

  const additions = text.data.kpi_expected_page_additions.additions.filter(
    (x) => x.length
  );
 const vaccineDeliveryValues = [...data.vaccine_delivery.values];
  const vaccineDeliveryEstimateValues = [
    ...data.vaccine_delivery_estimate.values,
  ];
  const vaccineAdministeredValues = [...data.vaccine_administered.values];
  const vaccineAdministeredEstimateValues = [
    ...data.vaccine_administered_estimate.values,
  ];

  // add the first estimate to the delivered values, otherwise the lines and stacks will
  // have a gap between them
  vaccineDeliveryValues.push({ ...vaccineDeliveryEstimateValues[0] });
  vaccineAdministeredValues.push({ ...vaccineAdministeredEstimateValues[0] });
  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.vaccinaties}
          title={text.title}
          icon={<VaccinatieIcon />}
          subtitle={text.description}
          reference={text.reference}
          metadata={{
            datumsText: text.datums,
            dateOrRange: parseFloat(text.date_of_insertion_unix),
            dateOfInsertionUnix: parseFloat(text.date_of_insertion_unix),
            dataSources: [],
          }}
        />

        <ArticleStrip articles={content.articles} />

        <TwoKpiSection>
          <KpiTile
            title={text.data.kpi_total.title}
            metadata={{
              date: parseFloat(text.data.kpi_total.date_of_report_unix),
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
                    label: text.data.kpi_total.first_tab_title,
                    value: text.data.kpi_total.first_tab_title,
                  },
                  {
                    label: text.data.kpi_total.second_tab_title,
                    value: text.data.kpi_total.second_tab_title,
                  },
                ]}
              />
            </Box>
            {selectedTab == text.data.kpi_total.first_tab_title && (
              <>
                <KpiValue
                  absolute={parseFloat(
                    text.data.kpi_total.tab_total_estimated.value
                  )}
                />
                <Box display="flex" flexDirection={{ _: 'column', lg: 'row' }}>
                  <Box flex={{ lg: '1 1 50%' }}>
                    <Text
                      mb={3}
                      dangerouslySetInnerHTML={{
                        __html:
                          text.data.kpi_total.tab_total_estimated
                            .description_first,
                      }}
                    />
                    <Text
                      mb={3}
                      dangerouslySetInnerHTML={{
                        __html:
                          text.data.kpi_total.tab_total_estimated
                            .description_second,
                      }}
                    />
                  </Box>
                  <Box flex={{ lg: '1 1 50%' }} ml={{ lg: 4 }}>
                    {text.data.kpi_total.tab_total_estimated.administered.map(
                      (item, index) => (
                        <Fragment key={index}>
                          {item.value && item.description && (
                            <Text fontWeight="bold">
                              <InlineText css={css({ color: 'data.primary' })}>
                                {formatNumber(parseFloat(item.value))}
                              </InlineText>{' '}
                              <InlineText
                                css={css({
                                  '& p': { display: 'inline-block', m: 0 },
                                })}
                                dangerouslySetInnerHTML={{
                                  __html: item.description,
                                }}
                              />
                              <br />
                              <InlineText
                                fontWeight="normal"
                                fontSize={1}
                                color="annotation"
                              >
                                {item.report_date}
                              </InlineText>
                            </Text>
                          )}
                        </Fragment>
                      )
                    )}
                  </Box>
                </Box>
              </>
            )}
            {selectedTab == text.data.kpi_total.second_tab_title && (
              <>
                <KpiValue absolute={parseFloat(text.data.kpi_total.value)} />
                <Box display="flex" flexDirection={{ _: 'column', lg: 'row' }}>
                  <Box flex={{ lg: '1 1 50%' }}>
                    <Text
                      mb={3}
                      dangerouslySetInnerHTML={{
                        __html: text.data.kpi_total.description_first,
                      }}
                    />
                    <Text
                      mb={3}
                      dangerouslySetInnerHTML={{
                        __html: text.data.kpi_total.description_second,
                      }}
                    />
                  </Box>
                  <Box flex={{ lg: '1 1 50%' }} ml={{ lg: 4 }}>
                    {text.data.kpi_total.administered.map((item, index) => (
                      <Fragment key={index}>
                        {item.value && item.description && (
                          <Text fontWeight="bold">
                            <InlineText css={css({ color: 'data.primary' })}>
                              {formatNumber(parseFloat(item.value))}
                            </InlineText>{' '}
                            <InlineText
                              css={css({
                                '& p': { display: 'inline-block', m: 0 },
                              })}
                              dangerouslySetInnerHTML={{
                                __html: item.description,
                              }}
                            />
                            <br />
                            <InlineText
                              fontWeight="normal"
                              fontSize={1}
                              color="annotation"
                            >
                              {item.report_date}
                            </InlineText>
                          </Text>
                        )}
                      </Fragment>
                    ))}
                  </Box>
                </Box>
              </>
            )}
          </KpiTile>
        </TwoKpiSection>

        <ChartTile
          title={text.grafiek.titel}
          description={text.grafiek.titel}
          metadata={{
            date: vaccineDeliveryValues[0].date_of_insertion_unix,
            source: text.bronnen.rivm,
          }}
        >
          <Box>
            <ParentSize>
              {({ width }) => (
                <AreaChart<
                  NlVaccineDeliveryValue | NlVaccineDeliveryEstimateValue,
                  | NlVaccineAdministeredValue
                  | NlVaccineAdministeredEstimateValue
                >
                  valueAnnotation={siteText.waarde_annotaties.x_miljoen}
                  width={width}
                  timeframe="all"
                  formatTooltip={createDeliveryTooltipFormatter(siteText)}
                  divider={{
                    color: colors.annotation,
                    leftLabel: text.data.vaccination_chart.left_divider_label,
                    rightLabel: text.data.vaccination_chart.right_divider_label,
                  }}
                  trends={[
                    {
                      values: vaccineDeliveryValues,
                      displays: [
                        {
                          metricProperty: 'total',
                          strokeWidth: 3,
                          color: colors.data.emphasis,
                          legendLabel: text.data.vaccination_chart.delivered,
                        },
                      ],
                    },
                    {
                      values: vaccineDeliveryEstimateValues,
                      displays: [
                        {
                          metricProperty: 'total',
                          style: 'dashed',
                          strokeWidth: 3,
                          legendLabel: text.data.vaccination_chart.estimated,
                          color: colors.data.emphasis,
                        },
                      ],
                    },
                  ]}
                  areas={[
                    {
                      values: vaccineAdministeredValues,
                      displays: Object.keys(colors.data.vaccines).map(
                        (key) => ({
                          metricProperty: key as any,
                          color: (colors.data.vaccines as any)[key],
                          legendLabel: key,
                        })
                      ),
                    },
                    {
                      values: vaccineAdministeredEstimateValues,
                      displays: Object.keys(colors.data.vaccines).map(
                        (key) => ({
                          metricProperty: key as any,
                          pattern: 'hatched',
                          color: (colors.data.vaccines as any)[key],
                          legendLabel: key,
                        })
                      ),
                    },
                  ]}
                />
              )}
            </ParentSize>
            <Legenda
              items={[
                {
                  label: text.data.vaccination_chart.legend.available,
                  color: 'data.emphasis',
                  shape: 'line',
                },
                {
                  label: text.data.vaccination_chart.legend.expected,
                  color: 'black',
                  shape: 'custom',
                  ShapeComponent: HatchedSquare,
                },
              ]}
            />
            <Legenda
              items={Object.keys(colors.data.vaccines).map((key) => ({
                label: (text.data.vaccination_chart.product_names as any)[key],
                color: `data.vaccines.${key}`,
                shape: 'square',
              }))}
            />
          </Box>
        </ChartTile>

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

          {/* <Text mt={0}>{text.grafiek_draagvlak.omschrijving}</Text> */}
          <ParentSize>
            {({ width }) => (
              <MultiLineChart
                timeframe="all"
                width={width}
                ariaLabelledBy="chart_vaccine_support"
                values={data.vaccine_support.values}
                showMarkerLine
                showLegend
                yTickValues={[0, 25, 50, 75, 100]}
                linesConfig={[
                  {
                    metricProperty: 'percentage_16_24',
                    label: replaceVariablesInText(
                      text.grafiek_draagvlak.leeftijd_jaar,
                      { ageGroup: '16 - 24' }
                    ),
                    color: '#005082',
                    legendShape: 'square',
                    areaFillOpacity: 0,
                  },
                  {
                    metricProperty: 'percentage_25_39',
                    label: replaceVariablesInText(
                      text.grafiek_draagvlak.leeftijd_jaar,
                      { ageGroup: '25 - 39' }
                    ),
                    color: '#00BBB5',
                    legendShape: 'square',
                    areaFillOpacity: 0,
                  },
                  {
                    metricProperty: 'percentage_40_54',
                    label: replaceVariablesInText(
                      text.grafiek_draagvlak.leeftijd_jaar,
                      { ageGroup: '40 - 54' }
                    ),
                    color: '#FFC000',
                    legendShape: 'square',
                    areaFillOpacity: 0,
                  },
                  {
                    metricProperty: 'percentage_55_69',
                    label: replaceVariablesInText(
                      text.grafiek_draagvlak.leeftijd_jaar,
                      { ageGroup: '55 - 69' }
                    ),
                    color: '#E28700',
                    legendShape: 'square',
                    areaFillOpacity: 0,
                  },
                  {
                    metricProperty: 'percentage_70_plus',
                    label: replaceVariablesInText(
                      text.grafiek_draagvlak.leeftijd_jaar,
                      { ageGroup: '70+' }
                    ),
                    color: '#C252D4',
                    legendShape: 'square',
                    areaFillOpacity: 0,
                  },
                ]}
                /**
                 * @TODO The tooltip formatting is getting a bit out of hand here. I
                 * think we can refactor this into a set of selectable types of
                 * tooltips. That probably means having to align a few charts
                 * design-wise. There are too many variables and implementation
                 * details required to format a good multi-line tooltip. It
                 * feels silly to expose that to the calling context.
                 */
                formatTooltip={(value, _key, linesConfig) => {
                  const dateStartString = formatDateFromSeconds(
                    value.date_start_unix,
                    'axis'
                  );
                  const dateEndString = formatDateFromSeconds(
                    value.date_end_unix,
                    'axis'
                  );

                  return (
                    <section>
                      <Heading level={5} mb={1}>
                        {text.grafiek_draagvlak.titel}
                      </Heading>
                      <VisuallyHidden>
                        {`${dateStartString} - ${dateEndString}`}
                      </VisuallyHidden>
                      <TooltipList>
                        {[...linesConfig].reverse().map((x) => (
                          <TooltipListItem
                            key={x.metricProperty}
                            color={x.color}
                          >
                            <TooltipValueContainer>
                              {x.label}:{' '}
                              <strong>
                                {formatPercentage(value[x.metricProperty])}%
                              </strong>
                            </TooltipValueContainer>
                          </TooltipListItem>
                        ))}

                        <Spacer mb={1} />
                        <TooltipListItem color="transparent">
                          <TooltipValueContainer>
                            {`${text.grafiek_draagvlak.tooltip_gemiddeld}:`}
                            <strong>
                              {formatPercentage(value['percentage_average'])}%
                            </strong>
                          </TooltipValueContainer>
                        </TooltipListItem>
                      </TooltipList>
                    </section>
                  );
                }}
                formatYAxis={(x) => `${x}%`}
                seriesMax={100}
                padding={{ left: 36 }}
              />
            )}
          </ParentSize>
        </ChartTile>

        <TwoKpiSection>
          <KpiTile title={text.data.kpi_expected_page_additions.title}>
            <Text mb={4}>
              {text.data.kpi_expected_page_additions.description}
            </Text>
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
        </TwoKpiSection>
      </TileList>
    </>
  );
};

VaccinationPage.getLayout = getNationalLayout;

export default VaccinationPage;

const TooltipList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

interface TooltipListItemProps {
  color: string;
}

const TooltipListItem = styled.li<TooltipListItemProps>`
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: ${(props) => props.color};
    margin-right: 0.5em;
    flex-shrink: 0;
  }
`;

const TooltipValueContainer = styled.span`
  display: flex;
  width: 100%;
  min-width: 120px;
  justify-content: space-between;
`;

function HatchedSquare() {
  return (
    <svg height="15" width="15">
      <defs>
        <pattern
          id="hatch"
          width="5"
          height="5"
          patternTransform="rotate(-45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y="0" width="5" height="5" fill="white" />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="5"
            style={{ stroke: 'black', strokeWidth: 3 }}
          />
        </pattern>
      </defs>
      <rect height="15" width="15" fill="url(#hatch)" />
    </svg>
  );
}
