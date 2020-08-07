import useSWR from 'swr';

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

import { DeceasedPeopleNurseryCountDaily } from 'types/data';

export const NursingHomeInfectedLocations: React.FC = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const text: typeof siteText.verpleeghuis_besmette_locaties =
    siteText.verpleeghuis_besmette_locaties;
  const newLocations: DeceasedPeopleNurseryCountDaily | undefined =
    state?.total_newly_reported_locations;
  const totalLocations: DeceasedPeopleNurseryCountDaily | undefined =
    state?.total_reported_locations;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Locatie} title={text.title} />
        <p>{text.text}</p>

        {newLocations && (
          <BarScale
            min={0}
            max={30}
            screenReaderText={text.screen_reader_graph_content}
            value={newLocations.last_value.total_new_reported_locations}
            id="besmette_locaties_verpleeghuis"
            dataKey="total_new_reported_locations"
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
            datumsText={text.datums}
            dateInsertedUnix={newLocations?.last_value?.date_of_insertion_unix}
            dateUnix={newLocations?.last_value?.date_of_report_unix}
          />
        )}
      </GraphContent>
      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikName="Aantal besmette locaties"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>

        <h4>{text.graph_title}</h4>

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
            {text.metric_title}{' '}
            <span style={{ color: '#01689b' }}>
              {formatDecimal(
                totalLocations.last_value.total_reported_locations
              )}
            </span>
          </h3>
        )}
        <p>{text.metric_text}</p>

        {newLocations && <Metadata dataSource={text.bron} />}
      </Collapse>
    </GraphContainer>
  );
};
