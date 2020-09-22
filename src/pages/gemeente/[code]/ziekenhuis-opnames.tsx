import { FCWithLayout } from '~/components/layout';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';
import { ContentHeader } from '~/components/layout/Content';

import Ziekenhuis from '~/assets/ziekenhuis.svg';

import siteText from '~/locale/index';

import { HospitalAdmissions } from '~/types/data.d';
import { LineChart } from '~/components/charts/index';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';

import { IntakeHospitalBarScale } from '~/components/gemeente/intake-hospital-barscale';

import { getLocalTitleForMuncipality } from '~/utils/getLocalTitleForCode';

const text: typeof siteText.gemeente_ziekenhuisopnames_per_dag =
  siteText.gemeente_ziekenhuisopnames_per_dag;

import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { hospitalAdmissionsTooltip } from '~/components/chloropleth/tooltips/municipal/hospitalAdmissionsTooltip';
import { MunicipalityLegenda } from '~/components/chloropleth/legenda/MunicipalityLegenda';

const IntakeHospital: FCWithLayout<IMunicipalityData> = (props) => {
  const { data } = props;

  const hospitalAdmissions: HospitalAdmissions | undefined =
    data?.hospital_admissions;

  return (
    <>
      <ContentHeader
        category={siteText.gemeente_layout.headings.medisch}
        title={getLocalTitleForMuncipality(text.titel, data.code)}
        Icon={Ziekenhuis}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: hospitalAdmissions?.last_value?.date_of_report_unix,
          dateInsertedUnix:
            hospitalAdmissions?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <IntakeHospitalBarScale data={hospitalAdmissions} showAxis={true} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      {hospitalAdmissions && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            values={hospitalAdmissions.values.map((value: any) => ({
              value: value.moving_average_hospital,
              date: value.date_of_report_unix,
            }))}
          />
        </article>
      )}

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{getLocalTitleForMuncipality(text.map_titel, data.code)}</h3>
          <p>{text.map_toelichting}</p>

          <MunicipalityLegenda
            metricName="hospital_admissions"
            title={siteText.ziekenhuisopnames_per_dag.chloropleth_legenda.titel}
          />
        </div>

        <div className="column-item column-item-extra-margin">
          <MunicipalityChloropleth
            selected={data.code}
            metricName="hospital_admissions"
            tooltipContent={hospitalAdmissionsTooltip}
          />
        </div>
      </article>
    </>
  );
};

IntakeHospital.getLayout = getMunicipalityLayout();

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default IntakeHospital;
