import { useContext } from 'react';

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
import { store } from 'store';

import { IntakeIntensivecareMa } from 'types/data';

export const IntakeIntensiveCare: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const text: typeof siteText.ic_opnames_per_dag = siteText.ic_opnames_per_dag;
  const data: IntakeIntensivecareMa | undefined =
    state?.NL?.intake_intensivecare_ma;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Arts} title={text.title.translation} />
        <p>{text.text.translation}</p>

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
                value: 10,
              },
              {
                color: '#f35065',
                value: 20,
              },
            ]}
            screenReaderText={text.screen_reader_graph_content.translation}
            kritiekeWaarde={Number(text.signaalwaarde.translation)}
            value={data.last_value.moving_average_ic}
            id="ic"
          />
        )}

        {data?.last_value?.moving_average_ic !== null && (
          <DateReported
            datumsText={text.datums.translation}
            dateUnix={data?.last_value?.date_of_report_unix}
          />
        )}
      </GraphContent>

      <Collapse
        openText={text.open.translation}
        sluitText={text.sluit.translation}
        piwikAction="landelijk"
        piwikName="Intensive care-opnames per dag"
      >
        <h4>{text.fold_title.translation}</h4>
        <p>{text.fold.translation}</p>

        <h4>{text.graph_title.translation}</h4>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: value.moving_average_ic,
                date: value.date_of_report_unix,
              }))}
              signaalwaarde={Number(text.signaalwaarde.translation)}
            />

            <Metadata dataSource={text.bron} />
          </>
        )}
      </Collapse>
    </GraphContainer>
  );
};
