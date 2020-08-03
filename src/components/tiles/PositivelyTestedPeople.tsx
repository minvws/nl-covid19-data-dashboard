import { useContext } from 'react';

import {
  FormattedMessage,
  FormattedNumber,
  FormattedDate,
  useIntl,
} from 'react-intl';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import { DateReported } from 'components/dateReported';
import Getest from 'assets/test.svg';
import { LineChart, BarChart } from './index';

import siteText from 'locale';
import { store } from 'store';

import {
  InfectedPeopleDeltaNormalized,
  InfectedPeopleTotal,
  IntakeShareAgeGroups,
} from 'types/data';

export const PositivelyTestedPeople: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const delta: InfectedPeopleDeltaNormalized | undefined =
    state?.NL?.infected_people_delta_normalized;
  const age: IntakeShareAgeGroups | undefined =
    state?.NL?.intake_share_age_groups;
  const total: InfectedPeopleTotal | undefined =
    state?.NL?.infected_people_total;

  const intl = useIntl();

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader
          Icon={Getest}
          title={intl.formatMessage({
            id: 'positief_geteste_personen.title',
          })}
        />
        <p>
          <FormattedMessage id="positief_geteste_personen.text" />
        </p>
        {delta && (
          <BarScale
            min={0}
            max={10}
            screenReaderText={intl.formatMessage(
              {
                id: 'positief_geteste_personen.screen_reader_graph_content',
              },
              {
                value: delta.last_value.infected_daily_increase,
                kritiekeWaarde: null,
              }
            )}
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
            <FormattedMessage id="positief_geteste_personen.metric_title" />{' '}
            <span style={{ color: '#01689b' }}>
              {total.last_value.infected_daily_total ? (
                <FormattedNumber
                  value={total.last_value.infected_daily_total}
                />
              ) : (
                '-'
              )}
            </span>
          </h3>
        )}

        {delta && delta?.last_value?.infected_daily_increase !== null && (
          <DateReported>
            <FormattedMessage
              id="positief_geteste_personen.datums"
              values={{
                dateOfReport: (
                  <FormattedDate
                    value={delta?.last_value?.date_of_report_unix * 1000}
                    month="long"
                    day="numeric"
                  />
                ),
                dateOfInsertion: (
                  <FormattedDate
                    value={delta?.last_value?.date_of_insertion_unix * 1000}
                    month="long"
                    day="numeric"
                  />
                ),
              }}
            />
          </DateReported>
        )}
      </GraphContent>
      <Collapse
        openText={intl.formatMessage({
          id: 'positief_geteste_personen.open',
        })}
        sluitText={intl.formatMessage({
          id: 'positief_geteste_personen.sluit',
        })}
        piwikAction="landelijk"
        piwikName="Positief geteste mensen"
      >
        <h4>
          <FormattedMessage id="positief_geteste_personen.fold_title" />
        </h4>
        <p>
          <FormattedMessage id="positief_geteste_personen.fold" />
        </p>

        <h4>
          <FormattedMessage id="positief_geteste_personen.linechart_title" />
        </h4>
        {delta && (
          <LineChart
            values={delta.values.map((value) => ({
              value: value.infected_daily_increase,
              date: value.date_of_report_unix,
            }))}
          />
        )}

        <h4>
          <FormattedMessage id="positief_geteste_personen.graph_title" />
        </h4>
        {age && (
          <>
            <BarChart
              keys={['0 tot 20', '20 tot 40', '40 tot 60', '60 tot 80', '80+']}
              data={age.values.map(
                (value) => value.infected_per_agegroup_increase
              )}
            />
            <Metadata dataSource={siteText['positief_geteste_personen.bron']} />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};
