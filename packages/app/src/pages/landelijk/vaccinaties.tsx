import { css } from '@styled-system/css';
import { ParentSize } from '@visx/responsive';
import { Fragment, useState } from 'react';
import VaccinatieIcon from '~/assets/vaccinaties.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { ChartTile } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { RadioGroup } from '~/components-styled/radio-group';
import { SEOHead } from '~/components-styled/seo-head';
import { StackedChart } from '~/components-styled/stacked-chart';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { InlineText, Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getNlData,
  getText,
} from '~/static-props/get-data';
import { formatNumber } from '~/utils/formatNumber';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  getText,
  createGetContent<{
    articles?: ArticleSummary[];
  }>(createPageArticlesQuery('vaccinationsPage'))
);

const VaccinationPage: FCWithLayout<typeof getStaticProps> = ({
  data,
  text: siteText,
  content,
}) => {
  const text = siteText.vaccinaties;
  const [selectedTab, setSelectedTab] = useState(
    text.data.kpi_total.first_tab_title
  );

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
          description={text.grafiek.omschrijving}
          ariaDescription={
            siteText.accessibility.grafieken.verwachte_leveringen
          }
          metadata={{
            date: 1611593522,
            source: text.bronnen.rivm,
          }}
        >
          <ParentSize>
            {({ width }) => (
              <StackedChart
                width={width}
                valueAnnotation={siteText.waarde_annotaties.x_100k}
                values={data.vaccine_delivery.values}
                config={[
                  {
                    metricProperty: 'pfizer',
                    color: '#007BC7',
                    legendLabel: 'BioNTech/Pfizer',
                  },
                  {
                    metricProperty: 'moderna',
                    color: '#00BBB5',
                    legendLabel: 'Moderna',
                  },
                ]}
              />
            )}
          </ParentSize>
        </ChartTile>

        <TwoKpiSection>
          <KpiTile
            title={text.data.kpi_expected_delivery.title}
            metadata={{
              date: parseFloat(
                text.data.kpi_expected_delivery.date_of_report_unix
              ),
              source: text.bronnen.all_right,
            }}
          >
            <KpiValue
              absolute={parseFloat(text.data.kpi_expected_delivery.value)}
            />
            <Text mb={4}>{text.data.kpi_expected_delivery.description}</Text>
          </KpiTile>
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

export default VaccinationPage;
