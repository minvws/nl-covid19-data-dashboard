import { useContext } from 'react';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import Ziektegolf from 'assets/ziektegolf.svg';
import formatDecimal from 'utils/formatDec';

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
          Signaalwaarde volgt in <time dateTime={'2020-07'}>juli 2020</time>.
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

        {count && <Metadata dataSource={text.bron} />}
      </Collapse>
    </GraphContainer>
  );
};
