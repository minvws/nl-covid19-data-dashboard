import useSWR from 'swr';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import Getest from 'assets/test.svg';
import { LineChart } from './index';

import siteText from 'locale';

import { DeceasedPeopleNurseryCountDaily } from 'types/data';

export const NursingHomeInfectedPeople: React.FC = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const text: typeof siteText.verpleeghuis_positief_geteste_personen =
    siteText.verpleeghuis_positief_geteste_personen;
  const data: DeceasedPeopleNurseryCountDaily | undefined =
    state?.infected_people_nursery_count_daily;
  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Getest} title={text.title} />
        <p>{text.text}</p>

        {data && (
          <BarScale
            min={0}
            max={100}
            screenReaderText={text.screen_reader_graph_content}
            value={data.last_value.infected_nursery_daily}
            id="positief_verpleeghuis"
            dataKey="infected_nursery_daily"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        {data?.last_value?.infected_nursery_daily !== null && (
          <DateReported
            datumsText={text.datums}
            dateInsertedUnix={data?.last_value?.date_of_insertion_unix}
            dateUnix={data?.last_value?.date_of_report_unix}
          />
        )}
      </GraphContent>
      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikAction="landelijk"
        piwikName="Aantal positief geteste bewoners"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>
        <h4>{text.graph_title}</h4>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: value.infected_nursery_daily,
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
