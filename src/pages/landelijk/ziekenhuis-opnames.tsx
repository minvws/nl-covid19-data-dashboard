import { useRouter } from 'next/router';
import { useState } from 'react';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Spacer } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/municipal/create-municipal-hospital-admissions-tooltip';
import { createRegionHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/region/create-region-hospital-admissions-tooltip';
import { ContentHeader_sourcesHack } from '~/components/contentHeader_sourcesHack';
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
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'municipal'
  );
  const router = useRouter();

  const dataIntake = data.intake_hospital_ma;
  const dataBeds = data.hospital_beds_occupied;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader_sourcesHack
        category={siteText.nationaal_layout.headings.ziekenhuizen}
        title={text.titel}
        icon={<Ziekenhuis />}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: dataIntake.last_value.date_of_report_unix,
          dateInsertedUnix: dataIntake.last_value.date_of_insertion_unix,
          dataSourceA: text.bronnen.rivm,
          dataSourceB: text.bronnen.lnaz,
        }}
        reference={text.reference}
      />
      <Spacer mb={4} />

      <TwoKpiSection>
        <KpiTile
          title={text.barscale_titel}
          description={text.extra_uitleg}
          metadata={{
            date: dataIntake.last_value.date_of_report_unix,
            source: text.bronnen.rivm,
          }}
        >
          <IntakeHospitalBarScale data={dataIntake} showAxis={true} />
        </KpiTile>

        <KpiTile
          title={text.kpi_bedbezetting.title}
          description={text.kpi_bedbezetting.description}
          metadata={{
            date: dataIntake.last_value.date_of_report_unix,
            source: text.bronnen.lnaz,
          }}
        >
          <KpiValue absolute={dataBeds.last_value.covid_occupied} />
        </KpiTile>
      </TwoKpiSection>

      <LineChartTile
        title={text.linechart_titel}
        description={text.linechart_description}
        values={dataIntake.values.map((value: any) => ({
          value: value.moving_average_hospital,
          date: value.date_of_report_unix,
        }))}
        signaalwaarde={40}
        metadata={{
          source: text.bronnen.rivm,
        }}
      />

      <LineChartTile
        title={text.chart_bedbezetting.title}
        description={text.chart_bedbezetting.description}
        values={dataBeds.values.map((value) => ({
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
          thresholds: regionThresholds.hospital_admissions,
          title: text.chloropleth_legenda.titel,
        }}
        metadata={{
          date: dataIntake.last_value.date_of_report_unix,
          source: text.bronnen.rivmSource,
        }}
        showDataWarning
      >
        {selectedMap === 'municipal' && (
          <MunicipalityChoropleth
            metricName="hospital_admissions"
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
            tooltipContent={createRegionHospitalAdmissionsTooltip(router)}
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
