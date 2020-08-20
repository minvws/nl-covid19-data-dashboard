import useSWR from 'swr';
import Link from 'next/link';

import BarScale from 'components/barScale';
import Metadata from 'components/metadata';
import Legenda from 'components/legenda';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { AreaChart } from 'components/tiles/index';

import Ziektegolf from 'assets/ziektegolf.svg';

import formatNumber from 'utils/formatNumber';

import siteText from 'locale';

import {
  InfectiousPeopleCount,
  InfectiousPeopleCountNormalized,
} from 'types/data';

const text: typeof siteText.besmettelijke_personen =
  siteText.besmettelijke_personen;

export function InfectiousPeopleBarScale(props: {
  data: InfectiousPeopleCountNormalized | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={80}
      screenReaderText={text.screen_reader_graph_content}
      value={data.last_value.infectious_avg_normalized}
      id="besmettelijk"
      rangeKey="infectious_normalized_high"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
    />
  );
}

const InfectiousPeople: FCWithLayout = () => {
  const { data } = useSWR(`/json/NL.json`);

  const count: InfectiousPeopleCount | undefined =
    data?.infectious_people_count;
  const countNormalized: InfectiousPeopleCountNormalized | undefined =
    data?.infectious_people_count_normalized;

  return (
    <>
      <GraphHeader Icon={Ziektegolf} title={text.title} />
      <p>{text.text}</p>

      <InfectiousPeopleBarScale data={countNormalized} />

      <p>
        Voor het aantal besmettelijke mensen is geen signaalwaarde beschikbaar.{' '}
        <Link href="/verantwoording">
          <a>Lees hier waarom</a>
        </Link>
      </p>

      {count && (
        <h3>
          {text.metric_title}{' '}
          <span style={{ color: '#01689b' }}>
            {formatNumber(count.last_value.infectious_avg)}
          </span>
        </h3>
      )}

      {countNormalized?.last_value?.infectious_avg_normalized !== null && (
        <DateReported
          datumsText={text.datums}
          dateUnix={count?.last_value?.date_of_report_unix}
        />
      )}

      <h4>{text.fold_title}</h4>
      <p>{text.fold}</p>

      <h4>{text.graph_title}</h4>

      {count?.values && (
        <AreaChart
          data={count.values.map((value) => ({
            avg: value.infectious_avg,
            min: value.infectious_low,
            max: value.infectious_high,
            date: value.date_of_report_unix,
          }))}
          rangeLegendLabel={text.rangeLegendLabel}
          lineLegendLabel={text.lineLegendLabel}
        />
      )}

      <Legenda>
        <li className="blue">{text.legenda_line}</li>
        <li className="gray square">{text.legenda_marge}</li>
      </Legenda>

      {count && <Metadata dataSource={text.bron} />}
    </>
  );
};

InfectiousPeople.getLayout = getNationalLayout();

export default InfectiousPeople;
