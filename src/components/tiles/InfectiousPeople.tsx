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
import formatDecimal from 'utils/formatDec';

import { AreaChart } from './index';

import siteText from 'locale';
import { store } from 'store';

import { InfectiousPeopleCount } from 'types/data';

export const InfectiousPeople: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const text: typeof siteText.besmettelijke_personen =
    siteText.besmettelijke_personen;
  const count: InfectiousPeopleCount | undefined =
    state?.NL?.infectious_people_count;
  const countNormalized: InfectiousPeopleCount | undefined =
    state?.NL?.infectious_people_count_normalized;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Ziektegolf} title={text.title.translation} />
        <p>{text.text.translation}</p>

        {countNormalized && (
          <BarScale
            min={0}
            max={80}
            screenReaderText={text.screen_reader_graph_content.translation}
            value={countNormalized.last_value.infectious_avg}
            id="besmettelijk"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        <p className={'regioDataLoading'}>
          Voor het aantal besmettelijke mensen is geen signaalwaarde beschikbaar
          omdat dit aantal een inschatting is gebaseerd op een berekening.
        </p>

        {count && (
          <h3>
            {text.metric_title.translation}{' '}
            <span style={{ color: '#01689b' }}>
              {formatDecimal(count.last_value.infectious_avg)}
            </span>
          </h3>
        )}

        {countNormalized?.last_value?.infectious_avg !== null && (
          <DateReported
            datumsText={text.datums.translation}
            dateUnix={count?.last_value?.date_of_report_unix}
          />
        )}
      </GraphContent>

      <Collapse
        openText={text.open.translation}
        sluitText={text.sluit.translation}
        piwikName="Aantal besmettelijke mensen"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title.translation}</h4>
        <p>{text.fold.translation}</p>

        <h4>{text.graph_title.translation}</h4>

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
            rangeLegendLabel="Onzekerheidsmarge"
            lineLegendLabel="Besmettelijke mensen"
          />
        )}

        <Legenda>
          <li className="blue">
            Het aantal besmettelijke mensen in Nederland.
          </li>
          <li className="gray square">
            De onzekerheidsmarge toont tussen welke waarden het aantal
            besmettelijke mensen zich bevindt.
          </li>
        </Legenda>

        {count && <Metadata dataSource={text.bron} />}
      </Collapse>
    </GraphContainer>
  );
};
