import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Box, Spacer } from '~/components-styled/base';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Tile } from '~/components-styled/layout';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { IntakeHospitalBarScale } from '~/components/landelijk/intake-hospital-barscale';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getNationalStaticProps,
  NationalPageProps,
} from '~/static-props/nl-data';

const text = siteText.ziekenhuisopnames_per_dag;

const IntakeHospital: FCWithLayout<NationalPageProps> = (props) => {
  const { data } = props;

  const lastValue = data.hospital.last_value;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.ziekenhuizen}
        screenreaderCategory={siteText.ziekenhuisopnames_per_dag.titel_sidebar}
        title={text.titel}
        icon={<Ziekenhuis />}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateInfo: lastValue.date_of_report_unix,
          dateOfInsertionUnix: lastValue.date_of_insertion_unix,
          dataSources: [text.bronnen.nice, text.bronnen.lnaz],
        }}
        reference={text.reference}
      />
      <Spacer mb={4} />

      <TwoKpiSection>
        <KpiTile
          title={text.barscale_titel}
          description={text.extra_uitleg}
          metadata={{
            date: lastValue.date_of_report_unix,
            source: text.bronnen.nice,
          }}
        >
          <IntakeHospitalBarScale
            data={data}
            showAxis={true}
            showValue={true}
          />
        </KpiTile>

        <KpiTile
          title={text.kpi_bedbezetting.title}
          description={text.kpi_bedbezetting.description}
          metadata={{
            date: lastValue.date_of_report_unix,
            source: text.bronnen.lnaz,
          }}
        >
          <KpiValue
            data-cy="covid_occupied"
            absolute={lastValue.beds_occupied_covid}
          />
        </KpiTile>
      </TwoKpiSection>

      <LineChartTile
        title={text.linechart_titel}
        description={text.linechart_description}
        values={data.hospital.values.map((value) => ({
          value: value.admissions_moving_average,
          date: value.date_of_report_unix,
        }))}
        signaalwaarde={40}
        metadata={{
          source: text.bronnen.nice,
        }}
      />

      <LineChartTile
        title={text.chart_bedbezetting.title}
        description={text.chart_bedbezetting.description}
        values={data.hospital.values.map((value) => ({
          value: value.beds_occupied_covid,
          date: value.date_of_report_unix,
        }))}
        metadata={{
          source: text.bronnen.lnaz,
        }}
      />
      {/*
      <ChoroplethTile
        title={text.map_titel}
        description={text.map_toelichting}
        onChangeControls={setSelectedMap}
        legend={{
          thresholds: regionThresholds.hospital_admissions.hospital_admissions,
          title: text.chloropleth_legenda.titel,
        }}
        metadata={{
          date: lastValue.date_of_report_unix,
          source: text.bronnen.nice,
        }}
        showDataWarning
      >
        {selectedMap === 'municipal' && (
          <MunicipalityChoropleth
            metricName="hospital_admissions"
            metricProperty="hospital_admissions"
            tooltipContent={createMunicipalHospitalAdmissionsTooltip(router)}
            onSelect={createSelectMunicipalHandler(
              router,
              'ziekenhuis-opnames'
            )}
          />
        )}
        {selectedMap === 'region' && (
          <SafetyRegionChoropleth
            metricName="hospital_admissions"
            metricProperty="hospital_admissions"
            tooltipContent={createRegionHospitalAdmissionsTooltip(router)}
            onSelect={createSelectRegionHandler(router, 'ziekenhuis-opnames')}
          />
        )}
      </ChoroplethTile>
        */}
      <Tile>
        <Heading level={3}>{text.tijdelijk_onbeschikbaar_titel}</Heading>
        <Box width="70%">
          <Text>{text.tijdelijk_onbeschikbaar}</Text>
        </Box>
      </Tile>
    </>
  );
};

IntakeHospital.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default IntakeHospital;
