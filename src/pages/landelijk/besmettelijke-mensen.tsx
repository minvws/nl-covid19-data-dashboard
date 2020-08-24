import useSWR from 'swr';
import Link from 'next/link';

import BarScale from 'components/barScale';
import Metadata from 'components/metadata';
import Legenda from 'components/legenda';
import TitleWithIcon from 'components/titleWithIcon';
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
      <TitleWithIcon Icon={Ziektegolf} title={text.title} as="h2" />

      <article className="metric-article">
        <p>{text.text}</p>

        <InfectiousPeopleBarScale data={countNormalized} />

        <p>
          {text.geen_signaalwaarde_beschikbaar}{' '}
          <Link href="/verantwoording">
            <a>{text.geen_signaalwaarde_beschikbaar_lees_waarom}</a>
          </Link>
        </p>

        {count && (
          <h3>
            {text.metric_title}{' '}
            <span className="text-blue">
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

        <h3>{text.fold_title}</h3>
        <p>{text.fold}</p>
      </article>

      <article className="metric-article">
        <h3>{text.graph_title}</h3>

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
            timeframeOptions={['all', '5weeks']}
          />
        )}

        <Legenda>
          <li className="blue">{text.legenda_line}</li>
          <li className="gray square">{text.legenda_marge}</li>
        </Legenda>

        {count && <Metadata dataSource={text.bron} />}
      </article>
    </>
  );
};

InfectiousPeople.getLayout = getNationalLayout();

export default InfectiousPeople;
