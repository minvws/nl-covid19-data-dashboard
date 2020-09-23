import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { LineChart } from '~/components/charts/index';
import { ContentHeader } from '~/components/layout/Content';

import { IntakeHospitalBarScale } from '~/components/landelijk/intake-hospital-barscale';

import Ziekenhuis from '~/assets/ziekenhuis.svg';

import siteText from '~/locale/index';

import { IntakeHospitalMa } from '~/types/data.d';
import { useState } from 'react';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { ChartRegionControls } from '~/components/chartRegionControls';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { SafetyRegionChloropleth } from '~/components/chloropleth/SafetyRegionChloropleth';
import { MunicipalityLegenda } from '~/components/chloropleth/legenda/MunicipalityLegenda';
import { SafetyRegionLegenda } from '~/components/chloropleth/legenda/SafetyRegionLegenda';
import { hospitalAdmissionsTooltip } from '~/components/chloropleth/tooltips/municipal/hospitalAdmissionsTooltip';
import { hospitalAdmissionsTooltip as regionHospitalAdmissionsTooltip } from '~/components/chloropleth/tooltips/region/hospitalAdmissionsTooltip';
import { onSelectMunicipal } from '~/components/chloropleth/selectHandlers/onSelectMunicipal';
import { useRouter } from 'next/router';
import { onSelectRegion } from '~/components/chloropleth/selectHandlers/onSelectRegion';

const text: typeof siteText.ziekenhuisopnames_per_dag =
  siteText.ziekenhuisopnames_per_dag;

const IntakeHospital: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'municipal'
  );
  const router = useRouter();

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

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.map_titel}</h3>
          <p>{text.map_toelichting}</p>
          <ChartRegionControls
            onChange={(val: 'region' | 'municipal') => setSelectedMap(val)}
          />
          {selectedMap === 'municipal' && (
            <MunicipalityLegenda
              metricName="hospital_admissions"
              title={text.chloropleth_legenda.titel}
            />
          )}

          {selectedMap === 'region' && (
            <SafetyRegionLegenda
              metricName="hospital_admissions"
              title={text.chloropleth_legenda.titel}
            />
          )}
        </div>

        <div className="column-item column-item-extra-margin">
          {selectedMap === 'municipal' && (
            <MunicipalityChloropleth
              metricName="hospital_admissions"
              tooltipContent={hospitalAdmissionsTooltip}
              onSelect={onSelectMunicipal(router)}
            />
          )}
          {selectedMap === 'region' && (
            <SafetyRegionChloropleth
              metricName="hospital_admissions"
              tooltipContent={regionHospitalAdmissionsTooltip}
              onSelect={onSelectRegion(router)}
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
