import { useContext } from 'react';

import { FormattedMessage, FormattedDate, useIntl } from 'react-intl';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import { DateReported } from 'components/dateReported';
import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';
import { LineChart } from './index';

import siteText from 'locale';
import { store } from 'store';

import { RioolwaterMetingen } from 'types/data';

export const SewerWater: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const data: RioolwaterMetingen | undefined = state?.NL?.rioolwater_metingen;

  const intl = useIntl();

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader
          Icon={RioolwaterMonitoring}
          title={intl.formatMessage({
            id: 'rioolwater_metingen.title',
          })}
        />

        <p>
          <FormattedMessage id="rioolwater_metingen.text" />
        </p>

        {data && (
          <BarScale
            min={0}
            max={100}
            screenReaderText={intl.formatMessage(
              {
                id: 'rioolwater_metingen.screen_reader_graph_content',
              },
              {
                value: data.last_value.average,
                kritiekeWaarde: null,
              }
            )}
            value={Number(data.last_value.average)}
            id="rioolwater_metingen"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        {data && data?.last_value?.average !== null && (
          <DateReported>
            <FormattedMessage
              id="rioolwater_metingen.datums"
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
          id: 'rioolwater_metingen.open',
        })}
        sluitText={intl.formatMessage({
          id: 'rioolwater_metingen.sluit',
        })}
        piwikName="Rioolwatermeting"
        piwikAction="landelijk"
      >
        <h4>
          <FormattedMessage id="rioolwater_metingen.fold_title" />
        </h4>
        <p>
          <FormattedMessage id="rioolwater_metingen.fold" />
        </p>

        <h4>
          <FormattedMessage id="rioolwater_metingen.graph_title" />
        </h4>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: Number(value.average),
                date: value.week_unix,
              }))}
            />

            <Metadata dataSource={siteText['rioolwater_metingen.bron']} />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};
