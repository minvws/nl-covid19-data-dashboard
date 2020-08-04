import { useContext } from 'react';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';
import { LineChart } from './index';

import siteText from 'locale';
import { store } from 'store';

import { RioolwaterMetingen } from 'types/data';

export const SewerWater: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const text: typeof siteText.rioolwater_metingen =
    siteText.rioolwater_metingen;
  const data: RioolwaterMetingen | undefined = state?.NL?.rioolwater_metingen;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader
          Icon={RioolwaterMonitoring}
          title={text.title.translation}
        />

        <p>{text.text.translation}</p>

        {data && (
          <BarScale
            min={0}
            max={100}
            screenReaderText={text.screen_reader_graph_content.translation}
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

        {data?.last_value?.average !== null && (
          <DateReported
            datumsText={text.datums.translation}
            dateInsertedUnix={data?.last_value?.date_of_insertion_unix}
            dateUnix={data?.last_value?.week_unix}
          />
        )}
      </GraphContent>
      <Collapse
        openText={text.open.translation}
        sluitText={text.sluit.translation}
        piwikName="Rioolwatermeting"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title.translation}</h4>
        <p>{text.fold.translation}</p>

        <h4>{text.graph_title.translation}</h4>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: Number(value.average),
                date: value.week_unix,
              }))}
            />

            <Metadata dataSource={text.bron} />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};
