import useSWR from 'swr';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import Arts from 'assets/arts.svg';
import { LineChart } from './index';

import siteText from 'locale';

import { IntakeIntensivecareMa } from 'types/data';

const SIGNAAL_WAARDE = 10;

export const IntakeIntensiveCare: React.FC = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const text: typeof siteText.ic_opnames_per_dag = siteText.ic_opnames_per_dag;
  const data: IntakeIntensivecareMa | undefined =
    state?.intake_intensivecare_ma;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Arts} title={text.title} />
        <p>{text.text}</p>

        {data && (
          <BarScale
            min={0}
            max={30}
            gradient={[
              {
                color: '#69c253',
                value: 0,
              },
              {
                color: '#D3A500',
                value: SIGNAAL_WAARDE,
              },
              {
                color: '#f35065',
                value: 20,
              },
            ]}
            dataKey="moving_average_ic"
            screenReaderText={text.screen_reader_graph_content}
            signaalwaarde={SIGNAAL_WAARDE}
            value={data.last_value.moving_average_ic}
            id="ic"
          />
        )}

        {data?.last_value?.moving_average_ic !== null && (
          <DateReported
            datumsText={text.datums}
            dateUnix={data?.last_value?.date_of_report_unix}
          />
        )}
      </GraphContent>

      <Collapse
        openText={text.open}
        sluitText={text.sluit}
        piwikAction="landelijk"
        piwikName="Intensive care-opnames per dag"
      >
        <h4>{text.fold_title}</h4>
        <p>{text.fold}</p>

        <h4>{text.graph_title}</h4>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: value.moving_average_ic,
                date: value.date_of_report_unix,
              }))}
              signaalwaarde={SIGNAAL_WAARDE}
            />

            <Metadata dataSource={text.bron} />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};
