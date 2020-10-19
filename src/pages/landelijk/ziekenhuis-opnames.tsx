import { useRouter } from 'next/router';
import { useState } from 'react';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Spacer } from '~/components-styled/base';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { ChartRegionControls } from '~/components/chartRegionControls';
import { LineChart } from '~/components/charts/index';
import { ChloroplethLegenda } from '~/components/chloropleth/legenda/ChloroplethLegenda';
import { useSafetyRegionLegendaData } from '~/components/chloropleth/legenda/hooks/useSafetyRegionLegendaData';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { SafetyRegionChloropleth } from '~/components/chloropleth/SafetyRegionChloropleth';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { createSelectRegionHandler } from '~/components/chloropleth/selectHandlers/createSelectRegionHandler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/chloropleth/tooltips/municipal/createMunicipalHospitalAdmissionsTooltip';
import { createRegionHospitalAdmissionsTooltip } from '~/components/chloropleth/tooltips/region/createRegionHospitalAdmissionsTooltip';
import { ContentHeaderMetadataHack } from '~/components/contentHeaderMetadataHack';
import { DataWarning } from '~/components/dataWarning';
import { IntakeHospitalBarScale } from '~/components/landelijk/intake-hospital-barscale';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';

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
      <ContentHeaderMetadataHack
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

      <article className="metric-article">
        <LineChart
          title={text.linechart_titel}
          description={text.linechart_description}
          values={dataIntake.values.map((value: any) => ({
            value: value.moving_average_hospital,
            date: value.date_of_report_unix,
          }))}
          signaalwaarde={40}
        />
        <footer className="article-footer">
          {siteText.common.metadata.source}:{' '}
          <a
            href={text.bronnen.rivm.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {text.bronnen.rivm.text}
          </a>
        </footer>
      </article>

      <article className="metric-article">
        <LineChart
          title={text.chart_bedbezetting.title}
          description={text.chart_bedbezetting.description}
          values={dataBeds.values.map((value) => ({
            value: value.covid_occupied,
            date: value.date_of_report_unix,
          }))}
        />
        <footer className="article-footer">
          {siteText.common.metadata.source}:{' '}
          <a
            href={text.bronnen.lnaz.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {text.bronnen.lnaz.text}
          </a>
        </footer>
      </article>

      <article className="metric-article layout-chloropleth">
        <div className="data-warning">
          <DataWarning />
        </div>
        <div className="chloropleth-header">
          <h3>{text.map_titel}</h3>
          <p>{text.map_toelichting}</p>

          <div className="chloropleth-controls">
            <ChartRegionControls
              onChange={(val: 'region' | 'municipal') => setSelectedMap(val)}
            />
          </div>
        </div>

        <div className="chloropleth-chart">
          {selectedMap === 'municipal' && (
            <MunicipalityChloropleth
              metricName="hospital_admissions"
              tooltipContent={createMunicipalHospitalAdmissionsTooltip(router)}
              onSelect={createSelectMunicipalHandler(
                router,
                'ziekenhuis-opnames'
              )}
            />
          )}
          {selectedMap === 'region' && (
            <SafetyRegionChloropleth
              metricName="hospital_admissions"
              tooltipContent={createRegionHospitalAdmissionsTooltip(router)}
              onSelect={createSelectRegionHandler(router, 'ziekenhuis-opnames')}
            />
          )}
        </div>

        <div className="chloropleth-legend">
          {legendItems && (
            <ChloroplethLegenda
              items={legendItems}
              title={text.chloropleth_legenda.titel}
            />
          )}
        </div>
        <footer className="chloropleth-footer">
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
