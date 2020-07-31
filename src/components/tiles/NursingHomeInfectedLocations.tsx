import { useContext } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import { DateReported } from 'components/dateReported';
import Locatie from 'assets/locaties.svg';
import formatDecimal from 'utils/formatDec';
import { LineChart } from './index';

import siteText from 'locale';
import { store } from 'store';

import { DeceasedPeopleNurseryCountDaily } from 'types/data';

export const NursingHomeInfectedLocations: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const newLocations: DeceasedPeopleNurseryCountDaily | undefined =
    state?.NL?.total_newly_reported_locations;
  const totalLocations: DeceasedPeopleNurseryCountDaily | undefined =
    state?.NL?.total_reported_locations;

  const intl = useIntl();

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader
          Icon={Locatie}
          title={intl.formatMessage({
            id: 'verpleeghuis_besmette_locaties.title',
          })}
        />

        <p>
          <FormattedMessage id="verpleeghuis_besmette_locaties.text" />
        </p>

        {newLocations && (
          <BarScale
            min={0}
            max={30}
            screenReaderText={intl.formatMessage({
              id: 'verpleeghuis_besmette_locaties.screen_reader_graph_content',
            })}
            value={newLocations.last_value.total_new_reported_locations}
            id="besmette_locaties_verpleeghuis"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}
        {newLocations?.last_value?.total_new_reported_locations !== null && (
          <DateReported
            datumsText={intl.formatMessage({
              id: 'verpleeghuis_besmette_locaties.datums',
            })}
            dateInsertedUnix={newLocations?.last_value?.date_of_insertion_unix}
            dateUnix={newLocations?.last_value?.date_of_report_unix}
          />
        )}
      </GraphContent>
      <Collapse
        openText={intl.formatMessage({
          id: 'verpleeghuis_besmette_locaties.open',
        })}
        sluitText={intl.formatMessage({
          id: 'verpleeghuis_besmette_locaties.sluit',
        })}
        piwikName="Aantal besmette locaties"
        piwikAction="landelijk"
      >
        <h4>
          <FormattedMessage id="verpleeghuis_besmette_locaties.fold_title" />
        </h4>
        <p>
          <FormattedMessage id="verpleeghuis_besmette_locaties.fold" />
        </p>

        <h4>
          <FormattedMessage id="verpleeghuis_besmette_locaties.graph_title" />
        </h4>

        {newLocations && (
          <LineChart
            values={newLocations.values.map((value) => ({
              value: value.total_new_reported_locations,
              date: value.date_of_report_unix,
            }))}
          />
        )}

        {totalLocations && (
          <h3>
            <FormattedMessage id="verpleeghuis_besmette_locaties.metric_title" />{' '}
            <span style={{ color: '#01689b' }}>
              {formatDecimal(
                totalLocations.last_value.total_reported_locations
              )}
            </span>
          </h3>
        )}
        <p>
          <FormattedMessage id="verpleeghuis_besmette_locaties.metric_text" />
        </p>

        {newLocations && (
          <Metadata
            dataSource={siteText['verpleeghuis_besmette_locaties.bron']}
          />
        )}
      </Collapse>
    </GraphContainer>
  );
};
