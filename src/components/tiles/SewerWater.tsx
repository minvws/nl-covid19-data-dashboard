import useSWR from 'swr';

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

import { RioolwaterMetingen } from 'types/data';

export const SewerWater: React.FC = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const text: typeof siteText.rioolwater_metingen =
    siteText.rioolwater_metingen;
  const data: RioolwaterMetingen | undefined = state?.rioolwater_metingen;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={RioolwaterMonitoring} title={text.title} />

        <p>{text.text}</p>

        {data && (
          <BarScale
            min={0}
            max={100}
            screenReaderText={text.screen_reader_graph_content}
            value={Number(data.last_value.average)}
            id="rioolwater_metingen"
            rangeKey="average"
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
            datumsText={text.datums}
            dateInsertedUnix={data?.last_value?.date_of_insertion_unix}
            dateUnix={data?.last_value?.week_unix}
          />
        )}
      </GraphContent>
      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikName="Rioolwatermeting"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>

        <h4>{text.graph_title}</h4>

        {data?.values && (
          <>
            <LineChart
              timeframeOptions={['all', '5weeks']}
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
