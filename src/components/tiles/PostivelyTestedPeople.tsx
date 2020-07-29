import { useContext } from 'react';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import Getest from 'assets/test.svg';
import formatDecimal from 'utils/formatDec';
import { LineChart, BarChart } from './index';

import siteText from 'locale';
import { store } from 'store';

import {
  InfectedPeopleDeltaNormalized,
  InfectedPeopleTotal,
  IntakeShareAgeGroups,
} from 'types/data';

export const PostivelyTestedPeople: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const text: typeof siteText.positief_geteste_personen =
    siteText.positief_geteste_personen;
  const delta: InfectedPeopleDeltaNormalized | undefined =
    state?.NL?.infected_people_delta_normalized;
  const age: IntakeShareAgeGroups | undefined =
    state?.NL?.intake_share_age_groups;
  const total: InfectedPeopleTotal | undefined =
    state?.NL?.infected_people_total;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Getest} title={text.title.translation} />
        <p>{text.text.translation}</p>
        {delta && (
          <BarScale
            min={0}
            max={5}
            screenReaderText={text.screen_reader_graph_content.translation}
            value={delta.last_value.infected_daily_increase}
            id="positief"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        {total && (
          <h3>
            {text.metric_title.translation}{' '}
            <span style={{ color: '#01689b' }}>
              {formatDecimal(total.last_value.infected_daily_total)}
            </span>
          </h3>
        )}

        {delta?.last_value?.infected_daily_increase !== null && (
          <DateReported
            datumsText={text.datums.translation}
            dateUnix={delta?.last_value?.date_of_report_unix}
          />
        )}
      </GraphContent>
      <Collapse
        openText={text.open.translation}
        sluitText={text.sluit.translation}
        piwikAction="landelijk"
        piwikName="Positief geteste mensen"
      >
        <h4>{text.fold_title.translation}</h4>
        <p>{text.fold.translation}</p>

        <h4>{text.linechart_title.translation}</h4>
        {delta && (
          <LineChart
            values={delta.values.map((value) => ({
              value: value.infected_daily_increase,
              date: value.date_of_report_unix,
            }))}
          />
        )}

        <h4>{text.graph_title.translation}</h4>
        {age && (
          <>
            <BarChart
              keys={['0 tot 20', '20 tot 40', '40 tot 60', '60 tot 80', '80+']}
              data={age.values.map(
                (value) => value.infected_per_agegroup_increase
              )}
            />
            <Metadata dataSource={text.bron} />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};
