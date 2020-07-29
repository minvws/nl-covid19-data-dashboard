import { useContext } from 'react';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import Legenda from 'components/legenda';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import Repro from 'assets/reproductiegetal.svg';
import { AreaChart } from './index';

import siteText from 'locale';
import { store } from 'store';

import { ReproductionIndex as ReproductionIndexData } from 'types/data';

export const ReproductionIndex: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const text: typeof siteText.reproductiegetal = siteText.reproductiegetal;
  const lastKnownValidData: ReproductionIndexData | undefined =
    state?.NL?.reproduction_index_last_known_average;

  const data: ReproductionIndexData | undefined = state?.NL?.reproduction_index;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader Icon={Repro} title={text.title.translation} />
        <p>{text.text.translation}</p>
        {data && (
          <BarScale
            min={0}
            max={2}
            screenReaderText={text.screen_reader_graph_content.translation}
            kritiekeWaarde={Number(text.signaalwaarde.translation)}
            value={lastKnownValidData?.last_value?.reproduction_index_avg}
            id="repro"
            gradient={[
              {
                color: '#69c253',
                value: 0,
              },
              {
                color: '#69c253',
                value: 1,
              },
              {
                color: '#D3A500',
                value: 1.0104,
              },
              {
                color: '#f35065',
                value: 1.125,
              },
            ]}
          />
        )}

        <DateReported
          datumsText={text.datums.translation}
          dateUnix={lastKnownValidData?.last_value?.date_of_report_unix}
          dateInsertedUnix={
            lastKnownValidData?.last_value?.date_of_insertion_unix
          }
        />
      </GraphContent>
      <Collapse
        openText={text.open.translation}
        sluitText={text.sluit.translation}
        piwikName="Reproductiegetal"
        piwikAction="landelijk"
      >
        <h4>{text.fold_title.translation}</h4>
        <p>{text.fold.translation}</p>

        <img
          width={315}
          height={100}
          loading="lazy"
          src="/images/reproductie-explainer.svg"
          alt="Ondersteunende afbeelding bij bovenstaande uitleg"
        />

        <h4>{text.graph_title.translation}</h4>
        {data?.values && (
          <AreaChart
            data={data.values.map((value) => ({
              avg: value.reproduction_index_avg,
              min: value.reproduction_index_low,
              max: value.reproduction_index_high,
              date: value.date_of_report_unix,
            }))}
            minY={0}
            maxY={4}
            signaalwaarde={1}
            rangeLegendLabel={text.rangeLegendLabel.translation}
            lineLegendLabel={text.lineLegendLabel.translation}
          />
        )}

        <Legenda>
          <li className="blue">{text.legenda_r.translation}</li>
          <li className="gray square">{text.legenda_marge.translation}</li>
        </Legenda>

        <Metadata dataSource={text.bron} />
      </Collapse>
    </GraphContainer>
  );
};
