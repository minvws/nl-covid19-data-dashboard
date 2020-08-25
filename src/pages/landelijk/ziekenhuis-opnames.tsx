import useSWR from 'swr';

import BarScale from 'components/barScale';
import Metadata from 'components/metadata';
import TitleWithIcon from 'components/titleWithIcon';
import DateReported from 'components/dateReported';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart } from 'components/tiles/index';

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
    />
  );
}

const IntakeHospital: FCWithLayout = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const data: IntakeHospitalMa | undefined = state?.intake_hospital_ma;

  return (
    <>
      <TitleWithIcon Icon={Ziekenhuis} title={text.title} as="h2" />
      <article className="metric-article">
        <p>{text.text}</p>

        <IntakeHospitalBarScale data={data} />

        {data?.last_value?.moving_average_hospital !== null && (
          <DateReported
            datumsText={text.datums}
            dateUnix={data?.last_value?.date_of_report_unix}
          />
        )}

        <h3>{text.fold_title}</h3>
        <p>{text.fold}</p>

        <MunicipalityMap
          metric="Hospital_admission"
          gradient={['#69c253', '#f35065']}
        />
      </article>

      <article className="metric-article">
        <h3>{text.graph_title}</h3>

        {data && (
          <>
            <LineChart
              values={data.values.map((value: any) => ({
                value: value.moving_average_hospital,
                date: value.date_of_report_unix,
              }))}
              signaalwaarde={40}
            />

            <Metadata dataSource={text.bron} />
          </>
        )}
      </article>
    </>
  );
};

IntakeHospital.getLayout = getNationalLayout();

export default IntakeHospital;
