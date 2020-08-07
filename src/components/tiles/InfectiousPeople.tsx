import { useContext } from 'react';

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
import { store } from 'store';

import {
  InfectiousPeopleCount,
  InfectiousPeopleCountNormalized,
} from 'types/data';

export const InfectiousPeople: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const text: typeof siteText.besmettelijke_personen =
    siteText.besmettelijke_personen;
  const count: InfectiousPeopleCount | undefined =
    state?.NL?.infectious_people_count;
  const countNormalized: InfectiousPeopleCountNormalized | undefined =
    state?.NL?.infectious_people_count_normalized;

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
            dataKey="infectious_avg"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

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
            minY={0}
            maxY={300000}
            rangeLegendLabel={text.rangeLegendLabel}
            lineLegendLabel={text.lineLegendLabel}
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
