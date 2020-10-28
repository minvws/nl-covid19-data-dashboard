import { useRouter } from 'next/router';
import { useState } from 'react';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Spacer } from '~/components-styled/base';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { ChartRegionControls } from '~/components-styled/chart-region-controls';
import { ChoroplethLegenda } from '~/components/choropleth/legenda/ChoroplethLegenda';
import { useSafetyRegionLegendaData } from '~/components/choropleth/legenda/hooks/useSafetyRegionLegendaData';
import { MunicipalityChoropleth } from '~/components/choropleth/MunicipalityChoropleth';
import { SafetyRegionChoropleth } from '~/components/choropleth/SafetyRegionChoropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/selectHandlers/createSelectMunicipalHandler';
import { createSelectRegionHandler } from '~/components/choropleth/selectHandlers/createSelectRegionHandler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/municipal/createMunicipalHospitalAdmissionsTooltip';
import { createRegionHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/region/createRegionHospitalAdmissionsTooltip';
import { ContentHeader_sourcesHack } from '~/components/contentHeader_sourcesHack';
import { IntakeHospitalBarScale } from '~/components/landelijk/intake-hospital-barscale';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { DataWarning } from '~/components/dataWarning';

const text = siteText.ziekenhuisopnames_per_dag;

const IntakeHospital: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'municipal'
  );
  const router = useRouter();
  const legendItems = useSafetyRegionLegendaData('hospital_admissions');
  const dataIntake = state.intake_hospital_ma;
  const dataBeds = state.hospital_beds_occupied;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader_sourcesHack
        category={siteText.nationaal_layout.headings.medisch}
        title={text.titel}
        Icon={Ziekenhuis}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: dataIntake.last_value.date_of_report_unix,
          dateInsertedUnix: dataIntake.last_value.date_of_insertion_unix,
          dataSourceA: text.bronnen.rivm,
          dataSourceB: text.bronnen.lnaz,
        }}
      />
      <Spacer mb={4} />

      <TwoKpiSection>
        <KpiTile
          title={text.barscale_titel}
          description={text.extra_uitleg}
          sourcedFrom={text.bronnen.rivm}
        >
          <IntakeHospitalBarScale data={dataIntake} showAxis={true} />
        </KpiTile>

        <KpiTile
          title={text.kpi_bedbezetting.title}
          description={text.kpi_bedbezetting.description}
          sourcedFrom={text.bronnen.lnaz}
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
        sourcedFrom={text.bronnen.rivm}
      />

      <LineChartTile
        title={text.chart_bedbezetting.title}
        description={text.chart_bedbezetting.description}
        values={dataBeds.values.map((value) => ({
          value: value.covid_occupied,
          date: value.date_of_report_unix,
        }))}
        sourcedFrom={text.bronnen.lnaz}
      />

      <article className="metric-article layout-choropleth">
        <div className="data-warning">
          <DataWarning />
        </div>
        <div className="choropleth-header">
          <h3>{text.map_titel}</h3>
          <p>{text.map_toelichting}</p>

          <div className="choropleth-controls">
            <ChartRegionControls
              onChange={(val: 'region' | 'municipal') => setSelectedMap(val)}
            />
          </div>
        </div>

        <div className="choropleth-chart">
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
        </div>

        <div className="choropleth-legend">
          {legendItems && (
            <ChoroplethLegenda
              items={legendItems}
              title={text.chloropleth_legenda.titel}
            />
          )}
        </div>
        <footer className="choropleth-footer">
          {siteText.common.metadata.source}:{' '}
          <a
            href={text.bronnen.rivmSource.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {text.bronnen.rivmSource.text}
          </a>
        </footer>
      </article>
    </>
  );
};

IntakeHospital.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default IntakeHospital;
