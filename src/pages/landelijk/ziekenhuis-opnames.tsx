import useSWR from 'swr';

import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart } from 'components/tiles/index';
import { ContentHeader } from 'components/layout/Content';

import Ziekenhuis from 'assets/ziekenhuis.svg';

import siteText from 'locale';

import { IntakeHospitalMa } from 'types/data';
import MunicipalityMap from 'components/mapChart';

const text: typeof siteText.ziekenhuisopnames_per_dag =
  siteText.ziekenhuisopnames_per_dag;

export function IntakeHospitalBarScale(props: {
  data: IntakeHospitalMa | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      signaalwaarde={40}
      screenReaderText={text.barscale_screenreader_text}
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
    />
  );
}

const IntakeHospital: FCWithLayout = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const data: IntakeHospitalMa | undefined = state?.intake_hospital_ma;

  return (
    <>
      <ContentHeader
        category="Medische indicatoren"
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

          <IntakeHospitalBarScale data={data} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.map_titel}</h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="column-item column-item-extra-margin">
          <MunicipalityMap
            metric="hospital_admissions"
            gradient={['#69c253', '#f35065']}
          />
        </div>
      </article>

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>

        {data && (
          <>
            <LineChart
              values={data.values.map((value: any) => ({
                value: value.moving_average_hospital,
                date: value.date_of_report_unix,
              }))}
              signaalwaarde={40}
            />
          </>
        )}
      </article>
    </>
  );
};

IntakeHospital.getLayout = getNationalLayout();

export default IntakeHospital;
