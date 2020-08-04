import { useContext } from 'react';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import Ziekenhuis from 'assets/ziekenhuis.svg';
import { LineChart } from './index';

import siteText from 'locale';
import { store } from 'store';

import { IntakeHospitalMa } from 'types/data';

export const IntakeHospital: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const text: typeof siteText.ziekenhuisopnames_per_dag =
    siteText.ziekenhuisopnames_per_dag;
  const data: IntakeHospitalMa | undefined = state?.NL?.intake_hospital_ma;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Ziekenhuis} title={text.title.translation} />

        <p>{text.text.translation}</p>

        {data && (
          <BarScale
            min={0}
            max={100}
            kritiekeWaarde={Number(text.signaalwaarde.translation)}
            screenReaderText={text.screen_reader_graph_content.translation}
            value={data.last_value.moving_average_hospital}
            id="opnames"
            gradient={[
              {
                color: '#69c253',
                value: 0,
              },
              {
                color: '#D3A500',
                value: 40,
              },
              {
                color: '#f35065',
                value: 90,
              },
            ]}
          />
        )}

        {data?.last_value?.moving_average_hospital !== null && (
          <DateReported
            datumsText={text.datums.translation}
            dateUnix={data?.last_value?.date_of_report_unix}
          />
        )}
      </GraphContent>

      <Collapse
        openText={text.open.translation}
        sluitText={text.sluit.translation}
        piwikName="Ziekenhuisopnames per dag"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title.translation}</h4>
        <p>{text.fold.translation}</p>

        <h4>{text.graph_title.translation}</h4>
        {data && (
          <>
            <LineChart
              values={data.values.map((value: any) => ({
                value: value.moving_average_hospital,
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
