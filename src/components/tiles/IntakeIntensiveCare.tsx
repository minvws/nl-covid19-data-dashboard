import { useContext } from 'react';

import { FormattedMessage, FormattedDate, useIntl } from 'react-intl';

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

import { IntakeIntensivecareMa } from 'types/data';

export const IntakeIntensiveCare: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const data: IntakeIntensivecareMa | undefined =
    state?.NL?.intake_intensivecare_ma;

  const intl = useIntl();

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader
          Icon={Arts}
          title={intl.formatMessage({
            id: 'ic_opnames_per_dag.title',
          })}
        />

        <p>
          <FormattedMessage id="ic_opnames_per_dag.text" />
        </p>

        {data && (
          <BarScale
            min={0}
            max={30}
            gradient={[
              {
                color: '#69c253',
                value: 0,
              },
              {
                color: '#D3A500',
                value: 10,
              },
              {
                color: '#f35065',
                value: 20,
              },
            ]}
            screenReaderText={intl.formatMessage(
              {
                id: 'ic_opnames_per_dag.screen_reader_graph_content',
              },
              {
                value: data.last_value.moving_average_ic,
                kritiekeWaarde: intl.formatMessage({
                  id: 'ic_opnames_per_dag.signaalwaarde',
                }),
              }
            )}
            kritiekeWaarde={Number(
              intl.formatMessage({
                id: 'ic_opnames_per_dag.signaalwaarde',
              })
            )}
            value={data.last_value.moving_average_ic}
            id="ic"
          />
        )}

        {data && data?.last_value?.moving_average_ic !== null && (
          <DateReported>
            <FormattedMessage
              id="ic_opnames_per_dag.datums"
              values={{
                dateOfReport: (
                  <FormattedDate
                    value={data?.last_value?.date_of_report_unix * 1000}
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
          id: 'ic_opnames_per_dag.open',
        })}
        sluitText={intl.formatMessage({
          id: 'ic_opnames_per_dag.sluit',
        })}
        piwikAction="landelijk"
        piwikName="Intensive care-opnames per dag"
      >
        <h4>
          <FormattedMessage id="ic_opnames_per_dag.fold_title" />
        </h4>
        <p>
          <FormattedMessage id="ic_opnames_per_dag.fold" />
        </p>

        <h4>
          <FormattedMessage id="ic_opnames_per_dag.graph_title" />
        </h4>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: value.moving_average_ic,
                date: value.date_of_report_unix,
              }))}
              signaalwaarde={Number(
                intl.formatMessage({
                  id: 'ic_opnames_per_dag.signaalwaarde',
                })
              )}
            />

            <Metadata dataSource={siteText['ic_opnames_per_dag.bron']} />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};
