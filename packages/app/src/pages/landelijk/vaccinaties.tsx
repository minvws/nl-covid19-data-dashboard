// import { NlVaccineSupportValue } from '@corona-dashboard/common';
import {
  isDateSpanValue,
  isDateValue,
  NlVaccineAdministeredEstimateValue,
  NlVaccineAdministeredValue,
  NlVaccineDeliveryEstimateValue,
  NlVaccineDeliveryValue
} from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ParentSize } from '@visx/responsive';
import { Fragment, useState } from 'react';
import VaccinatieIcon from '~/assets/vaccinaties.svg';
import { AreaChart } from '~/components-styled/area-chart';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { ChartTile } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { HoverPoint } from '~/components-styled/line-chart/components';
import { LineChart } from '~/components-styled/line-chart/line-chart';
import { TimestampedTrendValue } from '~/components-styled/line-chart/logic';
import { RadioGroup } from '~/components-styled/radio-group';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { InlineText, Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import { AllLanguages } from '~/locale/APP_LOCALE';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getNlData,
  getText
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import {
  formatDateFromMilliseconds,
  formatDateFromSeconds
} from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
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

  const vaccineDeliveryValues = data.vaccine_delivery.values;
  const vaccineDeliveryEstimateValues = data.vaccine_delivery_estimate.values;
  const vaccineAdministeredValues = data.vaccine_administered.values;
  const vaccineAdministeredEstimateValues =
    data.vaccine_administered_estimate.values;

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
          title="test"
          description="toelichting"
          metadata={{
            date: 1611593522,
            source: text.bronnen.rivm,
          }}
        >
          <Box>
            {' '}
            <ParentSize>
              {({ width }) => (
                <AreaChart<
                  NlVaccineDeliveryValue | NlVaccineDeliveryEstimateValue,
                  | NlVaccineAdministeredValue
                  | NlVaccineAdministeredEstimateValue
                >
                  width={width}
                  timeframe="all"
                  formatTooltip={createTooltipFormatter(siteText)}
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
                          color: '#F8E435',
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
                          legendLabel: text.data.vaccination_chart.estimated,
                          color: '#F8E435',
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
          <ParentSize>
            {({ width }) => (
              <LineChart
                timeframe="all"
                width={width}
                ariaLabelledBy="chart_vaccine_support"
                values={data.vaccine_support.values}
                linesConfig={[{ metricProperty: 'percentage_in_favor' }]}
                formatTooltip={(values) => {
                  const value = values[0];
                  const dateStartString = formatDateFromSeconds(
                    value.date_start_unix
                  );
                  const dateEndString = formatDateFromSeconds(
                    value.date_end_unix
                  );
                  return (
                    <Text m={0}>
                      <span style={{ fontWeight: 'bold' }}>
                        {`${dateStartString} - ${dateEndString}`}
                      </span>
                      <br />

                      {replaceVariablesInText(
                        siteText.common.tooltip.vaccinatie_bereidheid,
                        {
                          percentageInFavor: value.__value,
                        }
                      )}
                    </Text>
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
            <ul>
              {text.data.kpi_expected_page_additions.additions
                .filter((x) => x.length)
                .map((addition) => (
                  <li key={addition}>
                    <InlineText>{addition}</InlineText>
                  </li>
                ))}
            </ul>
          </KpiTile>
        </TwoKpiSection>
      </TileList>
    </>
  );
};

VaccinationPage.getLayout = getNationalLayout;

export type TooltipValue = (
  | NlVaccineDeliveryValue
  | NlVaccineDeliveryEstimateValue
  | NlVaccineAdministeredValue
  | NlVaccineAdministeredEstimateValue
) &
  TimestampedTrendValue;

function createTooltipFormatter(text: AllLanguages) {
  return (values: HoverPoint<TooltipValue>[]) => {
    return formatVaccinationsTooltip(values, text);
  };
}

function formatVaccinationsTooltip(
  values: HoverPoint<TooltipValue>[],
  text: AllLanguages
) {
  if (!values.length) {
    return null;
  }

  const data = values[0].data;

  if (isDateValue(data)) {
    return (
      <Box>
        <Text fontWeight="bold">
          {`${formatDateFromMilliseconds(data.__date.getTime())}: `}
        </Text>
        {values.map((value) => (
          <Box key={value.data.__value}>{formatNumber(value.data.__value)}</Box>
        ))}
      </Box>
    );
  } else if (isDateSpanValue(data)) {
    const dateStartString = formatDateFromSeconds(
      data.date_start_unix,
      'short'
    );
    const dateEndString = formatDateFromSeconds(data.date_end_unix, 'short');
    return (
      <Box>
        <Text fontWeight="bold">
          {`${dateStartString} - ${dateEndString}: `}
        </Text>
        {values.map((value) => (
          <Box key={`${value.label}-${value.data.__value}`}>
            {formatLabel(value.label, text)}: {formatValue(value)}
          </Box>
        ))}
      </Box>
    );
  }

  throw new Error(
    `Invalid value passed to format tooltip function: ${JSON.stringify(values)}`
  );
}

function formatLabel(labelKey: string | undefined, text: AllLanguages) {
  const labelText = labelKey
    ? (text.vaccinaties.data.vaccination_chart.product_names as any)[labelKey]
    : undefined;
  return labelText ?? labelKey;
}

function formatValue(value: HoverPoint<TooltipValue>) {
  const data: any = value.data;
  if (data.total) {
    return formatNumber(data.total);
  }
  return formatNumber(data[value.label as string]);
}

export default VaccinationPage;
