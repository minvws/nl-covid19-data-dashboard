import { useContext } from 'react';

import {
  FormattedMessage,
  FormattedDate,
  FormattedNumber,
  useIntl,
} from 'react-intl';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import { DateReported } from 'components/dateReported';
import Arts from 'assets/arts.svg';
import { LineChart } from './index';

import siteText from 'locale';
import { store } from 'store';

import { RioolwaterMetingen } from 'types/data';

export const SuspectedPatients: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const data: RioolwaterMetingen | undefined =
    state?.NL?.verdenkingen_huisartsen;

  const total = state?.NL?.verdenkingen_huisartsen?.last_value?.geschat_aantal;

  const intl = useIntl();

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader
          Icon={Arts}
          title={intl.formatMessage({
            id: 'verdenkingen_huisartsen.title',
          })}
        />

        <p>
          <FormattedMessage id="verdenkingen_huisartsen.text" />
        </p>

        {data && (
          <BarScale
            min={0}
            max={140}
            screenReaderText={intl.formatMessage(
              {
                id: 'verdenkingen_huisartsen.screen_reader_graph_content',
              },
              {
                value: data.last_value.incidentie,
                kritiekeWaarde: null,
              }
            )}
            value={data.last_value.incidentie as number | null}
            id="verdenkingen_huisartsen"
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
            <FormattedMessage defaultMessage="Geschat aantal patiënten met verdenking van COVID-19:" />{' '}
            <span style={{ color: '#01689b' }}>
              {total ? <FormattedNumber value={total} /> : '-'}
            </span>
          </h3>
        )}

        {data && data?.last_value?.incidentie !== null && (
          <DateReported>
            <FormattedMessage
              id="verdenkingen_huisartsen.datums"
              values={{
                dateOfReport: (
                  <FormattedDate
                    value={data?.last_value?.week_unix * 1000}
                    month="long"
                    day="numeric"
                  />
                ),
                dateOfInsertion: (
                  <FormattedDate
                    value={data?.last_value?.date_of_insertion_unix * 1000}
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
          id: 'verdenkingen_huisartsen.open',
        })}
        sluitText={intl.formatMessage({
          id: 'verdenkingen_huisartsen.sluit',
        })}
        piwikName="Aantal patiënten waarvan huisartsen COVID-19 vermoeden"
        piwikAction="landelijk"
      >
        <h4>
          <FormattedMessage id="verdenkingen_huisartsen.fold_title" />
        </h4>
        <p>
          <FormattedMessage id="verdenkingen_huisartsen.fold" />
        </p>

        <h4>
          <FormattedMessage id="verdenkingen_huisartsen.graph_title" />
        </h4>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: value.incidentie,
                date: value.week_unix,
              }))}
            />

            <Metadata dataSource={siteText['verdenkingen_huisartsen.bron']} />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};
