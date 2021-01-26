import { css } from '@styled-system/css';
import styled from 'styled-components';
import VaccinatieBarChart from '~/assets/vaccinate_bar_chart.svg';
import VaccinatieIcon from '~/assets/vaccinaties.svg';
import { Box } from '~/components-styled/base';
import { ChartTile } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { SEOHead } from '~/components-styled/seo-head';
import { StackedChart } from '~/components-styled/stacked-chart';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  getLastGeneratedDate,
  getNlData,
  getText,
} from '~/static-props/get-data';
import { formatNumber } from '~/utils/formatNumber';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  getText
);

const VaccinationPage: FCWithLayout<typeof getStaticProps> = ({
  text: siteText,
}) => {
  const text = siteText.vaccinaties;

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
        <TwoKpiSection>
          <KpiTile
            title={text.data.kpi_total.title}
            metadata={{
              date: parseFloat(text.data.kpi_total.date_of_report_unix),
              source: text.bronnen.all_left,
            }}
          >
            <KpiValue absolute={parseFloat(text.data.kpi_total.value)} />
            <Text mb={3}>{text.data.kpi_total.description_first}</Text>
            {text.data.kpi_total.administered.map((item, index) => (
              <>
                {item.value && item.description && (
                  <Heading
                    key={index}
                    level={4}
                    fontSize={'1.1em'}
                    mt={3}
                    mb={0}
                  >
                    <span css={css({ color: 'data.primary' })}>
                      {formatNumber(parseFloat(item.value))}
                    </span>
                    {` ${item.description}`}
                  </Heading>
                )}
              </>
            ))}
            <Text mb={3}>{text.data.kpi_total.description_second}</Text>
          </KpiTile>

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

            <Heading level={3} mt={4}>
              {text.section_vaccinations_more_information.title}
            </Heading>
            <Text
              mb={0}
              as={StyledParagraph}
              dangerouslySetInnerHTML={{
                __html: text.section_vaccinations_more_information.description,
              }}
            />
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
          <StackedChart
            width={700}
            valueAnnotation={siteText.waarde_annotaties.x_miljoen}
            values={[
              {
                pfizer: 10.2,
                moderna: 20.5,
                astra_zeneca: 3.6,
                cure_vac: 0,
                janssen: 0,
                sanofi: 15.2,
                date_of_insertion_unix: 0,
                date_unix: Date.parse('25 January 2021 00:00 UTC') / 1000,
              },
              {
                pfizer: 2.2,
                moderna: 10.7,
                astra_zeneca: 4.6,
                cure_vac: 0,
                janssen: 20.2,
                sanofi: 5.1,
                date_of_insertion_unix: 0,
                date_unix: Date.parse('01 February 2021 00:00 UTC') / 1000,
              },
              {
                pfizer: 13.5,
                moderna: 4.1,
                astra_zeneca: 15.8,
                cure_vac: 3.7,
                janssen: 1.9,
                sanofi: 0.2,
                date_of_insertion_unix: 0,
                date_unix: Date.parse('08 February 2021 00:00 UTC') / 1000,
              },
              {
                pfizer: 10.2,
                moderna: 20.5,
                astra_zeneca: 3.6,
                cure_vac: 0,
                janssen: 0,
                sanofi: 15.2,
                date_of_insertion_unix: 0,
                date_unix: Date.parse('15 February 2021 00:00 UTC') / 1000,
              },
              {
                pfizer: 2.2,
                moderna: 10.7,
                astra_zeneca: 4.6,
                cure_vac: 0,
                janssen: 20.2,
                sanofi: 5.1,
                date_of_insertion_unix: 0,
                date_unix: Date.parse('22 February 2021 00:00 UTC') / 1000,
              },
              {
                pfizer: 13.5,
                moderna: 4.1,
                astra_zeneca: 15.8,
                cure_vac: 3.7,
                janssen: 1.9,
                sanofi: 0.2,
                date_of_insertion_unix: 0,
                date_unix: Date.parse('01 March 2021 00:00 UTC') / 1000,
              },
            ]}
            config={[
              {
                metricProperty: 'astra_zeneca',
                color: '#007AEA',
                legendLabel: 'Astra Zeneca',
              },

              {
                metricProperty: 'pfizer',
                color: '#6AB4F9',
                legendLabel: 'BioTech Pfizer',
              },
              {
                metricProperty: 'cure_vac',
                color: '#C263EF',
                legendLabel: 'Curevac',
              },
              {
                metricProperty: 'janssen',
                color: '#C8AEFF',
                legendLabel: 'Janssen',
              },
              {
                metricProperty: 'moderna',
                color: '#00BBB5',
                legendLabel: 'Moderna',
              },
              {
                metricProperty: 'sanofi',
                color: '#96E4E4',
                legendLabel: 'Sanofi',
              },
            ]}
          />
        </ChartTile>

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
          <Box pt={1}>
            <VaccinatieBarChart />
          </Box>
        </ChartTile>
      </TileList>
    </>
  );
};

const StyledParagraph = styled.div(
  css({
    p: {
      marginBottom: 0,
    },
    ul: {
      marginTop: 0,
      paddingLeft: '1.2rem',
    },
  })
);

VaccinationPage.getLayout = getNationalLayout;

export default VaccinationPage;
