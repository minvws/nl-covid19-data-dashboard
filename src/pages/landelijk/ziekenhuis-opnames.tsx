import { useRouter } from 'next/router';
import { useState } from 'react';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
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
import { IntakeHospitalBarScale } from '~/components/landelijk/intake-hospital-barscale';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { formatNumber } from '~/utils/formatNumber';

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

      <div className="layout-two-column">
        <article className="metric-article column-item">
          <h3>{text.barscale_titel}</h3>

          <IntakeHospitalBarScale data={dataIntake} showAxis={true} />
          <p>{text.extra_uitleg}</p>
          <footer className="article-footer">
            {siteText.common.metadata.source}:{' '}
            <a href={text.bronnen.rivm.href}>{text.bronnen.rivm.text}</a>
          </footer>
        </article>

        <article className="metric-article column-item">
          <div className="article-top">
            <h3>{text.kpi_bedbezetting.title}</h3>
            <div className="text-blue kpi">
              {formatNumber(dataBeds.last_value.covid_occupied)}
            </div>
            <p>{text.kpi_bedbezetting.description}</p>
          </div>
          <footer className="article-footer">
            {siteText.common.metadata.source}:{' '}
            <a href={text.bronnen.lnaz.href}>{text.bronnen.lnaz.text}</a>
          </footer>
        </article>
      </div>

      <article className="metric-article layout-chloropleth">
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
        <footer className="article-footer">
          {siteText.common.metadata.source}:{' '}
          <a href={text.bronnen.rivm.href}>{text.bronnen.rivm.text}</a>
        </footer>
      </article>

      <article className="metric-article">
        <LineChart
          title={text.linechart_titel}
          values={dataIntake.values.map((value: any) => ({
            value: value.moving_average_hospital,
            date: value.date_of_report_unix,
          }))}
          signaalwaarde={40}
        />
        <footer className="article-footer">
          {siteText.common.metadata.source}:{' '}
          <a href={text.bronnen.rivm.href}>{text.bronnen.rivm.text}</a>
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
          <a href={text.bronnen.lnaz.href}>{text.bronnen.lnaz.text}</a>
        </footer>
      </article>
    </>
  );
};

IntakeHospital.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default IntakeHospital;
