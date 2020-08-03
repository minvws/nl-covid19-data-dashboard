import { useContext } from 'react';

import { FormattedMessage, FormattedDate, useIntl } from 'react-intl';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import { DateReported } from 'components/dateReported';
import CoronaVirus from 'assets/coronavirus.svg';
import { LineChart } from './index';

import siteText from 'locale';
import { store } from 'store';

import { DeceasedPeopleNurseryCountDaily } from 'types/data';

export const NursingHomeInfectedDeaths: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const data: DeceasedPeopleNurseryCountDaily | undefined =
    state?.NL?.deceased_people_nursery_count_daily;

  const intl = useIntl();

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader
          Icon={CoronaVirus}
          title={intl.formatMessage({
            id: 'verpleeghuis_oversterfte.title',
          })}
        />
        <p>
          <FormattedMessage id="verpleeghuis_oversterfte.text" />
        </p>
        {data && (
          <BarScale
            min={0}
            max={50}
            screenReaderText={intl.formatMessage(
              {
                id: 'verpleeghuis_oversterfte.screen_reader_graph_content',
              },
              {
                value: data.last_value.deceased_nursery_daily,
                kritiekeWaarde: null,
              }
            )}
            value={data.last_value.deceased_nursery_daily}
            id="over"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        {data && data?.last_value?.deceased_nursery_daily !== null && (
          <DateReported>
            <FormattedMessage
              id="verpleeghuis_oversterfte.datums"
              values={{
                dateOfReport: (
                  <FormattedDate
                    value={data?.last_value?.date_of_report_unix * 1000}
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
          id: 'verpleeghuis_oversterfte.open',
        })}
        sluitText={intl.formatMessage({
          id: 'verpleeghuis_oversterfte.sluit',
        })}
        piwikName="Sterfte"
        piwikAction="landelijk"
      >
        <h4>
          <FormattedMessage id="verpleeghuis_oversterfte.fold_title" />
        </h4>
        <p>
          <FormattedMessage id="verpleeghuis_oversterfte.fold" />
        </p>
        <h4>
          <FormattedMessage id="verpleeghuis_oversterfte.graph_title" />
        </h4>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: value.deceased_nursery_daily,
                date: value.date_of_report_unix,
              }))}
            />
            <Metadata dataSource={siteText['verpleeghuis_oversterfte.bron']} />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};
