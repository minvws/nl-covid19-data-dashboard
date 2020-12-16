import { useRouter } from 'next/router';
import { useState } from 'react';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Spacer } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { PageBarScale } from '~/components-styled/page-barscale';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/municipal/create-municipal-hospital-admissions-tooltip';
import { createRegionHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/region/create-region-hospital-admissions-tooltip';
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
  const router = useRouter();
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'municipal'
  );
  const dataHospitalIntake = data.intake_hospital_ma;
  const dataHospitalBeds = data.hospital_beds_occupied;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.ziekenhuizen}
        screenReaderCategory={siteText.ziekenhuisopnames_per_dag.titel_sidebar}
        title={text.titel}
        icon={<Ziekenhuis />}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateInfo: dataHospitalIntake.last_value.date_of_report_unix,
          dateOfInsertionUnix:
            dataHospitalIntake.last_value.date_of_insertion_unix,
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
            date: dataHospitalIntake.last_value.date_of_report_unix,
            source: text.bronnen.nice,
          }}
        >
          <PageBarScale
            data={data}
            scope="nl"
            metricName="intake_hospital_ma"
            metricProperty="moving_average_hospital"
            localeTextKey="ziekenhuisopnames_per_dag"
            differenceKey="intake_hospital_ma__moving_average_hospital"
          />
        </KpiTile>

        <KpiTile
          title={text.kpi_bedbezetting.title}
          description={text.kpi_bedbezetting.description}
          metadata={{
            date: dataHospitalBeds.last_value.date_of_report_unix,
            source: text.bronnen.lnaz,
          }}
        >
          <KpiValue
            data-cy="covid_occupied"
            absolute={dataHospitalBeds.last_value.covid_occupied}
            difference={data.difference.hospital_beds_occupied__covid_occupied}
          />
        </KpiTile>
      </TwoKpiSection>

      <LineChartTile
        title={text.linechart_titel}
        description={text.linechart_description}
        values={dataHospitalIntake.values.map((value: any) => ({
          value: value.moving_average_hospital,
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
        values={dataHospitalBeds.values.map((value) => ({
          value: value.covid_occupied,
          date: value.date_of_report_unix,
        }))}
        metadata={{
          source: text.bronnen.lnaz,
        }}
      />

      <ChoroplethTile
        title={text.map_titel}
        description={text.map_toelichting}
        onChangeControls={setSelectedMap}
        legend={{
          thresholds: regionThresholds.hospital_admissions.hospital_admissions,
          title: text.chloropleth_legenda.titel,
        }}
        metadata={{
          date: dataHospitalIntake.last_value.date_of_report_unix,
          source: text.bronnen.nice,
        }}
        showDataWarning
      >
        {selectedMap === 'municipal' && (
          <MunicipalityChoropleth
            metricName="hospital_admissions"
            metricProperty="hospital_admissions"
            tooltipContent={createMunicipalHospitalAdmissionsTooltip(
              createSelectMunicipalHandler(router, 'ziekenhuis-opnames')
            )}
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
            tooltipContent={createRegionHospitalAdmissionsTooltip(
              createSelectRegionHandler(router, 'ziekenhuis-opnames')
            )}
            onSelect={createSelectRegionHandler(router, 'ziekenhuis-opnames')}
          />
        )}
      </ChoroplethTile>
    </>
  );
};

IntakeHospital.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default IntakeHospital;
