import { useContext } from 'react';

import { FormattedMessage, FormattedDate, useIntl } from 'react-intl';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import { DateReported } from 'components/dateReported';
import Ziekenhuis from 'assets/ziekenhuis.svg';
import { LineChart } from './index';

import siteText from 'locale';
import { store } from 'store';

import { IntakeHospitalMa } from 'types/data';

export const IntakeHospital: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const data: IntakeHospitalMa | undefined = state?.NL?.intake_hospital_ma;

  const intl = useIntl();

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader
          Icon={Ziekenhuis}
          title={intl.formatMessage({
            id: 'ziekenhuisopnames_per_dag.title',
          })}
        />

        <p>
          <FormattedMessage id="ziekenhuisopnames_per_dag.text" />
        </p>

        {data && (
          <BarScale
            min={0}
            max={100}
            kritiekeWaarde={Number(
              intl.formatMessage({
                id: 'ziekenhuisopnames_per_dag.signaalwaarde',
              })
            )}
            screenReaderText={intl.formatMessage(
              {
                id: 'ziekenhuisopnames_per_dag.screen_reader_graph_content',
              },
              {
                value: intl.formatMessage({
                  id: 'ziekenhuisopnames_per_dag.signaalwaarde',
                }),
                kritiekeWaarde: intl.formatMessage({
                  id: 'ziekenhuisopnames_per_dag.signaalwaarde',
                }),
              }
            )}
            value={data.last_value.moving_average_hospital}
            id="opnames"
            gradient={[
              {
                color: '#69c253',
                value: 0,
              },
              {
                color: '#D3A500',
                value: 40,
              },
              {
                color: '#f35065',
                value: 90,
              },
            ]}
          />
        )}

        {data && data?.last_value?.moving_average_hospital !== null && (
          <DateReported>
            <FormattedMessage
              id="ziekenhuisopnames_per_dag.datums"
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
          id: 'ziekenhuisopnames_per_dag.open',
        })}
        sluitText={intl.formatMessage({
          id: 'ziekenhuisopnames_per_dag.sluit',
        })}
        piwikName="Ziekenhuisopnames per dag"
        piwikAction="landelijk"
      >
        <h4>
          <FormattedMessage id="ziekenhuisopnames_per_dag.fold_title" />
        </h4>
        <p>
          <FormattedMessage id="ziekenhuisopnames_per_dag.fold" />
        </p>

        <h4>
          <FormattedMessage id="ziekenhuisopnames_per_dag.graph_title" />
        </h4>
        {data && (
          <>
            <LineChart
              values={data.values.map((value: any) => ({
                value: value.moving_average_hospital,
                date: value.date_of_report_unix,
              }))}
              signaalwaarde={Number(
                intl.formatMessage({
                  id: 'ziekenhuisopnames_per_dag.signaalwaarde',
                })
              )}
            />

            <Metadata dataSource={siteText['ziekenhuisopnames_per_dag.bron']} />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};
