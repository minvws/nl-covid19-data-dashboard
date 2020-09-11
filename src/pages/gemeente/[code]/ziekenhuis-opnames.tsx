import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getMunicipalityLayout } from 'components/layout/MunicipalityLayout';
import { ContentHeader } from 'components/layout/Content';

import Ziekenhuis from 'assets/ziekenhuis.svg';

import siteText from 'locale';

import { HospitalAdmissions } from 'types/data';
import { LineChart } from 'components/charts/index';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from 'static-props/municipality-data';

import { getLocalTitleForMuncipality } from 'utils/getLocalTitleForCode';
import MunicipalityMap from 'components/vx/MunicipalityMap';
const text: typeof siteText.gemeente_ziekenhuisopnames_per_dag =
  siteText.gemeente_ziekenhuisopnames_per_dag;

import styles from 'components/vx/chloropleth.module.scss';

const tooltipContent = (context: any) => {
  return (
    context && (
      <div className={styles.defaultTooltip}>
        <strong>{context.gemnaam}</strong>
        <br />
        {context.value}
      </div>
    )
  );
};

export function IntakeHospitalBarScale(props: {
  data: HospitalAdmissions | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      signaalwaarde={40}
      screenReaderText={text.screen_reader_graph_content}
      value={data.last_value.moving_average_hospital}
      id="opnames"
      rangeKey="moving_average_hospital"
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#D3A500',
          value: 40,
        },
        {
          color: '#f35065',
          value: 90,
        },
      ]}
      showAxis={showAxis}
    />
  );
}

const IntakeHospital: FCWithLayout<IMunicipalityData> = (props) => {
  const { data } = props;

  const hospitalAdmissions: HospitalAdmissions | undefined =
    data?.hospital_admissions;

  return (
    <>
      <ContentHeader
        category="Medische indicatoren"
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

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>

        {hospitalAdmissions && (
          <>
            <LineChart
              values={hospitalAdmissions.values.map((value: any) => ({
                value: value.moving_average_hospital,
                date: value.date_of_report_unix,
              }))}
              signaalwaarde={40}
            />
          </>
        )}
      </article>

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{getLocalTitleForMuncipality(text.map_titel, data.code)}</h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="column-item column-item-extra-margin">
          <MunicipalityMap
            selected={data.code}
            metric="hospital_admissions"
            gradient={['#D2F3FF', '#005684']}
            tooltipContent={tooltipContent}
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
