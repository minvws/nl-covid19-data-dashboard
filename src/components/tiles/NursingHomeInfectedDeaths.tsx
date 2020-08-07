import useSWR from 'swr';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import CoronaVirus from 'assets/coronavirus.svg';
import { LineChart } from './index';

import siteText from 'locale';

import { DeceasedPeopleNurseryCountDaily } from 'types/data';

export const NursingHomeInfectedDeaths: React.FC = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const text: typeof siteText.verpleeghuis_oversterfte =
    siteText.verpleeghuis_oversterfte;
  const data: DeceasedPeopleNurseryCountDaily | undefined =
    state?.deceased_people_nursery_count_daily;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={CoronaVirus} title={text.title} />
        <p>{text.text}</p>
        {data && (
          <BarScale
            min={0}
            max={50}
            screenReaderText={text.screen_reader_graph_content}
            value={data.last_value.deceased_nursery_daily}
            id="over"
            dataKey="deceased_nursery_daily"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        {data?.last_value?.deceased_nursery_daily !== null && (
          <DateReported
            datumsText={text.datums}
            dateUnix={data?.last_value?.date_of_report_unix}
            dateInsertedUnix={data?.last_value?.date_of_insertion_unix}
          />
        )}
      </GraphContent>
      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikName="Sterfte"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>
        <h4>{text.graph_title}</h4>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: value.deceased_nursery_daily,
                date: value.date_of_report_unix,
              }))}
            />
            <Metadata dataSource={text.bron} />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};
