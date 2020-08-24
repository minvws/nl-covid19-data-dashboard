import useSWR from 'swr';

import BarScale from 'components/barScale';
import Metadata from 'components/metadata';
import Legenda from 'components/legenda';
import TitleWithIcon from 'components/titleWithIcon';
import DateReported from 'components/dateReported';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { AreaChart } from 'components/tiles/index';

import Repro from 'assets/reproductiegetal.svg';

import siteText from 'locale';

import { ReproductionIndex as ReproductionIndexData } from 'types/data';

const text: typeof siteText.reproductiegetal = siteText.reproductiegetal;

export function ReproductionIndexBarScale(props: {
  data: ReproductionIndexData | undefined;
  lastKnown: ReproductionIndexData | undefined;
}) {
  const { data, lastKnown } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={2}
      screenReaderText={text.screen_reader_graph_content}
      signaalwaarde={1}
      value={lastKnown?.last_value?.reproduction_index_avg}
      id="repro"
      rangeKey="reproduction_index_avg"
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#69c253',
          value: 1,
        },
        {
          color: '#D3A500',
          value: 1.0104,
        },
        {
          color: '#f35065',
          value: 1.125,
        },
      ]}
    />
  );
}

const ReproductionIndex: FCWithLayout = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const lastKnownValidData: ReproductionIndexData | undefined =
    state?.reproduction_index_last_known_average;

  const data: ReproductionIndexData | undefined = state?.reproduction_index;

  return (
    <>
      <TitleWithIcon Icon={Repro} title={text.title} as="h2" />

      <article className="metric-article">
        <p>{text.text}</p>

        <ReproductionIndexBarScale
          data={state}
          lastKnown={lastKnownValidData}
        />

        <DateReported
          datumsText={text.datums}
          dateUnix={lastKnownValidData?.last_value?.date_of_report_unix}
          dateInsertedUnix={
            lastKnownValidData?.last_value?.date_of_insertion_unix
          }
        />

        <h3>{text.fold_title}</h3>
        <p>{text.fold}</p>

        <img
          width={315}
          height={100}
          loading="lazy"
          src="/images/reproductie-explainer.svg"
          alt={text.reproductie_explainer_alt}
        />
      </article>

      <article className="metric-article">
        <h3>{text.graph_title}</h3>
        {data?.values && (
          <AreaChart
            data={data.values.map((value) => ({
              avg: value.reproduction_index_avg,
              min: value.reproduction_index_low,
              max: value.reproduction_index_high,
              date: value.date_of_report_unix,
            }))}
            signaalwaarde={1}
            rangeLegendLabel={text.rangeLegendLabel}
            lineLegendLabel={text.lineLegendLabel}
            timeframeOptions={['all', '5weeks']}
          />
        )}

        <Legenda>
          <li className="blue">{text.legenda_r}</li>
          <li className="gray square">{text.legenda_marge}</li>
        </Legenda>

        <Metadata dataSource={text.bron} />
      </article>
    </>
  );
};

ReproductionIndex.getLayout = getNationalLayout();

export default ReproductionIndex;
