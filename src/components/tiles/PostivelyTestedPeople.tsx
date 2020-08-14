import useSWR from 'swr';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import Getest from 'assets/test.svg';
import formatDecimal from 'utils/formatNumber';
import { LineChart, BarChart } from './index';

import siteText from 'locale';

import {
  InfectedPeopleDeltaNormalized,
  InfectedPeopleTotal,
  IntakeShareAgeGroups,
} from 'types/data';

export const PostivelyTestedPeople: React.FC = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const text: typeof siteText.positief_geteste_personen =
    siteText.positief_geteste_personen;
  const delta: InfectedPeopleDeltaNormalized | undefined =
    state?.infected_people_delta_normalized;
  const age: IntakeShareAgeGroups | undefined = state?.intake_share_age_groups;
  const total: InfectedPeopleTotal | undefined = state?.infected_people_total;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Getest} title={text.title} />
        <p>{text.text}</p>
        {delta && (
          <BarScale
            min={0}
            max={10}
            screenReaderText={text.screen_reader_graph_content}
            value={delta.last_value.infected_daily_increase}
            id="positief"
            dataKey="infected_daily_increase"
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
            {text.metric_title}{' '}
            <span style={{ color: '#01689b' }}>
              {formatDecimal(total.last_value.infected_daily_total)}
            </span>
          </h3>
        )}

        {delta?.last_value?.infected_daily_increase !== null && (
          <DateReported
            datumsText={text.datums}
            dateUnix={delta?.last_value?.date_of_report_unix}
            dateInsertedUnix={delta?.last_value?.date_of_insertion_unix}
          />
        )}
      </GraphContent>
      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikAction="landelijk"
        piwikName="Positief geteste mensen"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>

        <h4>{text.linechart_title}</h4>
        {delta && (
          <LineChart
            values={delta.values.map((value) => ({
              value: value.infected_daily_increase,
              date: value.date_of_report_unix,
            }))}
          />
        )}

        <h4>{text.graph_title}</h4>
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
