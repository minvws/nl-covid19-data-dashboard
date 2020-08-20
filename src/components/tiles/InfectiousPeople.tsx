import useSWR from 'swr';
import Link from 'next/link';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import Legenda from 'components/legenda';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import Ziektegolf from 'assets/ziektegolf.svg';
import formatDecimal from 'utils/formatNumber';

import { AreaChart } from './index';

import siteText from 'locale';

import {
  InfectiousPeopleCount,
  InfectiousPeopleCountNormalized,
} from 'types/data';

export const InfectiousPeople: React.FC = () => {
  const { data } = useSWR(`/json/NL.json`);

  const text: typeof siteText.besmettelijke_personen =
    siteText.besmettelijke_personen;
  const count: InfectiousPeopleCount | undefined =
    data?.infectious_people_count;
  const countNormalized: InfectiousPeopleCountNormalized | undefined =
    data?.infectious_people_count_normalized;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Ziektegolf} title={text.title} />
        <p>{text.text}</p>

        {countNormalized && (
          <BarScale
            min={0}
            max={80}
            screenReaderText={text.screen_reader_graph_content}
            value={countNormalized.last_value.infectious_avg_normalized}
            id="besmettelijk"
            rangeKey="infectious_normalized_high"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        <p>
          {text.geen_signaalwaarde_beschikbaar}{' '}
          <Link href="/verantwoording">
            <a>{text.geen_signaalwaarde_beschikbaar_lees_waarom}</a>
          </Link>
        </p>

        {count && (
          <h3>
            {text.metric_title}{' '}
            <span style={{ color: '#01689b' }}>
              {formatDecimal(count.last_value.infectious_avg)}
            </span>
          </h3>
        )}

        {countNormalized?.last_value?.infectious_avg_normalized !== null && (
          <DateReported
            datumsText={text.datums}
            dateUnix={count?.last_value?.date_of_report_unix}
          />
        )}
      </GraphContent>

      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikName="Aantal besmettelijke mensen"
        piwikAction="landelijk"
      >
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
            timeframeOptions={['all', '5weeks']}
          />
        )}

        <Legenda>
          <li className="blue">{text.legenda_line}</li>
          <li className="gray square">{text.legenda_marge}</li>
        </Legenda>

        {count && <Metadata dataSource={text.bron} />}
      </Collapse>
    </GraphContainer>
  );
};
