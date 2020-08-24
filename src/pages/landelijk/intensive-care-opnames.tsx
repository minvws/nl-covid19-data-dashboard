import useSWR from 'swr';

import BarScale from 'components/barScale';
import Metadata from 'components/metadata';
import TitleWithIcon from 'components/titleWithIcon';
import DateReported from 'components/dateReported';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart } from 'components/tiles/index';

import Arts from 'assets/arts.svg';

import siteText from 'locale';

import { IntakeIntensivecareMa } from 'types/data';

const text: typeof siteText.ic_opnames_per_dag = siteText.ic_opnames_per_dag;

export function IntakeIntensiveCareBarscale(props: {
  data: IntakeIntensivecareMa | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={30}
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#D3A500',
          value: 10,
        },
        {
          color: '#f35065',
          value: 20,
        },
      ]}
      rangeKey="moving_average_ic"
      screenReaderText={text.screen_reader_graph_content}
      signaalwaarde={10}
      value={data.last_value.moving_average_ic}
      id="ic"
    />
  );
}

const IntakeIntensiveCare: FCWithLayout = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const data: IntakeIntensivecareMa | undefined =
    state?.intake_intensivecare_ma;

  return (
    <>
      <TitleWithIcon Icon={Arts} title={text.title} as="h2" />

      <article className="metric-article">
        <p>{text.text}</p>

        <IntakeIntensiveCareBarscale data={data} />

        {data?.last_value?.moving_average_ic !== null && (
          <DateReported
            datumsText={text.datums}
            dateUnix={data?.last_value?.date_of_report_unix}
          />
        )}

        <h3>{text.fold_title}</h3>
        <p>{text.fold}</p>
      </article>

      <article className="metric-article">
        <h3>{text.graph_title}</h3>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: value.moving_average_ic,
                date: value.date_of_report_unix,
              }))}
              signaalwaarde={10}
            />

            <Metadata dataSource={text.bron} />
          </>
        )}
      </article>
    </>
  );
};

IntakeIntensiveCare.getLayout = getNationalLayout();

export default IntakeIntensiveCare;
