import { useContext } from 'react';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import Locatie from 'assets/locaties.svg';
import formatDecimal from 'utils/formatNumber';
import { LineChart } from './index';

import siteText from 'locale';
import { store } from 'store';

import { DeceasedPeopleNurseryCountDaily } from 'types/data';

export const NursingHomeInfectedLocations: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const text: typeof siteText.verpleeghuis_besmette_locaties =
    siteText.verpleeghuis_besmette_locaties;
  const newLocations: DeceasedPeopleNurseryCountDaily | undefined =
    state?.NL?.total_newly_reported_locations;
  const totalLocations: DeceasedPeopleNurseryCountDaily | undefined =
    state?.NL?.total_reported_locations;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Locatie} title={text.title.translation} />
        <p>{text.text.translation}</p>

        {newLocations && (
          <BarScale
            min={0}
            max={30}
            screenReaderText={text.screen_reader_graph_content.translation}
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
            datumsText={text.datums.translation}
            dateInsertedUnix={newLocations?.last_value?.date_of_insertion_unix}
            dateUnix={newLocations?.last_value?.date_of_report_unix}
          />
        )}
      </GraphContent>
      <Collapse
        openText={text.open.translation}
        sluitText={text.sluit.translation}
        piwikName="Aantal besmette locaties"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title.translation}</h4>
        <p>{text.fold.translation}</p>

        <h4>{text.graph_title.translation}</h4>

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
            {text.metric_title.translation}{' '}
            <span style={{ color: '#01689b' }}>
              {formatDecimal(
                totalLocations.last_value.total_reported_locations
              )}
            </span>
          </h3>
        )}
        <p>{text.metric_text.translation}</p>

        {newLocations && <Metadata dataSource={text.bron} />}
      </Collapse>
    </GraphContainer>
  );
};
