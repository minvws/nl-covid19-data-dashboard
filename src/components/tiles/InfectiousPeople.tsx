import { useContext } from 'react';

import {
  FormattedMessage,
  FormattedDate,
  useIntl,
  FormattedNumber,
} from 'react-intl';
import Link from 'next/link';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import Legenda from 'components/legenda';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import { DateReported } from 'components/dateReported';
import Ziektegolf from 'assets/ziektegolf.svg';

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

  const count: InfectiousPeopleCount | undefined =
    state?.NL?.infectious_people_count;
  const countNormalized: InfectiousPeopleCountNormalized | undefined =
    state?.NL?.infectious_people_count_normalized;

  const intl = useIntl();

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader
          Icon={Ziektegolf}
          title={intl.formatMessage({ id: 'besmettelijke_personen.title' })}
        />
        <p>
          <FormattedMessage id="besmettelijke_personen.text" />
        </p>

        {countNormalized && (
          <BarScale
            min={0}
            max={80}
            screenReaderText={intl.formatMessage(
              {
                id: 'besmettelijke_personen.screen_reader_graph_content',
              },
              {
                value: countNormalized.last_value.infectious_avg_normalized,
                kritiekeWaarde: null,
              }
            )}
            value={countNormalized.last_value.infectious_avg_normalized}
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
          <FormattedMessage
            defaultMessage="Voor het aantal besmettelijke mensen is geen signaalwaarde beschikbaar
          omdat dit aantal een inschatting is gebaseerd op een berekening."
          />{' '}
          <Link href="/verantwoording">
            <a>Lees hier waarom</a>
          </Link>
        </p>

        {count && (
          <h3>
            <FormattedMessage id="besmettelijke_personen.metric_title" />{' '}
            <span style={{ color: '#01689b' }}>
              {count.last_value.infectious_avg ? (
                <FormattedNumber value={count.last_value.infectious_avg} />
              ) : (
                '-'
              )}
            </span>
          </h3>
        )}

        {count &&
          countNormalized?.last_value?.infectious_avg_normalized !== null && (
            <DateReported>
              <FormattedMessage
                id="besmettelijke_personen.datums"
                values={{
                  dateOfReport: (
                    <FormattedDate
                      value={count?.last_value?.date_of_report_unix * 1000}
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
          id: 'besmettelijke_personen.open',
        })}
        sluitText={intl.formatMessage({
          id: 'besmettelijke_personen.sluit',
        })}
        piwikName="Aantal besmettelijke mensen"
        piwikAction="landelijk"
      >
        <h4>
          <FormattedMessage id="besmettelijke_personen.fold_title" />
        </h4>
        <p>
          <FormattedMessage id="besmettelijke_personen.fold" />
        </p>

        <h4>
          <FormattedMessage id="besmettelijke_personen.graph_title" />
        </h4>

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
            <FormattedMessage defaultMessage="Het aantal besmettelijke mensen in Nederland." />
          </li>
          <li className="gray square">
            <FormattedMessage
              defaultMessage="De onzekerheidsmarge toont tussen welke waarden het aantal
            besmettelijke mensen zich bevindt."
            />
          </li>
        </Legenda>

        {count && (
          <Metadata dataSource={siteText['besmettelijke_personen.bron']} />
        )}
      </Collapse>
    </GraphContainer>
  );
};
