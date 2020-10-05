import { useState } from 'react';
import { useRouter } from 'next/router';

import siteText from '~/locale/index';
import { IntakeHospitalMa } from '~/types/data.d';
import getNlData, { INationalData } from '~/static-props/nl-data';

import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { LineChart } from '~/components/charts/index';
import { ContentHeader } from '~/components/layout/Content';
import { IntakeHospitalBarScale } from '~/components/landelijk/intake-hospital-barscale';
import { ChartRegionControls } from '~/components/chartRegionControls';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { SafetyRegionChloropleth } from '~/components/chloropleth/SafetyRegionChloropleth';
import { ChloroplethLegenda } from '~/components/chloropleth/legenda/ChloroplethLegenda';
import { hospitalAdmissionsTooltip } from '~/components/chloropleth/tooltips/municipal/hospitalAdmissionsTooltip';
import { hospitalAdmissionsTooltip as regionHospitalAdmissionsTooltip } from '~/components/chloropleth/tooltips/region/hospitalAdmissionsTooltip';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { createSelectRegionHandler } from '~/components/chloropleth/selectHandlers/createSelectRegionHandler';
import { useSafetyRegionLegendaData } from '~/components/chloropleth/legenda/hooks/useSafetyRegionLegendaData';

import Ziekenhuis from '~/assets/ziekenhuis.svg';

const text: typeof siteText.ziekenhuisopnames_per_dag =
  siteText.ziekenhuisopnames_per_dag;

const IntakeHospital: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'municipal'
  );
  const router = useRouter();
  const legendItems = useSafetyRegionLegendaData('hospital_admissions');
  const data: IntakeHospitalMa | undefined = state?.intake_hospital_ma;

  return (
    <>
      <ContentHeader
        category={siteText.nationaal_layout.headings.medisch}
        title={text.titel}
        Icon={Ziekenhuis}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data?.last_value?.date_of_report_unix,
          dateInsertedUnix: data?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <IntakeHospitalBarScale data={data} showAxis={true} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

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
              tooltipContent={hospitalAdmissionsTooltip}
              onSelect={createSelectMunicipalHandler(
                router,
                'ziekenhuis-opnames'
              )}
            />
          )}
          {selectedMap === 'region' && (
            <SafetyRegionChloropleth
              metricName="hospital_admissions"
              tooltipContent={regionHospitalAdmissionsTooltip}
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
      </article>

      {data && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            values={data.values.map((value: any) => ({
              value: value.moving_average_hospital,
              date: value.date_of_report_unix,
            }))}
            signaalwaarde={40}
          />
        </article>
      )}
    </>
  );
};

IntakeHospital.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default IntakeHospital;
